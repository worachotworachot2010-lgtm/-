import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import confetti from 'canvas-confetti';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  AppStep,
  KrathongDesign,
  KrathongRecord,
  PierId,
  WishCategory,
} from './types/krathong';
import { DEFAULT_DESIGN, KRATHONG_LIFESPAN_MS } from './data/krathongCatalog';
import { TopNav } from './components/TopNav';
import { StartPage } from './components/StartPage';
import { SelectKrathongPage } from './components/SelectKrathongPage';
import { DecorateKrathongPage } from './components/DecorateKrathongPage';
import { WishPage } from './components/WishPage';
import { RiverPage } from './components/RiverPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { soundManager } from './utils/audio';

function toMillis(val: unknown): number {
  if (val instanceof Timestamp) return val.toMillis();
  if (val && typeof val === 'object' && 'toMillis' in val) {
    const fn = (val as { toMillis?: () => number }).toMillis;
    if (typeof fn === 'function') return fn();
  }
  return Date.now();
}

export function App() {
  const [step, setStep] = useState<AppStep>('start');
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);

  // Crafting state
  const [design, setDesign] = useState<KrathongDesign>(DEFAULT_DESIGN);
  const [senderName, setSenderName] = useState('');
  const [wishText, setWishText] = useState('');
  const [category, setCategory] = useState<WishCategory>('apology');
  const [pier, setPier] = useState<PierId>('chaophraya');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shared live river state from Firestore
  const [rawKrathongs, setRawKrathongs] = useState<KrathongRecord[]>([]);
  const [riverLoading, setRiverLoading] = useState(true);
  const [newlyFloatedId, setNewlyFloatedId] = useState<string | null>(null);
  const [blessedIds, setBlessedIds] = useState<Set<string>>(new Set());
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3600);
  }, []);

  // Tick every 30s so krathongs automatically disappear when reaching 24 hours
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 30_000);
    return () => window.clearInterval(intervalId);
  }, []);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      if (currentUser?.displayName) {
        setSenderName((prev) => (prev.trim() ? prev : currentUser.displayName!.slice(0, 40)));
      }
    });
    return () => unsub();
  }, []);

  // Real-time public river krathongs stream (explicit visibility == 'public' matching rules)
  useEffect(() => {
    if (!authReady) return;
    const krathongsRef = collection(db, 'krathongs');
    const q = query(
      krathongsRef,
      where('visibility', '==', 'public'),
      limit(250)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: KrathongRecord[] = snapshot.docs
          .map((d) => {
            const data = d.data();
            return {
              id: d.id,
              authorId: String(data.authorId || ''),
              senderName: String(data.senderName || 'ผู้ร่วมลอยกระทง'),
              wish: String(data.wish || ''),
              category: (data.category as WishCategory) || 'apology',
              pier: (data.pier as PierId) || 'chaophraya',
              baseId: data.baseId || 'banana-leaf',
              flowerId: data.flowerId || 'marigold',
              candleId: data.candleId || 'classic-gold',
              ornamentId: data.ornamentId || 'incense-garland',
              glowColor: data.glowColor || 'amber',
              laneY: typeof data.laneY === 'number' ? data.laneY : 0.5,
              startOffset: typeof data.startOffset === 'number' ? data.startOffset : 0.5,
              driftSpeed: typeof data.driftSpeed === 'number' ? data.driftSpeed : 1,
              blessingsCount:
                typeof data.blessingsCount === 'number' ? data.blessingsCount : 0,
              visibility: 'public' as const,
              createdAtMs: toMillis(data.createdAt),
            };
          })
          .sort((a, b) => b.createdAtMs - a.createdAtMs);
        setRawKrathongs(list);
        setNowMs(Date.now());
        setRiverLoading(false);
      },
      (error) => {
        setRiverLoading(false);
        handleFirestoreError(error, OperationType.LIST, 'krathongs');
      }
    );

    return () => unsub();
  }, [authReady]);

  // Only show krathongs created within the last 24 hours
  const krathongs = useMemo(
    () => rawKrathongs.filter((k) => nowMs - k.createdAtMs < KRATHONG_LIFESPAN_MS),
    [rawKrathongs, nowMs]
  );

  // Check which krathongs current user already blessed (when signed in)
  useEffect(() => {
    if (!user || krathongs.length === 0) {
      setBlessedIds(new Set());
      return;
    }

    let cancelled = false;
    const checkBlessings = async () => {
      const next = new Set<string>();
      await Promise.all(
        krathongs.slice(0, 30).map(async (k) => {
          try {
            const snap = await getDoc(
              doc(db, 'krathongs', k.id, 'blessings', user.uid)
            );
            if (snap.exists()) {
              next.add(k.id);
            }
          } catch {
            // Ignore individual read checks
          }
        })
      );
      if (!cancelled) {
        setBlessedIds(next);
      }
    };

    void checkBlessings();
    return () => {
      cancelled = true;
    };
  }, [user, krathongs]);

  const handleSignIn = useCallback(async (): Promise<User | null> => {
    setAuthBusy(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      showToast(`ยินดีต้อนรับคุณ ${result.user.displayName || 'ผู้ร่วมงาน'}`);
      return result.user;
    } catch (error) {
      const msg = error instanceof Error ? error.message : '';
      if (!msg.includes('popup-closed-by-user')) {
        showToast('ไม่สามารถเข้าสู่ระบบ Google ได้ในขณะนี้ กรุณาลองใหม่');
      }
      return null;
    } finally {
      setAuthBusy(false);
    }
  }, [showToast]);

  const handleSignOut = useCallback(async () => {
    setAuthBusy(true);
    try {
      await signOut(auth);
      showToast('ออกจากระบบเรียบร้อยแล้ว');
    } finally {
      setAuthBusy(false);
    }
  }, [showToast]);

  const handleFloatKrathong = useCallback(
    async (overrideUser?: User) => {
      const activeUser = overrideUser || auth.currentUser;
      if (!activeUser) return;

      const cleanName = senderName.trim().slice(0, 40);
      const cleanWish = wishText.trim().slice(0, 280);
      if (!cleanName || !cleanWish) return;

      setIsSubmitting(true);
      const krathongId = `k_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const path = `krathongs/${krathongId}`;

      try {
        await setDoc(doc(db, 'krathongs', krathongId), {
          authorId: activeUser.uid,
          senderName: cleanName,
          wish: cleanWish,
          category,
          pier,
          baseId: design.baseId,
          flowerId: design.flowerId,
          candleId: design.candleId,
          ornamentId: design.ornamentId,
          glowColor: design.glowColor,
          laneY: Number((0.18 + Math.random() * 0.64).toFixed(3)),
          startOffset: Number((0.15 + Math.random() * 0.55).toFixed(3)),
          driftSpeed: Number((0.75 + Math.random() * 0.45).toFixed(2)),
          blessingsCount: 0,
          visibility: 'public',
          createdAt: serverTimestamp(),
        });

        setNewlyFloatedId(krathongId);
        setWishText('');
        setStep('river');
        soundManager.playFloatSplash();
        showToast('ปล่อยกระทงลงสู่แม่น้ำเรียบร้อยแล้ว');

        try {
          confetti({
            particleCount: 45,
            spread: 65,
            origin: { y: 0.72 },
            colors: ['#F59E0B', '#FDE047', '#10B981', '#F472B6'],
          });
        } catch {
          // Ignore confetti errors on reduced contexts
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      } finally {
        setIsSubmitting(false);
      }
    },
    [category, design, pier, senderName, showToast, wishText]
  );

  const handleBlessKrathong = useCallback(
    async (target: KrathongRecord) => {
      const activeUser = auth.currentUser;
      if (!activeUser) return;
      if (blessedIds.has(target.id)) return;

      const batch = writeBatch(db);
      const krathongRef = doc(db, 'krathongs', target.id);
      const blessingRef = doc(db, 'krathongs', target.id, 'blessings', activeUser.uid);

      batch.set(blessingRef, {
        authorId: activeUser.uid,
        krathongId: target.id,
        createdAt: serverTimestamp(),
      });
      batch.update(krathongRef, {
        blessingsCount: target.blessingsCount + 1,
      });

      try {
        await batch.commit();
        setBlessedIds((prev) => {
          const next = new Set(prev);
          next.add(target.id);
          return next;
        });
        showToast(`ส่งคำอวยพรสาธุให้คุณ ${target.senderName} แล้ว`);
      } catch (error) {
        handleFirestoreError(
          error,
          OperationType.UPDATE,
          `krathongs/${target.id}/blessings/${activeUser.uid}`
        );
      }
    },
    [blessedIds, showToast]
  );

  const handleDeleteKrathong = useCallback(
    async (target: KrathongRecord) => {
      const activeUser = auth.currentUser;
      if (!activeUser || target.authorId !== activeUser.uid) {
        showToast('ไม่สามารถลบกระทงของผู้อื่นได้');
        return;
      }

      const path = `krathongs/${target.id}`;
      try {
        await deleteDoc(doc(db, 'krathongs', target.id));
        showToast('นำกระทงของคุณออกจากแม่น้ำแล้ว');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    },
    [showToast]
  );

  const totalBlessings = useMemo(
    () => krathongs.reduce((acc, item) => acc + item.blessingsCount, 0),
    [krathongs]
  );

  const navigateStep = (nextStep: AppStep) => {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#060A17] text-slate-100 flex flex-col">
        <TopNav
          currentStep={step}
          onNavigate={navigateStep}
          user={user}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          authBusy={authBusy}
        />

        {step === 'start' && (
          <StartPage
            totalKrathongs={krathongs.length}
            totalBlessings={totalBlessings}
            onStartCraft={() => navigateStep('select')}
            onGoRiver={() => navigateStep('river')}
            onNavigateStep={navigateStep}
          />
        )}

        {step === 'select' && (
          <SelectKrathongPage
            design={design}
            onSelectBase={(baseId) => setDesign((prev) => ({ ...prev, baseId }))}
            onBack={() => navigateStep('start')}
            onNext={() => navigateStep('decorate')}
          />
        )}

        {step === 'decorate' && (
          <DecorateKrathongPage
            design={design}
            onChangeDesign={setDesign}
            onBack={() => navigateStep('select')}
            onNext={() => navigateStep('wish')}
          />
        )}

        {step === 'wish' && (
          <WishPage
            design={design}
            user={user}
            senderName={senderName}
            wishText={wishText}
            category={category}
            pier={pier}
            onChangeSenderName={setSenderName}
            onChangeWishText={setWishText}
            onChangeCategory={setCategory}
            onChangePier={setPier}
            onBack={() => navigateStep('decorate')}
            onSignIn={handleSignIn}
            onSubmitFloat={handleFloatKrathong}
            isSubmitting={isSubmitting}
            authBusy={authBusy}
          />
        )}

        {step === 'river' && (
          <RiverPage
            krathongs={krathongs}
            nowMs={nowMs}
            loading={riverLoading}
            user={user}
            newlyFloatedId={newlyFloatedId}
            blessedIds={blessedIds}
            onBlessKrathong={handleBlessKrathong}
            onDeleteKrathong={handleDeleteKrathong}
            onCreateAnother={() => navigateStep('select')}
            onSignIn={handleSignIn}
          />
        )}

        {/* Toast Feedback */}
        {toastMsg && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl bg-[#0F1B33] border border-amber-400/40 text-amber-100 text-sm shadow-xl"
          >
            {toastMsg}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;

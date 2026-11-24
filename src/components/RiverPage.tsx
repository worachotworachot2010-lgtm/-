import React, { useEffect, useMemo, useRef, useState } from 'react';
import { User } from 'firebase/auth';
import {
  Heart,
  ListFilter,
  Plus,
  Search,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { KrathongRecord, PierId } from '../types/krathong';
import {
  KRATHONG_BASES,
  KRATHONG_LIFESPAN_MS,
  PIER_OPTIONS,
  WISH_CATEGORIES,
} from '../data/krathongCatalog';
import { KrathongArtwork } from './KrathongArtwork';
import { soundManager } from '../utils/audio';

interface RiverPageProps {
  krathongs: KrathongRecord[];
  nowMs: number;
  loading: boolean;
  user: User | null;
  newlyFloatedId: string | null;
  blessedIds: Set<string>;
  onBlessKrathong: (krathong: KrathongRecord) => Promise<void>;
  onDeleteKrathong: (krathong: KrathongRecord) => Promise<void>;
  onCreateAnother: () => void;
  onSignIn: () => Promise<User | null>;
}

const SKY_LANTERNS = [
  { left: '12%', delay: '0s', duration: '19s', scale: 0.7 },
  { left: '26%', delay: '4s', duration: '22s', scale: 0.55 },
  { left: '43%', delay: '8s', duration: '17s', scale: 0.8 },
  { left: '64%', delay: '2s', duration: '24s', scale: 0.6 },
  { left: '79%', delay: '6s', duration: '20s', scale: 0.75 },
  { left: '89%', delay: '11s', duration: '18s', scale: 0.5 },
];

function formatThaiRelativeTime(ms: number, nowMs: number): string {
  if (!ms) return 'เมื่อสักครู่';
  const diffSec = Math.max(0, Math.floor((nowMs - ms) / 1000));
  if (diffSec < 60) return 'เมื่อสักครู่';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} ชั่วโมงที่แล้ว`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} วันที่แล้ว`;
}

function formatRemaining24h(createdAtMs: number, nowMs: number): string {
  const remainingMs = Math.max(0, KRATHONG_LIFESPAN_MS - (nowMs - createdAtMs));
  const totalMinutes = Math.ceil(remainingMs / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours <= 0) return `เหลือเวลาลอยอีก ${mins} นาที`;
  return `เหลือเวลาลอยอีก ${hours} ชม. ${mins} นาที`;
}

export const RiverPage: React.FC<RiverPageProps> = ({
  krathongs,
  nowMs,
  loading,
  user,
  newlyFloatedId,
  blessedIds,
  onBlessKrathong,
  onDeleteKrathong,
  onCreateAnother,
  onSignIn,
}) => {
  const [backdropLoaded, setBackdropLoaded] = useState(true);
  const [pierFilter, setPierFilter] = useState<'all' | 'mine' | PierId>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKrathongId, setSelectedKrathongId] = useState<string | null>(null);
  const [showListDrawer, setShowListDrawer] = useState(false);
  const [ambientOn, setAmbientOn] = useState(false);
  const [blessingBusyId, setBlessingBusyId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const hoveredIdRef = useRef<string | null>(null);

  // Clean up ambient sound when leaving river page
  useEffect(() => {
    return () => {
      soundManager.stopAmbient();
    };
  }, []);

  // Auto-open newly floated krathong toast/highlight briefly, keep user focused on river
  const filteredKrathongs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return krathongs.filter((k) => {
      if (pierFilter === 'mine') {
        if (!user || k.authorId !== user.uid) return false;
      } else if (pierFilter !== 'all') {
        if (k.pier !== pierFilter) return false;
      }
      if (q) {
        const matchName = k.senderName.toLowerCase().includes(q);
        const matchWish = k.wish.toLowerCase().includes(q);
        return matchName || matchWish;
      }
      return true;
    });
  }, [krathongs, pierFilter, searchTerm, user]);

  const selectedKrathong = useMemo(
    () => krathongs.find((k) => k.id === selectedKrathongId) || null,
    [krathongs, selectedKrathongId]
  );

  // Smooth 60fps compositor-only horizontal river drift
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let frameId = 0;
    const startTime = performance.now();
    const xPositions = new Map<string, number>();

    const updateFrame = (now: number) => {
      const stageWidth = stageRef.current?.clientWidth || 1200;
      const elapsedSec = (now - startTime) / 1000;

      filteredKrathongs.forEach((k) => {
        const el = nodeRefs.current.get(k.id);
        if (!el) return;

        if (!xPositions.has(k.id)) {
          // Spread initial X across visible river width
          xPositions.set(k.id, k.startOffset * (stageWidth + 140) - 70);
        }

        if (!prefersReducedMotion && hoveredIdRef.current !== k.id) {
          const basePxPerSec = 14 * k.driftSpeed;
          const prevX = xPositions.get(k.id)!;
          let nextX = prevX + basePxPerSec * 0.016;
          if (nextX > stageWidth + 120) {
            nextX = -140;
          }
          xPositions.set(k.id, nextX);
        }

        const currentX = xPositions.get(k.id) ?? k.startOffset * stageWidth;
        const depthScale = 0.68 + k.laneY * 0.5;
        const gentleBob = prefersReducedMotion
          ? 0
          : Math.sin(elapsedSec * 1.4 + k.startOffset * 10) * 4;

        el.style.transform = `translate3d(${currentX.toFixed(1)}px, ${gentleBob.toFixed(1)}px, 0) scale(${depthScale.toFixed(2)})`;
      });

      frameId = window.requestAnimationFrame(updateFrame);
    };

    frameId = window.requestAnimationFrame(updateFrame);
    return () => window.cancelAnimationFrame(frameId);
  }, [filteredKrathongs]);

  const handleToggleAmbient = () => {
    const active = soundManager.toggleAmbient();
    setAmbientOn(active);
  };

  const handleBless = async (item: KrathongRecord) => {
    if (!user) {
      const signed = await onSignIn();
      if (!signed) return;
    }
    setBlessingBusyId(item.id);
    try {
      await onBlessKrathong(item);
      soundManager.playBless();
    } finally {
      setBlessingBusyId(null);
    }
  };

  const handleDelete = async (item: KrathongRecord) => {
    setDeletingId(item.id);
    try {
      await onDeleteKrathong(item);
      setSelectedKrathongId(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#050A16] text-slate-100">
      {/* River Toolbar */}
      <section className="bg-[#080F22]/90 border-b border-slate-800/80 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setPierFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                pierFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              ทุกท่าน้ำ ({krathongs.length})
            </button>
            {user && (
              <button
                type="button"
                onClick={() => setPierFilter('mine')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  pierFilter === 'mine'
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                กระทงของฉัน
              </button>
            )}
            {PIER_OPTIONS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPierFilter(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  pierFilter === p.id
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อหรือคำอธิษฐาน..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-[#050914] border border-slate-700 focus:border-amber-400 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none w-44 sm:w-52"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowListDrawer(!showListDrawer)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-medium text-slate-200 whitespace-nowrap cursor-pointer"
            >
              <ListFilter size={15} />
              <span>รายการคำอธิษฐาน</span>
            </button>

            <button
              type="button"
              onClick={handleToggleAmbient}
              aria-label={ambientOn ? 'ปิดเสียงบรรยากาศ' : 'เปิดเสียงบรรยากาศ'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
                ambientOn
                  ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {ambientOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
              <span className="hidden sm:inline">{ambientOn ? 'เสียงบรรยากาศเปิด' : 'เสียงบรรยากาศ'}</span>
            </button>

            <button
              type="button"
              onClick={onCreateAnother}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm whitespace-nowrap cursor-pointer"
            >
              <Plus size={15} />
              <span>ลอยกระทงเพิ่ม</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Shared River Stage */}
      <section
        ref={stageRef}
        className="relative flex-1 min-h-[540px] sm:min-h-[640px] overflow-hidden select-none"
      >
        {/* Night Sky & Temple Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040814] via-[#071426] to-[#030B16]">
          {backdropLoaded && (
            <img
              src="/src/assets/images/loy_krathong_river_backdrop_1795485926262.jpg"
              alt="ทิวทัศน์แม่น้ำยามค่ำคืนใต้แสงจันทร์เต็มดวงและแสงไฟจากวัดริมน้ำ"
              referrerPolicy="no-referrer"
              onError={() => setBackdropLoaded(false)}
              className="w-full h-full object-cover object-top opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050E1E]/25 to-[#030914]/75 pointer-events-none" />
        </div>

        {/* Floating Sky Lanterns in Upper Sky */}
        <div className="absolute inset-x-0 top-0 h-[44%] overflow-hidden pointer-events-none" aria-hidden="true">
          {SKY_LANTERNS.map((l, idx) => (
            <div
              key={idx}
              className="absolute bottom-0 animate-lantern-rise"
              style={{
                left: l.left,
                animationDelay: l.delay,
                animationDuration: l.duration,
              }}
            >
              <div
                className="w-3.5 h-5 rounded-t-md rounded-b-sm bg-gradient-to-b from-amber-200 to-orange-500 shadow-[0_0_12px_rgba(251,191,36,0.75)]"
                style={{ transform: `scale(${l.scale})` }}
              />
            </div>
          ))}
        </div>

        {/* Instruction Hint */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-4 pointer-events-none flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs sm:text-sm text-slate-200/85 bg-[#060A17]/65 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-slate-700/50">
            คลิกที่กระทงใดก็ได้ในแม่น้ำเพื่ออ่านคำอธิษฐานและกดส่งคำอวยพร · กระทงแต่ละใบจะลอยอยู่ 24 ชั่วโมง
          </p>
        </div>

        {/* River Water Zone (Bottom 60% of stage) */}
        <div className="absolute inset-x-0 top-[38%] bottom-0">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-amber-200/90 bg-[#060A17]/80 px-5 py-3 rounded-xl border border-amber-300/20">
                กำลังเชื่อมต่อสายน้ำและโหลดกระทงจากผู้ร่วมงาน...
              </p>
            </div>
          ) : filteredKrathongs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="max-w-md p-6 rounded-2xl bg-[#070E1F]/85 border border-slate-700/70 backdrop-blur-md space-y-4">
                <h2 className="font-display text-xl font-semibold text-amber-200">
                  {krathongs.length === 0
                    ? 'แม่น้ำกำลังรอคอยกระทงใบแรกของค่ำคืนนี้'
                    : 'ไม่พบกระทงที่ตรงกับตัวกรอง'}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {krathongs.length === 0
                    ? 'เชิญร่วมลอยกระทงออนไลน์ใบแรกของคุณ เพื่อให้ผู้คนได้มองเห็นและร่วมส่งคำอวยพร'
                    : 'ลองเลือกดูจากทุกท่าน้ำ หรือสร้างกระทงใบใหม่ของคุณลงสู่แม่น้ำ'}
                </p>
                <div className="flex justify-center gap-3">
                  {krathongs.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setPierFilter('all');
                        setSearchTerm('');
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium text-white cursor-pointer"
                    >
                      แสดงทุกท่าน้ำ
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onCreateAnother}
                    className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold cursor-pointer"
                  >
                    สร้างกระทงของคุณ
                  </button>
                </div>
              </div>
            </div>
          ) : (
            filteredKrathongs.map((k) => {
              const isMine = Boolean(user && k.authorId === user.uid);
              const isJustFloated = k.id === newlyFloatedId;
              const isSelected = k.id === selectedKrathongId;

              return (
                <button
                  key={k.id}
                  ref={(node) => {
                    if (node) {
                      nodeRefs.current.set(k.id, node);
                    } else {
                      nodeRefs.current.delete(k.id);
                    }
                  }}
                  type="button"
                  onMouseEnter={() => {
                    hoveredIdRef.current = k.id;
                  }}
                  onMouseLeave={() => {
                    if (hoveredIdRef.current === k.id) {
                      hoveredIdRef.current = null;
                    }
                  }}
                  onClick={() => {
                    soundManager.playChime(659.25);
                    setSelectedKrathongId(k.id);
                  }}
                  style={{
                    top: `${Math.round(k.laneY * 74)}%`,
                    zIndex: isSelected || isJustFloated ? 35 : Math.round(k.laneY * 30),
                  }}
                  className="absolute left-0 -translate-x-1/2 cursor-pointer group focus-visible:outline-none"
                  aria-label={`กระทงของ ${k.senderName}: ${k.wish}`}
                >
                  <div className="flex flex-col items-center">
                    <KrathongArtwork
                      design={{
                        baseId: k.baseId,
                        flowerId: k.flowerId,
                        candleId: k.candleId,
                        ornamentId: k.ornamentId,
                        glowColor: k.glowColor,
                      }}
                      size="md"
                      isHighlighted={isMine || isJustFloated || isSelected}
                    />
                    <span
                      className={`mt-0.5 px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap max-w-[130px] truncate transition-colors ${
                        isMine || isJustFloated
                          ? 'bg-amber-500/90 text-slate-950 font-semibold'
                          : 'bg-[#050A17]/75 text-slate-200 group-hover:bg-slate-900 group-hover:text-amber-200'
                      }`}
                    >
                      {isJustFloated ? `ของฉัน · ${k.senderName}` : k.senderName}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Wish Inspection Modal when clicking any krathong */}
        {selectedKrathong && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setSelectedKrathongId(null)}
          >
            <div
              className="max-w-lg w-full rounded-2xl bg-[#0B1224] border border-amber-300/25 p-6 shadow-2xl space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400">
                    <span>
                      {PIER_OPTIONS.find((p) => p.id === selectedKrathong.pier)?.name ||
                        'ริมแม่น้ำ'}
                    </span>
                    <span aria-hidden="true" className="mx-1.5">·</span>
                    <span>
                      {WISH_CATEGORIES.find((c) => c.id === selectedKrathong.category)?.name ||
                        'คำอธิษฐาน'}
                    </span>
                    <span aria-hidden="true" className="mx-1.5">·</span>
                    <span>{formatThaiRelativeTime(selectedKrathong.createdAtMs, nowMs)}</span>
                  </p>
                  <h2 className="font-display text-xl font-semibold text-white mt-1">
                    กระทงของ {selectedKrathong.senderName}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedKrathongId(null)}
                  aria-label="ปิดหน้าต่าง"
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="py-4 rounded-xl bg-gradient-to-b from-[#071022] to-[#030712] border border-slate-800 flex flex-col items-center">
                <div className="animate-krathong-bob">
                  <KrathongArtwork
                    design={{
                      baseId: selectedKrathong.baseId,
                      flowerId: selectedKrathong.flowerId,
                      candleId: selectedKrathong.candleId,
                      ornamentId: selectedKrathong.ornamentId,
                      glowColor: selectedKrathong.glowColor,
                    }}
                    size="lg"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {KRATHONG_BASES.find((b) => b.id === selectedKrathong.baseId)?.name}
                  <span aria-hidden="true" className="mx-1.5">·</span>
                  <span className="text-amber-300/90 font-mono-num">
                    {formatRemaining24h(selectedKrathong.createdAtMs, nowMs)}
                  </span>
                </p>
              </div>

              <blockquote className="p-4 rounded-xl bg-[#060A17] border border-slate-800 font-display text-base sm:text-lg text-amber-100 leading-relaxed break-words">
                “{selectedKrathong.wish}”
              </blockquote>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  disabled={
                    blessedIds.has(selectedKrathong.id) ||
                    blessingBusyId === selectedKrathong.id
                  }
                  onClick={() => handleBless(selectedKrathong)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:cursor-default ${
                    blessedIds.has(selectedKrathong.id)
                      ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-200'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  <Heart
                    size={16}
                    className={blessedIds.has(selectedKrathong.id) ? 'fill-emerald-300' : ''}
                  />
                  <span>
                    {blessedIds.has(selectedKrathong.id)
                      ? 'ส่งคำอวยพรสาธุแล้ว'
                      : blessingBusyId === selectedKrathong.id
                        ? 'กำลังส่งคำอวยพร...'
                        : 'สาธุ · ส่งคำอวยพร'}
                  </span>
                  <span className="font-mono-num ml-1">
                    ({selectedKrathong.blessingsCount})
                  </span>
                </button>

                {user && selectedKrathong.authorId === user.uid && (
                  <button
                    type="button"
                    disabled={deletingId === selectedKrathong.id}
                    onClick={() => handleDelete(selectedKrathong)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs sm:text-sm font-medium cursor-pointer disabled:opacity-60"
                  >
                    <Trash2 size={15} />
                    <span>{deletingId === selectedKrathong.id ? 'กำลังนำออก...' : 'นำกระทงออก'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Wish List Side Drawer */}
        {showListDrawer && (
          <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#080E1E] border-l border-slate-800 shadow-2xl flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold text-white">
                  คำอธิษฐานบนแม่น้ำ ({filteredKrathongs.length})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  กดเลือกเพื่อดูรายละเอียดกระทงและส่งคำอวยพร
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowListDrawer(false)}
                aria-label="ปิดรายการ"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
              {filteredKrathongs.length === 0 ? (
                <p className="p-6 text-sm text-slate-400 text-center">
                  ยังไม่มีคำอธิษฐานในหมวดนี้
                </p>
              ) : (
                filteredKrathongs.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedKrathongId(item.id);
                      setShowListDrawer(false);
                    }}
                    className="w-full text-left p-4 hover:bg-slate-900/70 transition-colors flex items-start gap-3.5 cursor-pointer"
                  >
                    <KrathongArtwork
                      design={{
                        baseId: item.baseId,
                        flowerId: item.flowerId,
                        candleId: item.candleId,
                        ornamentId: item.ornamentId,
                        glowColor: item.glowColor,
                      }}
                      size="sm"
                      animateFlame={false}
                      showWaterRipple={false}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm text-amber-200 truncate">
                          {item.senderName}
                        </span>
                        <span className="font-mono-num text-xs text-slate-400 shrink-0">
                          สาธุ {item.blessingsCount}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {PIER_OPTIONS.find((p) => p.id === item.pier)?.name} ·{' '}
                        {formatThaiRelativeTime(item.createdAtMs, nowMs)} ·{' '}
                        {formatRemaining24h(item.createdAtMs, nowMs)}
                      </p>
                      <p className="text-sm text-slate-200 mt-1.5 line-clamp-2 leading-relaxed">
                        “{item.wish}”
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>
        )}
      </section>
    </main>
  );
};

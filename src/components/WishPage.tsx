import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { ArrowLeft, LogIn, Send } from 'lucide-react';
import { KrathongDesign, PierId, WishCategory } from '../types/krathong';
import {
  KRATHONG_BASES,
  PIER_OPTIONS,
  WISH_CATEGORIES,
  WISH_TEMPLATES,
} from '../data/krathongCatalog';
import { KrathongArtwork } from './KrathongArtwork';
import { soundManager } from '../utils/audio';

interface WishPageProps {
  design: KrathongDesign;
  user: User | null;
  senderName: string;
  wishText: string;
  category: WishCategory;
  pier: PierId;
  onChangeSenderName: (v: string) => void;
  onChangeWishText: (v: string) => void;
  onChangeCategory: (v: WishCategory) => void;
  onChangePier: (v: PierId) => void;
  onBack: () => void;
  onSignIn: () => Promise<User | null>;
  onSubmitFloat: (overrideUser?: User) => Promise<void>;
  isSubmitting: boolean;
  authBusy: boolean;
}

export const WishPage: React.FC<WishPageProps> = ({
  design,
  user,
  senderName,
  wishText,
  category,
  pier,
  onChangeSenderName,
  onChangeWishText,
  onChangeCategory,
  onChangePier,
  onBack,
  onSignIn,
  onSubmitFloat,
  isSubmitting,
  authBusy,
}) => {
  const [formError, setFormError] = useState<string | null>(null);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  const selectedBase =
    KRATHONG_BASES.find((b) => b.id === design.baseId) || KRATHONG_BASES[0];
  const selectedPier = PIER_OPTIONS.find((p) => p.id === pier) || PIER_OPTIONS[0];
  const selectedCategory =
    WISH_CATEGORIES.find((c) => c.id === category) || WISH_CATEGORIES[0];

  const handleFloatClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanName = senderName.trim();
    const cleanWish = wishText.trim();

    if (!cleanName) {
      setFormError('กรุณากรอกชื่อผู้ลอยกระทงหรือนามแฝง');
      return;
    }
    if (!cleanWish) {
      setFormError('กรุณาเขียนคำอธิษฐานก่อนลอยกระทงลงแม่น้ำ');
      return;
    }

    if (!user) {
      setShowSignInPrompt(true);
      return;
    }

    await onSubmitFloat();
  };

  const handleGoogleSignInAndFloat = async () => {
    setFormError(null);
    const signedUser = await onSignIn();
    if (signedUser) {
      setShowSignInPrompt(false);
      await onSubmitFloat(signedUser);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#060A17] text-slate-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
          <div>
            <p className="text-xs font-medium text-amber-300">ขั้นตอนที่ 3 จาก 4</p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white mt-1">
              ตั้งจิตเขียนคำอธิษฐาน
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              ระบุชื่อของคุณ เลือกท่าน้ำ และเขียนคำอธิษฐานที่จะลอยไปพร้อมกระทงให้ทุกคนได้ร่วมอนุโมทนา
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sm text-slate-300 transition-colors self-start sm:self-auto cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft size={16} />
            <span>กลับไปตกแต่งกระทง</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Live Krathong & Wish Card Preview */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 p-6 sm:p-8 rounded-2xl bg-[#0B1224] border border-slate-800 flex flex-col items-center text-center">
            <div className="w-full py-6 rounded-xl bg-gradient-to-b from-[#071022] to-[#030712] border border-slate-800/80 flex items-center justify-center">
              <div className="animate-krathong-bob">
                <KrathongArtwork design={design} size="lg" />
              </div>
            </div>

            <div className="w-full mt-6 p-5 rounded-xl bg-[#070C1A] border border-amber-400/20 text-left space-y-2.5">
              <p className="text-xs text-slate-400">
                <span>{selectedBase.name}</span>
                <span aria-hidden="true" className="mx-1.5">·</span>
                <span>{selectedPier.name}</span>
              </p>

              <p className="font-display text-base text-amber-100 leading-relaxed min-h-[3.5rem] break-words">
                “{wishText.trim() || 'คำอธิษฐานของคุณจะปรากฏตรงนี้บนแม่น้ำ...'}”
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>ผู้ลอย: {senderName.trim() || 'ยังไม่ได้ระบุชื่อ'}</span>
                <span>{selectedCategory.name}</span>
              </div>
            </div>
          </aside>

          {/* Right: Wish Form */}
          <form onSubmit={handleFloatClick} className="lg:col-span-7 space-y-6">
            {/* Sender Name */}
            <div className="p-6 rounded-2xl bg-[#0B1224] border border-slate-800 space-y-5">
              <div>
                <label
                  htmlFor="senderName"
                  className="block text-sm font-medium text-slate-200 mb-2"
                >
                  ชื่อผู้ลอยกระทง (แสดงบนแม่น้ำสาธารณะ)
                </label>
                <input
                  id="senderName"
                  type="text"
                  maxLength={40}
                  value={senderName}
                  onChange={(e) => onChangeSenderName(e.target.value)}
                  placeholder="เช่น น้องบัว, ครอบครัวสุขสันต์ หรือนามแฝง"
                  className="w-full px-4 py-3 rounded-lg bg-[#060A17] border border-slate-700 focus:border-amber-400 text-white placeholder:text-slate-500 text-sm sm:text-base outline-none transition-colors"
                />
              </div>

              {/* Pier Selection */}
              <div>
                <span className="block text-sm font-medium text-slate-200 mb-2">
                  เลือกท่าน้ำสำหรับลอยกระทง
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PIER_OPTIONS.map((item) => {
                    const active = pier === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          soundManager.playChime(523.25);
                          onChangePier(item.id);
                        }}
                        className={`text-left px-4 py-3 rounded-lg border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#0F1B33] border-amber-400 text-amber-100'
                            : 'bg-[#060A17] border-slate-800 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{item.province}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wish Category */}
              <div>
                <span className="block text-sm font-medium text-slate-200 mb-2">
                  หมวดหมู่คำอธิษฐาน
                </span>
                <div className="flex flex-wrap gap-2">
                  {WISH_CATEGORIES.map((cat) => {
                    const active = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          soundManager.playChime(587.33);
                          onChangeCategory(cat.id);
                        }}
                        className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                          active
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                            : 'bg-[#060A17] text-slate-300 border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wish Textarea */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="wishText" className="text-sm font-medium text-slate-200">
                    คำอธิษฐานของคุณ
                  </label>
                  <span className="font-mono-num text-xs text-slate-400">
                    {wishText.length} / 280
                  </span>
                </div>
                <textarea
                  id="wishText"
                  rows={4}
                  maxLength={280}
                  value={wishText}
                  onChange={(e) => onChangeWishText(e.target.value)}
                  placeholder="พิมพ์คำขอขมาพระแม่คงคา หรือคำอธิษฐานที่คุณปรารถนาให้เป็นจริง..."
                  className="w-full px-4 py-3 rounded-lg bg-[#060A17] border border-slate-700 focus:border-amber-400 text-white placeholder:text-slate-500 text-sm sm:text-base outline-none transition-colors resize-none leading-relaxed"
                />

                {/* Quick Blessing Templates */}
                <div className="mt-3">
                  <p className="text-xs text-slate-400 mb-2">
                    เลือกใช้คำอธิษฐานแนะนำ (กดเพื่อเติมข้อความ):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {WISH_TEMPLATES.map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          soundManager.playChime(659.25);
                          onChangeWishText(tpl.slice(0, 280));
                        }}
                        className="text-left p-2.5 rounded-lg bg-[#060A17] hover:bg-slate-900 border border-slate-800 hover:border-slate-600 text-xs text-slate-300 leading-relaxed transition-colors cursor-pointer line-clamp-2"
                      >
                        “{tpl}”
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm"
                >
                  {formError}
                </div>
              )}

              {/* Google Sign-In Required Notice if not logged in */}
              {!user && (
                <div className="p-4 rounded-xl bg-[#0F1B33] border border-amber-400/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <span className="font-semibold text-amber-200 block">
                      เข้าสู่ระบบ Google เพื่อลอยกระทงลงแม่น้ำจริง
                    </span>
                    เพื่อบันทึกกระทงของคุณอย่างปลอดภัยและให้ทุกคนเห็นร่วมกันบนแม่น้ำ
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleSignInAndFloat}
                    disabled={authBusy || isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs sm:text-sm font-medium text-white whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
                  >
                    <LogIn size={15} />
                    <span>เข้าสู่ระบบ Google</span>
                  </button>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sm font-medium text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  ย้อนกลับ: ตกแต่ง
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || authBusy}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-base transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
                >
                  <Send size={17} />
                  <span>
                    {isSubmitting ? 'กำลังปล่อยกระทงลงแม่น้ำ...' : 'อธิษฐานและลอยกระทงลงแม่น้ำ'}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Inline Sign-In Prompt Modal if submitted while signed out */}
      {showSignInPrompt && !user && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#0B1224] border border-amber-400/30 text-center space-y-5">
            <h2 className="font-display text-xl font-semibold text-white">
              ยืนยันตัวตนเพื่อปล่อยกระทงลงแม่น้ำ
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              เข้าสู่ระบบด้วยบัญชี Google เพื่อให้กระทงและคำอธิษฐานของคุณถูกบันทึกบนแม่น้ำสาธารณะอย่างปลอดภัย
              และให้ผู้ร่วมงานคนอื่นๆ มองเห็นได้แบบเรียลไทม์
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSignInPrompt(false)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sm font-medium text-slate-300 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleGoogleSignInAndFloat}
                disabled={authBusy || isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold cursor-pointer disabled:opacity-60"
              >
                <LogIn size={16} />
                <span>{authBusy ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบและลอยเลย'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

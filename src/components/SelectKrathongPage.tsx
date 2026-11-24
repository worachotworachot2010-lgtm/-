import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { BaseId, KrathongDesign } from '../types/krathong';
import { KRATHONG_BASES } from '../data/krathongCatalog';
import { KrathongArtwork } from './KrathongArtwork';
import { soundManager } from '../utils/audio';

interface SelectKrathongPageProps {
  design: KrathongDesign;
  onSelectBase: (baseId: BaseId) => void;
  onBack: () => void;
  onNext: () => void;
}

export const SelectKrathongPage: React.FC<SelectKrathongPageProps> = ({
  design,
  onSelectBase,
  onBack,
  onNext,
}) => {
  const selectedMeta =
    KRATHONG_BASES.find((b) => b.id === design.baseId) || KRATHONG_BASES[0];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#060A17] text-slate-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
          <div>
            <p className="text-xs font-medium text-amber-300">ขั้นตอนที่ 1 จาก 4</p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white mt-1">
              เลือกฐานกระทงของคุณ
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              เลือกวัสดุฐานกระทงที่เป็นเอกลักษณ์และเป็นมิตรต่อสายน้ำ
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sm text-slate-300 transition-colors self-start sm:self-auto cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft size={16} />
            <span>กลับหน้าเริ่มต้น</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Base Selection Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {KRATHONG_BASES.map((base) => {
              const isSelected = design.baseId === base.id;
              return (
                <button
                  key={base.id}
                  type="button"
                  onClick={() => {
                    soundManager.playChime(523.25);
                    onSelectBase(base.id);
                  }}
                  className={`text-left p-5 rounded-xl border transition-all cursor-pointer relative flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isSelected
                      ? 'bg-[#0F1B33] border-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.12)]'
                      : 'bg-[#0B1224] border-slate-800 hover:border-slate-600 hover:bg-[#0E172E]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="bg-[#060B18] rounded-lg p-2 border border-slate-800/80">
                      <KrathongArtwork
                        design={{ ...design, baseId: base.id }}
                        size="sm"
                        animateFlame={false}
                        showWaterRipple={false}
                      />
                    </div>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300">
                        <Check size={15} />
                        <span>เลือกแล้ว</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="font-display text-lg font-semibold text-white">
                      {base.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      <span>{base.material}</span>
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      <span className="text-emerald-300/90">{base.ecoNote}</span>
                    </p>
                    <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
                      {base.meaning}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sticky Live Preview Stage */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 p-6 sm:p-8 rounded-2xl bg-[#0B1224] border border-slate-800 flex flex-col items-center text-center">
            <p className="text-xs font-medium text-slate-400">ตัวอย่างกระทงที่เลือก</p>
            <div className="my-6 w-full py-6 rounded-xl bg-gradient-to-b from-[#071022] to-[#040813] border border-slate-800/80 flex items-center justify-center">
              <div className="animate-krathong-bob">
                <KrathongArtwork design={design} size="xl" />
              </div>
            </div>

            <h3 className="font-display text-xl font-semibold text-amber-200">
              {selectedMeta.name}
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {selectedMeta.meaning}
            </p>

            <div className="w-full pt-6 mt-6 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sm font-medium text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playChime(659.25);
                  onNext();
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>ถัดไป: ตกแต่งกระทง</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

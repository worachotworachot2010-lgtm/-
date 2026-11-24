import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw, Shuffle } from 'lucide-react';
import { KrathongDesign } from '../types/krathong';
import {
  CANDLE_OPTIONS,
  DEFAULT_DESIGN,
  FLOWER_OPTIONS,
  GLOW_OPTIONS,
  ORNAMENT_OPTIONS,
} from '../data/krathongCatalog';
import { KrathongArtwork } from './KrathongArtwork';
import { soundManager } from '../utils/audio';

interface DecorateKrathongPageProps {
  design: KrathongDesign;
  onChangeDesign: (next: KrathongDesign) => void;
  onBack: () => void;
  onNext: () => void;
}

type DecorTab = 'flower' | 'candle' | 'ornament' | 'glow';

export const DecorateKrathongPage: React.FC<DecorateKrathongPageProps> = ({
  design,
  onChangeDesign,
  onBack,
  onNext,
}) => {
  const [activeTab, setActiveTab] = useState<DecorTab>('flower');

  const handleRandomize = () => {
    soundManager.playChime(783.99);
    const randomFlower = FLOWER_OPTIONS[Math.floor(Math.random() * FLOWER_OPTIONS.length)].id;
    const randomCandle = CANDLE_OPTIONS[Math.floor(Math.random() * CANDLE_OPTIONS.length)].id;
    const randomOrnament =
      ORNAMENT_OPTIONS[Math.floor(Math.random() * ORNAMENT_OPTIONS.length)].id;
    const randomGlow = GLOW_OPTIONS[Math.floor(Math.random() * GLOW_OPTIONS.length)].id;

    onChangeDesign({
      ...design,
      flowerId: randomFlower,
      candleId: randomCandle,
      ornamentId: randomOrnament,
      glowColor: randomGlow,
    });
  };

  const handleReset = () => {
    soundManager.playChime(440);
    onChangeDesign({
      ...DEFAULT_DESIGN,
      baseId: design.baseId,
    });
  };

  const currentFlower =
    FLOWER_OPTIONS.find((f) => f.id === design.flowerId) || FLOWER_OPTIONS[0];
  const currentCandle =
    CANDLE_OPTIONS.find((c) => c.id === design.candleId) || CANDLE_OPTIONS[0];
  const currentOrnament =
    ORNAMENT_OPTIONS.find((o) => o.id === design.ornamentId) || ORNAMENT_OPTIONS[0];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#060A17] text-slate-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
          <div>
            <p className="text-xs font-medium text-amber-300">ขั้นตอนที่ 2 จาก 4</p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white mt-1">
              ตกแต่งกระทงตามใจชอบ
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              เลือกดอกไม้ประดับ รูปแบบเทียน ของมงคล และสีแสงสะท้อนบนผิวน้ำ
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sm text-slate-300 transition-colors self-start sm:self-auto cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft size={16} />
            <span>เปลี่ยนฐานกระทง</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Live Animated Crafting Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 p-6 sm:p-8 rounded-2xl bg-[#0B1224] border border-slate-800 flex flex-col items-center">
            <div className="w-full py-8 rounded-xl bg-gradient-to-b from-[#071022] via-[#061124] to-[#030712] border border-slate-800/80 flex items-center justify-center relative overflow-hidden">
              <div className="animate-krathong-bob">
                <KrathongArtwork design={design} size="xl" />
              </div>
            </div>

            {/* Quick Summary */}
            <div className="w-full mt-5 space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">ดอกไม้ประดับ</span>
                <span className="font-medium text-white">{currentFlower.name}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">เทียนหลัก</span>
                <span className="font-medium text-white">{currentCandle.name}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">ของมงคลเสริมโชค</span>
                <span className="font-medium text-white">{currentOrnament.name}</span>
              </div>
            </div>

            {/* Randomize & Reset */}
            <div className="w-full grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-800">
              <button
                type="button"
                onClick={handleRandomize}
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-medium text-amber-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Shuffle size={15} />
                <span>สุ่มตกแต่ง</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-medium text-slate-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw size={15} />
                <span>คืนค่าเริ่มต้น</span>
              </button>
            </div>
          </div>

          {/* Right: Segmented Customization Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Segmented Tab Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 rounded-xl bg-[#0B1224] border border-slate-800">
              {(
                [
                  { id: 'flower', label: 'ดอกไม้ประดับ' },
                  { id: 'candle', label: 'ธูปและเทียน' },
                  { id: 'ornament', label: 'ของมงคล' },
                  { id: 'glow', label: 'แสงสะท้อนน้ำ' },
                ] as const
              ).map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Options */}
            <div className="space-y-3">
              {activeTab === 'flower' &&
                FLOWER_OPTIONS.map((item) => {
                  const selected = design.flowerId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        soundManager.playChime(587.33);
                        onChangeDesign({ ...design, flowerId: item.id });
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                        selected
                          ? 'bg-[#0F1B33] border-amber-400'
                          : 'bg-[#0B1224] border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className="w-10 h-10 rounded-lg border border-white/15 shrink-0"
                          style={{
                            background: `radial-gradient(circle, ${item.accentColor}, ${item.petalColor})`,
                          }}
                        />
                        <div>
                          <h3 className="font-display text-base font-semibold text-white">
                            {item.name}
                          </h3>
                          <p className="text-sm text-slate-400 mt-0.5">{item.meaning}</p>
                        </div>
                      </div>
                      {selected && <Check size={18} className="text-amber-400 shrink-0" />}
                    </button>
                  );
                })}

              {activeTab === 'candle' &&
                CANDLE_OPTIONS.map((item) => {
                  const selected = design.candleId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        soundManager.playChime(659.25);
                        onChangeDesign({ ...design, candleId: item.id });
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                        selected
                          ? 'bg-[#0F1B33] border-amber-400'
                          : 'bg-[#0B1224] border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className="w-10 h-10 rounded-lg border border-white/15 shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${item.flameTint}, ${item.waxColor})`,
                          }}
                        />
                        <div>
                          <h3 className="font-display text-base font-semibold text-white">
                            {item.name}
                          </h3>
                          <p className="text-sm text-slate-400 mt-0.5">{item.styleNote}</p>
                        </div>
                      </div>
                      {selected && <Check size={18} className="text-amber-400 shrink-0" />}
                    </button>
                  );
                })}

              {activeTab === 'ornament' &&
                ORNAMENT_OPTIONS.map((item) => {
                  const selected = design.ornamentId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        soundManager.playChime(698.46);
                        onChangeDesign({ ...design, ornamentId: item.id });
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                        selected
                          ? 'bg-[#0F1B33] border-amber-400'
                          : 'bg-[#0B1224] border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-[#060B18] rounded-lg p-1 border border-slate-800 shrink-0">
                          <KrathongArtwork
                            design={{ ...design, ornamentId: item.id }}
                            size="sm"
                            animateFlame={false}
                            showWaterRipple={false}
                          />
                        </div>
                        <div>
                          <h3 className="font-display text-base font-semibold text-white">
                            {item.name}
                          </h3>
                          <p className="text-sm text-slate-400 mt-0.5">{item.meaning}</p>
                        </div>
                      </div>
                      {selected && <Check size={18} className="text-amber-400 shrink-0" />}
                    </button>
                  );
                })}

              {activeTab === 'glow' &&
                GLOW_OPTIONS.map((item) => {
                  const selected = design.glowColor === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        soundManager.playChime(783.99);
                        onChangeDesign({ ...design, glowColor: item.id });
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                        selected
                          ? 'bg-[#0F1B33] border-amber-400'
                          : 'bg-[#0B1224] border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className="w-10 h-10 rounded-full border border-white/25 shrink-0"
                          style={{
                            backgroundColor: item.hex,
                            boxShadow: `0 0 18px ${item.hex}88`,
                          }}
                        />
                        <div>
                          <h3 className="font-display text-base font-semibold text-white">
                            {item.name}
                          </h3>
                          <p className="text-sm text-slate-400 mt-0.5">
                            แสงสะท้อนและระลอกน้ำรอบกระทงของคุณบนแม่น้ำ
                          </p>
                        </div>
                      </div>
                      {selected && <Check size={18} className="text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
            </div>

            {/* Bottom Step Navigation */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sm font-medium text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                ย้อนกลับ: เลือกกระทง
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playChime(783.99);
                  onNext();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm sm:text-base transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>ถัดไป: เขียนคำอธิษฐาน</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

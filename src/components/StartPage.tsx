import React, { useState } from 'react';
import { ArrowRight, Waves } from 'lucide-react';
import { AppStep } from '../types/krathong';
import { KrathongArtwork } from './KrathongArtwork';
import { DEFAULT_DESIGN } from '../data/krathongCatalog';

interface StartPageProps {
  totalKrathongs: number;
  totalBlessings: number;
  onStartCraft: () => void;
  onGoRiver: () => void;
  onNavigateStep: (step: AppStep) => void;
}

export const StartPage: React.FC<StartPageProps> = ({
  totalKrathongs,
  totalBlessings,
  onStartCraft,
  onGoRiver,
  onNavigateStep,
}) => {
  const [heroLoaded, setHeroLoaded] = useState(true);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#060A17] text-slate-100">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-amber-300/10">
        {/* Atmospheric Backdrop Image + Fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#060A17] via-[#0B172A] to-[#081C24]">
          {heroLoaded && (
            <img
              src="/src/assets/images/loy_krathong_hero_river_1795485925786.jpg"
              alt="บรรยากาศงานลอยกระทงริมแม่น้ำเจ้าพระยายามค่ำคืนใต้แสงจันทร์เต็มดวง"
              referrerPolicy="no-referrer"
              onError={() => setHeroLoaded(false)}
              className="w-full h-full object-cover object-center opacity-70"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#060A17]/95 via-[#060A17]/75 to-[#060A17]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060A17] via-transparent to-[#060A17]/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <p className="text-xs sm:text-sm font-medium text-amber-300/90 tracking-wide">
              เทศกาลลอยกระทงออนไลน์ · คืนเพ็ญเดือนสิบสอง
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.18] [text-wrap:balance]">
              ลอยกระทงอธิษฐาน
              <span className="block text-amber-300 mt-1">ร่วมสายน้ำเดียวกัน</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200/90 max-w-2xl leading-relaxed">
              ออกแบบกระทงในแบบของคุณ เลือกกลีบใบตองหรือดอกไม้มงคล จุดเทียนเขียนคำอธิษฐาน
              และลอยลงสู่แม่น้ำออนไลน์ที่ทุกคนสามารถมองเห็นและร่วมส่งคำอวยพรให้กันได้แบบเรียลไทม์
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onStartCraft}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-base transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <span>เริ่มสร้างกระทงของคุณ</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={onGoRiver}
                className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-100 font-medium text-base border border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <Waves size={18} className="text-emerald-400" />
                <span>ชมแม่น้ำและกระทงของทุกคน</span>
              </button>
            </div>

            {/* Clean unboxed live metrics */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-sm text-slate-300 border-t border-slate-800/80 max-w-xl">
              <div>
                <span className="text-slate-400">กระทงที่ลอยอยู่ในแม่น้ำ</span>
                <span className="ml-2 font-mono-num font-semibold text-amber-300 text-base">
                  {totalKrathongs.toLocaleString('th-TH')}
                </span>
                <span className="ml-1 text-slate-400">ใบ</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div>
                <span className="text-slate-400">คำอวยพรสาธุร่วมกัน</span>
                <span className="ml-2 font-mono-num font-semibold text-emerald-300 text-base">
                  {totalBlessings.toLocaleString('th-TH')}
                </span>
                <span className="ml-1 text-slate-400">ครั้ง</span>
              </div>
            </div>
          </div>

          {/* Right: Calm Featured Live Krathong */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative p-8 rounded-2xl bg-[#0A1328]/75 border border-amber-300/15 backdrop-blur-sm flex flex-col items-center text-center max-w-sm w-full">
              <div className="animate-krathong-bob">
                <KrathongArtwork design={DEFAULT_DESIGN} size="xl" />
              </div>
              <p className="font-display text-lg font-semibold text-amber-200 mt-2">
                กระทงใบตองกลีบผกา
              </p>
              <p className="text-xs text-slate-400 mt-1">
                ตัวอย่างกระทง · ปรับแต่งได้กว่า 20,000 รูปแบบ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Editorial Journey Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
              ขั้นตอนร่วมประเพณีลอยกระทงออนไลน์
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              ออกแบบกระทงและส่งต่อคำอธิษฐานให้ทุกคนบนแม่น้ำได้ร่วมอนุโมทนา (ลอยอยู่บนแม่น้ำ 24 ชั่วโมง)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01.',
              target: 'select' as AppStep,
              title: 'เลือกฐานกระทง',
              desc: 'เลือกฐานกระทง 12 รูปแบบ เช่น ใบตองกลีบผกา หงส์ทองสุวรรณหงส์ เรือพญานาค ดอกบัว หรือขนมปัง',
            },
            {
              step: '02.',
              target: 'decorate' as AppStep,
              title: 'ตกแต่งอย่างประณีต',
              desc: 'ประดับดอกไม้มงคล 8 ชนิด เลือกเทียน 6 แบบ ของเสริมสิริมงคล 6 อย่าง และแสงสะท้อนผิวน้ำ',
            },
            {
              step: '03.',
              target: 'wish' as AppStep,
              title: 'ตั้งจิตอธิษฐาน',
              desc: 'เลือกท่าน้ำที่ต้องการลอย กรอกชื่อและเขียนคำอธิษฐานจากใจพร้อมคำอวยพรแนะนำ',
            },
            {
              step: '04.',
              target: 'river' as AppStep,
              title: 'ลอยร่วมกับทุกคน',
              desc: 'ปล่อยกระทงลงแม่น้ำ ชมกระทงของผู้อื่นที่ลอยอยู่จริง และคลิกกดสาธุส่งคำอวยพร',
            },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => onNavigateStep(item.target)}
              className="text-left p-6 rounded-xl bg-[#0B1224] hover:bg-[#101933] border border-slate-800 hover:border-amber-400/35 transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span className="font-mono-num text-sm font-semibold text-amber-400">
                {item.step}
              </span>
              <h3 className="font-display text-lg font-semibold text-white mt-2 group-hover:text-amber-200 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};

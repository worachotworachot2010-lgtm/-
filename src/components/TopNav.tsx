import React from 'react';
import { User } from 'firebase/auth';
import { AppStep } from '../types/krathong';
import { LogIn, LogOut } from 'lucide-react';

interface TopNavProps {
  currentStep: AppStep;
  onNavigate: (step: AppStep) => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  authBusy: boolean;
}

const NAV_ITEMS: { id: AppStep; label: string }[] = [
  { id: 'start', label: 'หน้าเริ่มต้น' },
  { id: 'select', label: 'เลือกกระทง' },
  { id: 'decorate', label: 'ตกแต่ง' },
  { id: 'wish', label: 'คำอธิษฐาน' },
  { id: 'river', label: 'แม่น้ำอธิษฐาน' },
];

export const TopNav: React.FC<TopNavProps> = ({
  currentStep,
  onNavigate,
  user,
  onSignIn,
  onSignOut,
  authBusy,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#060A17]/85 backdrop-blur-md border-b border-amber-300/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Title */}
        <button
          type="button"
          onClick={() => onNavigate('start')}
          className="font-display text-lg sm:text-xl font-semibold text-amber-200 hover:text-amber-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
        >
          ลอยกระทงออนไลน์
        </button>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="ขั้นตอนการลอยกระทง"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const active = currentStep === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-t ${
                  active
                    ? 'border-amber-400 text-amber-200'
                    : 'border-transparent text-slate-300 hover:text-white hover:border-slate-500'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Auth Action */}
        <div className="flex items-center shrink-0">
          {user ? (
            <button
              type="button"
              onClick={onSignOut}
              disabled={authBusy}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-100 text-xs sm:text-sm font-medium border border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
            >
              <span className="max-w-[110px] truncate">{user.displayName || 'ผู้ร่วมงาน'}</span>
              <LogOut size={14} className="text-slate-400 shrink-0" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              disabled={authBusy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
            >
              <LogIn size={15} className="shrink-0" />
              <span>เข้าสู่ระบบ Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile compact step navigation bar */}
      <nav
        aria-label="เมนูมือถือ"
        className="flex md:hidden items-center justify-between gap-1 px-3 py-1.5 border-t border-slate-800/80 overflow-x-auto"
      >
        {NAV_ITEMS.map((item) => {
          const active = currentStep === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                active
                  ? 'bg-amber-500/20 text-amber-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};

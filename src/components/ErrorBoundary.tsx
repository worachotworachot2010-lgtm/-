import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อระบบ',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060A17] text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#0E162B] border border-amber-400/20 rounded-xl p-6 text-center space-y-4">
            <h2 className="font-display text-xl font-semibold text-amber-300">
              ขออภัย เกิดข้อผิดพลาดชั่วคราว
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              ระบบไม่สามารถเชื่อมต่อข้อมูลแม่น้ำได้ชั่วขณะ กรุณาลองรีเฟรชหน้าเว็บอีกครั้ง
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
            >
              โหลดหน้าใหม่
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

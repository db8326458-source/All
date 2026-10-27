import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wifi, Signal, BatteryMedium } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const { viewMode, activeProduct } = useApp();

  // For Admin Panel, full width is usually preferred, but frame mode can also wrap it
  if (viewMode === 'responsive') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <main className="flex-1 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    );
  }

  // Simulated Android Mobile Viewport
  return (
    <div className="min-h-screen bg-slate-900/90 py-6 px-4 flex items-center justify-center">
      <div className="w-full max-w-[420px] h-[870px] bg-white rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border-[10px] border-slate-800 flex flex-col overflow-hidden relative">
        
        {/* Android Punch Hole Camera & Speaker */}
        <div className="w-full h-8 bg-slate-900 text-white flex items-center justify-between px-6 text-xs select-none shrink-0 z-40">
          <span className="font-semibold text-[11px] tracking-tight">09:41</span>
          
          <div className="w-3.5 h-3.5 bg-black rounded-full ring-2 ring-slate-800 shrink-0" />
          
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-semibold">98%</span>
              <BatteryMedium className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 relative flex flex-col">
          {children}
        </div>

        {/* Android Gesture Bar */}
        <div className="w-full h-4 bg-white flex items-center justify-center shrink-0 z-40 border-t border-slate-100">
          <div className="w-32 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Film, BellRing, Sparkles } from 'lucide-react';

interface TelemetryProps {
  hallName?: string;
}

export const ConcessionTelemetryBar: React.FC<TelemetryProps> = ({
  hallName = 'אולם 04 • לייזר IMAX',
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(540); // 9 minutes countdown

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 10 ? prev - 1 : 540));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedCountdown = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div
      dir="rtl"
      className="w-full rounded-2xl p-3 md:p-3.5 bg-neutral-900/60 border border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-inter"
    >
      {/* Left side: Cinema & Hall info */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Film size={16} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-outfit">{hallName}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
              פרסומות פעילות
            </span>
          </div>
          <p className="text-neutral-400 text-[11px]">
            הקרנת הסרט תחל לאחר סיום מקבץ הטריילרים
          </p>
        </div>
      </div>

      {/* Center/Right: Live Telemetry countdown & Prep time */}
      <div className="flex items-center gap-4 me-auto sm:me-0">
        {/* Prep Time */}
        <div className="flex items-center gap-1.5 text-neutral-300">
          <Clock size={14} className="text-amber-400" />
          <span>זמן הכנה:</span>
          <span className="font-bold font-mono text-amber-300">~3 דק׳</span>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Countdown */}
        <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-white/5">
          <BellRing size={14} className="text-cyan-400 animate-pulse" />
          <span className="text-neutral-400">כיבוי אורות בעוד:</span>
          <span className="font-bold font-mono text-cyan-300 tracking-wider">
            {formattedCountdown}
          </span>
        </div>

        {/* Safe Badge */}
        <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium">
          <Sparkles size={12} />
          <span>בטוח להזמנה כעת</span>
        </div>
      </div>
    </div>
  );
};

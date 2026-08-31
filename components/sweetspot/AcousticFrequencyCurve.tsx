'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Disc, Radio } from 'lucide-react';

interface AcousticFrequencyCurveProps {
  isPlaying: boolean;
  frequency: number;
}

export function AcousticFrequencyCurve({ isPlaying, frequency }: AcousticFrequencyCurveProps) {
  const bars = [35, 60, 120, 250, 500, 1000, 2000, 4000, 8000, 16000];

  return (
    <div className="p-4 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 space-y-3" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-off-white/80">
          <Radio size={15} className={isPlaying ? 'text-primary animate-pulse' : 'text-off-white/40'} />
          <span>ספקטרום תדרים ואקוסטיקה בזמן אמת</span>
        </div>
        <span className="text-[11px] font-mono font-bold text-cyan-400">
          {isPlaying ? `${frequency}Hz + 35Hz Sub` : 'מצב המתנה (Idle)'}
        </span>
      </div>

      <div className="h-20 flex items-end justify-between gap-1.5 px-2 bg-black/50 rounded-2xl border border-white/5 overflow-hidden">
        {bars.map((freq, idx) => {
          const heightPercent = isPlaying
            ? Math.floor(Math.sin(idx + Date.now() / 200) * 30 + 55)
            : 15;

          return (
            <div key={freq} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                animate={{ height: `${heightPercent}%` }}
                transition={{ duration: 0.15, repeat: isPlaying ? Infinity : 0, repeatType: 'reverse' }}
                className={`w-full rounded-t-md transition-colors ${
                  freq <= 60
                    ? 'bg-gradient-to-t from-red-600 to-amber-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                    : 'bg-gradient-to-t from-cyan-600 to-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                }`}
              />
              <span className="text-[9px] font-mono text-off-white/40">{freq >= 1000 ? `${freq / 1000}k` : freq}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

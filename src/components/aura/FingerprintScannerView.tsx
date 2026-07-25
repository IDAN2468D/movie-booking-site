'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Fingerprint } from 'lucide-react';

interface FingerprintScannerViewProps {
  isScanning: boolean;
  scanProgress: number;
  onPressStart: () => void;
  onPressEnd: () => void;
}

export const FingerprintScannerView: React.FC<FingerprintScannerViewProps> = ({
  isScanning,
  scanProgress,
  onPressStart,
  onPressEnd,
}) => {
  return (
    <div className="relative w-full p-8 rounded-3xl bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col items-center text-center font-inter overflow-hidden">
      {/* Visual background aura */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="flex items-center gap-2 mb-2 relative z-10">
        <Shield className="w-5 h-5 text-cyan-400" />
        <span className="text-xs font-mono text-cyan-300 font-bold">סורק אורה ביומטרי בלייב</span>
      </div>

      <h2 className="text-2xl font-bold text-white font-outfit mb-2 relative z-10">
        לחץ והחזק לסריקת האורה
      </h2>
      <p className="text-xs text-slate-300 max-w-sm mb-8 relative z-10">
        הנח את האצבע על הסורק למשך 3 שניות. המערכת תנתח את דופק התהודה ותנפיק את פרופיל האורה שלך.
      </p>

      {/* Interactive Scanner Hub */}
      <div className="relative my-4">
        {/* Animated Progress Ring */}
        <svg className="w-44 h-44 -rotate-90">
          <circle
            cx="88"
            cy="88"
            r="76"
            className="stroke-white/10 fill-none"
            strokeWidth="6"
          />
          <circle
            cx="88"
            cy="88"
            r="76"
            className="stroke-cyan-400 fill-none transition-all duration-100"
            strokeWidth="6"
            strokeDasharray={477.5}
            strokeDashoffset={477.5 - (477.5 * scanProgress) / 100}
            strokeLinecap="round"
          />
        </svg>

        {/* Touch/Mouse Hold Button */}
        <motion.button
          onMouseDown={onPressStart}
          onMouseUp={onPressEnd}
          onMouseLeave={onPressEnd}
          onTouchStart={onPressStart}
          onTouchEnd={onPressEnd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`absolute inset-4 rounded-full border flex flex-col items-center justify-center gap-2 transition-all duration-300 transform-gpu ${
            isScanning
              ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-[0_0_40px_rgba(56,189,248,0.5)]'
              : 'bg-white/[0.04] border-white/15 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Fingerprint className={`w-16 h-16 transition-all ${isScanning ? 'text-cyan-300 animate-pulse scale-110' : 'text-slate-400'}`} />
          <span className="text-[11px] font-mono font-bold text-cyan-300">
            {isScanning ? `${Math.round(scanProgress)}%` : 'החזק לסריקה'}
          </span>
        </motion.button>
      </div>

      {isScanning && (
        <div className="mt-4 text-xs font-mono text-cyan-400 animate-pulse">
          מקליט דופק אקוסטי וכיול תדרים...
        </div>
      )}
    </div>
  );
};

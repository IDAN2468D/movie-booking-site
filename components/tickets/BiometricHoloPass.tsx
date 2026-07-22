"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface BiometricHoloPassProps {
  ticketId: string;
  movieTitle: string;
  seat: string;
}

export const BiometricHoloPass: React.FC<BiometricHoloPassProps> = ({ ticketId, movieTitle, seat }) => {
  const [progress, setProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const startHold = () => {
    if (isUnlocked) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(50, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // Audio fallback
    }

    let p = 0;
    timerRef.current = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(timerRef.current!);
        setIsUnlocked(true);
      }
    }, 100);
  };

  const endHold = () => {
    if (timerRef.current && !isUnlocked) {
      clearInterval(timerRef.current);
      setProgress(0);
    }
  };

  return (
    <div className="w-full max-w-sm p-6 rounded-3xl backdrop-blur-[40px] saturate-[250%] bg-neutral-950/40 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] text-white text-right relative overflow-hidden" dir="rtl">
      {/* Dynamic Holographic Gradient */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${isUnlocked ? 'bg-gradient-to-tr from-purple-600/30 via-cyan-500/20 to-emerald-500/30 opacity-100' : 'bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent opacity-50'}`} 
      />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
          <span className="text-xs font-mono text-purple-300">PASSBOOK #{ticketId.slice(0, 8)}</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${isUnlocked ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'}`}>
            {isUnlocked ? 'מאומת הולוגרפית 💎' : 'נעול ביומטרית 🔒'}
          </span>
        </div>

        <h3 className="font-['Outfit'] text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-white via-cyan-200 to-purple-300 mb-1">
          {movieTitle}
        </h3>
        <p className="text-sm font-mono text-neutral-400 mb-6">מושב VIP: {seat}</p>

        {/* Biometric Touch Scanner */}
        <div className="flex flex-col items-center justify-center my-4">
          <motion.button
            onPointerDown={startHold}
            onPointerUp={endHold}
            onPointerLeave={endHold}
            whileTap={{ scale: 0.95 }}
            className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
              isUnlocked
                ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                : 'border-purple-400/60 bg-purple-500/10 hover:border-purple-400'
            }`}
          >
            <span className="text-2xl">{isUnlocked ? '✨' : '👆'}</span>
          </motion.button>

          {/* Progress ring indicator */}
          {!isUnlocked && (
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden max-w-[160px]">
              <div className="bg-gradient-to-r from-purple-400 to-cyan-400 h-full transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
          )}
          <span className="text-xs text-neutral-400 mt-2 font-['Inter']">
            {isUnlocked ? 'הכרטיס הופעל בהצלחה!' : 'לחץ והחזק לאימות ביומטרי'}
          </span>
        </div>
      </div>
    </div>
  );
};

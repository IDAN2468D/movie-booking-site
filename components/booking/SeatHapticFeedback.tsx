'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function SeatHapticFeedback() {
  const triggerHapticAndBass = () => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate([30, 40, 30]);
      } catch {
        // Fallback
      }
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(40, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio fallback
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={triggerHapticAndBass}
      className="px-4 py-2 rounded-full bg-neutral-950/60 backdrop-blur-2xl border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-lg flex items-center gap-2"
    >
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      <span>משוב רטט ואקוסטיקה 40Hz מוכנים</span>
    </motion.button>
  );
}

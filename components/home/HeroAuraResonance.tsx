'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroAuraResonance() {
  const [isActive, setIsActive] = useState(false);

  const playSubBassPulse = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(35, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Graceful Web Audio fallback
    }
  };

  const handleToggle = () => {
    setIsActive((prev) => !prev);
    playSubBassPulse();
  };

  return (
    <div className="relative z-20 my-4 flex justify-center">
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group px-6 py-3 rounded-full bg-neutral-950/60 backdrop-blur-[40px] saturate-[250%] brightness-105 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center gap-3 overflow-hidden text-right"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-primary/20 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative w-3.5 h-3.5 flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-[0_0_12px_#ff1464]" />
        </div>

        <span className="relative z-10 text-xs font-black tracking-wider text-white font-display uppercase">
          {isActive ? 'הילת סרטים נוירונית פעילה ⚡' : 'סריקת הילת סרטים נוירונית'}
        </span>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative z-10 px-2 py-0.5 text-[9px] font-bold bg-primary/20 text-primary border border-primary/30 rounded-full"
            >
              120Hz Resonance
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

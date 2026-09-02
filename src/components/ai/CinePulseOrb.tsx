'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Bot, Activity } from 'lucide-react';
import { OrbMoodPicker } from './OrbMoodPicker';
import { useAudioContextManager } from '../../hooks/useAudioContextManager';

export const CinePulseOrb: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { playChime, playHapticBass } = useAudioContextManager();

  const handleToggle = () => {
    if (!isOpen) {
      playChime(587.33, 0.3); // D5 Harmonic Chime
      playHapticBass(50, 0.18);
    } else {
      playChime(440, 0.2, 'triangle');
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-24 left-4 md:bottom-8 md:left-8 z-40 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="mb-4 w-[calc(100vw-2rem)] max-w-sm md:w-96 rounded-3xl bg-black/85 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.15)] p-5 overflow-hidden relative"
          >
            {/* Top Atmospheric Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-cyan-500/20 to-transparent blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">AI Live Neural Engine</span>
              </div>
              <button
                onClick={handleToggle}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors border border-white/10"
                aria-label="סגור חלונית"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <OrbMoodPicker onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Holographic Orb Trigger */}
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="group relative flex items-center gap-3 p-2.5 md:p-3 rounded-full bg-black/70 backdrop-blur-xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(168,85,247,0.25)] hover:border-cyan-400/60 transition-all duration-300"
        aria-label="פתח יועץ קולנוע AI"
      >
        {/* Shimmering Halo Rings */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500/30 via-fuchsia-500/30 to-rose-500/30 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse pointer-events-none" />

        <div className="relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-tr from-cyan-600 via-indigo-600 to-fuchsia-600 shadow-inner">
          <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
          <div className="absolute inset-0 rounded-full border border-white/40" />
        </div>

        <div className="hidden md:flex flex-col text-right pe-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white font-outfit tracking-wide">CinePulse AI</span>
            <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
          </div>
          <span className="text-[10px] text-white/60">יועץ הווייב והסרטים החכם</span>
        </div>
      </motion.button>
    </div>
  );
};

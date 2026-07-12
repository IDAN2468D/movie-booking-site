"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { usePeerCoordinates } from '@/lib/store/phantomStore';
import { User } from 'lucide-react';

export default function PhantomPresence() {
  const coords = usePeerCoordinates();

  if (!coords) return null;

  // Render a futuristic glowing ghost avatar representing the remote peer's cursor position
  return (
    <motion.div
      style={{
        x: coords.x,
        y: coords.y,
        willChange: 'transform',
      }}
      className="absolute pointer-events-none z-50 transform-gpu"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', damping: 15 }}
    >
      {/* Iridescent Halo Glow Ring */}
      <div className="absolute -inset-4 rounded-full bg-cyan-500/20 blur-md animate-pulse transform-gpu" />

      {/* Chromatic Blur Border Container */}
      <div className="relative w-8 h-8 rounded-full border border-cyan-400/40 bg-black/60 flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.5)] transform-gpu">
        <User className="w-4 h-4 text-cyan-400" />
        
        {/* Tiny coordinate badge */}
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[6px] font-mono px-1 rounded whitespace-nowrap uppercase tracking-widest transform-gpu">
          Row {coords.row} Col {coords.col}
        </span>
      </div>
    </motion.div>
  );
}

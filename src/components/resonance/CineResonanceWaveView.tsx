'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CineResonanceWaveViewProps {
  resonanceLevel: number;
  glowColor: string;
  statusHebrew: string;
  descriptionHebrew: string;
}

export const CineResonanceWaveView: React.FC<CineResonanceWaveViewProps> = ({
  resonanceLevel,
  glowColor,
  statusHebrew,
  descriptionHebrew,
}) => {
  const bars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-white/10 bg-neutral-950/60 backdrop-blur-2xl shadow-2xl p-4 text-right" dir="rtl">
      {/* Specular Background Aura */}
      <motion.div
        className="absolute inset-0 pointer-events-none transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 75%)`,
          opacity: 0.25 + (resonanceLevel / 100) * 0.55,
        }}
      />

      {/* 3D Liquid Wave Equalizer Bars */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 h-28 my-auto">
        {bars.map((bar, idx) => {
          const heightMultiplier = Math.sin((idx / bars.length) * Math.PI);
          const currentHeight = Math.max(12, Math.min(100, (resonanceLevel * heightMultiplier * 1.1)));

          return (
            <motion.div
              key={bar}
              className="w-2.5 rounded-full bg-gradient-to-t from-cyan-500 via-sky-400 to-purple-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]"
              animate={{
                height: [currentHeight, Math.max(10, currentHeight * 1.3), currentHeight],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.2 + (idx % 4) * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      {/* Center Resonance Status Card (Fully Hebrew) */}
      <div className="relative z-10 w-full text-center space-y-1 mt-auto bg-neutral-900/50 backdrop-blur-md py-2 px-4 rounded-xl border border-white/10">
        <div className="flex justify-between items-center text-xs">
          <span className="font-outfit font-bold text-white text-base">
            {resonanceLevel}%
          </span>
          <span className="font-sans font-bold text-cyan-300">
            {statusHebrew}
          </span>
        </div>
        <p className="text-[11px] text-neutral-300 font-sans tracking-wide">
          {descriptionHebrew}
        </p>
      </div>
    </div>
  );
};

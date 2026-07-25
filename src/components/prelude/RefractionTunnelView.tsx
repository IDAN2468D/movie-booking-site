'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RefractionTunnelViewProps {
  alignmentPercentage: number;
  tunnelColor: string;
  sensoryStatus: string;
}

export const RefractionTunnelView: React.FC<RefractionTunnelViewProps> = ({
  alignmentPercentage,
  tunnelColor,
  sensoryStatus,
}) => {
  const rings = [1, 2, 3, 4, 5];

  return (
    <div className="relative w-full h-72 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 bg-neutral-950/60 backdrop-blur-2xl shadow-2xl">
      {/* Dynamic Specular Background Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at center, ${tunnelColor} 0%, transparent 70%)`,
          opacity: 0.3 + (alignmentPercentage / 100) * 0.5,
        }}
      />

      {/* Optical Refraction Tunnel Rings */}
      <div className="relative w-full h-full flex items-center justify-center">
        {rings.map((ring, idx) => {
          const scale = 0.2 + idx * 0.18 + (alignmentPercentage / 100) * 0.1;
          const rotation = idx * 15 + (alignmentPercentage / 100) * 45;

          return (
            <motion.div
              key={ring}
              className="absolute rounded-full border border-white/20 backdrop-blur-md shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] pointer-events-none"
              style={{
                width: `${scale * 280}px`,
                height: `${scale * 280}px`,
                borderColor: idx === rings.length - 1 ? 'rgba(255,255,255,0.4)' : tunnelColor,
              }}
              animate={{
                rotate: [rotation, rotation + 360],
                scale: [scale, scale * 1.05, scale],
              }}
              transition={{
                rotate: { duration: 20 - idx * 3, repeat: Infinity, ease: 'linear' },
                scale: { duration: 3 + idx, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          );
        })}

        {/* Central Thought Core Node */}
        <motion.div
          className="relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center border border-white/30 backdrop-blur-xl bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          animate={{
            scale: alignmentPercentage >= 100 ? [1, 1.15, 1] : 1,
            boxShadow: alignmentPercentage >= 100
              ? '0 0 50px rgba(168, 85, 247, 0.8)'
              : '0 0 25px rgba(56, 189, 248, 0.3)',
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="font-outfit text-2xl font-bold text-white tracking-widest">
            {alignmentPercentage}%
          </span>
          <span className="text-[10px] text-cyan-300/80 font-mono tracking-tighter uppercase">
            {alignmentPercentage >= 100 ? 'Synced' : 'Aligning'}
          </span>
        </motion.div>
      </div>

      {/* Sensory Status Overlay Tag */}
      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center px-3 py-1.5 rounded-lg border border-white/10 bg-neutral-900/40 backdrop-blur-md text-xs">
        <span className="text-neutral-400 font-inter">Sensory State:</span>
        <span className="font-mono text-cyan-400 font-medium tracking-wide">
          {sensoryStatus}
        </span>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AmbientGlowFrameProps {
  isActive: boolean;
  intensity?: number;
  className?: string;
  children: React.ReactNode;
}

export function AmbientGlowFrame({
  isActive,
  intensity = 0.85,
  className = '',
  children,
}: AmbientGlowFrameProps) {
  return (
    <div className={`relative group ${className}`}>
      {/* Ambient Radial Backlight Glow Layer */}
      {isActive && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: [intensity * 0.6, intensity, intensity * 0.7],
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-purple-600/30 to-amber-500/30 rounded-3xl blur-2xl -z-10 pointer-events-none transform-gpu will-change-transform"
          />
          {/* Secondary pulsing chromatic refraction rim */}
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -inset-[1.5px] rounded-2xl bg-[conic-gradient(from_0deg,rgba(0,242,254,0.4),rgba(79,70,229,0.3),rgba(236,72,153,0.4),rgba(0,242,254,0.4))] opacity-75 blur-[1px] -z-10 pointer-events-none"
          />
        </>
      )}

      {/* Main Container Content */}
      <div className="relative z-10 rounded-2xl overflow-hidden bg-black/80 backdrop-blur-xl border border-white/15 shadow-2xl">
        {children}
      </div>
    </div>
  );
}

export default AmbientGlowFrame;

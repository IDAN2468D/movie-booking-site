"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useCurrentSubtitle, useAudioAmplitude } from '@/lib/store/subtitlesStore';

export default function DynamicSubtitles() {
  const subtitle = useCurrentSubtitle();
  const amplitude = useAudioAmplitude();

  if (!subtitle) return null;

  // Modulate backdrop blur and saturation using Web Audio API amplitude
  const blurIntensity = Math.min(40, 20 + (amplitude / 255) * 20);
  const saturation = Math.min(250, 150 + (amplitude / 255) * 100);
  const scale = 1 + (amplitude / 255) * 0.05;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 w-full max-w-[600px] px-6 pointer-events-none transform-gpu">
      <motion.div
        animate={{ scale }}
        transition={{ duration: 0.1 }}
        style={{
          backdropFilter: `blur(${blurIntensity}px) saturate(${saturation}%)`,
          WebkitBackdropFilter: `blur(${blurIntensity}px) saturate(${saturation}%)`,
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 ${10 + (amplitude / 255) * 30}px rgba(6, 182, 212, 0.2)`,
          willChange: 'transform, backdrop-filter',
        }}
        className="p-4 rounded-2xl bg-neutral-950/40 border border-white/[0.12] text-center transform-gpu"
      >
        <span className="text-sm sm:text-base font-outfit font-bold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {subtitle}
        </span>
      </motion.div>
    </div>
  );
}

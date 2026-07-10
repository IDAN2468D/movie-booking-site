'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiquidGlassStore } from '@/lib/store/liquidGlassStore';

const THEME_MAP: Record<string, string> = {
  'Sci-Fi': 'from-purple-900/40 to-black/90',
  'Action': 'from-blue-900/40 to-black/90',
  'Horror': 'from-red-950/40 to-black/95',
  'Thriller': 'from-red-950/40 to-black/95',
  'Comedy': 'from-amber-900/30 to-slate-950/90',
  'Drama': 'from-amber-900/30 to-slate-950/90',
  'default': 'from-neutral-900/40 to-black/90'
};

export const AmbientGlass = memo(() => {
  const activeGenre = useLiquidGlassStore((state) => state.activeIntensityGenre) || 'default';
  
  const gradientClass = THEME_MAP[activeGenre] || THEME_MAP['default'];

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {/* Base Dark Background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Dynamic Animated Gradient Layer using AnimatePresence for smooth crossfading */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          key={activeGenre}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className={`absolute inset-0 bg-gradient-to-b ${gradientClass} transform-gpu will-change-[opacity]`}
        />
      </AnimatePresence>
      
      {/* Liquid Glass 4.0 Blur Matrix */}
      <div className="absolute inset-0 backdrop-blur-[24px] saturate-[180%] transform-gpu will-change-[backdrop-filter]" />
    </div>
  );
});

AmbientGlass.displayName = 'AmbientGlass';

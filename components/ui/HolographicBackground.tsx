'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingStore } from '@/lib/store';
import { getPaletteForMovie } from '@/lib/utils/color-sync';

export default function HolographicBackground() {
  const selectedMovie = useBookingStore(state => state.selectedMovie);
  
  const palette = useMemo(() => {
    return getPaletteForMovie(selectedMovie?.genre_ids || []);
  }, [selectedMovie]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base Dark Mesh */}
      <div className="absolute inset-0 bg-[#0A0A0A]" />
      
      {/* Animated Holographic Fog */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={`${palette.primary}-1`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0]
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] blur-[120px] will-change-transform"
          style={{
            background: `radial-gradient(circle at center, ${palette.primary}0D 0%, transparent 50%)`
          }}
        />
        
        <motion.div 
          key={`${palette.secondary}-2`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.15, 0.3, 0.15],
            scale: [1.1, 1, 1.1],
            rotate: [0, -45, 0]
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -bottom-[50%] -right-[50%] w-[200%] h-[200%] blur-[120px] will-change-transform"
          style={{
            background: `radial-gradient(circle at center, ${palette.secondary}0D 0%, transparent 50%)`
          }}
        />
      </AnimatePresence>

      {/* Static Refraction Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />
      
      {/* Bottom Vignette */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
    </div>
  );
}

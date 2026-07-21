'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingStore } from '@/lib/store';
import { getPaletteForMovie } from '@/lib/utils/color-sync';
import ParallaxOrb from './ParallaxOrb';

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
      <AnimatePresence mode="sync">
        <motion.div 
          key={`${palette.primary}-1`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.2, 0.4, 0.2]
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] blur-[64px]"
          style={{
            background: `radial-gradient(circle at center, ${palette.primary}0D 0%, transparent 50%)`,
            willChange: 'opacity'
          }}
        />
        
        <motion.div 
          key={`${palette.secondary}-2`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.15, 0.3, 0.15]
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -bottom-[10%] -right-[10%] w-[120%] h-[120%] blur-[64px]"
          style={{
            background: `radial-gradient(circle at center, ${palette.secondary}0D 0%, transparent 50%)`,
            willChange: 'opacity'
          }}
        />
      </AnimatePresence>

      {/* 3D Parallax Glass Orbs */}
      <ParallaxOrb size={450} offsetX="5%" offsetY="10%" parallaxFactor={0.03} />
      <ParallaxOrb size={300} offsetX="65%" offsetY="50%" parallaxFactor={0.06} />

      {/* Static Refraction Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />
      
      {/* Bottom Vignette */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
    </div>
  );
}

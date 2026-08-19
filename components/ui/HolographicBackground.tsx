'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBookingStore } from '@/lib/store';
import { getPaletteForMovie } from '@/lib/utils/color-sync';
import ParallaxOrb from './ParallaxOrb';

export default function HolographicBackground() {
  const selectedMovie = useBookingStore(state => state.selectedMovie);
  
  const palette = useMemo(() => {
    return getPaletteForMovie(selectedMovie?.genre_ids || []);
  }, [selectedMovie]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none [contain:strict] [isolation:isolate]" aria-hidden="true">
      {/* Base Dynamic Lighting Band Mesh */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out" 
        style={{ background: 'var(--bg-main, #0A0A0A)' }}
      />
      
      {/* Dynamic Day/Night Lighting Atmospheric Aura */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-in-out"
        style={{ background: 'var(--lighting-aura, transparent)' }}
      />

      {/* Subtle Animated Holographic Fog */}
      <div className="absolute inset-0 overflow-hidden [contain:strict] pointer-events-none">
        <motion.div 
          key={`${palette.primary}-1`}
          initial={false}
          animate={{ opacity: [0.12, 0.25, 0.12] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] blur-[70px] transform-gpu pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${palette.primary}10 0%, transparent 50%)`,
            willChange: 'opacity'
          }}
        />
        
        <motion.div 
          key={`${palette.secondary}-2`}
          initial={false}
          animate={{ opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -right-[10%] w-[120%] h-[120%] blur-[70px] transform-gpu pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${palette.secondary}10 0%, transparent 50%)`,
            willChange: 'opacity'
          }}
        />
      </div>

      {/* 3D Parallax Glass Orbs */}
      <ParallaxOrb size={450} offsetX="5%" offsetY="10%" parallaxFactor={0.03} />
      <ParallaxOrb size={300} offsetX="65%" offsetY="50%" parallaxFactor={0.06} />

      {/* Static Refraction Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />
      
      {/* Bottom Vignette */}
      <div 
        className="absolute inset-x-0 bottom-0 h-64 pointer-events-none transition-all duration-1000"
        style={{ background: 'linear-gradient(to top, var(--bg-main, #0A0A0A) 0%, transparent 100%)' }}
      />
    </div>
  );
}

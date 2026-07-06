'use client';

import React from 'react';
import { motion, MotionValue, useTransform, useVelocity, useSpring } from 'framer-motion';

interface Props {
  scrollY: MotionValue<number>;
}

export function AnamorphicFlareLayer({ scrollY }: Props) {
  // Speed factor 0.14 per v6.0 specs
  const yParallax = useTransform(scrollY, (v) => v * -0.14);
  
  // Calculate scroll velocity for dynamic stretching and brightening
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  
  // Map velocity to scaleX (baseline 1, expands based on speed)
  const scaleX = useTransform(smoothVelocity, [-1000, 0, 1000], [2.5, 1, 2.5]);
  
  // Map velocity to opacity (brightens on scroll)
  const opacity = useTransform(smoothVelocity, [-1000, 0, 1000], [0.8, 0.3, 0.8]);

  return (
    <div className="fixed inset-0 w-full h-[150vh] pointer-events-none z-0 overflow-hidden mix-blend-screen flex flex-col items-center justify-center">
      
      {/* Flare 1 - Main Center Streak */}
      <motion.div
        style={{ y: yParallax, scaleX, opacity }}
        className="absolute top-[30%] w-[150vw] h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 via-indigo-500/30 to-transparent transform-gpu will-change-transform blur-[1px]"
      />
      <motion.div
        style={{ y: yParallax, scaleX, opacity }}
        className="absolute top-[30%] w-[100vw] h-[10px] bg-gradient-to-r from-transparent via-cyan-400/10 via-indigo-400/10 to-transparent transform-gpu will-change-transform blur-[4px]"
      />

      {/* Flare 2 - Lower Streak */}
      <motion.div
        style={{ 
          y: yParallax, 
          scaleX, 
          opacity 
        }}
        className="absolute top-[70%] w-[120vw] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 via-cyan-500/20 to-transparent transform-gpu will-change-transform blur-[1px]"
      />
      
    </div>
  );
}

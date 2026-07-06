'use client';

import React, { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

export function ShutterFlickerLayer() {
  // Use a motion value for opacity to ensure zero-reflow rendering
  const opacity = useMotionValue(0.015);
  const lastTime = useRef(0);
  
  // 24fps locked flicker loop (approx 41.66ms per frame)
  useAnimationFrame((time) => {
    if (time - lastTime.current > 41.66) {
      // Pseudo-random exposure variations mimicking celluloid projection
      const flicker = 0.01 + Math.random() * 0.03;
      opacity.set(flicker);
      lastTime.current = time;
    }
  });

  return (
    <motion.div
      style={{ opacity }}
      className="fixed inset-0 w-full h-[100vh] bg-black pointer-events-none z-10 mix-blend-overlay transform-gpu will-change-transform"
    />
  );
}

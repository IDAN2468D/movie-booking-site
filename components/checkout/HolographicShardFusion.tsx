'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useLiquidGlassStore } from '../../lib/store/liquidGlassStore';

const PARTICLE_COUNT = 24;

export function HolographicShardFusion() {
  const isFusionActive = useLiquidGlassStore((state) => state.fusionShardsActive);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isFusionActive) return null;

  // Render particles isolated in a portal container to prevent structural reflow inside layout wrappers
  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        // Generate random origins representing the seat matrix
        // And fuse them into the center screen (the ticket)
        const startX = typeof window !== 'undefined' ? window.innerWidth / 2 + (Math.random() * 600 - 300) : 0;
        const startY = typeof window !== 'undefined' ? window.innerHeight + 100 : 0;
        
        const targetX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
        const targetY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-10 bg-white/90 rounded-full shadow-[0_0_20px_rgba(255,255,255,1),0_0_40px_rgba(255,0,100,0.5)] transform-gpu will-change-transform mix-blend-screen"
            initial={{ 
              x: startX, 
              y: startY, 
              scale: Math.random() * 0.5 + 0.5,
              rotate: Math.random() * 360,
              opacity: 0
            }}
            animate={{ 
              x: targetX, 
              y: targetY,
              scale: 0,
              rotate: Math.random() * 360 + 180,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 0.7 + Math.random() * 0.6,
              ease: [0.22, 1, 0.36, 1], // Expo out for snappy shard fusion
              delay: Math.random() * 0.3
            }}
          />
        );
      })}
    </div>,
    document.body
  );
}

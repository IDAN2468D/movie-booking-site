'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingStore } from '@/lib/store';

interface Particle {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size: number;
  rotation: number;
  delay: number;
  color: string;
}

interface CurrencyCascadeProps {
  onComplete?: () => void;
  checkoutResult?: { success: boolean; data?: any; error?: string };
}

export default function CurrencyCascade({ onComplete, checkoutResult }: CurrencyCascadeProps) {
  // Shallow-baked atomic selector for transaction completion
  const isTransactionCompleted = useBookingStore((state) => state.isTransactionCompleted);
  const setTransactionCompleted = useBookingStore((state) => state.setTransactionCompleted);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [triggerCascade, setTriggerCascade] = useState(false);

  useEffect(() => {
    // Validate trigger condition safely against the Result Pattern
    const isValidSuccess = checkoutResult?.success === true || (isTransactionCompleted && !checkoutResult?.error);
    
    if (isValidSuccess) {
      setTriggerCascade(true);
      
      // Generate 45 GPU-friendly cascading currency/glass shards
      const generated: Particle[] = Array.from({ length: 45 }).map((_, i) => {
        const startX = Math.random() * window.innerWidth;
        const startY = -50;
        const endX = startX + (Math.random() - 0.5) * 300;
        const endY = window.innerHeight + 50;
        const size = Math.random() * 16 + 10;
        const rotation = Math.random() * 360;
        const delay = Math.random() * 0.8;
        
        // Liquid Glass palette colors (cyan, magenta, gold, violet, rose)
        const colors = ['#0AEFFF', '#FF1464', '#EAB308', '#A855F7', '#EC4899'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        return { id: i, startX, startY, endX, endY, size, rotation, delay, color };
      });
      
      setParticles(generated);

      // Clean up after cascade animation completes
      const timeout = setTimeout(() => {
        setTriggerCascade(false);
        setTransactionCompleted(false);
        if (onComplete) onComplete();
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [checkoutResult, isTransactionCompleted, setTransactionCompleted, onComplete]);

  return (
    <AnimatePresence>
      {triggerCascade && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 0.8 }}
              animate={{
                opacity: [1, 1, 0],
                scale: [0.8, 1.1, 0.6],
                rotate: p.rotation + 720,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: p.delay,
              }}
              // GPU transform mapping with style coordinates to eliminate layout reflow
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                x: p.startX,
                y: p.startY,
                width: p.size,
                height: p.size * 1.5,
              }}
            >
              {/* Particle visual - holographic reflective coin shape */}
              <motion.div
                animate={{
                  x: [0, p.endX - p.startX],
                  y: [0, p.endY - p.startY],
                }}
                transition={{
                  duration: 2.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: p.delay,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '6px',
                  background: `linear-gradient(135deg, ${p.color}dd, rgba(255,255,255,0.4))`,
                  boxShadow: `0 4px 12px ${p.color}66, inset 0 0 4px rgba(255,255,255,0.6)`,
                }}
                // Enforcing Liquid Glass refraction tokens
                className="backdrop-blur-md saturate-[150%] bg-white/10 border border-white/20"
              />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

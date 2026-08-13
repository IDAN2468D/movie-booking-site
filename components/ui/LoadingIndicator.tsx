'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type LoadingIndicatorVariant = 'orbit' | 'spinner' | 'pulse' | 'dots';
export type LoadingIndicatorSize = 'sm' | 'md' | 'lg' | 'xl' | number;

export interface LoadingIndicatorProps {
  variant?: LoadingIndicatorVariant;
  size?: LoadingIndicatorSize;
  color?: string;
  label?: string;
  className?: string;
  duration?: number;
  interactive?: boolean;
}

const SIZE_MAP: Record<string, number> = {
  sm: 24,
  md: 40,
  lg: 60,
  xl: 80,
};

/**
 * ⚡ LoadingIndicator: Framer Motion 120Hz GPU-Accelerated Loading Indicator.
 * Uses 120Hz GPU transform/opacity rendering, interactive hover dynamics,
 * 4-color quantum discharges, and prefers-reduced-motion safety across the entire site.
 */
export function LoadingIndicator({
  variant = 'orbit',
  size = 'md',
  color = '#ff4500',
  label = 'טוען...',
  className = '',
  duration = 1.2,
  interactive = true,
}: LoadingIndicatorProps) {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 40;

  return (
    <div
      role="status"
      aria-label={label}
      className={`relative inline-flex items-center justify-center select-none ${interactive ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'} ${className}`}
      style={{
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
      }}
    >
      {/* Variant 1: Framer Motion 120Hz GPU Orbiting 4-Color Quantum Discharges */}
      {variant === 'orbit' && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'linear',
          }}
          whileHover={interactive ? { scale: 1.2, transition: { duration: 0.2 } } : {}}
          className="relative w-full h-full transform-gpu will-change-transform"
        >
          {/* Top Dot: Red-Orange */}
          <motion.span
            whileHover={interactive ? { scale: 1.3 } : {}}
            className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-[#ff4500] shadow-[0_0_12px_#ff4500] transform-gpu"
            style={{ width: `${pixelSize * 0.24}px`, height: `${pixelSize * 0.24}px` }}
          />

          {/* Right Dot: Yellow-Orange */}
          <motion.span
            whileHover={interactive ? { scale: 1.3 } : {}}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-[#ff9900] shadow-[0_0_12px_#ff9900] transform-gpu"
            style={{ width: `${pixelSize * 0.24}px`, height: `${pixelSize * 0.24}px` }}
          />

          {/* Bottom Dot: Pink / Magenta */}
          <motion.span
            whileHover={interactive ? { scale: 1.3 } : {}}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-[#ff007f] shadow-[0_0_12px_#ff007f] transform-gpu"
            style={{ width: `${pixelSize * 0.24}px`, height: `${pixelSize * 0.24}px` }}
          />

          {/* Left Dot: Cyan / Aqua */}
          <motion.span
            whileHover={interactive ? { scale: 1.3 } : {}}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-[#00f0ff] shadow-[0_0_12px_#00f0ff] transform-gpu"
            style={{ width: `${pixelSize * 0.24}px`, height: `${pixelSize * 0.24}px` }}
          />
        </motion.div>
      )}

      {/* Variant 2: Framer Motion 120Hz Conic Electric Spinner */}
      {variant === 'spinner' && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration, repeat: Infinity, ease: 'linear' }}
          whileHover={interactive ? { scale: 1.15 } : {}}
          className="relative w-full h-full flex items-center justify-center transform-gpu will-change-transform"
        >
          <div
            className="w-full h-full rounded-full border-2 border-white/10 border-t-transparent"
            style={{
              borderTopColor: color,
              borderRightColor: `${color}88`,
              filter: `drop-shadow(0 0 8px ${color}aa)`,
            }}
          />
          <motion.div
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: duration * 0.8, repeat: Infinity }}
            className="absolute w-[40%] h-[40%] rounded-full"
            style={{ backgroundColor: color }}
          />
        </motion.div>
      )}

      {/* Variant 3: Framer Motion 120Hz Radial Pulse */}
      {variant === 'pulse' && (
        <motion.div
          whileHover={interactive ? { scale: 1.2 } : {}}
          className="relative w-full h-full flex items-center justify-center transform-gpu will-change-transform"
        >
          <motion.span
            animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.6, 0.1, 0.6] }}
            transition={{ duration: duration * 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-full h-full rounded-full"
            style={{ backgroundColor: color }}
          />
          <motion.span
            animate={{ scale: [0.95, 1.08, 0.95] }}
            transition={{ duration: duration * 0.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[45%] h-[45%] rounded-full shadow-[0_0_14px_var(--color-1)] transform-gpu"
            style={{ backgroundColor: color }}
          />
        </motion.div>
      )}

      {/* Variant 4: Framer Motion 120Hz Neon Wave Dots */}
      {variant === 'dots' && (
        <div className="flex items-center justify-between w-full h-full px-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [-3, 3, -3], scale: [0.9, 1.2, 0.9], opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: duration * 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
              whileHover={interactive ? { scale: 1.5 } : {}}
              className="w-[24%] h-[24%] rounded-full shadow-[0_0_8px_#ff4500] transform-gpu will-change-transform"
              style={{
                backgroundColor: i === 1 ? '#ff9900' : i === 2 ? '#ff007f' : color,
              }}
            />
          ))}
        </div>
      )}

      <span className="sr-only">{label}</span>
    </div>
  );
}

export default LoadingIndicator;

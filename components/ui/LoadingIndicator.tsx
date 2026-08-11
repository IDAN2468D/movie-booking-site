'use client';

import React from 'react';

export type LoadingIndicatorVariant = 'orbit' | 'spinner' | 'pulse' | 'dots';
export type LoadingIndicatorSize = 'sm' | 'md' | 'lg' | 'xl' | number;

export interface LoadingIndicatorProps {
  variant?: LoadingIndicatorVariant;
  size?: LoadingIndicatorSize;
  color?: string;
  label?: string;
  className?: string;
  duration?: number;
}

const SIZE_MAP: Record<string, number> = {
  sm: 24,
  md: 40,
  lg: 60,
  xl: 80,
};

/**
 * ⚡ LoadingIndicator: High-Performance GPU-Accelerated Loading Animation.
 * Implements strict 60/120 FPS transform/opacity rendering, a11y role="status",
 * CSS variables, and prefers-reduced-motion safety.
 */
export function LoadingIndicator({
  variant = 'orbit',
  size = 'md',
  color = '#ff4500',
  label = 'טוען...',
  className = '',
  duration = 1.2,
}: LoadingIndicatorProps) {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 40;

  return (
    <div
      role="status"
      aria-label={label}
      className={`relative inline-flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        // Custom CSS variables for dynamic sizing and duration
        ['--loader-size' as string]: `${pixelSize}px`,
        ['--anim-duration' as string]: `${duration}s`,
        ['--color-1' as string]: color,
      }}
    >
      {/* Variant 1: Orbiting Dots (4-Color Quantum Discharges) */}
      {variant === 'orbit' && (
        <div className="relative w-full h-full animate-[spin_var(--anim-duration)_linear_infinite] [transform:translateZ(0)] will-change-transform motion-reduce:animate-none">
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full w-[22%] h-[22%] bg-[#ff4500] shadow-[0_0_8px_#ff4500]"
          />
          <span
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full w-[22%] h-[22%] bg-[#ff8800] shadow-[0_0_8px_#ff8800]"
          />
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full w-[22%] h-[22%] bg-[#ff0055] shadow-[0_0_8px_#ff0055]"
          />
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full w-[22%] h-[22%] bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]"
          />
        </div>
      )}

      {/* Variant 2: Precision Conic Electric Spinner */}
      {variant === 'spinner' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div
            className="w-full h-full rounded-full border-2 border-white/10 border-t-transparent animate-[spin_var(--anim-duration)_linear_infinite] [transform:translateZ(0)] will-change-transform motion-reduce:animate-none"
            style={{
              borderTopColor: color,
              borderRightColor: `${color}88`,
              filter: `drop-shadow(0 0 6px ${color}aa)`,
            }}
          />
          <div
            className="absolute w-[40%] h-[40%] rounded-full bg-white/20 animate-ping opacity-30"
            style={{ backgroundColor: color }}
          />
        </div>
      )}

      {/* Variant 3: Electric Radial Pulse */}
      {variant === 'pulse' && (
        <div className="relative w-full h-full flex items-center justify-center [transform:translateZ(0)]">
          <span
            className="absolute w-full h-full rounded-full animate-ping opacity-40 motion-reduce:animate-none"
            style={{ backgroundColor: color, animationDuration: `${duration * 1.5}s` }}
          />
          <span
            className="w-[45%] h-[45%] rounded-full shadow-[0_0_12px_var(--color-1)]"
            style={{ backgroundColor: color }}
          />
        </div>
      )}

      {/* Variant 4: Neon Dots */}
      {variant === 'dots' && (
        <div className="flex items-center justify-between w-full h-full px-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[24%] h-[24%] rounded-full bg-[#ff4500] shadow-[0_0_6px_#ff4500] animate-[pulse_var(--anim-duration)_ease-in-out_infinite] [transform:translateZ(0)] will-change-transform"
              style={{
                animationDelay: `${i * 0.2}s`,
                backgroundColor: i === 1 ? '#ff8800' : i === 2 ? '#ff0055' : color,
              }}
            />
          ))}
        </div>
      )}

      {/* Screen Reader Label */}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default LoadingIndicator;


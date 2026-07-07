'use client';

import { useEffect, useRef } from 'react';
import { useLiquidGlassStore } from '../../lib/store/liquidGlassStore';

const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

export function VolumetricFilmGrain() {
  const isFilmGrainActive = useLiquidGlassStore((state) => state.isFilmGrainActive);
  const grainRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!isFilmGrainActive || !grainRef.current) return;

    const animateGrain = () => {
      if (grainRef.current) {
        // GPU accelerated random translation to avoid reflow and hit 120Hz
        const x = Math.floor(Math.random() * 10) - 5;
        const y = Math.floor(Math.random() * 10) - 5;
        grainRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      frameRef.current = requestAnimationFrame(animateGrain);
    };

    frameRef.current = requestAnimationFrame(animateGrain);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [isFilmGrainActive]);

  if (!isFilmGrainActive) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] opacity-[0.03] mix-blend-overlay pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        ref={grainRef}
        className="absolute inset-[-10%] w-[120%] h-[120%] transform-gpu will-change-transform"
        style={{
          backgroundImage: `url("${NOISE_SVG}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '150px 150px',
        }}
      />
    </div>
  );
}

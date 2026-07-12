"use client";

import React, { useEffect, useRef } from 'react';
import { useGrainDensity, useGrainSpeedCoefficient } from '@/lib/store/grainShaderStore';

const GRAIN_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

export default function VolumetricGrain() {
  const density = useGrainDensity();
  const speed = useGrainSpeedCoefficient();
  const grainRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!grainRef.current) return;

    let lastTime = performance.now();
    const animate = (now: number) => {
      // Limit speed/frames if coefficient is low
      if (now - lastTime >= 1000 / (24 * speed)) {
        lastTime = now;
        if (grainRef.current) {
          const x = (Math.random() - 0.5) * 15;
          const y = (Math.random() - 0.5) * 15;
          grainRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [speed]);

  return (
    <div
      ref={grainRef}
      className="fixed -inset-10 pointer-events-none z-50 transform-gpu mix-blend-overlay"
      style={{
        backgroundImage: `url("${GRAIN_SVG}")`,
        opacity: density * 0.1, // scaled for organic texture opacity
        willChange: 'transform',
      }}
    />
  );
}

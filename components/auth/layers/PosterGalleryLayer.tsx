'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';

interface Props {
  scrollY: MotionValue<number>;
  images?: string[];
}

export function PosterGalleryLayer({ scrollY, images = [] }: Props) {
  // Speed factor = 0.45 for depth perception
  const y = useTransform(scrollY, (value) => value * -0.45);

  return (
    <motion.div
      style={{ y }}
      className="fixed inset-0 w-full h-[300vh] pointer-events-none transform-gpu will-change-transform z-0 overflow-hidden"
    >
      {/* Scattered Glass Posters */}
      {images.map((imgSrc, i) => {
        // Randomize positioning and rotation slightly based on index
        const top = `${10 + (i * 25)}%`;
        const left = i % 2 === 0 ? `${10 + (i * 5)}%` : `${60 - (i * 5)}%`;
        const rotate = i % 2 === 0 ? 6 + i : -4 - i;

        return (
          <div 
            key={`poster-${i}`}
            className="absolute w-[280px] h-[400px] rounded-[30px] backdrop-blur-md bg-white/[0.02] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.15)] p-4 flex flex-col gap-2"
            style={{ 
              top, 
              left, 
              transform: `rotate(${rotate}deg)` 
            }}
          >
            <div className="relative w-full flex-1 rounded-2xl border border-white/10 bg-black/60 shadow-inner overflow-hidden">
               <Image
                src={imgSrc}
                alt={`Poster ${i}`}
                fill
                className="object-cover opacity-80 mix-blend-overlay"
                unoptimized
              />
            </div>
            {/* Pseudo-text lines representing metadata in the glass card */}
            <div className="w-2/3 h-3 rounded-full bg-white/10 mt-2" />
            <div className="w-1/2 h-2 rounded-full bg-white/5" />
          </div>
        );
      })}
    </motion.div>
  );
}

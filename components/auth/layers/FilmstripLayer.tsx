'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';

interface Props {
  scrollY: MotionValue<number>;
  imageSrc?: string;
}

export function FilmstripLayer({ scrollY, imageSrc = "/image_1.png" }: Props) {
  // Speed factor = 0.38
  const y = useTransform(scrollY, (value) => value * -0.38);

  return (
    <motion.div
      style={{ y }}
      className="fixed inset-0 w-full h-[200vh] pointer-events-none transform-gpu will-change-transform z-0 overflow-hidden"
    >
      {/* Translucent glassmorphic filmstrip 1 */}
      <div className="absolute top-[10%] left-[5%] w-[120px] h-[600px] rounded-[30px] backdrop-blur-md bg-white/[0.02] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.15)] flex flex-col gap-4 p-4 -rotate-12">
        {[...Array(4)].map((_, i) => (
          <div key={`fs1-${i}`} className="w-full flex-1 rounded-[14px] border border-white/5 bg-black/40 shadow-inner" />
        ))}
      </div>
      
      {/* Translucent glassmorphic filmstrip 2 */}
      <div className="absolute top-[40%] right-[10%] w-[150px] h-[500px] rounded-[30px] backdrop-blur-md bg-white/[0.02] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.15)] flex flex-col gap-4 p-4 rotate-6">
        {[...Array(3)].map((_, i) => (
          <div key={`fs2-${i}`} className="w-full flex-1 rounded-[14px] border border-white/5 bg-black/50 shadow-inner" />
        ))}
      </div>

      {/* Negative Frame with Image 1 */}
      <div className="absolute top-[60%] left-[30%] w-[400px] h-[250px] rounded-[40px] backdrop-blur-md bg-white/[0.02] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.15)] p-6 rotate-3">
        <div className="relative w-full h-full rounded-2xl border border-white/10 bg-black/60 shadow-inner overflow-hidden">
           <Image
            src={imageSrc}
            alt="Glass negative frame"
            fill
            className="object-cover opacity-80 mix-blend-overlay"
            unoptimized
          />
        </div>
      </div>
    </motion.div>
  );
}

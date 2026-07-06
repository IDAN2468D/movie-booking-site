'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface Props {
  scrollY: MotionValue<number>;
}

export function ProjectorBeamLayer({ scrollY }: Props) {
  // Speed factor = 0.09 per v6.0 specs
  const y = useTransform(scrollY, (value) => value * -0.09);
  const scale = useTransform(scrollY, [0, 1000], [1, 1.1]);

  return (
    <motion.div
      style={{ y, scale }}
      className="fixed inset-0 w-full h-[150vh] pointer-events-none transform-gpu will-change-transform z-0 origin-top flex flex-col items-center justify-center"
    >
      {/* Projector Lens Halo */}
      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle_at_center,oklab(0.3_0.1_0.1)_0%,transparent_70%)] opacity-15 mix-blend-screen blur-[100px]" />
      
      {/* Conical Light Rays */}
      <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[150vw] h-[150vh] bg-[conic-gradient(from_180deg_at_50%_0%,transparent_40%,rgba(255,255,255,0.08)_50%,transparent_60%)] opacity-15 mix-blend-screen" />
      
      {/* Massive Conical Radial OKLAB gradient */}
      <div className="absolute top-[-30%] left-[50%] -translate-x-1/2 w-[200vw] h-[200vh] bg-[radial-gradient(ellipse_at_top,oklab(1_0_0/0.1)_0%,transparent_50%)] blur-3xl opacity-30 pointer-events-none" />
    </motion.div>
  );
}

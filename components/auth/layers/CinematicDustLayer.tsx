'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';

interface Props {
  scrollY: MotionValue<number>;
  imageSrc?: string;
}

export function CinematicDustLayer({ scrollY, imageSrc = "/image_2.png" }: Props) {
  // Speed factor 0.22 per v6.0 specs
  const yParallax = useTransform(scrollY, (value) => value * -0.22);

  return (
    <div className="fixed inset-0 w-full h-[150vh] pointer-events-none z-0 overflow-hidden">
      <motion.div
        style={{ y: yParallax }}
        animate={{
          x: [0, -30, 10, -15, 0], // Smooth horizontal noise drift
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-[120vw] h-[150vh] -left-[10vw] transform-gpu will-change-transform mix-blend-screen opacity-60"
      >
        <Image
          src={imageSrc}
          alt="Glowing particle motes texture"
          fill
          priority
          className="object-cover"
          unoptimized
        />
      </motion.div>
    </div>
  );
}

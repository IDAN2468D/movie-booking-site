'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';

interface Props {
  scrollY: MotionValue<number>;
  imageSrc?: string;
}

export function FocusLaserLayer({ scrollY, imageSrc = "/image_3.png" }: Props) {
  // Speed factor 0.55 per v6.0 specs
  const yParallax = useTransform(scrollY, (value) => value * -0.55);

  return (
    <motion.div
      style={{ y: yParallax }}
      className="fixed inset-0 w-full h-[150vh] pointer-events-none z-10 transform-gpu will-change-transform mix-blend-screen opacity-80"
    >
      <div className="relative w-full h-full">
        <Image
          src={imageSrc}
          alt="Intense white-gold projection laser beam streams"
          fill
          priority
          className="object-cover"
          unoptimized
        />
      </div>
    </motion.div>
  );
}

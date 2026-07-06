'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';

interface Props {
  scrollY: MotionValue<number>;
  imageSrc?: string;
}

export function DeepBaseLayer({ scrollY, imageSrc = "/image_0.png" }: Props) {
  // Speed factor 0.05 per v6.0 specs
  const yParallax = useTransform(scrollY, (value) => value * -0.05);

  return (
    <motion.div
      style={{ y: yParallax }}
      className="fixed inset-0 w-full h-[150vh] pointer-events-none z-0 transform-gpu will-change-transform opacity-60"
    >
      <div className="relative w-full h-full">
        <Image
          src={imageSrc}
          alt="Deep Base Background"
          fill
          priority
          className="object-cover"
          unoptimized
        />
      </div>
    </motion.div>
  );
}

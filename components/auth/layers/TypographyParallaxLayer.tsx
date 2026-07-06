'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface Props {
  scrollY: MotionValue<number>;
}

export function TypographyParallaxLayer({ scrollY }: Props) {
  // Speed factor for massive hollow text set strictly to 0.70 as per v6.0 specs
  const yParallax = useTransform(scrollY, (value) => value * -0.70);

  return (
    <div className="fixed inset-0 w-full h-[200vh] pointer-events-none z-0 overflow-hidden flex flex-col justify-center items-center">
      
      {/* Background Kinetic Text 1 */}
      <motion.div
        style={{ y: yParallax }}
        className="absolute top-[20%] left-[-10%] opacity-20 transform-gpu will-change-transform"
      >
        <h1 
          className="text-[20rem] font-black font-outfit uppercase whitespace-nowrap text-transparent"
          style={{ WebkitTextStroke: '2px rgba(255,255,255,0.05)' }}
        >
          CINEMA
        </h1>
      </motion.div>

      {/* Background Kinetic Text 2 */}
      <motion.div
        style={{ y: yParallax }}
        className="absolute top-[60%] right-[-5%] opacity-15 transform-gpu will-change-transform"
      >
        <h1 
          className="text-[16rem] font-black font-outfit uppercase whitespace-nowrap text-transparent"
          style={{ WebkitTextStroke: '2px rgba(255,255,255,0.06)' }}
        >
          PREMIUM
        </h1>
      </motion.div>

      {/* Background Kinetic Text 3 */}
      <motion.div
        style={{ y: yParallax }}
        className="absolute top-[120%] left-[10%] opacity-10 transform-gpu will-change-transform"
      >
        <h1 
          className="text-[22rem] font-black font-outfit uppercase whitespace-nowrap text-transparent"
          style={{ WebkitTextStroke: '2px rgba(255,255,255,0.04)' }}
        >
          EXPERIENCE
        </h1>
      </motion.div>

    </div>
  );
}

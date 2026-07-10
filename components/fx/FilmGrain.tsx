'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';

const GRAIN_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

export const FilmGrain = memo(() => {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] h-screen w-screen overflow-hidden opacity-[0.04] mix-blend-overlay">
      <motion.div
        animate={{
          transform: [
            'translate(0%, 0%)',
            'translate(-2%, -2%)',
            'translate(-4%, 2%)',
            'translate(2%, -4%)',
            'translate(-2%, 4%)',
            'translate(0%, 0%)',
          ],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }}
        className="absolute -inset-[50%] h-[200%] w-[200%] transform-gpu will-change-transform"
        style={{
          backgroundImage: `url("${GRAIN_SVG}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />
    </div>
  );
});

FilmGrain.displayName = 'FilmGrain';

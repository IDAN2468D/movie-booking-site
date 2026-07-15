'use client';

import React from 'react';
import { motion } from 'framer-motion';
import OmniBox from './OmniBox';
import { VolumetricFilmGrain } from '../effects/VolumetricFilmGrain';

interface GatewayHeroProps {
  title: string;
  subtitle: string;
}

export default function GatewayHero({ title, subtitle }: GatewayHeroProps) {
  return (
    <div className="relative min-h-[65vh] flex flex-col justify-center items-center overflow-hidden pt-24 pb-12 px-4">
      {/* Volumetric Film Grain Layer */}
      <VolumetricFilmGrain />

      {/* Cinematic Background Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020203]/40 to-[#020203] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,92,255,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col gap-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white font-display leading-tight"
          style={{ willChange: 'transform, opacity' }}
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-white/50 leading-relaxed font-body max-w-xl mx-auto"
          style={{ willChange: 'transform, opacity' }}
        >
          {subtitle}
        </motion.p>

        <div className="mt-8">
          <OmniBox />
        </div>
      </div>
    </div>
  );
}

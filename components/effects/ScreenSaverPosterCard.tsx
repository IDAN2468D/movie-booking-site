'use client';

import { motion } from 'framer-motion';
import { ResilientImage } from '@/components/ui/ResilientImage';

interface ScreenSaverPosterCardProps {
  posterUrl: string;
  title: string;
}

export function ScreenSaverPosterCard({ posterUrl, title }: ScreenSaverPosterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: -20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="hidden lg:block relative w-56 h-80 rounded-2xl overflow-hidden border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.3)] transform-gpu hover:scale-105 transition-transform duration-500 shrink-0"
    >
      <ResilientImage
        src={posterUrl}
        alt={`כרזה רשמית: ${title}`}
        fallbackTitle={title}
        fill
        className="object-cover"
        sizes="224px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-3 right-3 left-3 text-right">
        <span className="text-[10px] uppercase font-bold tracking-widest text-red-500 bg-black/60 px-2 py-0.5 rounded border border-red-500/30">
          כרזה רשמית
        </span>
      </div>
    </motion.div>
  );
}

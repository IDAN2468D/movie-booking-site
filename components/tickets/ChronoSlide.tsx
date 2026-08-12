'use client';

import React from 'react';
import { motion, MotionValue, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { MemoryCapsuleItem } from '@/lib/validations/memoryCapsule';
import { playMemoryRecallSound } from '@/lib/audio/acousticMemory';

interface ChronoSlideProps {
  item: MemoryCapsuleItem;
  index: number;
  scrollYProgress: MotionValue<number>;
  onRecall: (item: MemoryCapsuleItem) => void;
}

export function ChronoSlide({ item, index, scrollYProgress, onRecall }: ChronoSlideProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleRecallClick = () => {
    playMemoryRecallSound();
    onRecall(item);
  };

  const step = 0.2;
  const startRange = Math.max(0, (index - 1) * step);
  const peakRange = index * step;
  const endRange = Math.min(1, (index + 1) * step);

  const opacity = useTransform(scrollYProgress, [startRange, peakRange, endRange], [0.35, 1, 0.35]);
  const scale = useTransform(scrollYProgress, [startRange, peakRange, endRange], [0.92, 1, 0.92]);
  const blur = useTransform(scrollYProgress, [startRange, peakRange, endRange], [8, 0, 8]);
  const filter = useTransform(blur, (v) => `blur(${v}px) saturate(${110 - v * 4}%)`);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative w-full min-h-[220px] bg-neutral-950/80 border border-white/15 rounded-3xl p-6 md:p-7 flex flex-col justify-between transform-gpu will-change-transform shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-2xl overflow-hidden"
      style={{ opacity, scale, filter, rotateX, rotateY, transformStyle: 'preserve-3d' }}
    >
      {/* Background Poster Vignette */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none mix-blend-screen scale-105"
        style={{ backgroundImage: `url(${item.posterUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40 pointer-events-none" />

      {/* Card Header */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-outfit text-2xl md:text-3xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] tracking-wide">
              {item.movieTitle}
            </h3>
            {item.reflection?.rating && (
              <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-lg text-amber-300 text-xs font-black">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{item.reflection.rating}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-cyan-200/60 font-inter mt-1">
            {item.hall} • <span className="font-mono text-cyan-300 font-bold">{item.seats.join(', ')}</span>
          </p>
        </div>

        <span className="font-mono text-xs font-bold text-white/80 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 tracking-wider shadow-inner shrink-0">
          {item.date}
        </span>
      </div>

      {/* Quote Snippet */}
      <p className="relative z-10 text-xs md:text-sm text-cyan-100/90 italic font-serif my-3 bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-sm line-clamp-2">
        "{item.iconicQuote}"
      </p>

      {/* Metadata & Recall Button */}
      <div className="relative z-10 space-y-3 border-t border-dashed border-white/15 pt-3">
        <div className="flex justify-between font-inter text-xs text-neutral-400 tracking-wider">
          <span className="font-bold">ORDER ID: <span className="text-white/80 font-mono">{item.id}</span></span>
          <span className="font-bold">TEMPORAL DECAY: <span className="text-cyan-400 font-mono">{Math.round(item.decayLevel * 100)}%</span></span>
        </div>

        <button 
          onClick={handleRecallClick}
          className="group relative w-full py-3.5 bg-gradient-to-r from-primary via-rose-500 to-amber-500 hover:brightness-110 border border-white/20 rounded-2xl overflow-hidden transition-all active:scale-[0.98] shadow-[0_0_25px_rgba(255,159,10,0.4)] flex items-center justify-center gap-2"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <Sparkles className="w-4 h-4 text-black animate-pulse relative z-10" />
          <span className="relative z-10 text-black text-xs md:text-sm font-black uppercase tracking-[0.25em] drop-shadow-sm">
            שחזר זיכרון
          </span>
        </button>
      </div>

      {/* Filmstrip holes indicator on left & right */}
      <div className="absolute -left-2 top-0 bottom-0 flex flex-col justify-evenly pointer-events-none z-10">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="w-1.5 h-3.5 rounded-sm bg-neutral-950 border border-white/20 shadow-inner" />
        ))}
      </div>
      <div className="absolute -right-2 top-0 bottom-0 flex flex-col justify-evenly pointer-events-none z-10">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="w-1.5 h-3.5 rounded-sm bg-neutral-950 border border-white/20 shadow-inner" />
        ))}
      </div>
    </motion.div>
  );
}

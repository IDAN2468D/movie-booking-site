'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Sparkles, Star, Heart } from 'lucide-react';
import { MemoryCapsuleItem } from '@/lib/validations/memoryCapsule';
import { playMemoryRecallSound } from '@/lib/audio/acousticMemory';

interface MemoryShardCardProps {
  item: MemoryCapsuleItem;
  viewMode: 'reel' | 'grid';
  onSelect: (item: MemoryCapsuleItem) => void;
}

const RARITY_LABELS: Record<string, { label: string; color: string; border: string }> = {
  mythic: { label: 'מיתי', color: 'text-amber-300 bg-amber-500/20', border: 'border-amber-500/40' },
  legendary: { label: 'אגדי', color: 'text-purple-300 bg-purple-500/20', border: 'border-purple-500/40' },
  rare: { label: 'נדיר', color: 'text-cyan-300 bg-cyan-500/20', border: 'border-cyan-500/40' },
  common: { label: 'נפוץ', color: 'text-slate-300 bg-slate-500/20', border: 'border-slate-500/40' },
};

export const MemoryShardCard: React.FC<MemoryShardCardProps> = ({ item, viewMode, onSelect }) => {
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

  const handleCardClick = () => {
    playMemoryRecallSound();
    onSelect(item);
  };

  const rarity = RARITY_LABELS[item.rarityTier] || RARITY_LABELS.rare;

  if (viewMode === 'grid') {
    return (
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        onClick={handleCardClick}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.025 }}
        className="group relative cursor-pointer rounded-3xl border border-white/15 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-2xl transition-all hover:border-primary/50 text-right overflow-hidden flex flex-col justify-between"
      >
        <div className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden mb-4 border border-white/12 shadow-lg">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${item.posterUrl})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-black uppercase border ${rarity.color} ${rarity.border} backdrop-blur-md`}>
            {rarity.label}
          </span>
          {item.reflection?.rating && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/30">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs font-black text-amber-300 font-mono">{item.reflection.rating}</span>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-xl font-black font-outfit text-white group-hover:text-primary transition-colors line-clamp-1">{item.movieTitle}</h4>
          <p className="text-xs text-white/60 font-inter mt-1">{item.date} • {item.hall}</p>
          <p className="text-sm text-cyan-100/90 italic line-clamp-3 mt-3 font-serif bg-white/5 p-3.5 rounded-xl border border-white/5 leading-relaxed">
            "{item.iconicQuote}"
          </p>
        </div>

        <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
          <span className="flex items-center gap-1.5 text-primary font-black text-sm">
            <Sparkles className="w-4 h-4" /> שחזר זיכרון
          </span>
          {item.reflection?.personalNote && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-emerald-400" /> רשמים נשמרו
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  // Reel Mode
  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={handleCardClick}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.015 }}
      className="group relative w-full cursor-pointer rounded-3xl border border-white/15 bg-white/[0.04] p-6 md:p-8 shadow-2xl backdrop-blur-2xl hover:border-primary/50 transition-all flex flex-col md:flex-row items-center gap-6 md:gap-8 overflow-hidden"
    >
      <div className="relative w-full md:w-48 aspect-[3/4] rounded-2xl overflow-hidden shrink-0 border border-white/12 shadow-xl">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${item.posterUrl})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        <span className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md text-xs font-black border ${rarity.color} ${rarity.border} backdrop-blur-md`}>
          {rarity.label}
        </span>
      </div>

      <div className="flex-1 w-full text-right flex flex-col justify-between h-full space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl md:text-3xl font-black font-outfit text-white group-hover:text-primary transition-colors">{item.movieTitle}</h3>
            <div className="flex flex-wrap items-center gap-2.5 text-xs md:text-sm text-white/60 mt-1.5">
              <span>{item.date}</span>
              <span>•</span>
              <span>{item.hall}</span>
              <span>•</span>
              <span className="text-cyan-300 font-mono font-bold">{item.seats.join(', ')}</span>
            </div>
          </div>
          {item.reflection?.rating && (
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-black text-amber-300">{item.reflection.rating}/5</span>
            </div>
          )}
        </div>

        <p className="text-sm md:text-base text-cyan-100/90 italic font-serif bg-black/50 border border-white/10 p-4 rounded-2xl leading-relaxed shadow-inner">
          "{item.iconicQuote}"
        </p>

        <div className="flex items-center justify-between text-xs md:text-sm pt-2 border-t border-white/10">
          <span className="text-white/40 font-mono text-xs">HMAC: {item.hmacSignature.slice(0, 16)}...</span>
          <button className="flex items-center gap-2 text-sm font-black text-primary px-5 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/40 transition-all shadow-[0_0_15px_rgba(255,159,10,0.2)]">
            <Sparkles className="w-4 h-4 animate-pulse" /> שחזר קפסולה
          </button>
        </div>
      </div>
    </motion.div>
  );
};

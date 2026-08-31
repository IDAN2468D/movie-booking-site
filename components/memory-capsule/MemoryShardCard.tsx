'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MemoryShard, ShardRarity } from '@/lib/schemas/memoryCapsule.schema';
import { Sparkles, Disc, Calendar, Armchair, Shield, Play, Pause } from 'lucide-react';

interface MemoryShardCardProps {
  shard: MemoryShard;
}

const RARITY_THEMES: Record<
  ShardRarity,
  { label: string; border: string; glow: string; text: string; bg: string }
> = {
  MYTHIC: {
    label: 'מיתולוגי (Mythic)',
    border: 'border-red-500/50',
    glow: 'from-red-600/30 via-purple-600/30 to-amber-500/30',
    text: 'text-red-400',
    bg: 'bg-red-500/10',
  },
  EPIC: {
    label: 'אפי (Epic)',
    border: 'border-purple-500/50',
    glow: 'from-purple-600/30 via-pink-600/30 to-cyan-500/30',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  RARE: {
    label: 'נדיר (Rare)',
    border: 'border-cyan-500/50',
    glow: 'from-cyan-500/30 via-blue-500/30 to-teal-400/30',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  COMMON: {
    label: 'קלאסי (Common)',
    border: 'border-white/20',
    glow: 'from-white/10 to-white/5',
    text: 'text-off-white/70',
    bg: 'bg-white/5',
  },
};

export function MemoryShardCard({ shard }: MemoryShardCardProps) {
  const [isPlayingEcho, setIsPlayingEcho] = useState(false);
  const theme = RARITY_THEMES[shard.rarity] || RARITY_THEMES.COMMON;

  const toggleEcho = () => {
    if (typeof window === 'undefined') return;
    try {
      if (isPlayingEcho) {
        setIsPlayingEcho(false);
        return;
      }
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(shard.acousticEchoFrequency || 432, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
      setIsPlayingEcho(true);
      setTimeout(() => setIsPlayingEcho(false), 1500);
    } catch {
      setIsPlayingEcho(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className={`relative p-6 rounded-[32px] bg-black/60 backdrop-blur-3xl border ${theme.border} shadow-2xl overflow-hidden group flex flex-col justify-between space-y-6 text-right`}
      dir="rtl"
    >
      {/* Holographic Glow Accent */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${theme.glow} opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none`}
      />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-[11px] font-black border ${theme.bg} ${theme.border} ${theme.text}`}>
          {theme.label}
        </span>
        <span className="text-xs font-mono font-bold text-amber-400">שווי שוק: ₪{shard.marketValueIls}</span>
      </div>

      {/* Movie Info */}
      <div className="relative z-10 space-y-2">
        <h3 className="text-xl font-black text-white font-rubik tracking-tight">{shard.movieTitle}</h3>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-off-white/60">
          <span className="flex items-center gap-1"><Calendar size={12} /> {shard.screeningDate}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Armchair size={12} /> {shard.seatLabel}</span>
        </div>
      </div>

      {/* Quote */}
      <div className="relative z-10 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
        <p className="text-xs text-white/90 italic leading-relaxed">&ldquo;{shard.quoteText}&rdquo;</p>
        <span className="text-[10px] text-off-white/50 block text-left">— {shard.quoteAuthor}</span>
      </div>

      {/* Footer & Audio Echo */}
      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-xs">
        <span className="text-[11px] font-mono text-off-white/40">
          מהדורה #{shard.editionNumber} / {shard.totalMinted}
        </span>

        <button
          onClick={toggleEcho}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
        >
          {isPlayingEcho ? <Pause size={14} className="text-cyan-400" /> : <Play size={14} />}
          <span>{isPlayingEcho ? 'מהדהד...' : 'הד אקוסטי'}</span>
        </button>
      </div>
    </motion.div>
  );
}

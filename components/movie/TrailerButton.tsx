'use client';

import React, { useState } from 'react';
import { Play, Loader2, Sparkles, Film } from 'lucide-react';
import { motion } from 'framer-motion';
import { VideoResult } from '@/lib/tmdb';
import { useTrailerStore } from '@/lib/store/trailer-store';

interface Props {
  movieId: number;
  movieTitle: string;
  variant?: 'default' | 'hero';
}

export default function TrailerButton({ movieId, movieTitle, variant = 'default' }: Props) {
  const [loading, setLoading] = useState(false);
  const openTrailer = useTrailerStore((state) => state.openTrailer);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/movie-videos/${movieId}`);
      const data: VideoResult[] = await res.json();
      if (data && data.length > 0) {
        const trailer = data.find((v) => v.type === 'Trailer' || v.type === 'Teaser') || data[0];
        openTrailer({
          movieId: String(movieId),
          movieTitle,
          trailerKey: trailer.key,
          videoList: data.map((v) => ({ id: v.id, key: v.key, name: v.name, type: v.type })),
        });
      }
    } catch (err) {
      console.error('Failed to load trailers', err);
    } finally {
      setLoading(false);
    }
  };

  const isHero = variant === 'hero';

  return (
    <motion.button
      whileHover={{ scale: 1.03, translateY: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      disabled={loading}
      aria-label={`צפה בטריילר הרשמי של הסרט ${movieTitle}`}
      title={`צפה בטריילר של ${movieTitle}`}
      className={
        isHero
          ? 'group relative overflow-hidden px-5 md:px-8 py-3.5 md:py-5 rounded-2xl md:rounded-[2rem] font-black flex items-center justify-center gap-3 text-white bg-gradient-to-r from-cyan-500/15 via-purple-600/15 to-pink-500/15 hover:from-cyan-500/25 hover:to-pink-500/25 backdrop-blur-2xl border border-white/20 hover:border-cyan-400/60 shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300'
          : 'group relative overflow-hidden px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 text-white bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-xl border border-white/15 hover:border-cyan-400/50 shadow-lg transition-all duration-300 text-xs'
      }
    >
      {/* Chromatic Shimmer Reflection */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" style={{ backgroundSize: '200% 100%' }} />

      {/* Ambient Neon Backlight Glow */}
      <div className="absolute -inset-1 rounded-[inherit] bg-gradient-to-r from-cyan-500/0 via-cyan-400/20 to-purple-500/0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 pointer-events-none" />

      {loading ? (
        <div className="relative z-10 flex items-center gap-2">
          <Loader2 size={18} className="animate-spin text-cyan-400" />
          <span className="text-white/80 font-bold text-xs md:text-sm">טוען טריילר...</span>
        </div>
      ) : (
        <div className="relative z-10 flex items-center gap-2.5 md:gap-3">
          {/* Pulsing Play Orb */}
          <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-xl md:rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform">
            <Play size={13} className="fill-white text-white ml-0.5" />
          </div>

          <div className="flex flex-col items-start text-right min-w-0">
            <div className="flex items-center gap-1.5 leading-none mb-0.5">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-cyan-300 font-rubik flex items-center gap-1">
                <Film size={11} className="text-cyan-400" />
                איכות קולנועית
              </span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-200 text-[9px] font-bold border border-cyan-400/30">4K HDR</span>
            </div>
            <span className="text-sm md:text-base font-black font-rubik text-white drop-shadow block tracking-tight whitespace-nowrap">
              צפה בטריילר הרשמי
            </span>
          </div>

          <Sparkles size={14} className="text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:rotate-12 transition-all shrink-0 hidden sm:inline" />
        </div>
      )}
    </motion.button>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

import type { Variants } from 'framer-motion';

export interface MovieEntranceData {
  id: string | number;
  title: string;
  backdropUrl: string;
  posterUrl: string;
  rating: number;
  genres: string[];
  overview: string;
  tagline?: string;
}

export interface MovieEntranceAnimationProps {
  movie: MovieEntranceData;
  onBookClick?: () => void;
  children?: React.ReactNode;
  backButtonHref?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function MovieEntranceAnimation({
  movie,
  onBookClick,
  children,
  backButtonHref = '/',
}: MovieEntranceAnimationProps) {
  const [backdropSrc, setBackdropSrc] = React.useState(movie.backdropUrl || '/posters/default.svg');
  const [posterSrc, setPosterSrc] = React.useState(movie.posterUrl || '/posters/default.svg');

  React.useEffect(() => {
    setBackdropSrc(movie.backdropUrl || '/posters/default.svg');
    setPosterSrc(movie.posterUrl || '/posters/default.svg');
  }, [movie.backdropUrl, movie.posterUrl]);

  return (
    <div className="relative min-h-[650px] md:min-h-[600px] w-full overflow-hidden bg-black text-white" dir="rtl">
      {/* 1. Backdrop Background Animation */}
      <motion.div
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.55 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Image
          src={backdropSrc}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          onError={() => setBackdropSrc('/posters/default.svg')}
          className="object-cover object-center filter brightness-75 saturate-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/40 to-transparent hidden md:block" />
        <div className="absolute inset-0 bg-black/40 opacity-50 md:hidden" />
      </motion.div>

      {/* Holographic Scanner Line (Liquid Glass Effect) */}
      <motion.div
        animate={{ y: ['0%', '1000%', '0%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent shadow-[0_0_25px_rgba(255,159,10,0.3)] z-20 pointer-events-none"
      />

      {/* Back Button */}
      <Link
        href={backButtonHref}
        className="absolute top-6 right-6 md:top-8 md:right-8 z-30 flex items-center justify-center w-10 h-10 md:w-auto md:px-6 md:py-3 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-3xl border border-white/20 text-white text-sm font-black hover:bg-white/20 transition-all shadow-2xl active:scale-95"
      >
        <ArrowRight size={20} className="md:ml-2" />
        <span className="hidden md:inline uppercase tracking-widest text-[11px]">חזור למסך הבית</span>
      </Link>

      {/* 2. Staggered Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-6 pt-24 pb-12 min-h-[600px] flex flex-col md:flex-row items-center md:items-end justify-center md:justify-start gap-8 md:gap-12"
      >
        {/* Movie Poster - Smooth GPU Transition */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-44 h-64 md:w-72 md:h-[420px] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-cyan-500/10 border-2 border-white/20 shrink-0 group/poster [transform:translateZ(0)]"
        >
          <Image
            src={posterSrc}
            alt={movie.title}
            fill
            priority
            sizes="(max-width: 768px) 176px, 288px"
            onError={() => setPosterSrc('/posters/default.svg')}
            className="object-cover saturate-[1.15] transition-transform duration-700 group-hover/poster:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity" />
        </motion.div>

        {/* Details & Metadata */}
        <div className="flex flex-col gap-3 text-center md:text-right max-w-2xl">
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {movie.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium backdrop-blur-md"
              >
                {genre}
              </span>
            ))}
            <span className="px-3 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold backdrop-blur-md flex items-center gap-1">
              <Star size={12} className="fill-current text-amber-400" />
              {movie.rating.toFixed(1)}
            </span>
          </motion.div>

          {movie.tagline && (
            <motion.p variants={itemVariants} className="text-cyan-400 text-xs md:text-sm font-black tracking-widest uppercase">
              &quot;{movie.tagline}&quot;
            </motion.p>
          )}

          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 font-display"
          >
            {movie.title}
          </motion.h1>

          <motion.p variants={itemVariants} className="text-slate-300 text-sm md:text-base leading-relaxed line-clamp-3">
            {movie.overview}
          </motion.p>

          {children ? (
            <motion.div variants={itemVariants} className="pt-2">
              {children}
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="pt-4 flex items-center justify-center md:justify-start gap-4">
              <button
                onClick={onBookClick}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                הזמן כרטיסים עכשיו
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie, getImageUrl } from '@/lib/tmdb';
import { Play, Star, Info, Heart, Headphones, Ticket } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import TrailerButton from '@/components/movie/TrailerButton';
import { motion } from 'framer-motion';
import { MarkerHighlight } from '@/components/fx/MarkerHighlight';
import { KineticText } from '@/components/effects/KineticText';

interface FeaturedHeroProps {
  movie: Movie;
}

export default function FeaturedHero({ movie }: FeaturedHeroProps) {
  const { setSelectedMovie, favorites, toggleFavorite } = useBookingStore();
  if (!movie) return null;

  const isFavorite = favorites.some(m => m.id === movie.id);

  return (
    <section className="relative w-full min-h-[600px] md:h-[650px] rounded-[2.5rem] overflow-hidden group mx-auto max-w-[95%] mt-4 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] [transform:translateZ(0)]">
      {/* Background Image */}
      <Image
        src={getImageUrl(movie.backdrop_path, 'original')}
        alt={movie.displayTitle}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1400px"
        className="object-cover transition-transform duration-1000 group-hover:scale-105 saturate-[1.1]"
        priority
      />
      
      {/* Dynamic Gradients for premium depth - Lightened to ensure visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A0A]/80 via-transparent to-transparent hidden md:block z-10" />
      <div className="absolute inset-0 bg-black/30 opacity-40 md:hidden z-10" />

      {/* Holographic Scanner Line (Liquid Glass 2.0) */}
      <motion.div 
        animate={{ y: ['0%', '1000%', '0%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent shadow-[0_0_20px_rgba(255,159,10,0.4)] z-20"
      />
      
      {/* Liquid Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-cyan-500/5 opacity-30 z-20 pointer-events-none" />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col md:flex-row items-center md:items-end justify-center md:justify-between p-8 md:p-16 z-30 gap-12 text-center md:text-right">
        {/* Left/Main Side (Text & Actions) */}
        <div className="flex-1 w-full flex flex-col items-center md:items-end">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="bg-primary text-black text-[10px] font-black px-3 py-1.5 rounded-xl tracking-[0.2em] uppercase shadow-lg shadow-primary/20 font-display">
              <MarkerHighlight delay={1.2} color="#000000" strokeWidth={2}>PREMIUM AI CHOICE</MarkerHighlight>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-xl px-3 py-1.5 rounded-xl text-white text-[10px] md:text-xs border border-white/10 shadow-2xl">
              <Star className="w-3.5 h-3.5 text-primary fill-primary" />
              <span className="font-black text-white/90">דירוג {movie.vote_average.toFixed(1)}</span>
            </div>
            {movie.release_date && (
              <div className="bg-white/5 backdrop-blur-xl px-3 py-1.5 rounded-xl text-white/70 text-[10px] md:text-xs border border-white/10 font-black">
                {movie.release_date.split('-')[0]}
              </div>
            )}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.85] text-glow font-display uppercase"
          >
            {movie.title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-white/80 text-base md:text-xl mb-10 line-clamp-3 leading-relaxed-hebrew max-w-2xl font-medium drop-shadow-md"
          >
            {movie.overview}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 w-full md:w-auto"
          >
            {/* Primary Action */}
            <motion.button 
              whileHover={{ 
                scale: 1.05, 
                translateY: -4, 
                boxShadow: '0 30px 60px rgba(255,159,10,0.5), 0 0 20px rgba(255,159,10,0.3)' 
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMovie(movie)}
              className="flex-1 md:flex-none bg-primary text-black px-12 h-20 rounded-[2rem] font-black flex items-center justify-center gap-4 transition-all shadow-[0_20px_50px_rgba(255,159,10,0.4)] group/btn relative overflow-hidden border border-white/20"
            >
              {/* Premium Liquid Glass Effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-30 z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full group-hover/btn:animate-shimmer z-20" style={{ backgroundSize: '200% 100%' }} />
              
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 12, scale: 1.2 }}
                className="relative z-30"
              >
                <Ticket className="w-6 h-6 text-black" />
              </motion.div>

              <div className="relative z-30 flex flex-col items-start">
                <span className="text-sm font-black uppercase tracking-widest text-black font-rubik leading-none mb-1">חווית צפייה פרמיום</span>
                <div className="relative">
                  <MarkerHighlight color="rgba(0,0,0,0.08)" delay={0.2} strokeWidth={8}>
                    <span className="text-xl md:text-2xl font-black font-rubik text-black block tracking-tight">
                      הזמן 3 כרטיסים
                    </span>
                  </MarkerHighlight>
                </div>
              </div>

              {/* Holographic Glow */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/20 rounded-full blur-2xl group-hover/btn:scale-150 transition-transform duration-700" />
            </motion.button>

            <div className="flex items-center gap-3">
              <TrailerButton movieId={movie.id} movieTitle={movie.displayTitle} variant="hero" />
              
              <Link 
                href={`/movie/${movie.id}`}
                className="w-14 h-14 md:w-16 md:h-16 bg-white/10 hover:bg-white/20 backdrop-blur-3xl rounded-2xl flex items-center justify-center transition-all border border-white/20 shadow-2xl shrink-0 group"
              >
                <Info className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </Link>

              <motion.button
                whileHover={{ scale: 1.1, translateY: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleFavorite(movie)}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-2xl relative overflow-hidden group ${
                  isFavorite 
                  ? 'bg-primary border-primary text-black' 
                  : 'bg-white/10 backdrop-blur-3xl border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <Heart size={22} className={`${isFavorite ? 'fill-current' : ''} relative z-10 transition-transform duration-300 group-hover:scale-110`} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Right Side (Poster) - Only on Desktop for premium layout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.4, type: 'spring' }}
          className="hidden lg:block w-72 h-[420px] rounded-[3rem] overflow-hidden border border-white/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.1)] relative group/poster"
        >
          <Image
            src={getImageUrl(movie.poster_path, 'w500')}
            alt={movie.displayTitle}
            fill
            sizes="288px"
            className="object-cover transition-transform duration-1000 group-hover/poster:scale-110 saturate-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity duration-500" />
        </motion.div>
      </div>

      {/* Holographic Refraction Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[60px] pointer-events-none mix-blend-screen opacity-50" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none mix-blend-screen opacity-50" />
    </section>
  );
}

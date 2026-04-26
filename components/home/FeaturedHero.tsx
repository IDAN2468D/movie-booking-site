'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie, getImageUrl } from '@/lib/tmdb';
import { Play, Star, Info, Heart, Headphones, Ticket } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import TrailerButton from '@/components/movie/TrailerButton';
import { motion } from 'framer-motion';

interface FeaturedHeroProps {
  movie: Movie;
}

export default function FeaturedHero({ movie }: FeaturedHeroProps) {
  const { setSelectedMovie, favorites, toggleFavorite } = useBookingStore();
  if (!movie) return null;

  const isFavorite = favorites.some(m => m.id === movie.id);

  return (
    <section className="relative w-full h-[600px] md:h-[550px] rounded-[56px] overflow-hidden group mx-auto max-w-[95%] mt-4 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)]">
      {/* Background Image */}
      <Image
        src={getImageUrl(movie.backdrop_path, 'original')}
        alt={movie.displayTitle}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1400px"
        className="object-cover transition-transform duration-1000 group-hover:scale-105"
        priority
      />
      
      {/* Dynamic Gradients for premium depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent md:bg-gradient-to-l md:from-black md:via-black/40 md:to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-60 z-10" />

      {/* Holographic Scanner Line (YUV-DESIGN Pink) */}
      <motion.div 
        animate={{ y: ['0%', '1000%', '0%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_rgba(255,20,100,0.8)] z-20"
      />
      
      {/* Liquid Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-yellow/10 opacity-40 z-20 pointer-events-none" />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end items-start p-8 md:p-16 max-w-full text-right z-30">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex items-center gap-2 md:gap-3 mb-4"
        >
          <div className="bg-primary text-off-white text-[9px] md:text-[10px] font-display px-3 py-1.5 rounded-full tracking-widest uppercase shadow-[0_4px_12px_rgba(255,20,100,0.3)]">חדש בקולנוע</div>
          <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-[40px] px-3 py-1.5 rounded-full text-off-white text-[10px] md:text-xs border-[0.5px] border-white/20 shadow-xl font-display uppercase tracking-wider">
            <Star className="w-3 h-3 text-yellow fill-yellow" />
            <span className="">דירוג {movie.vote_average.toFixed(1)}</span>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-8xl font-display text-off-white mb-4 tracking-tighter leading-[0.9] max-w-3xl drop-shadow-2xl uppercase"
        >
          {movie.displayTitle}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-off-white/70 text-sm md:text-lg mb-8 line-clamp-3 leading-relaxed max-w-lg font-medium opacity-80"
        >
          {movie.overview}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4 w-full md:w-auto"
        >
          {/* Secondary Actions: Vertical Pills */}
          <div className="flex items-center gap-2 h-14 md:h-16">
            <motion.button
              whileHover={{ scale: 1.1, translateY: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleFavorite(movie)}
              className={`w-10 md:w-12 h-full rounded-full flex items-center justify-center border transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden group ${
                isFavorite 
                ? 'bg-primary border-primary text-off-white shadow-[0_0_20px_rgba(255,20,100,0.4)]' 
                : 'bg-white/5 backdrop-blur-3xl saturate-[200%] border-white/10 text-off-white hover:bg-white/10'
              }`}
            >
              <Heart size={20} className={`${isFavorite ? 'fill-current' : ''} relative z-10 transition-transform duration-300 group-hover:scale-110`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, translateY: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 md:w-12 h-full rounded-full flex items-center justify-center border bg-white/5 backdrop-blur-3xl saturate-[200%] border-white/10 text-off-white hover:bg-white/10 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden group"
            >
              <Headphones size={20} className="relative z-10 transition-transform duration-300 group-hover:scale-110" />
            </motion.button>
          </div>

          <div className="flex-1 md:flex-none">
            <TrailerButton movieId={movie.id} movieTitle={movie.displayTitle} variant="hero" />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, translateY: -2, boxShadow: '0 20px 40px rgba(255,20,100,0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedMovie(movie)}
            className="flex-1 md:flex-none bg-primary text-off-white px-8 h-14 md:h-16 rounded-full font-display flex items-center justify-center gap-3 transition-all shadow-[0_15px_40px_rgba(255,20,100,0.4)] group/btn relative overflow-hidden border border-white/10"
          >
            <Ticket className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
            <span className="relative z-10 text-sm md:text-lg uppercase tracking-widest">הזמן עכשיו</span>
          </motion.button>
          
          <Link 
            href={`/movie/${movie.id}`}
            className="w-14 h-14 md:w-16 md:h-16 bg-white/5 hover:bg-white/10 backdrop-blur-3xl rounded-full flex items-center justify-center transition-all border border-white/10 shadow-2xl shrink-0 group"
          >
            <Info className="w-6 h-6 text-off-white group-hover:scale-110 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Holographic Refraction Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen opacity-30" />
    </section>
  );
}

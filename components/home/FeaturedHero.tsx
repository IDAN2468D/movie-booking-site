'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie, getImageUrl } from '@/lib/tmdb';
import { Play, Star, Info } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import TrailerButton from '@/components/movie/TrailerButton';

interface FeaturedHeroProps {
  movie?: Movie;
}

import { motion } from 'framer-motion';

export default function FeaturedHero({ movie }: FeaturedHeroProps) {
  const { setSelectedMovie } = useBookingStore();
  if (!movie) return null;

  return (
    <section className="relative w-full h-[500px] rounded-[2rem] overflow-hidden group mx-auto max-w-[95%] mt-4">
      {/* Background Image */}
      <Image
        src={getImageUrl(movie.backdrop_path, 'original')}
        alt={movie.displayTitle}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1400px"
        className="object-cover transition-transform duration-1000 group-hover:scale-105"
        priority
      />
      
      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-l from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end items-start p-6 md:p-12 max-w-full text-right">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4"
        >
          <div className="bg-[#FF9F0A] text-white text-[9px] md:text-[10px] font-black px-2 py-1 rounded tracking-widest uppercase">חדש בקולנוע</div>
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-[40px] px-2 py-1 rounded text-white text-[10px] md:text-xs border-[0.5px] border-white/20">
            <Star className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#FF9F0A] fill-[#FF9F0A]" />
            דירוג {movie.vote_average.toFixed(1)}
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 md:mb-4 tracking-tight leading-tight max-w-2xl text-glow"
        >
          {movie.title}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-slate-300 text-xs md:text-sm mb-6 md:mb-8 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-lg font-medium"
        >
          {movie.overview}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center gap-3 md:gap-4 flex-wrap"
        >
          <button 
            onClick={() => setSelectedMovie(movie)}
            className="bg-[#FF9F0A] hover:bg-[#FF7A00] text-white px-5 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold flex items-center gap-2 md:gap-3 transition-all shadow-xl shadow-orange-500/20 active:scale-95 group/btn text-sm md:text-base"
          >
            <Play className="w-4 h-4 md:w-5 md:h-5 fill-white group-hover/btn:-translate-x-1 transition-transform rotate-180" />
            צפה עכשיו
          </button>
          
          <TrailerButton movieId={movie.id} movieTitle={movie.displayTitle} variant="hero" />

          <Link 
            href={`/movie/${movie.id}`}
            className="w-12 h-12 md:w-14 md:h-14 bg-white/5 hover:bg-white/10 backdrop-blur-[40px] rounded-xl md:rounded-2xl flex items-center justify-center transition-all border-[0.5px] border-white/20"
          >
            <Info className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </Link>
        </motion.div>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FF9F0A]/10 to-transparent pointer-events-none" />
    </section>
  );
}

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
        <section className="relative w-full h-[600px] md:h-[500px] rounded-[2.5rem] overflow-hidden group mx-auto max-w-[95%] mt-4 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)]">
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
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/40 to-transparent md:bg-gradient-to-l md:from-[#0F0F0F] md:via-[#0F0F0F]/40 md:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-60" />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end items-start p-8 md:p-16 max-w-full text-right">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex items-center gap-2 md:gap-3 mb-4"
        >
          <div className="bg-[#FF9F0A] text-white text-[9px] md:text-[10px] font-black px-2.5 py-1.5 rounded-lg tracking-widest uppercase shadow-[0_4px_12px_rgba(255,159,10,0.3)]">חדש בקולנוע</div>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-[40px] px-2.5 py-1.5 rounded-lg text-white text-[10px] md:text-xs border-[0.5px] border-white/20 shadow-xl">
            <Star className="w-3 h-3 text-[#FF9F0A] fill-[#FF9F0A]" />
            <span className="font-black">דירוג {movie.vote_average.toFixed(1)}</span>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-[0.9] max-w-2xl text-glow font-outfit"
        >
          {movie.title}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-slate-300 text-sm md:text-lg mb-8 line-clamp-3 leading-relaxed max-w-lg font-medium opacity-80"
        >
          {movie.overview}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center gap-4 w-full md:w-auto"
        >
          <button 
            onClick={() => setSelectedMovie(movie)}
            className="flex-1 md:flex-none bg-[#FF9F0A] hover:bg-[#FF7A00] text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-[0_15px_30px_rgba(255,159,10,0.3)] active:scale-95 group/btn text-sm md:text-base uppercase tracking-widest"
          >
            <Play className="w-5 h-5 fill-white group-hover/btn:-translate-x-1 transition-transform rotate-180" />
            צפה עכשיו
          </button>
          
          <div className="hidden sm:block">
            <TrailerButton movieId={movie.id} movieTitle={movie.displayTitle} variant="hero" />
          </div>

          <Link 
            href={`/movie/${movie.id}`}
            className="w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-[40px] rounded-2xl flex items-center justify-center transition-all border-[0.5px] border-white/20 shadow-2xl shrink-0"
          >
            <Info className="w-6 h-6 text-white" />
          </Link>
        </motion.div>
      </div>

      {/* Holographic Refraction Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen opacity-30" />
    </section>
  );
}

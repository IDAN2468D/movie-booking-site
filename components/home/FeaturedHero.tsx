'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie, getImageUrl } from '@/lib/tmdb';
import { Star, Info, Heart, Ticket } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import TrailerButton from '@/components/movie/TrailerButton';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { MarkerHighlight } from '@/components/fx/MarkerHighlight';
import LiveActivityPulse from '@/components/ui/LiveActivityPulse';

interface FeaturedHeroProps {
  movie: Movie;
}

export default function FeaturedHero({ movie }: FeaturedHeroProps) {
  const { setSelectedMovie, favorites, toggleFavorite } = useBookingStore();
  
  // Parallax Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (!movie) return null;

  const isFavorite = favorites.some(m => m.id === movie.id);

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[600px] md:h-[650px] rounded-[2.5rem] overflow-hidden group mx-auto max-w-[95%] mt-4 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] [transform:translateZ(0)] perspective-1000"
    >
      {/* Background Image */}
      <Image
        src={getImageUrl(movie.backdrop_path, 'original')}
        alt={movie.displayTitle}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1400px"
        className="object-cover transition-transform duration-1000 group-hover:scale-105 saturate-[1.1]"
        priority
      />
      
      {/* Dynamic Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A0A]/80 via-transparent to-transparent hidden md:block z-10" />
      
      {/* Liquid Holographic Scanner (Liquid Glass 3.0) */}
      <motion.div 
        animate={{ 
          y: ['-100%', '200%', '-100%'],
          opacity: [0, 0.3, 0] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-primary/10 to-transparent z-20 blur-2xl"
      />
      <motion.div 
        animate={{ y: ['0%', '1000%', '0%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent shadow-[0_0_20px_rgba(255,159,10,0.4)] z-20"
      />
      
      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col md:flex-row items-center md:items-end justify-center md:justify-between p-8 md:p-16 z-30 gap-12 text-center md:text-right">
        {/* Left/Main Side */}
        <motion.div 
          style={{ rotateX, rotateY }}
          className="flex-1 w-full flex flex-col items-center md:items-end preserve-3d"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-center md:justify-end gap-3 mb-6"
          >
            <LiveActivityPulse />
            <div className="bg-primary text-black text-[10px] font-black px-3 py-1.5 rounded-xl tracking-[0.2em] uppercase shadow-lg shadow-primary/20 font-display">
              <MarkerHighlight delay={1.2} color="#000000" strokeWidth={2}>LIQUID GLASS 3.0 CHOICE</MarkerHighlight>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-xl px-3 py-1.5 rounded-xl text-white text-[10px] md:text-xs border border-white/10 shadow-2xl">
              <Star className="w-3.5 h-3.5 text-primary fill-primary" />
              <span className="font-black text-white/90">דירוג {movie.vote_average.toFixed(1)}</span>
            </div>
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

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05, translateY: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMovie(movie)}
              className="flex-1 md:flex-none bg-primary text-black px-8 h-20 rounded-[1.5rem] font-black flex items-center justify-center gap-3 transition-all shadow-[0_20px_50px_rgba(255,159,10,0.4)] relative overflow-hidden border border-white/20"
            >
              <Ticket className="w-5 h-5 text-black" />
              <span className="text-lg md:text-xl font-black font-rubik">הזמן 3 כרטיסים</span>
            </motion.button>

            <div className="flex items-center gap-3">
              <TrailerButton movieId={movie.id} movieTitle={movie.displayTitle} variant="hero" />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleFavorite(movie)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                  isFavorite ? 'bg-primary border-primary text-black' : 'bg-white/10 border-white/20 text-white'
                }`}
              >
                <Heart size={22} className={isFavorite ? 'fill-current' : ''} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Right Side (Poster) with 3D Parallax */}
        <motion.div
          style={{ rotateX, rotateY, translateZ: 50 }}
          className="hidden lg:block w-72 h-[420px] rounded-[3rem] overflow-hidden border border-white/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative preserve-3d"
        >
          <Image
            src={getImageUrl(movie.poster_path, 'w500')}
            alt={movie.displayTitle}
            fill
            sizes="288px"
            className="object-cover saturate-[1.1]"
          />
        </motion.div>
      </div>

      {/* Holographic Refraction Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[60px] pointer-events-none opacity-50" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none opacity-50" />
    </section>
  );
}

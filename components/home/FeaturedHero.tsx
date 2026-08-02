'use client';

import React from 'react';
import Image from 'next/image';
import { Movie, getImageUrl } from '@/lib/tmdb';
import { Star, Heart, Ticket } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import TrailerButton from '@/components/movie/TrailerButton';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface FeaturedHeroProps {
  movie: Movie;
}

export default function FeaturedHero({ movie }: FeaturedHeroProps) {
  const { setSelectedMovie, favorites, toggleFavorite } = useBookingStore();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const bgX = useSpring(useTransform(mouseX, [-350, 350], [-10, 10]), { stiffness: 90, damping: 25 });
  const bgY = useSpring(useTransform(mouseY, [-350, 350], [-10, 10]), { stiffness: 90, damping: 25 });

  const textX = useSpring(useTransform(mouseX, [-350, 350], [-25, 25]), { stiffness: 100, damping: 30 });
  const textY = useSpring(useTransform(mouseY, [-350, 350], [-25, 25]), { stiffness: 100, damping: 30 });

  const posterX = useSpring(useTransform(mouseX, [-350, 350], [-45, 45]), { stiffness: 110, damping: 28 });
  const posterY = useSpring(useTransform(mouseY, [-350, 350], [-45, 45]), { stiffness: 110, damping: 28 });

  const rotateX = useSpring(useTransform(mouseY, [-350, 350], [12, -12]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-350, 350], [-12, 12]), { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (!movie) return null;
  const isFavorite = favorites.some((m) => m.id === movie.id);

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[620px] md:h-[670px] rounded-[2.5rem] overflow-hidden group mx-auto max-w-[1600px] mt-4 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] [transform:translateZ(0)] perspective-1000"
    >
      <motion.div
        style={{ x: bgX, y: bgY, scale: 1.06, willChange: 'transform' }}
        className="absolute inset-0 z-0 select-none pointer-events-none transform-gpu"
      >
        <Image
          src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
          alt={movie.displayTitle}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1400px"
          className="object-cover saturate-[1.1]"
          priority
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent z-10" />

      <div className="absolute inset-0 flex flex-col md:flex-row items-center md:items-end justify-center md:justify-between p-8 md:p-16 z-30 gap-12 text-center md:text-right">
        <motion.div
          style={{ x: textX, y: textY, rotateX, rotateY, willChange: 'transform' }}
          className="flex-1 w-full flex flex-col items-center md:items-end preserve-3d transform-gpu"
        >
          <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-xl px-3 py-1.5 rounded-xl text-white text-[10px] md:text-xs border border-white/10 shadow-2xl mb-4">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="font-black text-white/90">דירוג {movie.vote_average.toFixed(1)}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.85] text-glow font-display uppercase">
            {movie.title}
          </h1>

          <p className="text-white/85 text-base md:text-lg mb-8 line-clamp-3 leading-relaxed-hebrew max-w-2xl font-medium drop-shadow-md font-body">
            {movie.overview}
          </p>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.05, translateY: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMovie(movie)}
              className="flex-1 md:flex-none bg-primary text-white px-8 h-16 rounded-[1.5rem] font-black flex items-center justify-center gap-3 transition-all shadow-[0_20px_50px_rgba(255,20,100,0.4)] relative overflow-hidden border border-white/20 hover:brightness-110"
            >
              <Ticket className="w-5 h-5 text-white" />
              <span className="text-lg md:text-xl font-black font-display">הזמן כרטיסים</span>
            </motion.button>

            <div className="flex items-center gap-3">
              <TrailerButton movieId={movie.id} movieTitle={movie.displayTitle} variant="hero" />
              <motion.button
                whileHover={{ scale: 1.1, translateY: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleFavorite(movie)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                  isFavorite ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(255,20,100,0.4)]' : 'bg-white/10 border-white/20 text-white'
                }`}
              >
                <Heart size={22} className={isFavorite ? 'fill-current text-white' : ''} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ x: posterX, y: posterY, rotateX, rotateY, translateZ: 80, willChange: 'transform' }}
          className="hidden lg:block w-72 h-[420px] rounded-[3rem] overflow-hidden border border-white/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative preserve-3d transform-gpu"
        >
          <Image
            src={getImageUrl(movie.poster_path || movie.backdrop_path, 'w500')}
            alt={movie.displayTitle}
            fill
            sizes="288px"
            className="object-cover saturate-[1.1]"
          />
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion, useMotionValue, useTransform, PanInfo, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Movie {
  _id: string;
  id?: string;
  title: string;
  posterPath?: string;
  poster_path?: string;
  genreNames?: string[];
  overview?: string;
}

import { useAcousticDeck } from '../../hooks/useAcousticDeck';

export interface MovieCard3DProps {
  movie: Movie;
  onSwipe: (id: string, direction: 'left' | 'right') => void;
  isFront: boolean;
  index: number;
}

export default function MovieCard3D({ movie, onSwipe, isFront, index }: MovieCard3DProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();
  const { setCrossfade, resetCrossfade, triggerResonance } = useAcousticDeck();

  useEffect(() => {
    if (!isFront) return;
    const unsubscribe = x.on('change', (latestX) => {
      const intensity = Math.min(Math.abs(latestX) / 150, 1);
      if (intensity > 0.05) setCrossfade(intensity);
      else resetCrossfade();
    });
    return () => {
      unsubscribe();
      resetCrossfade();
    };
  }, [x, isFront, setCrossfade, resetCrossfade]);

  // Gesture deltas mapped to rotation and tilt
  const rotateX = useTransform(y, [-200, 200], [15, -15]);
  const rotateY = useTransform(x, [-200, 200], [-15, 15]);
  const rotateZ = useTransform(x, [-200, 200], [-5, 5]);

  // Multi-dimensional scale factors based on depth
  const scale = useTransform(x, [-200, 0, 200], [0.95, isFront ? 1 : 0.95 - index * 0.05, 0.95]);
  
  // Background gradient shift based on X drag (Emerald for right, Ruby for left)
  const glowOpacity = useTransform(x, [-150, 0, 150], [0.8, 0, 0.8]);
  const glowColor = useTransform(x, [-150, 0, 150], [
    'rgba(220, 38, 38, 0.5)', // Ruby Red
    'rgba(255, 255, 255, 0)',
    'rgba(16, 185, 129, 0.5)' // Emerald Green
  ]);

  const handleDragEnd = async (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 120;
    if (info.offset.x > threshold) {
      triggerResonance('like');
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe(movie._id || movie.id || '', 'right');
    } else if (info.offset.x < -threshold) {
      triggerResonance('pass');
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe(movie._id || movie.id || '', 'left');
    } else {
      resetCrossfade();
      controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  const poster = movie.posterPath || movie.poster_path;
  const imageUrl = poster ? (poster.startsWith('http') ? poster : `https://image.tmdb.org/t/p/w780${poster}`) : '/placeholder-poster.png';

  // AI Resonance Mock calculation based on Title Length for visual stability
  const affinity = Math.min(98, 75 + (movie.title.length % 20));

  return (
    <motion.div
      className="absolute w-full h-full max-w-[340px] max-h-[500px] flex justify-center items-center rounded-3xl"
      style={{
        x,
        y,
        rotateX,
        rotateY,
        rotateZ,
        scale,
        zIndex: 100 - index,
        // Hardware acceleration
        transformOrigin: 'center center',
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={false}
      // Zero-Reflow optimization
      whileTap={{ cursor: 'grabbing' }}
    >
      <div 
        className="relative w-full h-full rounded-3xl overflow-hidden cursor-grab transform-gpu will-change-transform backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40 border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_inset_0_-1px_1px_rgba(0,0,0,0.4)]"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15)',
        }}
      >
        <Image 
          src={imageUrl}
          alt={movie.title || 'Movie Poster'}
          fill
          className="object-cover pointer-events-none"
          priority={isFront}
        />

        {/* Predictive AI Resonance Overlay (Vector Graph) */}
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-xl p-2 border border-white/10 flex flex-col items-center gap-1 z-10 pointer-events-none">
          <span className="text-[10px] text-white/70 font-['Inter'] font-semibold tracking-wider uppercase">AI Affinity</span>
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400"
                strokeDasharray={`${affinity}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-white font-['Outfit']">{affinity}%</span>
          </div>
        </div>

        {/* Dynamic Glow Overlay for Swipe Indicator */}
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            backgroundColor: glowColor,
            opacity: glowOpacity,
          }}
        />

        {/* Liquid Glass 4.0 Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <h2 className="text-2xl font-bold text-white font-['Outfit'] drop-shadow-md">
            {movie.title}
          </h2>
          {movie.genreNames && movie.genreNames.length > 0 && (
            <p className="text-sm text-white/80 font-['Inter'] mt-1 truncate">
              {movie.genreNames.join(' • ')}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

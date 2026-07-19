'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie, getImageUrl } from '@/lib/tmdb';
import { X, Sparkles, BrainCircuit } from 'lucide-react';
import NextImage from 'next/image';
import { createPortal } from 'react-dom';

interface NeuralEmotionMatrixProps {
  isOpen: boolean;
  onClose: () => void;
  matchedMovies: Movie[];
  analysis: string;
  onSelectMovie: (movie: Movie) => void;
}

export default function NeuralEmotionMatrix({
  isOpen,
  onClose,
  matchedMovies,
  analysis,
  onSelectMovie
}: NeuralEmotionMatrixProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const overlayContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col bg-zinc-950/95 backdrop-blur-[60px] overflow-y-auto"
        >
          {/* Ambient Lighting Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background pointer-events-none min-h-screen" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 md:top-10 md:right-10 w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all z-50 shadow-2xl active:scale-95 group"
          >
            <X size={26} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Top Central Core (The "Brain") */}
          <div className="w-full pt-16 md:pt-24 pb-8 px-6 flex flex-col items-center z-40">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.1 }}
              className="flex flex-col items-center justify-center text-center max-w-4xl"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 border border-primary/30 shadow-[0_0_80px_rgba(var(--primary),0.4)] flex items-center justify-center mb-6 relative overflow-hidden backdrop-blur-md">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, ease: "linear", repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/20 to-transparent"
                />
                <BrainCircuit size={32} className="text-primary relative z-10" />
              </div>
              
              <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 md:p-8 shadow-2xl">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Sparkles size={24} className="text-primary" />
                  <h2 className="text-2xl md:text-5xl font-black text-white font-outfit tracking-tight">
                    זיהוי נוירולוגי הושלם
                  </h2>
                </div>
                <p className="text-sm md:text-xl text-slate-300 font-inter font-medium max-w-2xl mx-auto leading-relaxed">
                  {analysis}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Movie Orbs Grid (No overlap with text) */}
          <div className="flex-1 w-full flex items-start justify-center z-50 px-4 pb-32 pt-8">
            <div className="flex flex-wrap items-start justify-center gap-8 md:gap-16 max-w-7xl">
              {matchedMovies.map((movie, index) => {
                return (
                  <motion.div
                    key={movie.id}
                    initial={{ scale: 0, opacity: 0, y: 50 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1, 
                      y: 0,
                      // Infinite subtle floating animation relative to its flex position
                      translateY: [0, -10, 10, 0],
                      translateX: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      scale: { type: 'spring', damping: 15, stiffness: 80, delay: index * 0.15 + 0.3 },
                      opacity: { duration: 0.5, delay: index * 0.15 + 0.3 },
                      translateY: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' },
                      translateX: { duration: 5 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }
                    }}
                    whileHover={{ scale: 1.1, zIndex: 60 }}
                    whileTap={{ scale: 0.95 }}
                    drag
                    dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                    dragElastic={0.2}
                    onClick={() => {
                      onSelectMovie(movie);
                      onClose();
                    }}
                    className="relative flex flex-col items-center gap-4 cursor-pointer group"
                  >
                    {/* The Orb */}
                    <div className="w-36 h-36 md:w-52 md:h-52 rounded-full border-[3px] border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden relative group-hover:border-primary/60 group-hover:shadow-[0_0_60px_rgba(var(--primary),0.5)] transition-all duration-500 bg-zinc-900">
                      {movie.poster_path && (
                        <NextImage
                          src={getImageUrl(movie.poster_path)}
                          alt={movie.displayTitle || movie.title || ""}
                          fill
                          sizes="(max-width: 768px) 144px, 208px"
                          className="object-cover opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 saturate-[1.2]"
                        />
                      )}
                      {/* Holographic specular overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/10 group-hover:to-primary/20 transition-colors duration-500 pointer-events-none mix-blend-overlay" />
                      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(255,255,255,0.15)] pointer-events-none" />
                    </div>
                    
                    {/* The Label Pill */}
                    <div className="px-5 py-2 md:py-3 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl opacity-90 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-400 flex flex-col items-center">
                      <p className="text-white font-black text-sm md:text-base tracking-tight font-outfit text-center max-w-[140px] md:max-w-[200px] truncate">
                        {movie.displayTitle || movie.title || ""}
                      </p>
                      <p className="text-primary text-[10px] md:text-xs font-black text-center mt-1 tracking-widest">
                        ★ {movie.vote_average.toFixed(1)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(overlayContent, document.body);
}

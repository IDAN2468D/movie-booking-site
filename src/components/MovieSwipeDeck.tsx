"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useSwipeStore } from '@/hooks/useSwipeStore';

export interface Movie {
  _id: string;
  title: string;
  posterUrl: string;
  genre: string;
  duration: number;
}

interface MovieSwipeDeckProps {
  movies: Movie[];
  sessionId: string;
  userId: string;
}

// Theme tokens mapped to genre for Dynamic Theme Injector
const THEME_TOKENS: Record<string, string> = {
  'Sci-Fi': 'from-purple-900/40 to-black/90',
  'Cyberpunk': 'from-purple-900/40 to-black/90',
  'Horror': 'from-red-950/40 to-black/95',
  'Thriller': 'from-red-950/40 to-black/95',
  'Comedy': 'from-amber-900/30 to-slate-950/90',
  'Drama': 'from-amber-900/30 to-slate-950/90',
};

export default function MovieSwipeDeck({ movies, sessionId, userId }: MovieSwipeDeckProps) {
  const [deck, setDeck] = useState<Movie[]>(movies);
  const [exitX, setExitX] = useState<number>(0);
  const addSwipe = useSwipeStore(state => state.addSwipe);

  // Dynamic Theme State (reads top card metadata)
  const activeMovie = deck[0];
  const activeTheme = activeMovie 
    ? (THEME_TOKENS[activeMovie.genre] || 'from-neutral-900/40 to-black/90')
    : 'from-neutral-900/40 to-black/90';

  const x = useMotionValue(0);
  
  // Emerald glow for right swipe
  const emeraldOpacity = useTransform(x, [0, 150], [0, 0.6]);
  // Ruby refraction for left swipe
  const rubyOpacity = useTransform(x, [-150, 0], [0.6, 0]);

  const handleDragEnd = (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      // Swipe Right (Like)
      setExitX(1000);
      swipeOut('like');
    } else if (offset < -100 || velocity < -500) {
      // Swipe Left (Dislike)
      setExitX(-1000);
      swipeOut('dislike');
    }
  };

  const swipeOut = (direction: 'like' | 'dislike') => {
    if (!activeMovie) return;
    
    // Aggregate swipe in debounced store (zero-lag UI)
    addSwipe({ movieId: activeMovie._id, action: direction }, sessionId, userId);
    
    setDeck((prev) => prev.slice(1));
    x.set(0); // Reset motion value
  };

  return (
    <div 
      className={`relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-b ${activeTheme} transition-colors duration-700 ease-in-out`}
      style={{ willChange: 'background' }}
    >
      <AnimatePresence>
        {deck.map((movie, index) => {
          // Render only the top 2 cards for extreme performance and zero reflow
          if (index > 1) return null;
          
          const isTop = index === 0;

          return (
            <motion.div
              key={movie._id}
              drag={isTop ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={isTop ? handleDragEnd : undefined}
              style={{
                x: isTop ? x : 0,
                backgroundImage: `url(${movie.posterUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                willChange: 'transform, opacity',
              }}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ 
                scale: isTop ? 1 : 0.95, 
                opacity: isTop ? 1 : 0.7,
                y: isTop ? 0 : 20,
                zIndex: isTop ? 10 : 0
              }}
              exit={{ 
                x: exitX,
                opacity: 0,
                scale: 0.9 
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute w-[320px] h-[480px] rounded-2xl flex flex-col items-center justify-end p-6 backdrop-blur-[24px] saturate-[180%] bg-white/5 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_inset_0_-1px_1px_rgba(0,0,0,0.4)]"
            >
              {isTop && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none transition-colors"
                    style={{ 
                      backgroundColor: 'rgba(16, 185, 129, 0.2)', // Emerald glow
                      opacity: emeraldOpacity, 
                      mixBlendMode: 'overlay',
                      boxShadow: 'inset 0 0 40px rgba(16, 185, 129, 0.5)'
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none transition-colors"
                    style={{ 
                      backgroundColor: 'rgba(239, 68, 68, 0.2)', // Ruby refraction
                      opacity: rubyOpacity, 
                      mixBlendMode: 'overlay',
                      boxShadow: 'inset 0 0 40px rgba(239, 68, 68, 0.5)'
                    }}
                  />
                </>
              )}

              {/* Glass Footer for Metadata */}
              <div className="w-full rounded-xl p-4 backdrop-blur-md bg-black/40 border border-white/10 shadow-lg relative z-20">
                <h2 className="text-xl font-outfit font-bold text-white mb-1 drop-shadow-md">
                  {movie.title}
                </h2>
                <div className="flex gap-2 text-sm text-gray-300 font-inter">
                  <span className="px-2 py-0.5 rounded-full bg-white/10">{movie.genre}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10">{movie.duration}m</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {deck.length === 0 && (
        <div className="text-white font-outfit text-xl animate-pulse">
          No more movies in this catalog.
        </div>
      )}
    </div>
  );
}

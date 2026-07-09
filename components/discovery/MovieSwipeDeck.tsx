'use client';

import { useState, useCallback, useMemo, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard3D from './MovieCard3D';
import { submitSwipeAction } from '../../lib/actions/matcher';

interface Movie {
  _id: string;
  id?: string;
  title: string;
  posterPath?: string;
  poster_path?: string;
  genreNames?: string[];
  overview?: string;
}

export interface MovieSwipeDeckProps {
  initialMovies: Movie[];
  onSwipeRight?: (movieId: string) => void;
  onSwipeLeft?: (movieId: string) => void;
  onDeckEmpty: () => void;
  userId?: string;
  sessionId?: string;
}

export default function MovieSwipeDeck({ initialMovies, onSwipeRight, onSwipeLeft, onDeckEmpty, userId = 'anonymous-user', sessionId }: MovieSwipeDeckProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [isPending, startTransition] = useTransition();

  const handleSwipe = useCallback((id: string, direction: 'left' | 'right') => {
    // Efficiently remove the top card immediately (Optimistic UI)
    setMovies((prev) => {
      const nextStack = prev.filter(m => (m._id || m.id) !== id);
      if (nextStack.length === 0) {
        // Use timeout to allow exit animation to begin before unmounting everything or triggering empty state abruptly
        setTimeout(() => onDeckEmpty(), 300);
      }
      return nextStack;
    });

    // Mask backend latency via useTransition
    startTransition(async () => {
      // Trigger prop callbacks if provided
      if (direction === 'right' && onSwipeRight) onSwipeRight(id);
      if (direction === 'left' && onSwipeLeft) onSwipeLeft(id);

      // Execute Server Action
      await submitSwipeAction({
        movieId: id,
        direction,
        timestamp: Date.now(),
        sessionId: sessionId || undefined,
      }, userId);
    });
  }, [onSwipeRight, onSwipeLeft, onDeckEmpty, sessionId, userId]);

  const activeStack = useMemo(() => {
    // Only render the top 3 cards for performance (Zero-Reflow strategy)
    return movies.slice(0, 3).reverse();
  }, [movies]);

  if (movies.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-full border-2 border-white/20 border-t-white/80 animate-spin mx-auto mb-4"
          />
          <p className="text-white/60 font-['Inter']">Quantum Syncing Matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[340px] h-[500px] mx-auto perspective-1000">
      <AnimatePresence>
        {activeStack.map((movie, idx) => {
          // Since we reversed the array (for z-index stacking in DOM), the last element in `activeStack` is the actual front card
          const isFront = idx === activeStack.length - 1;
          // Calculate the visual index from the top (0 = front, 1 = second, etc.)
          const visualIndex = activeStack.length - 1 - idx;
          const key = movie._id || movie.id || Math.random().toString();

          return (
            <MovieCard3D
              key={key}
              movie={movie}
              isFront={isFront}
              index={visualIndex}
              onSwipe={handleSwipe}
            />
          );
        })}
      </AnimatePresence>

      {/* Manual Action Buttons */}
      <div className="absolute -bottom-24 left-0 right-0 flex justify-center gap-8 z-50">
        <button 
          onClick={() => handleSwipe(movies[0]?._id || movies[0]?.id || '', 'left')}
          className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 hover:bg-red-500/20 active:scale-90 transition-all duration-200 backdrop-blur-md shadow-[0_0_15px_rgba(220,38,38,0.2)]"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <button 
          onClick={() => handleSwipe(movies[0]?._id || movies[0]?.id || '', 'right')}
          className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 hover:bg-emerald-500/20 active:scale-90 transition-all duration-200 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        </button>
      </div>
    </div>
  );
}

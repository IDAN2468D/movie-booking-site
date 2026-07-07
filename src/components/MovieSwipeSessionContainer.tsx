"use client";

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeSession } from '../hooks/useSwipeSession';
import MovieSwipeDeck, { Movie } from './MovieSwipeDeck';
import { recordSwipe } from '../lib/actions/swipeActions';

interface MovieSwipeSessionContainerProps {
  initialMovies: Movie[];
  sessionId: string;
  userId: string;
}

export default function MovieSwipeSessionContainer({
  initialMovies,
  sessionId,
  userId,
}: MovieSwipeSessionContainerProps) {
  const router = useRouter();
  const { sessionState } = useSwipeSession(sessionId);
  const [isPending, startTransition] = useTransition();

  const handleSwipe = (movieId: string, direction: 'like' | 'dislike') => {
    startTransition(async () => {
      try {
        await recordSwipe(sessionId, userId, movieId, direction);
      } catch (error) {
        console.error('Failed to record swipe:', error);
      }
    });
  };

  const matchedMovie = initialMovies.find((m) => m._id === sessionState.matchedMovieId);

  return (
    <div className="relative w-full h-full min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Underlying Deck */}
      <MovieSwipeDeck movies={initialMovies} onSwipe={handleSwipe} />

      {/* Victory Overlay Modal */}
      <AnimatePresence>
        {sessionState.status === 'matched' && matchedMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 backdrop-blur-[32px] bg-black/60 border border-white/10"
          >
            {/* Celebration Announcement */}
            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-4xl font-outfit font-bold text-center text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] mb-8"
            >
              It's a Match!
              <span className="block text-xl font-inter text-gray-300 mt-2 font-normal">
                You are all going to watch {matchedMovie.title}!
              </span>
            </motion.h1>

            {/* Glowing Blurry Card of the Matched Movie */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 120, damping: 20 }}
              className="relative w-[280px] h-[400px] rounded-2xl p-1 mb-10 overflow-hidden"
            >
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-500 opacity-60 blur-xl animate-pulse" />
              
              <div 
                className="relative w-full h-full rounded-2xl border border-white/20 shadow-2xl backdrop-blur-md"
                style={{
                  backgroundImage: `url(${matchedMovie.posterUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </motion.div>

            {/* Proceed Action CTA */}
            <motion.button
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.8 }}
              onClick={() => {
                router.push(`/movies/booking/seats?movieId=${matchedMovie._id}&sessionId=${sessionId}`);
              }}
              className="px-8 py-4 rounded-full text-lg font-outfit font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300"
            >
              Proceed to Seat Allocation
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

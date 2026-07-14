"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUpcomingMoviesAction } from '@/app/actions/movieActions';
import { UpcomingMovie } from '@/lib/validations/movieValidation';
import { getImageUrl } from '@/lib/tmdb';
import Image from 'next/image';

export default function ComingSoonCarousel() {
  const [movies, setMovies] = useState<UpcomingMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadUpcomingMovies() {
      try {
        const result = await getUpcomingMoviesAction();
        if (result.success && result.data) {
          setMovies(result.data.slice(0, 10)); // Limit to top 10 upcoming movies
        } else {
          setError(result.error || "שגיאה בטעינת סרטים");
        }
      } catch (err) {
        console.error("Failed to load upcoming movies:", err);
        setError("שגיאה בטעינת סרטים");
      } finally {
        setLoading(false);
      }
    }
    loadUpcomingMovies();
  }, []);

  const handleNext = () => {
    if (movies.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const handlePrev = () => {
    if (movies.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };

  // Render Skeleton Loader to ensure strict Zero-Reflow during loading
  if (loading) {
    return (
      <section className="mt-12 px-4 md:px-0" dir="rtl">
        <h3 className="text-xl font-bold text-white mb-6 font-['Outfit'] tracking-wide">
          בקרוב לקולנוע
        </h3>
        <div className="w-full h-[400px] rounded-2xl bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_0_25px_50px_-12px_rgba(0,0,0,0.7)] flex items-center justify-center">
          <div className="flex gap-4">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 font-['Inter'] text-sm animate-pulse">טוען סרטים בקרוב...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || movies.length === 0) {
    return null; // Silent fallback on error to not disrupt UX
  }

  const currentMovie = movies[currentIndex];

  return (
    <section className="mt-12 px-4 md:px-0" dir="rtl" ref={containerRef}>
      <h3 className="text-xl font-bold text-white mb-6 font-['Outfit'] tracking-wide">
        בקרוב לקולנוע
      </h3>

      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_0_25px_50px_-12px_rgba(0,0,0,0.7),_0_0_40px_rgba(0,0,0,0.5)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.movieId}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col md:flex-row items-center p-6 md:p-10 gap-8 will-change-transform transform-gpu"
          >
            {/* Poster container with high depth glass rim */}
            <div className="relative w-40 h-60 md:w-56 md:h-80 rounded-lg overflow-hidden border border-white/20 shadow-[0_15px_30px_rgba(0,0,0,0.5)] shrink-0 transform-gpu">
              <Image
                src={getImageUrl(currentMovie.posterPath, 'w500')}
                alt={currentMovie.title}
                fill
                priority
                sizes="(max-width: 768px) 160px, 224px"
                className="object-cover"
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1 flex flex-col justify-center text-right">
              <span className="text-cyan-400 font-['Inter'] text-xs font-semibold tracking-wider uppercase mb-2">
                תאריך יציאה: {new Date(currentMovie.releaseDate).toLocaleDateString('he-IL')}
              </span>
              <h4 className="text-2xl md:text-3xl font-extrabold text-white mb-4 font-['Outfit']">
                {currentMovie.title}
              </h4>
              <p className="text-sm md:text-base text-gray-300 font-['Inter'] leading-relaxed line-clamp-4 max-w-xl">
                {currentMovie.overview || "אין תקציר זמין לסרט זה."}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="absolute bottom-6 left-6 flex gap-3 z-10">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-white/10 bg-neutral-900/40 hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center text-white backdrop-blur-md"
            aria-label="Previous Movie"
          >
            &#8594;
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-white/10 bg-neutral-900/40 hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center text-white backdrop-blur-md"
            aria-label="Next Movie"
          >
            &#8592;
          </button>
        </div>
      </div>
    </section>
  );
}

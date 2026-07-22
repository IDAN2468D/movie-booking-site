"use client";

import React, { useState, useEffect, useCallback } from "react";
import { UpcomingMovie } from "@/lib/validations/movieValidation";
import { TrailerModal } from "@/components/coming-soon/TrailerModal";
import { UpcomingMovieCard } from "@/components/coming-soon/UpcomingMovieCard";
import { getMovieTrailerAction } from "@/app/actions/movieActions";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore } from "@/lib/store";

interface ComingSoonClientProps {
  initialMovies: UpcomingMovie[];
}

export function ComingSoonClient({ initialMovies }: ComingSoonClientProps) {
  const [hoveredMovie, setHoveredMovie] = useState<UpcomingMovie | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);
  const [activeMovie, setActiveMovie] = useState<UpcomingMovie | null>(null);
  const [loadingTrailerId, setLoadingTrailerId] = useState<number | null>(null);

  const auraColor = useBookingStore((state) => state.auraColor);

  const handlePlayTrailer = async (movieId: number) => {
    setLoadingTrailerId(movieId);
    const movieObj = initialMovies.find((m) => m.movieId === movieId) || null;
    setActiveMovie(movieObj);

    try {
      const res = await getMovieTrailerAction(movieId);
      if (res.success && res.data && res.data.length > 0) {
        // Pick the first official trailer, or just the first trailer
        const trailer = res.data.find((v) => v.official) || res.data[0];
        setActiveTrailerKey(trailer.key);
        setIsTrailerOpen(true);
      } else {
        alert("לא נמצא טריילר לסרט זה.");
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
      alert("שגיאה בטעינת הטריילר.");
    } finally {
      setLoadingTrailerId(null);
    }
  };

  const handleHover = useCallback((movie: UpcomingMovie) => {
    setHoveredMovie(movie);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden font-inter pt-20" dir="rtl">
      {/* Immersive Background layer - Liquid Glass 4.0 */}
      <AnimatePresence mode="wait">
        {hoveredMovie && hoveredMovie.posterPath && (
          <motion.div
            key={hoveredMovie.movieId}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${hoveredMovie.posterPath})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(30px) saturate(150%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Dynamic Overlay Gradient */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${auraColor}33 0%, transparent 70%), linear-gradient(to bottom, transparent 0%, #000 100%)`
        }}
      />

      <div className="relative z-10 container mx-auto px-6 py-12">
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-outfit font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            בקרוב בקולנוע
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-2xl"
          >
            גלו את הסרטים החמים ביותר שעומדים לצאת בקרוב. צפו בטריילרים, שמרו ביומן והיו הראשונים לדעת מתי נפתחת מכירת הכרטיסים.
          </motion.p>
        </header>

        {/* Inline Hero Trailer Player (positioned directly above cards) */}
        <TrailerModal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          trailerKey={activeTrailerKey}
          movie={activeMovie}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {initialMovies.map((movie, index) => (
            <UpcomingMovieCard
              key={movie.movieId}
              movie={movie}
              onPlayTrailer={handlePlayTrailer}
              onHover={handleHover}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

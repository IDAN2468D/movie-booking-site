'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDiscoveryStore, useDiscoveryEventBridge } from '@/hooks/useDiscoveryContext';

export default function MovieCarousel() {
  const { movies, fetchCatalog, isLoading, activeCategory } = useDiscoveryStore();
  
  useDiscoveryEventBridge(); // Attach event listener

  useEffect(() => {
    // We mock the persona vector for this implementation.
    // In production, this would come from the user's active session or AppState.
    fetchCatalog(['Sci-Fi Fan']);
  }, [fetchCatalog]);

  if (isLoading && movies.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse bg-white/5 w-full h-48 rounded-2xl border border-white/10" />
      </div>
    );
  }

  // If a category was jumped to, highlight that genre
  const filteredMovies = activeCategory 
    ? movies.filter(m => m.genre.toLowerCase() === activeCategory.toLowerCase())
    : movies;

  const displayMovies = filteredMovies.length > 0 ? filteredMovies : movies;

  // Safeguard drag constraints for SSR
  const dragConstraintsLeft = typeof window !== 'undefined' 
    ? -((displayMovies.length * 220) - window.innerWidth + 48) 
    : -1000;

  return (
    <div className="w-full overflow-hidden py-8">
      <div className="px-6 mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white tracking-wide">
          {activeCategory ? `Recommended: ${activeCategory}` : 'Semantic Discovery'}
        </h2>
      </div>

      <motion.div 
        className="flex gap-6 px-6"
        drag="x"
        dragConstraints={{ right: 0, left: dragConstraintsLeft > 0 ? 0 : dragConstraintsLeft }}
        whileTap={{ cursor: "grabbing" }}
        style={{ cursor: "grab" }}
      >
        {displayMovies.map((movie) => (
          <motion.div
            key={movie.id}
            className="shrink-0 w-[200px] h-[300px] relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <img 
              src={movie.posterUrl} 
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <span className="text-[10px] uppercase tracking-widest text-primary/80 font-mono font-bold mb-1 block">
                {movie.genre}
              </span>
              <h3 className="text-white font-bold leading-tight">{movie.title}</h3>
            </div>
            
            {/* Liquid Glass Hover Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] pointer-events-none" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

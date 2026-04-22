'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Movie } from '@/lib/tmdb';
import { MovieCard } from './MovieCard';

interface Props {
  movies: Movie[];
}

export default function MovieSimilarSection({ movies }: Props) {
  if (!movies.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
        סרטים דומים
        <div className="w-2 h-2 rounded-full bg-[#FF9F0A]" />
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </motion.section>
  );
}

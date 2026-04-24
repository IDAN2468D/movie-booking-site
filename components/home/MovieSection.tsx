import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MovieCard } from '../movie/MovieCard';
import { Movie } from '@/lib/tmdb';
import { motion } from 'framer-motion';

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  onSeeAll?: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function MovieSection({ title, movies, onSeeAll }: MovieSectionProps) {
  return (
    <section className="px-2 py-8">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-6"
      >
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          {title}
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF9F0A]" />
        </h2>
        <button 
          onClick={onSeeAll}
          className="text-sm font-medium text-slate-500 hover:text-[#FF9F0A] transition-colors flex items-center gap-1 group"
        >
          ראה הכל
          <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
        </button>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8"
      >
        {movies.map((movie) => (
          <motion.div key={movie.id} variants={item}>
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

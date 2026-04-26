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
        <section className="py-8">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-6 px-4"
      >
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2 font-outfit">
          {title}
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF9F0A] shadow-[0_0_10px_rgba(255,159,10,0.5)]" />
        </h2>
        <button 
          onClick={onSeeAll}
          className="text-xs font-black text-slate-500 hover:text-[#FF9F0A] transition-all flex items-center gap-1 group uppercase tracking-widest"
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
        className="flex overflow-x-auto pb-8 gap-4 px-4 no-scrollbar md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:gap-8 md:px-0"
      >
        {movies.map((movie) => (
          <motion.div 
            key={movie.id} 
            variants={item}
            className="min-w-[160px] sm:min-w-[200px] md:min-w-0"
          >
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

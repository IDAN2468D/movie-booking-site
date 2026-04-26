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
    <section className="py-12">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-10 px-6"
      >
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-display text-primary uppercase tracking-[0.4em] mb-1">CURATED COLLECTION</p>
          <h2 className="text-3xl md:text-4xl font-display text-off-white tracking-tighter uppercase flex items-center gap-3">
            {title}
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_15px_rgba(255,20,100,0.6)]" />
          </h2>
        </div>

        {onSeeAll && (
          <button 
            onClick={onSeeAll}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-primary/40 transition-all duration-500"
          >
            <span className="text-[10px] font-display text-off-white/40 group-hover:text-primary uppercase tracking-[0.2em] transition-colors">
              SEE ALL
            </span>
            <ChevronRight className="w-4 h-4 text-off-white/20 group-hover:text-primary rotate-180 transition-all" />
          </button>
        )}
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex overflow-x-auto pb-10 gap-6 px-6 no-scrollbar md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:gap-10"
      >
        {movies.map((movie) => (
          <motion.div 
            key={movie.id} 
            variants={item}
            className="min-w-[180px] sm:min-w-[220px] md:min-w-0"
          >
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

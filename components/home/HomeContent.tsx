'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CategoryFilters from './CategoryFilters';
import MovieSection from './MovieSection';
import FeaturedHero from './FeaturedHero';
import AIRecommendations from './AIRecommendations';
import { Movie, GENRE_MAP } from '@/lib/tmdb';
import { useBookingStore } from '@/lib/store';
import NextImage from 'next/image';

interface HomeContentProps {
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  trendingMovies: Movie[];
  nowPlayingMovies: Movie[];
}

export default function HomeContent({ 
  popularMovies, 
  topRatedMovies, 
  trendingMovies,
  nowPlayingMovies
}: HomeContentProps) {
  const { activeCategory, setActiveCategory, selectedMovie } = useBookingStore();

  const getFilteredMovies = () => {
    if (activeCategory === 'trending') return trendingMovies;
    if (activeCategory === 'recent') return nowPlayingMovies;
    if (activeCategory === 'top') return topRatedMovies;
    
    const genreId = GENRE_MAP[activeCategory];
    if (genreId) {
      return popularMovies.filter(movie => movie.genre_ids.includes(genreId));
    }
    
    return popularMovies;
  };

  const moviesToShow = getFilteredMovies();

  return (
    <div className="pb-20">
      <FeaturedHero movie={trendingMovies[0]} />

      <div className="px-10 mt-8">
        <CategoryFilters />
      </div>

      {activeCategory === 'all' && <AIRecommendations />}

      <div className="space-y-4">
        {activeCategory === 'all' ? (
          <>
            <MovieSection 
              title="מוקרן כעת" 
              movies={nowPlayingMovies.slice(0, 12)} 
              onSeeAll={() => setActiveCategory('recent')}
            />
            <MovieSection 
              title="סרטים פופולריים" 
              movies={popularMovies.slice(0, 12)} 
              onSeeAll={() => setActiveCategory('trending')}
            />
            <MovieSection 
              title="הכי מדורגים" 
              movies={topRatedMovies.slice(0, 12)} 
              onSeeAll={() => setActiveCategory('top')}
            />
          </>
        ) : (
          <MovieSection 
            title={activeCategory === 'trending' ? 'במגמה' : 
                   activeCategory === 'recent' ? 'מוקרן כעת' : 
                   activeCategory === 'top' ? 'הכי מדורגים' :
                   activeCategory === 'action' ? 'פעולה' : 
                   activeCategory === 'scifi' ? 'מדע בדיוני' : 
                   activeCategory === 'comedy' ? 'קומדיה' :
                   activeCategory === 'drama' ? 'דרמה' :
                   activeCategory === 'horror' ? 'אימה' :
                   activeCategory === 'animation' ? 'אנימציה' : 'הכל'} 
            movies={moviesToShow} 
          />
        )}
      </div>

      {/* Mobile Booking Trigger */}
      {selectedMovie && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="xl:hidden fixed bottom-20 left-4 right-4 bg-[#FF9F0A] p-4 rounded-2xl flex items-center justify-between shadow-2xl z-40"
        >
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-black/10 overflow-hidden relative">
                <NextImage 
                  src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`} 
                  alt={selectedMovie.title}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
             <div className="text-right">
                <p className="text-[10px] text-background font-black uppercase tracking-widest">הסרט שנבחר</p>
                <p className="text-sm text-background font-bold line-clamp-1">{selectedMovie.title}</p>
             </div>
          </div>
          <button 
            onClick={() => alert('פותח את ממשק ההזמנה לנייד...')}
            className="px-6 py-2 bg-background text-primary font-black rounded-xl text-xs uppercase tracking-widest"
          >
            הזמן עכשיו
          </button>
        </motion.div>
      )}
    </div>
  );
}

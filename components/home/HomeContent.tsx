'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CategoryFilters from './CategoryFilters';
import MovieSection from './MovieSection';
import FeaturedHero from './FeaturedHero';
import AIRecommendations from './AIRecommendations';
import { Movie, GENRE_MAP, getMoviesByGenre } from '@/lib/tmdb';
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
  const { activeCategory, setActiveCategory, selectedMovie, searchQuery, filters } = useBookingStore();
  const [genreMovies, setGenreMovies] = React.useState<Record<string, Movie[]>>({});
  const [isLoadingGenre, setIsLoadingGenre] = React.useState(false);

  React.useEffect(() => {
    const genreId = GENRE_MAP[activeCategory];
    // Check if it's a genre category and not already fetched
    if (genreId && !genreMovies[activeCategory] && !['trending', 'recent', 'top', 'all'].includes(activeCategory)) {
      setIsLoadingGenre(true);
      getMoviesByGenre(genreId)
        .then(movies => {
          setGenreMovies(prev => ({ ...prev, [activeCategory]: movies }));
        })
        .catch(console.error)
        .finally(() => setIsLoadingGenre(false));
    }
  }, [activeCategory, genreMovies]);

  const getFilteredMovies = () => {
    // Combine all available movies to ensure we don't miss any when filtering
    const allMoviesPool = [...popularMovies, ...trendingMovies, ...topRatedMovies, ...nowPlayingMovies];
    // Remove duplicates by ID
    const uniqueMovies = Array.from(new Map(allMoviesPool.map(m => [m.id, m])).values());
    
    let movies = uniqueMovies;
    
    // 1. Filter by Active Category (Tab)
    if (activeCategory !== 'all') {
      if (activeCategory === 'trending') movies = trendingMovies;
      else if (activeCategory === 'recent') movies = nowPlayingMovies;
      else if (activeCategory === 'top') movies = topRatedMovies;
      else if (genreMovies[activeCategory]) {
        movies = genreMovies[activeCategory];
      } else {
        const categoryGenreId = GENRE_MAP[activeCategory];
        if (categoryGenreId) {
          movies = uniqueMovies.filter(movie => movie.genre_ids.includes(categoryGenreId));
        }
      }
    }

    // 2. Apply Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      movies = movies.filter(movie => 
        movie.title.toLowerCase().includes(q) || 
        movie.overview?.toLowerCase().includes(q)
      );
    }

    // 3. Apply Modal Filters (Genre)
    if (filters.genre !== 'הכל') {
      const filterGenreId = GENRE_MAP[filters.genre];
      if (filterGenreId) {
        movies = movies.filter(movie => movie.genre_ids.includes(filterGenreId));
      }
    }

    // 4. Apply Modal Filters (Rating)
    if (filters.rating > 0) {
      movies = movies.filter(movie => movie.vote_average >= filters.rating);
    }

    // 5. Apply Modal Filters (Year)
    if (filters.year && filters.year !== 'הכל') {
      movies = movies.filter(movie => movie.release_date?.startsWith(filters.year));
    }
    
    return movies;
  };

  const moviesToShow = getFilteredMovies();
  const isGlobalFiltering = searchQuery !== '' || filters.genre !== 'הכל' || filters.rating > 0 || filters.year !== 'הכל';

  return (
    <div className="pb-20">
      <FeaturedHero movie={trendingMovies[0]} />

      <div className="px-10 mt-8">
        <CategoryFilters />
      </div>

      {activeCategory === 'all' && <AIRecommendations />}

      <div className="space-y-4">
        {isLoadingGenre ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,159,10,0.3)]" />
            <p className="text-sm font-black text-slate-500 uppercase tracking-widest animate-pulse">טוען סרטים מהקטגוריה...</p>
          </div>
        ) : isGlobalFiltering ? (
          <MovieSection 
            title={searchQuery ? `תוצאות חיפוש עבור "${searchQuery}"` : "תוצאות מסוננות"} 
            movies={moviesToShow} 
          />
        ) : activeCategory === 'all' ? (
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
        
        {moviesToShow.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <p className="text-xl font-bold mb-2">לא נמצאו סרטים תואמים</p>
            <p className="text-sm">נסו לשנות את החיפוש או הפילטרים</p>
          </div>
        )}
      </div>

      {/* Mobile Booking Trigger (Liquid Glass 2.0) */}
      {selectedMovie && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="xl:hidden fixed bottom-24 left-6 right-6 bg-white/[0.03] backdrop-blur-[40px] p-5 rounded-[32px] flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-40 border border-white/10 overflow-hidden group"
        >
          {/* Holographic background glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-cyan-500/5 opacity-40" />
          
          <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative shadow-2xl group-hover:scale-105 transition-transform duration-500">
                <NextImage 
                  src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`} 
                  alt={selectedMovie.title}
                  fill
                  sizes="56px"
                  className="object-cover saturate-[1.1]"
                />
              </div>
             <div className="text-right">
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-1">הסרט שנבחר</p>
                <p className="text-base text-white font-black line-clamp-1 font-outfit leading-tight">{selectedMovie.title}</p>
             </div>
          </div>
          
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-mobile-booking'))}
            className="px-6 py-3 bg-primary text-background font-black rounded-2xl text-[11px] uppercase tracking-widest relative z-10 shadow-[0_10px_20px_rgba(255,159,10,0.2)] active:scale-95 transition-all duration-300"
          >
            הזמן עכשיו
          </button>
        </motion.div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Movie, GENRE_MAP, getMoviesByGenre } from '@/lib/tmdb';
import { useBookingStore } from '@/lib/store';

interface UseFilteredMoviesProps {
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  trendingMovies: Movie[];
  nowPlayingMovies: Movie[];
}

export function useFilteredMovies({
  popularMovies,
  topRatedMovies,
  trendingMovies,
  nowPlayingMovies,
}: UseFilteredMoviesProps) {
  const { activeCategory, searchQuery, filters, setAllMovies } = useBookingStore();
  const [genreMovies, setGenreMovies] = useState<Record<string, Movie[]>>({});
  const [isLoadingGenre, setIsLoadingGenre] = useState(false);

  // Set all movies in the store for other components to access (e.g. search, bot)
  useEffect(() => {
    const all = [...popularMovies, ...topRatedMovies, ...trendingMovies, ...nowPlayingMovies];
    const unique = Array.from(new Map(all.map(m => [m.id, m])).values());
    setAllMovies(unique);
  }, [popularMovies, topRatedMovies, trendingMovies, nowPlayingMovies, setAllMovies]);

  // Fetch genre movies dynamically if needed
  useEffect(() => {
    const genreId = GENRE_MAP[activeCategory];
    const isSpecialCategory = ['trending', 'recent', 'top', 'all'].includes(activeCategory);
    
    if (genreId && !genreMovies[activeCategory] && !isSpecialCategory) {
      const fetchGenreMovies = async () => {
        setIsLoadingGenre(true);
        try {
          const movies = await getMoviesByGenre(genreId);
          setGenreMovies(prev => ({ ...prev, [activeCategory]: movies }));
        } catch (err) {
          console.error('Failed to fetch genre movies:', err);
        } finally {
          setIsLoadingGenre(false);
        }
      };
      fetchGenreMovies();
    }
  }, [activeCategory, genreMovies]);

  const getFilteredMovies = () => {
    const allMoviesPool = [...popularMovies, ...trendingMovies, ...topRatedMovies, ...nowPlayingMovies];
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
        movie.displayTitle.toLowerCase().includes(q) || 
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

  return {
    moviesToShow,
    isGlobalFiltering,
    isLoadingGenre,
  };
}

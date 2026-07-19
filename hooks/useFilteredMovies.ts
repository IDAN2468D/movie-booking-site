'use client';

import { useState, useEffect, useRef } from 'react';
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

  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const workerRef = useRef<Worker | null>(null);

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

  // Initialize and manage Web Worker
  useEffect(() => {
    workerRef.current = new Worker(new URL('@/lib/workers/filterWorker.ts', import.meta.url));
    
    workerRef.current.onmessage = (event: MessageEvent) => {
      setFilteredMovies(event.data.filteredMovies);
      setIsFiltering(false);
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // Post to worker on filter changes
  useEffect(() => {
    if (!workerRef.current) return;
    
    setIsFiltering(true);
    
    const allMoviesPool = [...popularMovies, ...trendingMovies, ...topRatedMovies, ...nowPlayingMovies];
    
    workerRef.current.postMessage({
      moviesPool: allMoviesPool,
      activeCategory,
      genreMoviesCache: genreMovies,
      searchQuery,
      filters,
      trendingMovies,
      nowPlayingMovies,
      topRatedMovies
    });
  }, [
    activeCategory, 
    searchQuery, 
    filters, 
    genreMovies, 
    popularMovies, 
    trendingMovies, 
    topRatedMovies, 
    nowPlayingMovies
  ]);

  const isGlobalFiltering = searchQuery !== '' || filters.genre !== 'הכל' || filters.rating > 0 || filters.year !== 'הכל';

  return {
    moviesToShow: filteredMovies,
    isGlobalFiltering,
    isLoadingGenre,
    isFiltering,
  };
}

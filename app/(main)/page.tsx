import { getPopularMovies, getTopRatedMovies, getTrendingMovies, getNowPlayingMovies, type Movie } from '@/lib/tmdb';
import HomeContent from '@/components/home/HomeContent';

export default async function Home() {
  let popularMovies: Movie[] = [], 
      topRatedMovies: Movie[] = [], 
      trendingMovies: Movie[] = [], 
      nowPlayingMovies: Movie[] = [];
  
  try {
    [popularMovies, topRatedMovies, trendingMovies, nowPlayingMovies] = await Promise.all([
      getPopularMovies(),
      getTopRatedMovies(),
      getTrendingMovies(),
      getNowPlayingMovies(),
    ]);
  } catch (error) {
    console.error('Failed to fetch movies from TMDB:', error);
  }

  return (
    <HomeContent 
      popularMovies={popularMovies}
      topRatedMovies={topRatedMovies}
      trendingMovies={trendingMovies}
      nowPlayingMovies={nowPlayingMovies}
    />
  );
}

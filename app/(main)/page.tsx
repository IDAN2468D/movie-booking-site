import { getPopularMovies, getTopRatedMovies, getTrendingMovies, getNowPlayingMovies } from '@/lib/tmdb';
import HomeContent from '@/components/home/HomeContent';

export default async function Home() {
  const [popularMovies, topRatedMovies, trendingMovies, nowPlayingMovies] = await Promise.all([
    getPopularMovies(),
    getTopRatedMovies(),
    getTrendingMovies(),
    getNowPlayingMovies(),
  ]);

  return (
    <HomeContent 
      popularMovies={popularMovies}
      topRatedMovies={topRatedMovies}
      trendingMovies={trendingMovies}
      nowPlayingMovies={nowPlayingMovies}
    />
  );
}

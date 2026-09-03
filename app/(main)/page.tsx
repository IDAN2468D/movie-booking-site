import { Suspense } from 'react';
import { getPopularMovies, getTopRatedMovies, getTrendingMovies, getNowPlayingMovies, type Movie } from '@/lib/tmdb';
import { getFallbackMovies } from '@/lib/tmdb-fallback';
import HomeContent from '@/components/home/HomeContent';
import SmartPicks from '@/components/home/SmartPicks';
import SmartPicksSkeleton from '@/components/home/SmartPicksSkeleton';

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

  if (popularMovies.length === 0) {
    const fallback = getFallbackMovies();
    popularMovies = fallback;
    trendingMovies = fallback;
    nowPlayingMovies = fallback;
    topRatedMovies = fallback;
  }

  return (
    <HomeContent 
      popularMovies={popularMovies}
      topRatedMovies={topRatedMovies}
      trendingMovies={trendingMovies}
      nowPlayingMovies={nowPlayingMovies}
      recommendationsNode={
        <Suspense key="ai-recommendations-suspense" fallback={<SmartPicksSkeleton />}>
          <SmartPicks />
        </Suspense>
      }
    />
  );
}

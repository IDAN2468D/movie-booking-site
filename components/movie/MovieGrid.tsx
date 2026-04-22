import { getPopularMovies } from '@/lib/tmdb';
import { MovieCard } from './MovieCard';

export const MovieGrid = async () => {
  let movies = [];
  try {
    movies = await getPopularMovies();
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        Failed to load movies. Please try again later.
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-500">
        No movies found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

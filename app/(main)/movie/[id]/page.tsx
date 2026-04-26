import { getMovieDetails, getMovieCredits, getSimilarMovies, getMovieVideos, getMovieReviews } from '@/lib/tmdb';
import MovieDetailsContent from '@/components/movie/MovieDetailsContent';

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);

  const [movie, credits, similar, videos, reviews] = await Promise.all([
    getMovieDetails(movieId),
    getMovieCredits(movieId),
    getSimilarMovies(movieId),
    getMovieVideos(movieId),
    getMovieReviews(movieId),
  ]);

  const director = credits.crew.find(c => c.job === 'Director');

  return (
    <MovieDetailsContent
      movie={movie}
      cast={credits.cast.slice(0, 12)}
      director={director || null}
      similarMovies={similar.slice(0, 6)}
      videos={videos}
      tmdbReviews={reviews.slice(0, 5)}
    />
  );
}

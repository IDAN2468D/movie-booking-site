import { z } from 'zod';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Zod Schemas for Validation (GOVERNANCE Rule 1)
export const MovieSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  name: z.string().optional(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number().default(0),
  release_date: z.string().nullable().optional(),
  first_air_date: z.string().nullable().optional(),
  overview: z.string().default(''),
  genre_ids: z.array(z.number()).default([]),
});

export type Movie = z.infer<typeof MovieSchema> & {
  displayTitle: string;
};

export const GENRE_MAP: Record<string, number> = {
  action: 28, adventure: 12, animation: 16, comedy: 35, crime: 80, 
  documentary: 99, drama: 18, family: 10751, fantasy: 14, history: 36, 
  horror: 27, music: 10402, mystery: 9648, romance: 10749, scifi: 878, 
  thriller: 53, war: 10752, western: 37, 'פעולה': 28, 'הרפתקאות': 12,
  'אנימציה': 16, 'קומדיה': 35, 'פשע': 80, 'דוקומנטרי': 99, 'דרמה': 18,
  'משפחה': 10751, 'פנטזיה': 14, 'היסטוריה': 36, 'אימה': 27, 'מוזיקה': 10402,
  'מסתורין': 9648, 'רומנטיקה': 10749, 'מדע בדיוני': 878, 'מתח': 53,
  'מלחמה': 10752, 'מערבון': 37,
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500') => {
  if (!path) return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=300';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  genre_ids: number[];
}

interface TMDBResponse<T> {
  results: T[];
  total_pages: number;
  total_results: number;
}

function formatMovieData(movie: TMDBMovie): Movie {
  const validated = MovieSchema.parse(movie);
  return {
    ...validated,
    displayTitle: validated.title || validated.name || 'Untitled',
  };
}

export async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY || '',
    language: 'he-IL',
    ...params,
  });

  // Explicit Caching (GOVERNANCE Rule 2 & TMDB_DATA_STRATEGY)
  const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`, {
    next: { revalidate: 3600 } // 1 hour cache
  });
  
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText} (${response.status})`);
  }

  return response.json();
}

/**
 * Advanced Search & Discover (ADVANCED_SEARCH_LOGIC)
 */
export async function discoverMovies(params: {
  genre?: number;
  rating?: number;
  year?: number;
  query?: string;
  page?: number;
}) {
  if (params.query) {
    const data = await fetchFromTMDB<TMDBResponse<TMDBMovie>>('/search/movie', {
      query: params.query,
      page: (params.page || 1).toString(),
    });
    return data.results.map(formatMovieData);
  }

  const discoverParams: Record<string, string> = {
    sort_by: 'popularity.desc',
    page: (params.page || 1).toString(),
  };

  if (params.genre) discoverParams.with_genres = params.genre.toString();
  if (params.rating) discoverParams['vote_average.gte'] = params.rating.toString();
  if (params.year) discoverParams['primary_release_year'] = params.year.toString();

  const data = await fetchFromTMDB<TMDBResponse<TMDBMovie>>('/discover/movie', discoverParams);
  return data.results.map(formatMovieData);
}

export async function getPopularMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<TMDBResponse<TMDBMovie>>('/movie/popular');
  return data.results.map(formatMovieData);
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<TMDBResponse<TMDBMovie>>('/movie/top_rated');
  return data.results.map(formatMovieData);
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<TMDBResponse<TMDBMovie>>('/trending/movie/day');
  return data.results.map(formatMovieData);
}

export async function getNowPlayingMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<TMDBResponse<TMDBMovie>>('/movie/now_playing');
  return data.results.map(formatMovieData);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  return discoverMovies({ query });
}

export async function getMoviesByGenre(genreId: number): Promise<Movie[]> {
  return discoverMovies({ genre: genreId });
}
// --- Movie Details Types ---

export interface MovieDetails {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  overview: string;
  genre_ids: number[];
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  original_language: string;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  popularity: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  const data = await fetchFromTMDB<MovieDetails>(`/movie/${id}`);
  // In a real app, we'd also validate MovieDetails with Zod
  return {
    ...data,
    genre_ids: data.genres?.map(g => g.id) || [],
  };
}

export async function getMovieCredits(id: number): Promise<{ cast: CastMember[]; crew: CrewMember[] }> {
  return fetchFromTMDB(`/movie/${id}/credits`);
}

export async function getSimilarMovies(id: number): Promise<Movie[]> {
  const data = await fetchFromTMDB<TMDBResponse<TMDBMovie>>(`/movie/${id}/similar`);
  return data.results.map(formatMovieData);
}

// --- Video / Trailers ---

export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;       // "Trailer" | "Teaser" | "Clip" | "Featurette"
  official: boolean;
}

export async function getMovieVideos(id: number): Promise<VideoResult[]> {
  const data = await fetchFromTMDB<{ results: VideoResult[] }>(`/movie/${id}/videos`);
  // Return only YouTube trailers/teasers, prioritising official trailers
  return (data.results || [])
    .filter(v => v.site === 'YouTube' && ['Trailer', 'Teaser'].includes(v.type))
    .sort((a, b) => {
      if (a.official !== b.official) return a.official ? -1 : 1;
      if (a.type !== b.type) return a.type === 'Trailer' ? -1 : 1;
      return 0;
    });
}
// --- Reviews ---

export interface TMDBReview {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
}

export async function getMovieReviews(id: number): Promise<TMDBReview[]> {
  const data = await fetchFromTMDB<{ results: TMDBReview[] }>(`/movie/${id}/reviews`);
  return data.results || [];
}

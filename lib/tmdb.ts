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

export const getImageUrl = (
  path: string | null | undefined, 
  size: 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original' = 'w342'
) => {
  if (!path || path === 'null' || path === 'undefined' || path === '/null' || path === '/undefined' || path.endsWith('/w500/') || path.endsWith('/w342/') || path.endsWith('/original/')) {
    return '/posters/default.svg';
  }
  if (path.startsWith('http') || path.startsWith('/posters/')) return path;
  return `${IMAGE_BASE_URL}/${size}${path.startsWith('/') ? path : '/' + path}`;
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

export function formatMovieData(movie: TMDBMovie): Movie {
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

export const FALLBACK_MOVIES: Movie[] = [
  {
    id: 693134,
    title: 'חולית: חלק 2',
    displayTitle: 'חולית: חלק 2',
    poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s520bIn.jpg',
    vote_average: 8.3,
    release_date: '2024-02-27',
    overview: 'המסע של פול אטריידיס ממשיך כשהוא מתאחד עם צ\'אני והפרמנים.',
    genre_ids: [878, 12],
  },
  {
    id: 533535,
    title: 'דדפול & וולברין',
    displayTitle: 'דדפול & וולברין',
    poster_path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdrop_path: '/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    vote_average: 7.8,
    release_date: '2024-07-24',
    overview: 'דדפול חובר לוולברין במשימה להציל את היקום שלהם.',
    genre_ids: [28, 35, 878],
  },
  {
    id: 1022789,
    title: 'הקול בראש 2',
    displayTitle: 'הקול בראש 2',
    poster_path: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    backdrop_path: '/stKGOm8wqGOFc26YGE6fTMR3wZ6.jpg',
    vote_average: 7.7,
    release_date: '2024-06-11',
    overview: 'רגשות חדשים מצטרפים למוחה של ריילי.',
    genre_ids: [16, 10751, 35],
  },
];

/**
 * Advanced Search & Discover (ADVANCED_SEARCH_LOGIC)
 */
export async function discoverMovies(params: {
  genre?: number;
  rating?: number;
  year?: number;
  query?: string;
  page?: number;
  maxRuntime?: number;
}): Promise<Movie[]> {
  try {
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
    if (params.maxRuntime) discoverParams['with_runtime.lte'] = params.maxRuntime.toString();

    const data = await fetchFromTMDB<TMDBResponse<TMDBMovie>>('/discover/movie', discoverParams);
    return data.results.map(formatMovieData);
  } catch (error) {
    console.warn('TMDB discoverMovies fallback triggered:', error);
    return FALLBACK_MOVIES;
  }
}

export async function getPopularMovies(): Promise<Movie[]> {
  try {
    const data = await fetchFromTMDB<TMDBResponse<TMDBMovie>>('/movie/popular');
    return data.results.map(formatMovieData);
  } catch (error) {
    console.warn('TMDB getPopularMovies fallback triggered:', error);
    return FALLBACK_MOVIES;
  }
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  try {
    const data = await fetchFromTMDB<TMDBResponse<TMDBMovie>>('/movie/top_rated');
    return data.results.map(formatMovieData);
  } catch (error) {
    console.warn('TMDB getTopRatedMovies fallback triggered:', error);
    return FALLBACK_MOVIES;
  }
}

export async function getTrendingMovies(): Promise<Movie[]> {
  try {
    const data = await fetchFromTMDB<TMDBResponse<TMDBMovie>>('/trending/movie/day');
    return data.results.map(formatMovieData);
  } catch (error) {
    console.warn('TMDB getTrendingMovies fallback triggered:', error);
    return FALLBACK_MOVIES;
  }
}

export async function getNowPlayingMovies(): Promise<Movie[]> {
  try {
    const data = await fetchFromTMDB<TMDBResponse<TMDBMovie>>('/movie/now_playing');
    return data.results.map(formatMovieData);
  } catch (error) {
    console.warn('TMDB getNowPlayingMovies fallback triggered:', error);
    return FALLBACK_MOVIES;
  }
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

export interface TMDBPerson {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  popularity: number;
}

export async function getActorDetails(id: number): Promise<TMDBPerson | null> {
  try {
    return await fetchFromTMDB<TMDBPerson>(`/person/${id}`);
  } catch (error) {
    console.error(`TMDB getActorDetails error for ID ${id}:`, error);
    return null;
  }
}

export interface ActorMovieCredit {
  id: number;
  title: string;
  character: string;
  poster_path: string | null;
  release_date?: string;
  vote_average: number;
}

interface TMDBMovieCreditCast {
  id: number;
  title?: string;
  name?: string;
  character?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

export async function getActorMovieCredits(id: number): Promise<ActorMovieCredit[]> {
  try {
    const data = await fetchFromTMDB<{ cast: TMDBMovieCreditCast[] }>(`/person/${id}/movie_credits`);
    return (data.cast || [])
      .map(m => ({
        id: m.id,
        title: m.title || m.name || '',
        character: m.character || '',
        poster_path: m.poster_path,
        release_date: m.release_date || m.first_air_date || '',
        vote_average: m.vote_average || 0
      }))
      .sort((a, b) => {
        const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
        const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 10);
  } catch (error) {
    console.error(`TMDB getActorMovieCredits error for ID ${id}:`, error);
    return [];
  }
}


export async function getMovieDetails(id: number): Promise<MovieDetails> {
  try {
    const data = await fetchFromTMDB<MovieDetails>(`/movie/${id}`);
    return {
      ...data,
      genre_ids: data.genres?.map(g => g.id) || [],
    };
  } catch (error) {
    console.error(`TMDB getMovieDetails error for ID ${id}:`, error);
    // Mock fallback for E2E tests
    return {
      id,
      title: 'Movie Not Found',
      poster_path: '',
      backdrop_path: '',
      vote_average: 0,
      vote_count: 0,
      release_date: '',
      overview: 'Details for this movie are currently unavailable.',
      genre_ids: [],
      genres: [],
      runtime: 0,
      tagline: '',
      status: 'Unknown',
      budget: 0,
      revenue: 0,
      original_language: 'en',
      production_companies: [],
      popularity: 0
    };
  }
}

export async function getMovieCredits(id: number): Promise<{ cast: CastMember[]; crew: CrewMember[] }> {
  try {
    return await fetchFromTMDB(`/movie/${id}/credits`);
  } catch {
    return { cast: [], crew: [] };
  }
}

export async function getSimilarMovies(id: number): Promise<Movie[]> {
  try {
    const data = await fetchFromTMDB<TMDBResponse<TMDBMovie>>(`/movie/${id}/similar`);
    return data.results.map(formatMovieData);
  } catch {
    return [];
  }
}

export async function getRecommendations(id: number): Promise<Movie[]> {
  try {
    const data = await fetchFromTMDB<TMDBResponse<TMDBMovie>>(`/movie/${id}/recommendations`);
    return data.results.map(formatMovieData);
  } catch {
    return [];
  }
}

export async function getMovieById(id: number): Promise<Movie | null> {
  try {
    const data = await fetchFromTMDB<TMDBMovie>(`/movie/${id}`);
    return formatMovieData(data);
  } catch (error) {
    console.error(`TMDB getMovieById error for ID ${id}:`, error);
    return null;
  }
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
  try {
    const data = await fetchFromTMDB<{ results: VideoResult[] }>(`/movie/${id}/videos`, { language: 'en-US' });
    return (data.results || [])
      .filter(v => v.site === 'YouTube' && ['Trailer', 'Teaser'].includes(v.type))
      .sort((a, b) => {
        if (a.official !== b.official) return a.official ? -1 : 1;
        if (a.type !== b.type) return a.type === 'Trailer' ? -1 : 1;
        return 0;
      });
  } catch {
    return [];
  }
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
  try {
    const data = await fetchFromTMDB<{ results: TMDBReview[] }>(`/movie/${id}/reviews`);
    return data.results || [];
  } catch {
    return [];
  }
}

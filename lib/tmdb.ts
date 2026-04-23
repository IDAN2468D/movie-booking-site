const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids: number[];
}

export const GENRE_MAP: Record<string, number> = {
  // English keys (for CategoryTabs)
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  scifi: 878,
  thriller: 53,
  war: 10752,
  western: 37,
  series: 10770,
  // Hebrew keys (for FilterModal)
  'פעולה': 28,
  'הרפתקאות': 12,
  'אנימציה': 16,
  'קומדיה': 35,
  'פשע': 80,
  'דוקומנטרי': 99,
  'דרמה': 18,
  'משפחה': 10751,
  'פנטזיה': 14,
  'היסטוריה': 36,
  'אימה': 27,
  'מוזיקה': 10402,
  'מסתורין': 9648,
  'רומנטיקה': 10749,
  'מדע בדיוני': 878,
  'מתח': 53,
  'מלחמה': 10752,
  'מערבון': 37,
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500') => {
  if (!path) return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=300';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  genre_ids: number[];
}

function formatMovieData(movie: TMDBMovie): Movie {
  return {
    id: movie.id,
    title: movie.title || movie.name || 'Untitled',
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    vote_average: movie.vote_average || 0,
    release_date: movie.release_date || movie.first_air_date || '',
    overview: movie.overview || '',
    genre_ids: movie.genre_ids || [],
  };
}

export async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY || '',
    language: 'he-IL',
    ...params,
  });

  const connector = endpoint.includes('?') ? '&' : '?';
  const response = await fetch(`${BASE_URL}${endpoint}${connector}${queryParams}`);
  
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getPopularMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<{ results: TMDBMovie[] }>('/movie/popular');
  return (data.results || []).map(formatMovieData);
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<{ results: TMDBMovie[] }>('/movie/top_rated');
  return (data.results || []).map(formatMovieData);
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<{ results: TMDBMovie[] }>('/trending/movie/day');
  return (data.results || []).map(formatMovieData);
}

export async function getNowPlayingMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<{ results: TMDBMovie[] }>('/movie/now_playing');
  return (data.results || []).map(formatMovieData);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query) return [];
  const data = await fetchFromTMDB<{ results: TMDBMovie[] }>('/search/movie', {
    query: query,
    include_adult: 'false',
    page: '1'
  });
  return (data.results || []).map(formatMovieData);
}

export async function getMoviesByGenre(genreId: number): Promise<Movie[]> {
  const data = await fetchFromTMDB<{ results: TMDBMovie[] }>('/discover/movie', {
    with_genres: genreId.toString(),
    sort_by: 'popularity.desc'
  });
  return (data.results || []).map(formatMovieData);
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
  return {
    ...data,
    genre_ids: data.genres?.map(g => g.id) || [],
  };
}

export async function getMovieCredits(id: number): Promise<{ cast: CastMember[]; crew: CrewMember[] }> {
  return fetchFromTMDB(`/movie/${id}/credits`);
}

export async function getSimilarMovies(id: number): Promise<Movie[]> {
  const data = await fetchFromTMDB<{ results: TMDBMovie[] }>(`/movie/${id}/similar`);
  return (data.results || []).map(formatMovieData);
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

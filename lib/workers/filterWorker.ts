import { Movie, GENRE_MAP } from '../tmdb';

export type FilterWorkerRequest = {
  moviesPool: Movie[];
  activeCategory: string;
  genreMoviesCache: Record<string, Movie[]>;
  searchQuery: string;
  filters: { genre: string; rating: number; year: string };
  trendingMovies: Movie[];
  nowPlayingMovies: Movie[];
  topRatedMovies: Movie[];
};

export type FilterWorkerResponse = {
  filteredMovies: Movie[];
};

self.addEventListener('message', (event: MessageEvent<FilterWorkerRequest>) => {
  const {
    moviesPool,
    activeCategory,
    genreMoviesCache,
    searchQuery,
    filters,
    trendingMovies,
    nowPlayingMovies,
    topRatedMovies
  } = event.data;

  // Deduplicate movies
  const uniqueMovies = Array.from(new Map(moviesPool.map(m => [m.id, m])).values());
  let movies = uniqueMovies;

  // 1. Filter by Active Category (Tab)
  if (activeCategory !== 'all') {
    if (activeCategory === 'trending') movies = trendingMovies;
    else if (activeCategory === 'recent') movies = nowPlayingMovies;
    else if (activeCategory === 'top') movies = topRatedMovies;
    else if (genreMoviesCache[activeCategory]) {
      movies = genreMoviesCache[activeCategory];
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
      (movie.overview && movie.overview.toLowerCase().includes(q))
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

  // Send back to main thread
  self.postMessage({ filteredMovies: movies } as FilterWorkerResponse);
});

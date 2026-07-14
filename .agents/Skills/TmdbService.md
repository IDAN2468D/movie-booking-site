# Skill: TmdbMovieService
## Objective
Fetch and cache upcoming movie data from TMDB API.

## API Specification
- Base URL: https://api.themoviedb.org/3
- Endpoint: /movie/upcoming
- Logic: Implement server-side proxy to protect API keys.

## Data Contract (Zod Schema)
- movieId: z.number()
- title: z.string()
- releaseDate: z.string()
- posterPath: z.string().nullable()
- overview: z.string()

## Constraints
- Caching: Must implement a 24-hour cache layer (to prevent API quota drain).
- Performance: Must return data within < 200ms.
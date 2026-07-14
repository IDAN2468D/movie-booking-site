import { z } from 'zod';

export const UpcomingMovieSchema = z.object({
  movieId: z.number(),
  title: z.string(),
  releaseDate: z.string(),
  posterPath: z.string().nullable(),
  overview: z.string(),
});

export const UpcomingMoviesResponseSchema = z.array(UpcomingMovieSchema);

export type UpcomingMovie = z.infer<typeof UpcomingMovieSchema>;

export const VideoResultSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  site: z.string(),
  type: z.string(),
  official: z.boolean(),
});

export type ValidationVideoResult = z.infer<typeof VideoResultSchema>;

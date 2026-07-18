import { z } from 'zod';

export const AtmosphericProfileSchema = z.enum(['rain', 'fire', 'snow', 'cyber', 'none']);
export type AtmosphericProfile = z.infer<typeof AtmosphericProfileSchema>;

export const MovieAcousticMetadataSchema = z.object({
  profile: AtmosphericProfileSchema.default('none'),
  audioUrl: z.string().optional(),
});

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

import { describe, it, expect } from 'vitest';
import { UpcomingMovieSchema, UpcomingMoviesResponseSchema } from '../validations/movieValidation';

describe('Upcoming Movies Zod Schemas', () => {
  describe('UpcomingMovieSchema', () => {
    it('should validate a correct upcoming movie structure', () => {
      const validMovie = {
        movieId: 12345,
        title: "שומרי הגלקסיה בקרוב",
        releaseDate: "2026-08-15",
        posterPath: "/path_to_poster.jpg",
        overview: "תקציר של סרט עתידי מרתק בקולנוע.",
      };

      const result = UpcomingMovieSchema.safeParse(validMovie);
      expect(result.success).toBe(true);
    });

    it('should allow nullable posterPath', () => {
      const validMovie = {
        movieId: 12345,
        title: "סרט ללא פוסטר",
        releaseDate: "2026-09-01",
        posterPath: null,
        overview: "תקציר כלשהו.",
      };

      const result = UpcomingMovieSchema.safeParse(validMovie);
      expect(result.success).toBe(true);
    });

    it('should fail if critical fields are missing', () => {
      const invalidMovie = {
        movieId: 12345,
        title: "סרט חסר תקציר",
        releaseDate: "2026-09-01",
      };

      const result = UpcomingMovieSchema.safeParse(invalidMovie);
      expect(result.success).toBe(false);
    });
  });

  describe('UpcomingMoviesResponseSchema', () => {
    it('should validate array of upcoming movies', () => {
      const validList = [
        {
          movieId: 1,
          title: "סרט 1",
          releaseDate: "2026-07-20",
          posterPath: "/1.jpg",
          overview: "תקציר 1"
        },
        {
          movieId: 2,
          title: "סרט 2",
          releaseDate: "2026-07-25",
          posterPath: null,
          overview: "תקציר 2"
        }
      ];

      const result = UpcomingMoviesResponseSchema.safeParse(validList);
      expect(result.success).toBe(true);
    });
  });
});

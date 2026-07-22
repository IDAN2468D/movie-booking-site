import { describe, it, expect } from 'vitest';
import { UpcomingMovieSchema } from '../validations/movieValidation';

describe("Sprint 56: Liquid Glass 4.0 Coming Soon Trailer Overlay", () => {
  it('validates upcoming movie payload for trailer player', () => {
    const movieData = {
      movieId: 101,
      title: "אווטאר: אש ועפר",
      overview: "הפרק השלישי בסדרת אווטאר",
      releaseDate: "2026-12-18",
      posterPath: "/avatar3.jpg",
      voteAverage: 8.9,
    };

    const result = UpcomingMovieSchema.safeParse(movieData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("אווטאר: אש ועפר");
    }
  });

  it('rejects invalid upcoming movie data missing required fields', () => {
    const invalidData = {
      movieId: "not-a-number",
      title: "",
    };

    const result = UpcomingMovieSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

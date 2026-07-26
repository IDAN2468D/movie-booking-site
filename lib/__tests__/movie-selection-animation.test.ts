import { describe, it, expect } from 'vitest';
import { MovieSelectionAnimationInputSchema } from '@/lib/validations/movie-selection-animation.schema';
import { generateMovieAnimationPreset } from '@/lib/actions/movie-selection-animation.actions';

describe('Movie Selection Animation Unit Tests', () => {
  it('should validate valid input correctly', () => {
    const input = {
      movieId: 550,
      movieTitle: 'מועדון קרב',
      genres: ['Action', 'Drama'],
      rating: 8.8,
    };
    const parsed = MovieSelectionAnimationInputSchema.parse(input);
    expect(parsed.movieId).toBe(550);
    expect(parsed.movieTitle).toBe('מועדון קרב');
  });

  it('should generate action theme for action genre', async () => {
    const res = await generateMovieAnimationPreset({
      movieId: 101,
      movieTitle: 'מטריקס',
      genres: ['Action', 'Sci-Fi'],
      rating: 9.0,
    });
    expect(res.success).toBe(true);
    expect(res.data?.themeName).toBe('אקשן עוצמתי');
  });

  it('should generate sci-fi theme for sci-fi genre', async () => {
    const res = await generateMovieAnimationPreset({
      movieId: 102,
      movieTitle: 'אינטרסטלר',
      genres: ['Sci-Fi', 'Adventure'],
      rating: 8.6,
    });
    expect(res.success).toBe(true);
    expect(res.data?.themeName).toBe('הולוגרמה ניאון');
  });
});

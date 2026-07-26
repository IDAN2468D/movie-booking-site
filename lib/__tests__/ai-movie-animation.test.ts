import { describe, it, expect } from 'vitest';
import { AiMovieAnimationRequestSchema } from '@/lib/validations/ai-movie-animation.schema';
import { generateAiMovieAnimations } from '@/lib/actions/ai-movie-animation.actions';

describe('AI Movie Scene Image Animation Unit Tests', () => {
  it('should validate request schema correctly', () => {
    const input = {
      movieId: 550,
      movieTitle: 'מועדון קרב',
      overview: 'תקציר הסרט',
      stylePreset: 'cyberpunk' as const,
    };
    const parsed = AiMovieAnimationRequestSchema.parse(input);
    expect(parsed.movieId).toBe(550);
    expect(parsed.stylePreset).toBe('cyberpunk');
  });

  it('should generate animated frames for cyberpunk style', async () => {
    const res = await generateAiMovieAnimations({
      movieId: 550,
      movieTitle: 'מועדון קרב',
      stylePreset: 'cyberpunk',
    });
    expect(res.success).toBe(true);
    expect(res.data?.frames.length).toBeGreaterThanOrEqual(3);
    expect(res.data?.activeStyle).toBe('cyberpunk');
  });

  it('should include custom prompt frame when provided', async () => {
    const res = await generateAiMovieAnimations({
      movieId: 550,
      movieTitle: 'מועדון קרב',
      customPrompt: 'קרב ניאון קוסמי בחלל',
      stylePreset: 'fantasy',
    });
    expect(res.success).toBe(true);
    expect(res.data?.frames[0].title).toContain('יצירת AI חדשה');
  });
});

'use server';

import {
  MovieSelectionAnimationInputSchema,
  MovieSelectionAnimationInput,
  MovieSelectionAnimationPreset,
} from '@/lib/validations/movie-selection-animation.schema';

export type ActionResult<T = MovieSelectionAnimationPreset> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function generateMovieAnimationPreset(
  rawInput: MovieSelectionAnimationInput
): Promise<ActionResult<MovieSelectionAnimationPreset>> {
  try {
    const validated = MovieSelectionAnimationInputSchema.parse(rawInput);
    
    // Determine dynamic chromatic glow based on primary genre & rating
    const primaryGenre = validated.genres[0]?.toLowerCase() || '';
    let glowColor = 'rgba(255, 159, 10, 0.8)'; // default gold/amber
    let secondaryGlow = 'rgba(255, 20, 100, 0.6)';
    let themeName = 'קלאסיקה זהובה';

    if (primaryGenre.includes('action') || primaryGenre.includes('פעולה')) {
      glowColor = 'rgba(255, 59, 48, 0.9)';
      secondaryGlow = 'rgba(255, 149, 0, 0.7)';
      themeName = 'אקשן עוצמתי';
    } else if (primaryGenre.includes('sci-fi') || primaryGenre.includes('מדע בדיוני')) {
      glowColor = 'rgba(0, 229, 255, 0.9)';
      secondaryGlow = 'rgba(123, 31, 162, 0.7)';
      themeName = 'הולוגרמה ניאון';
    } else if (primaryGenre.includes('horror') || primaryGenre.includes('אימה')) {
      glowColor = 'rgba(176, 0, 32, 0.95)';
      secondaryGlow = 'rgba(74, 20, 140, 0.8)';
      themeName = 'אופל דרמטי';
    } else if (primaryGenre.includes('animation') || primaryGenre.includes('אנימציה')) {
      glowColor = 'rgba(255, 215, 0, 0.9)';
      secondaryGlow = 'rgba(0, 230, 118, 0.7)';
      themeName = 'קסם צבעוני';
    }

    const particleCount = Math.min(60, Math.max(20, Math.round(validated.rating * 5)));
    const hologramIntensity = Math.min(1.0, 0.5 + validated.rating * 0.05);

    return {
      success: true,
      data: {
        glowColor,
        secondaryGlow,
        rotationSpeed: 12,
        particleCount,
        hologramIntensity,
        themeName,
      },
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Invalid animation parameters';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

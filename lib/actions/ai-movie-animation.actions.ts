'use server';

import {
  AiMovieAnimationRequestSchema,
  AiMovieAnimationResponse,
} from '@/lib/validations/ai-movie-animation.schema';
import { getImageUrl } from '@/lib/tmdb';
import { z } from 'zod';

export type AiMovieAnimationInput = z.input<typeof AiMovieAnimationRequestSchema>;

export type ActionResult<T = AiMovieAnimationResponse> = {
  success: boolean;
  data?: T;
  error?: string;
};

const HEBREW_DICTIONARY: Record<string, string> = {
  'חללית': 'spaceship',
  'חלל': 'deep space',
  'ניאון': 'neon glowing',
  'סגולה': 'purple fuchsia',
  'סגול': 'purple',
  'כחול': 'cyan blue',
  'אדום': 'crimson red',
  'זהב': 'golden yellow',
  'ירוק': 'matrix green',
  'קרב': 'action battle',
  'רובוט': 'futuristic robot',
  'דרקון': 'mythical dragon',
  'עיר': 'cyberpunk city',
  'אש': 'flames fire',
  'מדע בדיוני': 'sci-fi futuristic',
  'גיבור': 'superhero',
  'אור': 'bright light',
};

function translatePrompt(text: string): string {
  let translated = text;
  Object.entries(HEBREW_DICTIONARY).forEach(([he, en]) => {
    translated = translated.replace(new RegExp(he, 'g'), en);
  });
  // Strip non-alphanumeric chars for safe URL query
  return translated.replace(/[^\w\s]/gi, '').trim() || 'cinematic movie scene';
}

const SCENE_PRESETS: Record<string, { filter: string; anim: 'zoom_in' | 'pan_right' | 'pulse_glow' | 'rotation_tilt' }> = {
  cyberpunk: {
    filter: 'hue-rotate(180deg) saturate(220%) contrast(120%) brightness(105%)',
    anim: 'zoom_in',
  },
  retro_film: {
    filter: 'sepia(60%) contrast(130%) brightness(95%) hue-rotate(-10deg)',
    anim: 'pan_right',
  },
  epic_glow: {
    filter: 'saturate(250%) contrast(115%) hue-rotate(330deg)',
    anim: 'pulse_glow',
  },
  noir: {
    filter: 'grayscale(100%) contrast(160%) brightness(85%)',
    anim: 'rotation_tilt',
  },
  fantasy: {
    filter: 'hue-rotate(240deg) saturate(190%) brightness(110%)',
    anim: 'zoom_in',
  },
};

export async function generateAiMovieAnimations(
  rawInput: AiMovieAnimationInput
): Promise<ActionResult<AiMovieAnimationResponse>> {
  try {
    const validated = AiMovieAnimationRequestSchema.parse(rawInput);
    const styleKey = validated.stylePreset || 'cyberpunk';
    const config = SCENE_PRESETS[styleKey] || SCENE_PRESETS.cyberpunk;

    const baseBackdrop = getImageUrl(validated.backdropPath || validated.posterPath || '', 'original');
    const basePoster = getImageUrl(validated.posterPath || validated.backdropPath || '', 'w500');

    const frames = [
      {
        id: `frame-${validated.movieId}-1`,
        title: `סצנת AI 1: הילת ${validated.movieTitle}`,
        imageUrl: baseBackdrop,
        cssFilter: config.filter,
        animationType: config.anim,
        description: `אנימציית AI קולנועית בסגנון ${styleKey} עם תנועה דינמית מותאמת לסרט.`,
      },
      {
        id: `frame-${validated.movieId}-2`,
        title: `סצנת AI 2: דרמה הולוגרפית`,
        imageUrl: basePoster,
        cssFilter: 'hue-rotate(40deg) saturate(180%) contrast(110%)',
        animationType: 'pan_right' as const,
        description: `עיבוד AI שני המציג תנועה אופקית מרהיבה עם השתקפויות קריסטליות.`,
      },
      {
        id: `frame-${validated.movieId}-3`,
        title: `סצנת AI 3: אנרגיה קוונטית`,
        imageUrl: baseBackdrop,
        cssFilter: 'hue-rotate(290deg) saturate(240%) brightness(115%)',
        animationType: 'pulse_glow' as const,
        description: `אנימציית AI המשלבת פעימות אור קוונטיות ואפקט עומק 3D.`,
      },
    ];

    if (validated.customPrompt && validated.customPrompt.trim()) {
      const EnglishPrompt = translatePrompt(validated.customPrompt);
      const query = encodeURIComponent(`cinematic 8k movie scene, ${EnglishPrompt}, photorealistic, dramatic cinematic lighting`);
      const seed = Math.floor(Math.random() * 100000);
      const generatedAiImageUrl = `https://image.pollinations.ai/prompt/${query}?width=1280&height=720&nologo=true&seed=${seed}`;

      frames.unshift({
        id: `frame-custom-${Date.now()}`,
        title: `יצירת AI חדשה: "${validated.customPrompt.slice(0, 22)}..."`,
        imageUrl: generatedAiImageUrl,
        cssFilter: 'none',
        animationType: 'zoom_in' as const,
        description: `תמונת AI שחוללה בזמן אמת מאפס על בסיס הפרומפט: "${validated.customPrompt}".`,
      });
    }

    return {
      success: true,
      data: {
        frames,
        activeStyle: styleKey,
      },
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'AI Animation generation failed';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

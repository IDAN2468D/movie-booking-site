'use server';

import { z } from 'zod';

const StemPresetSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  dialogue: z.number().min(0).max(100),
  score: z.number().min(0).max(100),
  bass: z.number().min(0).max(100),
  fx: z.number().min(0).max(100),
  subBassSweepHz: z.number().min(30).max(120),
  spatialSpread: z.number().min(0).max(100),
});

export type StemPreset = z.infer<typeof StemPresetSchema>;

const DEFAULT_PRESETS: StemPreset[] = [
  {
    id: 'director_dialogue',
    name: 'פוקוס דיאלוג הבמאי',
    description: 'הדגשת קולות שחקנים והפחתת מוזיקת רקע לבהירות מקסימלית',
    dialogue: 100,
    score: 35,
    bass: 40,
    fx: 50,
    subBassSweepHz: 45,
    spatialSpread: 60,
  },
  {
    id: 'orchestral_immersion',
    name: 'חוויה תזמורתית מרחבית',
    description: 'העצמת הפסקול הסימפוני עם פריסה מרחבית רחבה של 360 מעלות',
    dialogue: 60,
    score: 100,
    bass: 80,
    fx: 40,
    subBassSweepHz: 38,
    spatialSpread: 95,
  },
  {
    id: 'action_sub_bass',
    name: 'פיצוץ אקוסטי וסאב-באס 40Hz',
    description: 'הגברת תדרי באס נמוכים במיוחד לסצנות אקשן ומרדפים',
    dialogue: 75,
    score: 70,
    bass: 100,
    fx: 95,
    subBassSweepHz: 35,
    spatialSpread: 85,
  },
  {
    id: 'ambient_night',
    name: 'מצב לילה אקוסטי מרוכך',
    description: 'ריסון תדרים חדים לשמירה על חוויית שמע צלולה בווליום שקט',
    dialogue: 85,
    score: 40,
    bass: 30,
    fx: 30,
    subBassSweepHz: 50,
    spatialSpread: 40,
  },
];

export async function getStemPresetsAction() {
  try {
    return {
      success: true,
      data: DEFAULT_PRESETS,
    };
  } catch {
    return {
      success: false,
      error: 'Failed to retrieve stem presets',
    };
  }
}

export async function saveCustomStemPresetAction(data: unknown) {
  try {
    const parsed = StemPresetSchema.parse(data);
    return {
      success: true,
      data: parsed,
      message: `הפריסט "${parsed.name}" נשמר בהצלחה במערכת`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'שגיאה באימות הגדרות הפריסט',
    };
  }
}

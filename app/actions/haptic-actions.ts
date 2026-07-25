'use server';

import { HapticCalibrationSchema, HapticCalibrationInput } from '@/lib/validations/haptic';

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function calibrateHapticProfile(
  rawInput: HapticCalibrationInput
): Promise<ActionResult<{ resonanceScore: number; harmonicFrequency: number; message: string }>> {
  try {
    const validated = HapticCalibrationSchema.parse(rawInput);

    // Calculate simulated harmonic resonance metrics
    const harmonicFrequency = Math.round(validated.subBassFrequency * 1.618);
    const resonanceScore = Math.min(
      100,
      Math.round(validated.subBassFrequency * 0.5 + validated.hapticIntensity * 50)
    );

    let message = 'פרופיל התהודה כויל בהצלחה';
    if (validated.preset === 'sci-fi') {
      message = 'תדר תהודה קוונטי מופעל לחוויית מד"ב';
    } else if (validated.preset === 'action') {
      message = 'פרופיל אקשן בעוצמה גבוהה כויל לרטט אופטימלי';
    } else if (validated.preset === 'thriller') {
      message = 'דופק מתח הפטי מופעל לתדר סאב-באס נמוך';
    } else if (validated.preset === 'ambient') {
      message = 'מצב אווירה הטיפולי רגוע ופועם חלש';
    }

    return {
      success: true,
      data: {
        resonanceScore,
        harmonicFrequency,
        message,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'שגיאה בכיול פרופיל התהודה ההפטי',
    };
  }
}

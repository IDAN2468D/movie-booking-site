'use server';

import { SoundtrackSynthSchema, SoundtrackSynthInput, SoundtrackPresetResult } from '@/lib/validations/synth';

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function generateSoundtrackPresetAction(
  rawInput: SoundtrackSynthInput
): Promise<ActionResult<SoundtrackPresetResult>> {
  try {
    const validated = SoundtrackSynthSchema.parse(rawInput);

    const presets = {
      cinematic_minor: {
        presetTitle: 'פסקול קולנועי דרמטי (Cinematic Minor)',
        scaleName: 'סולם מינור הרמוני קלאסי',
        harmonicNotes: [220, 261.63, 329.63, 392, 440],
        baseFrequencyHz: 220,
        themeDescription: 'אווירה עמוקה, דרמטית ומתוחה המתאימה לסרטי מתח וסרטי איכות עלילתיים.',
      },
      sci_fi_major: {
        presetTitle: 'פסקול סייבר קוונטי (Sci-Fi Major)',
        scaleName: 'סולם פנטטוני עתידני',
        harmonicNotes: [261.63, 293.66, 329.63, 392, 440],
        baseFrequencyHz: 261.63,
        themeDescription: 'צלילים קוונטיים מנצנצים וארפג\'יו עתידני המציע תחושת מסע בחלל.',
      },
      dark_thriller: {
        presetTitle: 'פסקול מתח אפל (Dark Thriller)',
        scaleName: 'סולם כרומטי מונמך',
        harmonicNotes: [110, 130.81, 146.83, 164.81, 220],
        baseFrequencyHz: 110,
        themeDescription: 'באס נמוך ואטמוספירה קודרת עם פעימות דופק מהירות לבניית מתח גבוה.',
      },
      ambient_harmony: {
        presetTitle: 'פסקול אווירה הרמוני (Ambient Harmony)',
        scaleName: 'סולם מז\'ור מרגיע',
        harmonicNotes: [196, 246.94, 293.66, 349.23, 392],
        baseFrequencyHz: 196,
        themeDescription: 'הרמוניות אווירה רגועות המשרות תחושת מרחב ושלווה קולנועית.',
      },
    };

    const result = presets[validated.scale] || presets.cinematic_minor;

    return {
      success: true,
      data: result,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'שגיאה ביצירת הגדרות הפסקול הקוונטי',
    };
  }
}

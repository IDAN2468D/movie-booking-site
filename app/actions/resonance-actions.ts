'use server';

import { ResonanceStateSchema, ResonanceResult, ResonanceStateInput } from '@/lib/validations/resonance';

export async function calculateCineResonanceAction(input: ResonanceStateInput): Promise<{
  success: boolean;
  data?: ResonanceResult;
  error?: string;
}> {
  try {
    const validated = ResonanceStateSchema.parse(input);

    const isBass = validated.profileMode === 'bass';
    const isSurround = validated.profileMode === 'surround';

    const baseFreq = isBass ? 15000 : isSurround ? 8500 : 3500;
    const targetFrequency = Math.min(20000, Math.max(200, Math.round(baseFreq * (validated.resonanceLevel / 100))));

    let glowColor = 'rgba(56, 189, 248, 0.5)';
    if (validated.resonanceLevel > 80) {
      glowColor = 'rgba(168, 85, 247, 0.7)';
    } else if (validated.resonanceLevel > 40) {
      glowColor = 'rgba(14, 165, 233, 0.6)';
    }

    let statusHebrew = 'מוכן לכיול';
    let descriptionHebrew = 'הזז את סליידר התהודה כדי להתאים את צליל הקולנוע';

    if (validated.resonanceLevel >= 100) {
      statusHebrew = 'סנכרון תדרים מושלם';
      descriptionHebrew = 'תדרי השמע כויולו בדיוק מרבי לחוויה קולנועית עוצרת נשימה';
    } else if (validated.resonanceLevel > 50) {
      statusHebrew = 'מכייל תדרי שמע';
      descriptionHebrew = 'מבצע אופטימיזציה לתדרי הדיאלוג והבאס האקוסטי';
    }

    return {
      success: true,
      data: {
        resonanceLevel: validated.resonanceLevel,
        glowColor,
        targetFrequency,
        statusHebrew,
        descriptionHebrew,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'כיול תדר התהודה נכשל';
    return { success: false, error: msg };
  }
}

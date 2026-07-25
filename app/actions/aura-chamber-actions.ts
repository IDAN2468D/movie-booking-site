'use server';

import { BiometricAuraScanSchema, BiometricAuraScanInput, AuraProfileResult } from '@/lib/validations/aura-chamber';

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function analyzeBiometricAuraAction(
  rawInput: BiometricAuraScanInput
): Promise<ActionResult<AuraProfileResult>> {
  try {
    const validated = BiometricAuraScanSchema.parse(rawInput);

    // Compute deterministic aura profile based on pulse rate and scan metrics
    const auraOptions = [
      {
        auraType: 'cyan_quantum' as const,
        auraTitle: 'אורה קוונטית זוהרת (Cyan Quantum)',
        auraColor: '#00E5FF',
        energyFrequencyHz: 432,
        resonancePercentage: 96,
        moodDescription: 'תדר רגוע וממוקד. מתאים במיוחד לסרטי מדע בדיוני ומתח עתידני.',
        recommendedVibes: ['מדע בדיוני', 'סייברפאנק', 'מסע בזמן'],
      },
      {
        auraType: 'violet_stellar' as const,
        auraTitle: 'אורה סטלארית סגולה (Stellar Violet)',
        auraColor: '#A855F7',
        energyFrequencyHz: 528,
        resonancePercentage: 94,
        moodDescription: 'תדר יצירתי ועמוק. מתאים לדרמות קולנועיות ומבט מאחורי הקלעים.',
        recommendedVibes: ['דרמה פסיכולוגית', 'פנטזיה', 'סרטי אינדי'],
      },
      {
        auraType: 'solar_gold' as const,
        auraTitle: 'אורה סולארית מוזהבת (Solar Gold)',
        auraColor: '#F59E0B',
        energyFrequencyHz: 639,
        resonancePercentage: 98,
        moodDescription: 'תדר אנרגטי ועוצמתי. מתאים לסרטי אקשן, הרפתקאות ואירועי IMAX.',
        recommendedVibes: ['אקשן עוצמתי', 'הרפתקאות', 'בלוקבאסטר IMAX'],
      },
      {
        auraType: 'emerald_eco' as const,
        auraTitle: 'אורה אמרלד הרמונית (Emerald Eco)',
        auraColor: '#10B981',
        energyFrequencyHz: 741,
        resonancePercentage: 92,
        moodDescription: 'תדר הרמוני ומרגיע. מתאים לסרטי טבע, קומדיה וסרטי משפחה.',
        recommendedVibes: ['קומדיה', 'אנימציה', 'סרטי טבע ודוקו'],
      },
    ];

    const selectedIndex = Math.floor((validated.pulseRate + validated.holdDurationMs) % auraOptions.length);
    const result = auraOptions[selectedIndex];

    return {
      success: true,
      data: result,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'שגיאה בניתוח האורה הביומטרית',
    };
  }
}

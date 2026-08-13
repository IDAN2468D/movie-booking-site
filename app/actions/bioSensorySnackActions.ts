'use server';

import { z } from 'zod';

export const BioSensoryPairingSchema = z.object({
  snackId: z.string(),
  name: z.string(),
  matchScorePercentage: z.number().min(0).max(100),
  palateProfile: z.string(),
  estimatedPrepTimeSec: z.number(),
  gradientColors: z.string(),
  category: z.string(),
  priceILS: z.number(),
});

export type BioSensoryPairing = z.infer<typeof BioSensoryPairingSchema>;

const PALATE_CATALOG: BioSensoryPairing[] = [
  {
    snackId: 'snack_truffle_popcorn',
    name: 'פופקורן כמהין זהב & מלח ים אטלנטי',
    matchScorePercentage: 98,
    palateProfile: 'אומאמי עשיר, מתאים לסרטי אקשן ומתח גבוה',
    estimatedPrepTimeSec: 240,
    gradientColors: 'from-amber-500/20 to-yellow-600/20 border-amber-500/40',
    category: 'נשנושים',
    priceILS: 38,
  },
  {
    snackId: 'snack_dragon_drink',
    name: 'קוקטייל דרקון קיווי-ליים קואנטי',
    matchScorePercentage: 94,
    palateProfile: 'חומציות מרעננת, מאזנת קצב אדרנלין מוגבר',
    estimatedPrepTimeSec: 180,
    gradientColors: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40',
    category: 'משקאות',
    priceILS: 32,
  },
  {
    snackId: 'snack_choco_lava',
    name: 'סופלה שוקולד לוהט & גלידת ניטרוגן',
    matchScorePercentage: 91,
    palateProfile: 'מתוק עמוק וניגודיות טמפרטורה לסרטים רומנטיים',
    estimatedPrepTimeSec: 300,
    gradientColors: 'from-fuchsia-500/20 to-purple-600/20 border-fuchsia-500/40',
    category: 'קינוחים',
    priceILS: 42,
  },
];

export async function getBioSensorySnackPairingsAction(movieGenre = 'Sci-Fi') {
  try {
    return {
      success: true,
      data: PALATE_CATALOG,
      genre: movieGenre,
    };
  } catch {
    return {
      success: false,
      error: 'שגיאה בחישוב התאמת הטעמים הדיו-סנסורית',
    };
  }
}

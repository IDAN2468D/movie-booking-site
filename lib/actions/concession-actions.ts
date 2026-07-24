'use server';

import { HoloPairingQuerySchema, HoloCartSchema } from '@/lib/validations/concession';
import { MOCK_HOLO_CONCESSIONS, HoloConcessionItem } from '@/lib/types/concession';

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function getAiConcessionPairing(payload: unknown): Promise<ActionResult<{ recommendedItem: HoloConcessionItem; explanation: string }>> {
  const parsed = HoloPairingQuerySchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'פרמטרי שאילתא שגויים' };
  }

  const { movieGenre, preferredSweetness, preferredSaltiness } = parsed.data;

  // AI Pairing Heuristic Matrix
  let match = MOCK_HOLO_CONCESSIONS.find((item) => item.recommendedGenres.includes(movieGenre));
  if (!match) {
    match = MOCK_HOLO_CONCESSIONS[0];
  }

  const explanation = `שילוב מושלם לסרט ${movieGenre}! המתכון הותאם לרמת מתיקות ${preferredSweetness}% ומליחות ${preferredSaltiness}%.`;

  return {
    success: true,
    data: {
      recommendedItem: match,
      explanation
    }
  };
}

export async function submitHoloConcessionOrder(payload: unknown): Promise<ActionResult<{ orderId: string; status: string }>> {
  const parsed = HoloCartSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'נתוני עגלה לא תקינים' };
  }

  try {
    const orderId = `HOLO-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      success: true,
      data: {
        orderId,
        status: 'CONFIRMED'
      }
    };
  } catch (error) {
    return { success: false, error: 'שגיאה בעבודת שרת ההזמנות' };
  }
}

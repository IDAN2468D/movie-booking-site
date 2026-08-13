'use server';

import { z } from 'zod';

export const SplitPaymentCheckoutSchema = z.object({
  sessionId: z.string(),
  seatNumber: z.string(),
  paymentMethod: z.enum(['ILS_CREDIT', 'CRYPTO_USDC', 'CRYPTO_ETH']),
  amountILS: z.number().positive(),
});

export const SeatAllocationSchema = z.object({
  seatNumber: z.string(),
  assignedUser: z.string(),
  isPaid: z.boolean(),
  amountILS: z.number(),
  amountCryptoUSDC: z.number(),
});

export const SplitSessionSchema = z.object({
  sessionId: z.string(),
  movieTitle: z.string(),
  totalAmountILS: z.number(),
  remainingSeconds: z.number(),
  seatAllocations: z.array(SeatAllocationSchema),
});

export type SplitSession = z.infer<typeof SplitSessionSchema>;

const MOCK_SPLIT_SESSION: SplitSession = {
  sessionId: 'split_session_99',
  movieTitle: 'דילמת המד"ב 2026: אופק האירועים',
  totalAmountILS: 180,
  remainingSeconds: 600, // 10 minutes session lock
  seatAllocations: [
    { seatNumber: 'VIP-C1', assignedUser: 'אני (מארח)', isPaid: true, amountILS: 60, amountCryptoUSDC: 16.5 },
    { seatNumber: 'VIP-C2', assignedUser: 'תמר ש.', isPaid: false, amountILS: 60, amountCryptoUSDC: 16.5 },
    { seatNumber: 'VIP-C3', assignedUser: 'יונתן כ.', isPaid: false, amountILS: 60, amountCryptoUSDC: 16.5 },
  ],
};

export async function getSplitPaymentSessionAction(sessionId = 'split_session_99') {
  try {
    return {
      success: true,
      data: MOCK_SPLIT_SESSION,
    };
  } catch {
    return {
      success: false,
      error: 'Failed to retrieve split payment session',
    };
  }
}

export async function payIndividualSeatAction(input: unknown) {
  try {
    const { seatNumber, paymentMethod, amountILS } = SplitPaymentCheckoutSchema.parse(input);

    const seat = MOCK_SPLIT_SESSION.seatAllocations.find((s) => s.seatNumber === seatNumber);
    if (!seat) throw new Error('המושב המבוקש לא נמצא בסשן');

    seat.isPaid = true;

    return {
      success: true,
      data: MOCK_SPLIT_SESSION,
      message: `התשלום עבור מושב ${seatNumber} בסך ₪${amountILS} (${paymentMethod}) נקלט בהצלחה!`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'שגיאה בביצוע התשלום המפוצל',
    };
  }
}

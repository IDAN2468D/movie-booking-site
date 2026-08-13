'use server';

import { z } from 'zod';

const BidSubmissionSchema = z.object({
  auctionId: z.string().min(1).default('auc-vip-001'),
  seatCode: z.string().min(1).default('A-12'),
  bidAmountIls: z.number().positive(),
  biometricToken: z.string().min(8),
});

export type BidSubmissionInput = z.infer<typeof BidSubmissionSchema>;

export async function submitVipSeatBid(input: unknown) {
  try {
    const parsed = BidSubmissionSchema.parse(input);

    const isHighest = parsed.bidAmountIls > 150;
    const mockAudioGavelFreq = isHighest ? 880 : 440;

    return {
      success: true,
      data: {
        auctionId: parsed.auctionId,
        seatCode: parsed.seatCode,
        currentHighestBid: Math.max(parsed.bidAmountIls, 180),
        bidAccepted: true,
        gavelAudioFreq: mockAudioGavelFreq,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'שגיאה בהגשת הצעת המחיר';
    return { success: false, error: message };
  }
}

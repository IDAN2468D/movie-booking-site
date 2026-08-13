'use server';

import { z } from 'zod';

const AuctionBidSchema = z.object({
  auctionId: z.string(),
  bidAmount: z.number().min(1),
  bidderName: z.string().min(1),
});

const AuctionStateSchema = z.object({
  auctionId: z.string(),
  movieTitle: z.string(),
  seatNumber: z.string(),
  currentBid: z.number(),
  highestBidder: z.string(),
  secondsRemaining: z.number(),
  totalBidsCount: z.number(),
});

export type AuctionState = z.infer<typeof AuctionStateSchema>;

const ACTIVE_AUCTION: AuctionState = {
  auctionId: 'vip_auction_101',
  movieTitle: 'דילמת המד"ב 2026: אופק האירועים',
  seatNumber: 'VIP Prime Box #1',
  currentBid: 85,
  highestBidder: 'רועי ל.',
  secondsRemaining: 180,
  totalBidsCount: 7,
};

export async function getLiveAuctionStateAction(auctionId = 'vip_auction_101') {
  try {
    return {
      success: true,
      data: ACTIVE_AUCTION,
    };
  } catch {
    return {
      success: false,
      error: 'Failed to retrieve auction state',
    };
  }
}

export async function submitAuctionBidAction(input: unknown) {
  try {
    const { bidAmount, bidderName } = AuctionBidSchema.parse(input);

    if (bidAmount <= ACTIVE_AUCTION.currentBid) {
      throw new Error(`הצעת המחיר חייבת להיות גבוהה מ-₪${ACTIVE_AUCTION.currentBid}`);
    }

    ACTIVE_AUCTION.currentBid = bidAmount;
    ACTIVE_AUCTION.highestBidder = bidderName;
    ACTIVE_AUCTION.totalBidsCount += 1;

    return {
      success: true,
      data: ACTIVE_AUCTION,
      message: `הצעתך בסך ₪${bidAmount} התקבלה בהצלחה!`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'שגיאה בהגשת ההצעה למכרז',
    };
  }
}

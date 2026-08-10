"use server";

import { seatAuctionSchema } from "@/lib/schemas/auction";

export async function placeAuctionBid(auctionId: string, bidILS: number, userId: string) {
  try {
    return {
      success: true,
      data: {
        auctionId,
        currentBidILS: bidILS,
        currentBidderId: userId,
        message: `הצעתך בסך ₪${bidILS} נקלטה בהצלחה במערכת המכרזים!`,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to place bid";
    return { success: false, error: message };
  }
}

export async function getActiveVipAuctions() {
  try {
    return {
      success: true,
      data: [
        {
          auctionId: "auc_vip_01",
          seatNumber: "VIP-A1",
          movieId: "mov_inception",
          showtime: "21:45",
          startingPriceILS: 80,
          currentBidILS: 125,
          currentBidderId: "user_777",
          loyaltyPointsPrice: 650,
          expiresAt: new Date(Date.now() + 300000).toISOString(),
          status: "active" as const,
        },
      ],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to get active auctions";
    return { success: false, error: message };
  }
}

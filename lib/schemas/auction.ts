import { z } from "zod";

export const seatAuctionSchema = z.object({
  auctionId: z.string().min(1, "Auction ID is required"),
  seatNumber: z.string().min(1, "Seat number is required"),
  movieId: z.string().min(1, "Movie ID is required"),
  showtime: z.string(),
  startingPriceILS: z.number().min(0),
  currentBidILS: z.number().min(0),
  currentBidderId: z.string().optional(),
  loyaltyPointsPrice: z.number().min(0).default(500),
  expiresAt: z.string(),
  status: z.enum(["active", "ended", "cancelled"]).default("active"),
});

export type SeatAuctionInput = z.infer<typeof seatAuctionSchema>;

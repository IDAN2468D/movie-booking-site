import { z } from 'zod';

export const bidSchema = z.object({
  auctionId: z.string().min(1, 'Auction ID is required'),
  bidAmount: z.number().int().positive('Bid must be a positive integer'),
});

export const auctionSchema = z.object({
  movieId: z.string(),
  movieTitle: z.string(),
  moviePoster: z.string(),
  seatLabel: z.string(),
  startingBid: z.number().int().positive(),
  currentBid: z.number().int().positive(),
  highestBidder: z.string().optional().nullable(),
  highestBidderName: z.string().optional().nullable(),
  endTime: z.date(),
  status: z.enum(['active', 'completed', 'cancelled']).default('active'),
});

export type BidInput = z.infer<typeof bidSchema>;
export type AuctionInput = z.infer<typeof auctionSchema>;

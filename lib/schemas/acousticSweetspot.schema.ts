import { z } from "zod";

export const SweetSpotRatingEnum = z.enum([
  "EXCELLENT",
  "OPTIMAL",
  "GOOD",
  "SIDE_LEANING",
]);

export const SeatAcousticProfileSchema = z.object({
  seatId: z.string(),
  row: z.string(),
  number: z.number().int(),
  coordinates: z.object({
    x: z.number(), // -1 (far left) to 1 (far right)
    y: z.number(), // 0 (front row) to 1 (back row)
    z: z.number().default(0),
  }),
  speakerDistances: z.object({
    frontLeft: z.number(),
    frontCenter: z.number(),
    frontRight: z.number(),
    surroundLeft: z.number(),
    surroundRight: z.number(),
    subwoofer: z.number(),
  }),
  immersionScore: z.number().min(0).max(100),
  sweetSpotRating: SweetSpotRatingEnum,
  reverbTimeSec: z.number().min(0).max(3),
  bassClarityIndex: z.number().min(0).max(100),
  dialogueIntelligibility: z.number().min(0).max(100),
  recommendedPerk: z.string(),
});

export const HallAcousticQuerySchema = z.object({
  hallId: z.string().default("hall-dolby-atmos-1"),
  selectedSeatId: z.string().optional(),
});

export type SweetSpotRating = z.infer<typeof SweetSpotRatingEnum>;
export type SeatAcousticProfile = z.infer<typeof SeatAcousticProfileSchema>;
export type HallAcousticQuery = z.infer<typeof HallAcousticQuerySchema>;

export type HallAcousticData = {
  hallName: string;
  soundSystem: string;
  totalSeats: number;
  optimalSeatId: string;
  profiles: Record<string, SeatAcousticProfile>;
};

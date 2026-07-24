import { z } from 'zod';

export const BoxOfficePredictionInputSchema = z.object({
  movieId: z.string().min(1),
  stakeAmount: z.number().min(10).max(10000),
  predictionTarget: z.enum(['OVER_100M', 'OVER_250M', 'BLOCKBUSTER_500M']),
});

export const PredictionMarketResultSchema = z.object({
  stakeAmount: z.number(),
  predictedPayout: z.number(),
  multiplier: z.number(),
  marketConsensusPercent: z.number(),
  status: z.string(),
});

export type BoxOfficePredictionInput = z.infer<typeof BoxOfficePredictionInputSchema>;
export type PredictionMarketResult = z.infer<typeof PredictionMarketResultSchema>;

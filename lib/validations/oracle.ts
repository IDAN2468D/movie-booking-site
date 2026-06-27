import { z } from 'zod';

export const oracleBetSchema = z.object({
  predictionId: z.string().min(1, 'Prediction ID is required'),
  optionId: z.string().min(1, 'Option ID is required'),
  amount: z.number().int().positive('Bet amount must be positive'),
});

export type OracleBetInput = z.infer<typeof oracleBetSchema>;

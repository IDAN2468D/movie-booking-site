import { z } from 'zod';

export const SynapseStateSchema = z.object({
  alignmentPercentage: z.number().min(0).max(100),
  sensoryThreshold: z.enum(['low', 'medium', 'high']),
  frequencyHz: z.number().min(20).max(20000),
  selectedMovieTitle: z.string().optional(),
});

export type SynapseStateInput = z.infer<typeof SynapseStateSchema>;

export interface SynapseAlignmentResult {
  alignmentPercentage: number;
  refractionTunnelColor: string;
  targetFrequency: number;
  sensoryStatus: string;
}

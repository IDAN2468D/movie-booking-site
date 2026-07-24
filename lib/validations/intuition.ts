import { z } from 'zod';

export const IntuitionQuerySchema = z.object({
  query: z.string().min(2, 'השאילתה קצרה מדי').max(200),
});

export type IntuitionQuery = z.infer<typeof IntuitionQuerySchema>;

export interface IntuitionSearchResult {
  id: string;
  movieTitle: string;
  metaphorMatch: string;
  sentimentGradient: string;
  confidence: number;
}

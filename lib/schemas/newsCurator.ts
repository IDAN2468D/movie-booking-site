import { z } from 'zod';

export const NewsArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  source: z.string(),
  date: z.string(),
  url: z.string().optional(),
  sentiment: z.enum(['exciting', 'dramatic', 'rumor', 'neutral']).optional(),
  tags: z.array(z.string()).optional(),
});

export const NewsCuratorOutputSchema = z.object({
  news: z.array(NewsArticleSchema),
  lastUpdated: z.string(),
});

export type NewsArticle = z.infer<typeof NewsArticleSchema>;
export type NewsCuratorOutput = z.infer<typeof NewsCuratorOutputSchema>;

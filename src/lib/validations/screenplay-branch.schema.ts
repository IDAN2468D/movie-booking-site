import { z } from 'zod';

export const ScreenplayBranchInputSchema = z.object({
  movieId: z.string().min(1),
  movieTitle: z.string().min(1),
  genre: z.string().min(1),
  userChoicePrompt: z.string().min(1),
});

export const BranchOptionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  tone: z.string(),
  probabilityScore: z.number(),
});

export const ScreenplayResultSchema = z.object({
  currentNodeTitle: z.string(),
  storySnippet: z.string(),
  options: z.array(BranchOptionSchema),
});

export type ScreenplayBranchInput = z.infer<typeof ScreenplayBranchInputSchema>;
export type ScreenplayResult = z.infer<typeof ScreenplayResultSchema>;

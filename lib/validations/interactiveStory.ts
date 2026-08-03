import { z } from 'zod';

export const storyBranchingSchema = z.object({
  movieId: z.string().min(1),
  currentTimestamp: z.number().nonnegative(),
  sceneDescription: z.string().min(1),
  userChoices: z.array(z.string()).optional(),
});

export const groupPlannerSchema = z.object({
  groupId: z.string().min(1),
  members: z.array(z.object({
    id: z.string(),
    name: z.string(),
    genrePreferences: z.array(z.string()),
    dietaryRestrictions: z.array(z.string()).optional(),
  })),
  proposedBudgetPerPerson: z.number().positive(),
});

export type StoryBranchingPayload = z.infer<typeof storyBranchingSchema>;
export type GroupPlannerPayload = z.infer<typeof groupPlannerSchema>;

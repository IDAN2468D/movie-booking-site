import { z } from "zod";

export const storyBranchSchema = z.object({
  nodeId: z.string().min(1, "Node ID is required"),
  movieId: z.string().min(1, "Movie ID is required"),
  title: z.string().min(1, "Title is required"),
  choiceText: z.string(),
  consequenceSummary: z.string(),
  parentId: z.string().nullable().optional(),
  childNodeIds: z.array(z.string()).default([]),
  aiConfidenceScore: z.number().min(0).max(100).default(90),
});

export type StoryBranchInput = z.infer<typeof storyBranchSchema>;

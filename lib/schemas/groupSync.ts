import { z } from "zod";

export const groupMatchSchema = z.object({
  groupId: z.string().min(1, "Group ID is required"),
  groupName: z.string().min(2, "Group name must be at least 2 characters"),
  members: z.array(
    z.object({
      userId: z.string(),
      userName: z.string(),
      preferredGenres: z.array(z.string()),
      dislikedGenres: z.array(z.string()).optional(),
    })
  ).min(1, "At least one member is required"),
  targetMovieId: z.string().optional(),
  compatibilityScore: z.number().min(0).max(100).optional().default(85),
});

export type GroupMatchInput = z.input<typeof groupMatchSchema>;
export type GroupMatchOutput = z.infer<typeof groupMatchSchema>;

import { z } from "zod";

export const TicketSplinterRequestSchema = z.object({
  parentTicketId: z.string().min(1, "Parent Ticket ID is required"),
  count: z.number().int().min(1).max(4, "Maximum 4 splinters allowed per ticket"),
});

export type TicketSplinterRequest = z.infer<typeof TicketSplinterRequestSchema>;

export const TicketSplinterResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.object({
    splinterId: z.string(),
    claimToken: z.string(),
  })).optional(),
  error: z.string().optional()
});

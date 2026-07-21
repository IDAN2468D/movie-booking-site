import { z } from "zod";

export const TrailerTriviaItemSchema = z.object({
  timeInSeconds: z.number().describe("The exact second the trivia should appear"),
  text: z.string().describe("Short trivia text in Hebrew, max 100 characters"),
});

export const TrailerTriviaResponseSchema = z.array(TrailerTriviaItemSchema);

export type TrailerTriviaItem = z.infer<typeof TrailerTriviaItemSchema>;

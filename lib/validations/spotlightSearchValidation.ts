import { z } from "zod";

export const SpotlightSearchQuerySchema = z.object({
  query: z.string().min(1, "שאילתת חיפוש לא יכולה להיות ריקה").max(100, "שאילתת חיפוש ארוכה מדי"),
  limit: z.number().int().min(1).max(20).optional().default(8),
  filterType: z.enum(["all", "movies", "actors", "genres"]).optional().default("all"),
});

export type SpotlightSearchQueryInput = z.input<typeof SpotlightSearchQuerySchema>;
export type SpotlightSearchQueryParsed = z.infer<typeof SpotlightSearchQuerySchema>;

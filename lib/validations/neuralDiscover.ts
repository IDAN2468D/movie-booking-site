import { z } from "zod";

export const neuralSchema = z.object({
  searchQuery: z.string().optional(),
  mood: z.string().optional(),
  directorMode: z.string().optional(),
  sensoryFocus: z.string().optional(),
  dosage: z.string().optional(),
  tension: z
    .number()
    .min(0, "מדד המתח או הקצב שהוזן אינו חוקי")
    .max(100, "מדד המתח או הקצב שהוזן אינו חוקי"),
  pace: z
    .number()
    .min(0, "מדד המתח או הקצב שהוזן אינו חוקי")
    .max(100, "מדד המתח או הקצב שהוזן אינו חוקי"),
}).refine(
  (data) => (data.searchQuery && data.searchQuery.length >= 2) || !!data.mood,
  {
    message: "חיפוש חופשי חייב להכיל לפחות 2 תווים או בחירת קטגוריית מצב רוח",
    path: ["searchQuery"],
  }
);

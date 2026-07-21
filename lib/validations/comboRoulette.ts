import { z } from "zod";

export const DynamicComboSchema = z.object({
  name: z.string().describe("The name of the combo package in Hebrew"),
  description: z.string().describe("A persuasive rationale for the combo in Hebrew, max 100 characters"),
  discountPercent: z.number().min(5).max(30).describe("The discount percentage between 5 and 30"),
  items: z.array(z.number()).describe("An array of 2 or 3 product IDs included in the combo"),
});

export type DynamicCombo = z.infer<typeof DynamicComboSchema>;

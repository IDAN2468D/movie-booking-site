import { z } from "zod";

export const BioConcessionSchema = z.object({
  energyVibe: z.enum(["Chill", "Hyper", "Cinematic", "Focused", "Ethereal"]),
  preferredCategory: z.enum(["Popcorn", "Beverage", "Gourmet", "Combo"]),
  subBassSensitivity: z.number().min(0).max(100),
});

export type BioConcessionInput = z.infer<typeof BioConcessionSchema>;

import { z } from "zod";

export const AuraColorSchema = z.object({
  primary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid Hex"),
  secondary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid Hex"),
  accent: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid Hex"),
});

export const CinematicAuraSchema = z.object({
  mood: z.string().describe("Short 1-2 words description of the cinematic mood, e.g. 'Cyberpunk Thrill'"),
  colors: AuraColorSchema,
  intensity: z.number().min(0).max(100).describe("Intensity of the aura from 0 to 100"),
  description: z.string().describe("A poetic 1-sentence description of the user's cinematic energy"),
});

export type CinematicAura = z.infer<typeof CinematicAuraSchema>;

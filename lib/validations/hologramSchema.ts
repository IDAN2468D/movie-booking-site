import { z } from "zod";

export const HologramThemeSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
  hologramTextureType: z.enum(["crystal", "liquid", "cyber", "plasma"]),
  passName: z.string().max(50),
});

export type HologramTheme = z.infer<typeof HologramThemeSchema>;

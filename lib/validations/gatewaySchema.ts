import { z } from "zod";

export const OmniBoxStateSchema = z.enum(["IDLE", "ACTIVE", "PROCESSING", "RESOLVED"]);

export const HeroSectionSchema = z.object({
  title: z.string().min(1, "כותרת היא שדה חובה"),
  subtitle: z.string(),
  backgroundMedia: z.object({
    type: z.enum(["video", "image"]),
    src: z.string().url("כתובת המדיה אינה תקינה"),
    blurIntensity: z.number().min(0).max(100).default(20),
  }),
  omniBox: z.object({
    placeholderText: z.string(),
    aiPulseColor: z.string().default("#8A5CFF"),
    currentState: OmniBoxStateSchema.default("IDLE"),
  }),
});

export type HeroSectionData = z.infer<typeof HeroSectionSchema>;

export const GatewayFeatureSchema = z.object({
  id: z.string().uuid("מזהה תכונה אינו תקין"),
  featureId: z.enum(["NEURAL_DISCOVERY", "KINETIC_TICKET", "OMNI_SEARCH", "OTHER"]),
  title: z.string().min(1, "שם התכונה הוא שדה חובה"),
  description: z.string(),
  iconSvg: z.string(),
  visualAssets: z.array(z.string().url()).optional(),
  callToAction: z.object({
    label: z.string(),
    href: z.string(),
  }).optional(),
  glassEffectSettings: z.object({
    backdropBlur: z.string().default("blur-md"),
    borderOpacity: z.number().default(0.1),
  }),
});

export const FeaturesGridSchema = z.array(GatewayFeatureSchema).min(1, "חובה לספק לפחות תכונה אחת");

export type GatewayFeatureData = z.infer<typeof GatewayFeatureSchema>;

export const OmniRequestSchema = z.object({
  query: z.string().min(1, "שאילתת החיפוש אינה יכולה להיות ריקה"),
  context: z.object({
    deviceType: z.string(),
    localTime: z.string(),
  }).optional(),
});

export type OmniRequest = z.infer<typeof OmniRequestSchema>;

export const OmniResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    intent: z.enum(["SEARCH_MOVIE", "MOOD_DISCOVERY", "TICKET_RETRIEVAL"]),
    redirectUrl: z.string().optional(),
    payload: z.any(),
  }).optional(),
  error: z.string().optional(),
});

export type OmniResponse = z.infer<typeof OmniResponseSchema>;

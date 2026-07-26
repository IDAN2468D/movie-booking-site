import { z } from 'zod';

export const ScreenSaverSettingsSchema = z.object({
  inactivityTimeout: z.number().min(0).max(600000), // ms (0 = disabled)
  soundEnabled: z.boolean().default(true),
  soundVolume: z.number().min(0).max(1).default(0.08),
  themeMode: z.enum(['glass', 'cyber', 'minimal']).default('glass'),
  autoSlideInterval: z.number().min(3000).max(30000).default(6000),
});

export type ScreenSaverSettings = z.infer<typeof ScreenSaverSettingsSchema>;

export const ScreenSaverMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  year: z.string(),
  genres: z.array(z.string()),
  backdropUrl: z.string(),
  posterUrl: z.string().optional(),
});

export type ScreenSaverMovie = z.infer<typeof ScreenSaverMovieSchema>;

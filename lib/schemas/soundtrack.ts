import { z } from 'zod';

export const SoundtrackItemSchema = z.object({
  id: z.string(),
  movieId: z.number(),
  movieTitle: z.string(),
  songTitle: z.string(),
  artist: z.string(),
  album: z.string().optional(),
  year: z.number().optional(),
  audioUrl: z.string().optional(),
  coverImage: z.string().optional(),
  duration: z.string().optional(),
  genre: z.string().optional(),
});

export const SoundtrackCatalogSchema = z.object({
  soundtracks: z.array(SoundtrackItemSchema),
  totalCount: z.number().optional(),
});

export type SoundtrackItem = z.infer<typeof SoundtrackItemSchema>;
export type SoundtrackCatalog = z.infer<typeof SoundtrackCatalogSchema>;

import { z } from 'zod';

export const memoryReflectionSchema = z.object({
  capsuleId: z.string(),
  rating: z.number().min(1).max(5).default(5),
  personalNote: z.string().max(500).default(''),
  companions: z.string().max(100).optional(),
  favoriteScene: z.string().max(200).optional(),
  emotionalVibe: z.string().default('התרגשות'),
});

export const memoryCapsuleItemSchema = z.object({
  id: z.string(),
  movieId: z.string(),
  movieTitle: z.string(),
  posterUrl: z.string(),
  date: z.string(),
  timestamp: z.number(),
  hall: z.string().default('VIP Dolby Atmos'),
  seats: z.array(z.string()).default([]),
  genre: z.string().default('קולנוע'),
  iconicQuote: z.string(),
  characterName: z.string().optional(),
  decayLevel: z.number().min(0).max(1).default(0.1),
  rarityTier: z.enum(['common', 'rare', 'legendary', 'mythic']).default('rare'),
  hmacSignature: z.string().default(''),
  reflection: memoryReflectionSchema.optional(),
  isCustom: z.boolean().default(false),
});

export type MemoryReflection = z.infer<typeof memoryReflectionSchema>;
export type MemoryCapsuleItem = z.infer<typeof memoryCapsuleItemSchema>;

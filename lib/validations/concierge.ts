import { z } from 'zod';

export const SentimentVectorSchema = z.object({
  mood: z.string().min(1, 'Mood string must not be empty'),
  intensity: z.number().min(0).max(1, 'Intensity must be a value between 0 and 1'),
});

export const PromptMessageSchema = z.object({
  role: z.enum(['user', 'critic', 'system']),
  content: z.string().min(1, 'Message content cannot be empty'),
});

export const PromptPayloadSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty'),
  systemPrompt: z.string().optional(),
  history: z.array(PromptMessageSchema).default([]),
  userMood: SentimentVectorSchema.default({ mood: 'neutral', intensity: 0.5 }),
  context: z.object({
    movieId: z.string().optional(),
    currentMood: z.string().optional(),
    activeRoute: z.string().optional(),
  }).optional(),
});

export const PRDStructureSchema = z.object({
  objective: z.string().min(10, 'Objective must specify intent clearly'),
  targetPersona: z.array(z.string()).min(1, 'At least one target persona is required'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is required'),
});

export const SpecContractSchema = z.object({
  resultPattern: z.enum(['UnifiedResultPattern']),
  maxLoc: z.number().max(200, 'All files must adhere to the sub-200 LOC limit'),
  interfaces: z.array(z.string()).min(1, 'Define at least one structural interface'),
});

export type PromptPayload = z.infer<typeof PromptPayloadSchema>;
export type PRDStructure = z.infer<typeof PRDStructureSchema>;
export type SpecContract = z.infer<typeof SpecContractSchema>;
export type SentimentVector = z.infer<typeof SentimentVectorSchema>;

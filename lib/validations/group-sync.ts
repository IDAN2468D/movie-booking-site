import { z } from 'zod';

export const ParticipantSchema = z.object({
  id: z.string(),
  nameHebrew: z.string(),
  auraColor: z.string(),
  panX: z.number().min(-1).max(1),
  isSynced: z.boolean(),
});

export const GroupSyncSchema = z.object({
  partyId: z.string(),
  participants: z.array(ParticipantSchema),
  resonanceScore: z.number().min(0).max(100),
});

export type ParticipantInput = z.infer<typeof ParticipantSchema>;
export type GroupSyncInput = z.infer<typeof GroupSyncSchema>;

export interface GroupSyncResult {
  resonanceScore: number;
  harmonicChordFreq: number;
  statusHebrew: string;
  descriptionHebrew: string;
  mergedGlowColor: string;
  syncedCount: number;
}

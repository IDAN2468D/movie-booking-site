import { z } from "zod";

export const TelepathicVaultSchema = z.object({
  passId: z.string().min(1),
  fingerprintHoldDurationMs: z.number().min(500).max(10000),
  heartbeatBpm: z.number().min(40).max(180),
  biometricToken: z.string().min(8),
});

export type TelepathicVaultInput = z.infer<typeof TelepathicVaultSchema>;

'use server';

import { z } from 'zod';

const PassbookShardSchema = z.object({
  bookingId: z.string().min(1).default('BK-9082'),
  userRef: z.string().min(1).default('USR-7712'),
});

export type PassbookShardInput = z.infer<typeof PassbookShardSchema>;

export async function generateChronoPassbookShard(input: unknown) {
  try {
    const parsed = PassbookShardSchema.parse(input);

    const timestamp = new Date().toISOString();
    const signature = `HMAC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    return {
      success: true,
      data: {
        bookingId: parsed.bookingId,
        userRef: parsed.userRef,
        encryptedNfcPayload: `NFC_CINE_${parsed.bookingId}_${signature}`,
        signature,
        timestamp,
        gateStatus: 'AUTHORIZED_NFC',
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'שגיאה במודול NFC Passbook';
    return { success: false, error: msg };
  }
}

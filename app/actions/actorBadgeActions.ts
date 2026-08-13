'use server';

import { z } from 'zod';
import crypto from 'crypto';

const ActorBadgeInputSchema = z.object({
  actorName: z.string().min(1).default('טימותי שאלאמה'),
  userId: z.string().default('user_guest_88'),
});

export type ActorBadgeInput = z.infer<typeof ActorBadgeInputSchema>;

export interface ActorBadgeShard {
  actorName: string;
  badgeLevel: string;
  loyaltyPoints: number;
  encryptedShardHash: string;
  issuedAt: string;
}

export async function generateActorFanBadge(input: unknown) {
  try {
    const parsed = ActorBadgeInputSchema.parse(input);
    const secret = process.env.NEXTAUTH_SECRET || 'cinepulse_secret_shard_key_2026';

    const rawPayload = `${parsed.actorName}:${parsed.userId}:${Date.now()}`;
    const encryptedShardHash = crypto
      .createHmac('sha256', secret)
      .update(rawPayload)
      .digest('hex');

    const badgeShard: ActorBadgeShard = {
      actorName: parsed.actorName,
      badgeLevel: 'סופר-מעריץ היפר-סנסורי',
      loyaltyPoints: 950,
      encryptedShardHash: `CP-ACTOR-${encryptedShardHash.slice(0, 16).toUpperCase()}`,
      issuedAt: new Date().toLocaleDateString('he-IL'),
    };

    return {
      success: true,
      data: badgeShard,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'שגיאה ביצירת תג המעריצים';
    return { success: false, error: errorMsg };
  }
}

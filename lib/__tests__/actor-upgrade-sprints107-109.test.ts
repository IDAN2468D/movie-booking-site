import { describe, it, expect } from 'vitest';
import { fetchActorEmotionMetrics } from '@/app/actions/actorEmotionActions';
import { generateActorFanBadge } from '@/app/actions/actorBadgeActions';

describe('Actor Upgrade Suite (Sprints 107-109)', () => {
  it('Sprint 107: fetchActorEmotionMetrics returns valid emotion graph metrics', async () => {
    const res = await fetchActorEmotionMetrics({
      actorName: 'טימותי שאלאמה',
      filmography: ['חולית: חלק 2', 'וונקה'],
    });

    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    if (res.data) {
      expect(res.data.actorName).toBe('טימותי שאלאמה');
      expect(res.data.metrics.length).toBeGreaterThan(0);
      expect(res.data.metrics[0]).toHaveProperty('intensity');
      expect(res.data.metrics[0]).toHaveProperty('dominantTone');
    }
  });

  it('Sprint 109: generateActorFanBadge returns encrypted HMAC-SHA256 badge shard', async () => {
    const res = await generateActorFanBadge({
      actorName: 'טימותי שאלאמה',
      userId: 'user_test_99',
    });

    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    if (res.data) {
      expect(res.data.actorName).toBe('טימותי שאלאמה');
      expect(res.data.badgeLevel).toContain('מעריץ');
      expect(res.data.encryptedShardHash).toContain('CP-ACTOR-');
      expect(res.data.loyaltyPoints).toBeGreaterThan(0);
    }
  });
});

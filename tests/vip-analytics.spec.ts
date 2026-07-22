import { describe, it, expect } from 'vitest';
import { VipAnalyticsSchema } from '../lib/validations/vipAnalytics';
import { getVipAnalyticsAction } from '../app/actions/getVipAnalyticsActions';

describe('Sprint 55: VIP Cine-Pulse Analytics Dashboard', () => {
  it('validates VIP analytics schema correctly', () => {
    const valid = VipAnalyticsSchema.safeParse({
      userId: 'user-vip-101',
      timeframe: '90d',
    });
    expect(valid.success).toBe(true);

    const invalid = VipAnalyticsSchema.safeParse({
      userId: '',
    });
    expect(invalid.success).toBe(false);
  });

  it('returns valid VIP metrics and genre affinity payload', async () => {
    const res = await getVipAnalyticsAction({
      userId: 'user-vip-101',
      timeframe: '90d',
    });

    expect(res.success).toBe(true);
    expect(res.data?.vipTier).toContain('Platinum');
    expect(res.data?.genreAffinity.length).toBeGreaterThan(0);
    expect(res.data?.totalPulsePoints).toBeGreaterThan(0);
  });
});

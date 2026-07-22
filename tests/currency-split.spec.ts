import { describe, it, expect } from 'vitest';
import { CurrencySplitSchema } from '../lib/validations/currencySplit';
import { getCurrencyRatesAction } from '../app/actions/getCurrencyRatesActions';

describe('Sprint 54: Native Multi-Currency Lock & Split-Pay', () => {
  it('validates currency split ratio schema correctly', () => {
    const valid = CurrencySplitSchema.safeParse({
      totalAmountIls: 200,
      fiatRatio: 0.5,
      cryptoRatio: 0.3,
      vipPointsRatio: 0.2,
      targetCurrency: 'ILS',
    });
    expect(valid.success).toBe(true);

    const invalid = CurrencySplitSchema.safeParse({
      totalAmountIls: -50,
      fiatRatio: 1.5, // ratio exceeds 1.0
    });
    expect(invalid.success).toBe(false);
  });

  it('calculates exact currency split breakdown and rate lock time', async () => {
    const res = await getCurrencyRatesAction({
      totalAmountIls: 200,
      fiatRatio: 0.5,
      cryptoRatio: 0.3,
      vipPointsRatio: 0.2,
      targetCurrency: 'ILS',
    });

    expect(res.success).toBe(true);
    expect(res.data?.fiatAmount).toBe(100);
    expect(res.data?.cryptoBtcAmount).toBeGreaterThan(0);
    expect(res.data?.vipPointsNeeded).toBe(80);
    expect(res.data?.lockExpiresAt).toBeDefined();
  });
});

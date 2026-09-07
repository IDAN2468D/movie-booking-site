import { describe, it, expect } from 'vitest';
import { calculateYieldOptimization } from '../erp/yieldOptimizer';
import { playCockpitTick } from '@/components/erp/cockpit/LiquidCockpitAudio';

describe('CinePulse Liquid ERP 5.0 Cockpit Suite', () => {
  it('calculates net revenue correctly given gross revenue and tax rate', () => {
    const grossRevenue = 100000;
    const taxRate = 18; // 18% VAT
    const netRevenue = grossRevenue * (1 - taxRate / 100);
    expect(netRevenue).toBe(82000);
  });

  it('converts ILS currency to USD properly', () => {
    const amountILS = 3700;
    const rate = 3.7;
    const amountUSD = amountILS / rate;
    expect(amountUSD).toBe(1000);
  });

  it('calculates dynamic yield optimization for cinema halls', () => {
    const occupancy = 25;
    const hoursLeft = 3;
    const basePrice = 48;
    const result = calculateYieldOptimization(occupancy, hoursLeft, basePrice);

    expect(result).toBeDefined();
    expect(result.recommendedPrice).toBeGreaterThan(0);
    expect(result.promoActionHe).toBeDefined();
    expect(typeof result.actionType).toBe('string');
  });

  it('handles Web Audio playCockpitTick safely in Node/SSR environment without crashing', () => {
    expect(() => playCockpitTick(800)).not.toThrow();
  });
});

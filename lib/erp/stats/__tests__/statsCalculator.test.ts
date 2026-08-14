import { describe, it, expect } from 'vitest';
import { cleanCurrencyAmount, normalizeHebrewTitle, parseDateToIso, normalizeRawOrder } from '../normalizer';
import { parseCsvOrPastedText } from '../csvParser';
import { calculateSiteStats } from '../metricsCalculator';
import { detectAnomalies } from '../anomalyDetector';
import { generateHebrewMarkdownReport } from '../markdownReportGenerator';
import { RawOrderInput } from '../types';

describe('Movie Site Stats Domain Suite', () => {
  it('cleans currency strings and symbols accurately', () => {
    expect(cleanCurrencyAmount('150 ₪')).toBe(150);
    expect(cleanCurrencyAmount('₪1,250.50')).toBe(1250.5);
    expect(cleanCurrencyAmount('250 ש"ח')).toBe(250);
    expect(cleanCurrencyAmount('80 NIS')).toBe(80);
    expect(cleanCurrencyAmount('$45.00')).toBe(45);
    expect(cleanCurrencyAmount(320)).toBe(320);
    expect(cleanCurrencyAmount(null)).toBe(0);
  });

  it('preserves Hebrew sofit letters verbatim in movie titles', () => {
    const titleWithSofit = 'סופרמן וגלדיאטור: עולם מושלם (סרט אקשן)';
    const normalized = normalizeHebrewTitle(titleWithSofit);
    expect(normalized).toBe(titleWithSofit);
    expect(normalized.includes('ן')).toBe(true);
    expect(normalized.includes('ם')).toBe(true);
    expect(normalized.includes('ץ')).toBe(false);
  });

  it('parses Israeli DD/MM/YYYY, ISO, and GA4 date formats', () => {
    expect(parseDateToIso('15/08/2025').iso).toBe('2025-08-15');
    expect(parseDateToIso('05-04-2025').iso).toBe('2025-04-05');
    expect(parseDateToIso('2025-12-31').iso).toBe('2025-12-31');
    expect(parseDateToIso('20250814').iso).toBe('2025-08-14');
  });

  it('parses CSV and tab-separated text with Hebrew and GA4 headers', () => {
    const csvContent = `תאריך,שם סרט,סכום,לקוח,סטטוס
15/08/2025,חולית: חלק שני,₪120,user1@test.com,מאושר
16/08/2025,דדפול & וולברין,₪240,user2@test.com,מאושר
16/08/2025,חולית: חלק שני,₪60,user1@test.com,מומש
17/08/2025,אופנהיימר,₪80,user3@test.com,בוטל`;

    const parsed = parseCsvOrPastedText(csvContent);
    expect(parsed.length).toBe(4);
    expect(parsed[0].movieTitle).toBe('חולית: חלק שני');
    expect(parsed[0].amount).toBe('₪120');
    expect(parsed[3].status).toBe('בוטל');
  });

  it('computes exact 18% Israeli VAT, AOV, Top Movies, and Retention', () => {
    const rawOrders: RawOrderInput[] = [
      { date: '2025-08-01', movieTitle: 'אוואטר 3', amount: 118, customerEmail: 'idan@cine.com', status: 'completed', quantity: 2 },
      { date: '2025-08-01', movieTitle: 'אוואטר 3', amount: 118, customerEmail: 'idan@cine.com', status: 'completed', quantity: 2 },
      { date: '2025-08-02', movieTitle: 'גלדיאטור 2', amount: 354, customerEmail: 'yossi@cine.com', status: 'completed', quantity: 3 },
      { date: '2025-08-03', movieTitle: 'סופרמן', amount: 100, customerEmail: 'guest@cine.com', status: 'cancelled', quantity: 1 },
    ];

    const normalized = rawOrders.map((r, i) => normalizeRawOrder(r, i, 0.18));
    const stats = calculateSiteStats(normalized, 0.18);

    expect(stats.totalCompletedOrders).toBe(3);
    expect(stats.totalCancelledOrders).toBe(1);
    expect(stats.totalTransactions).toBe(4);
    expect(stats.totalGrossRevenue).toBe(590); // 118 + 118 + 354
    expect(stats.totalNetRevenue).toBe(500); // 590 / 1.18 = 500
    expect(stats.averageOrderValue).toBe(196.67); // 590 / 3
    expect(stats.cancellationRate).toBe(25); // 1 / 4 = 25%

    // Top Movies
    expect(stats.topMoviesByRevenue[0].movieTitle).toBe('גלדיאטור 2');
    expect(stats.topMoviesByRevenue[0].grossRevenue).toBe(354);
    expect(stats.topMoviesByOrders[0].movieTitle).toBe('אוואטר 3');
    expect(stats.topMoviesByOrders[0].orderCount).toBe(4);

    // Retention
    expect(stats.retention.totalUniqueCustomers).toBe(2); // idan, yossi
    expect(stats.retention.customersWithMultipleOrders).toBe(1); // idan has 2 orders
    expect(stats.retention.returningCustomerRate).toBe(50); // 1 / 2 = 50%
  });

  it('detects volume spikes and generates Hebrew markdown report', () => {
    const dailySeries = [
      { period: '2025-08-01', displayDate: '01/08', completedOrders: 3, cancelledOrders: 0, grossRevenue: 300, netRevenue: 254 },
      { period: '2025-08-02', displayDate: '02/08', completedOrders: 2, cancelledOrders: 0, grossRevenue: 200, netRevenue: 169 },
      { period: '2025-08-03', displayDate: '03/08', completedOrders: 25, cancelledOrders: 1, grossRevenue: 2500, netRevenue: 2118 },
    ];

    const anomalies = detectAnomalies(dailySeries);
    expect(anomalies.some((a) => a.type === 'spike')).toBe(true);

    const stats = calculateSiteStats([]);
    stats.anomalies = anomalies;
    const report = generateHebrewMarkdownReport(stats);
    expect(report.includes('דוח ביצועי אתר הסרטים')).toBe(true);
    expect(report.includes('הכנסה נטו (לפני מע"מ 18%)')).toBe(true);
  });
});

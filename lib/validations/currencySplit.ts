import { z } from 'zod';

export const CurrencySplitSchema = z.object({
  totalAmountIls: z.number().positive('Total amount must be greater than zero'),
  fiatRatio: z.number().min(0).max(1.0),
  cryptoRatio: z.number().min(0).max(1.0),
  vipPointsRatio: z.number().min(0).max(1.0),
  targetCurrency: z.enum(['ILS', 'USD', 'EUR', 'BTC', 'ETH']).default('ILS'),
});

export const ExchangeRatesSchema = z.object({
  rates: z.record(z.string(), z.number()),
  timestamp: z.number(),
});

export type CurrencySplitInput = z.input<typeof CurrencySplitSchema>;
export type CurrencySplitOutput = z.output<typeof CurrencySplitSchema>;
export type ExchangeRates = z.infer<typeof ExchangeRatesSchema>;

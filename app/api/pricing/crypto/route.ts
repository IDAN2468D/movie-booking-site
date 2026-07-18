import { NextResponse } from 'next/server';
import { z } from 'zod';

const CryptoRateSchema = z.object({
  BTC: z.number().positive(),
  ETH: z.number().positive(),
  SOL: z.number().positive(),
  lastUpdated: z.string().datetime()
});

export type CryptoRateData = z.infer<typeof CryptoRateSchema>;

// Base prices to simulate volatility around
const BASE_RATES = {
  BTC: 65000,
  ETH: 3400,
  SOL: 150
};

export async function GET() {
  try {
    // Simulate real-time market volatility (± 0.5% every request)
    const volatility = (base: number) => base * (1 + (Math.random() - 0.5) * 0.01);

    const rawData = {
      BTC: volatility(BASE_RATES.BTC),
      ETH: volatility(BASE_RATES.ETH),
      SOL: volatility(BASE_RATES.SOL),
      lastUpdated: new Date().toISOString()
    };

    // Strict boundary validation
    const validatedData = CryptoRateSchema.parse(rawData);

    return NextResponse.json({
      success: true,
      data: validatedData
    });
  } catch (error) {
    console.error('Crypto Pricing API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve live crypto rates' },
      { status: 500 }
    );
  }
}

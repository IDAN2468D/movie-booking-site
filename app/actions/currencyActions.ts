"use server";

import { ExchangeRatesSchema, ExchangeRates } from "@/lib/validations/currencySplit";

// In-memory cache to prevent excessive API calls
let cachedRates: ExchangeRates | null = null;

export async function getExchangeRatesAction(): Promise<{ success: boolean; data?: ExchangeRates; error?: string }> {
  try {
    const now = Date.now();

    // Return cached rates if younger than 5 minutes
    if (cachedRates && now - cachedRates.timestamp < 5 * 60 * 1000) {
      return { success: true, data: cachedRates };
    }

    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const simulatedRates: ExchangeRates = {
      rates: {
        USD: 1,
        ILS: 3.75 + (Math.random() * 0.05 - 0.025), // Slight fluctuation
        BTC: 0.000015 + (Math.random() * 0.000001), 
        ETH: 0.0003 + (Math.random() * 0.00001),
      },
      timestamp: now,
    };

    // Validate boundaries
    const validated = ExchangeRatesSchema.parse(simulatedRates);
    
    // Update cache
    cachedRates = validated;

    return { success: true, data: validated };
  } catch (error: any) {
    console.error("Exchange rates fetch failed:", error);
    // Fallback to strict hardcoded rates if simulation/validation fails
    return { 
      success: true, 
      data: { rates: { USD: 1, ILS: 3.75, BTC: 0.000015, ETH: 0.0003 }, timestamp: Date.now() } 
    };
  }
}

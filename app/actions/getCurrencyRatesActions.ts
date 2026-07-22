"use server";

import { CurrencySplitSchema, CurrencySplitInput } from "@/lib/validations/currencySplit";

export async function getCurrencyRatesAction(input: CurrencySplitInput) {
  try {
    const validated = CurrencySplitSchema.parse(input);
    const { totalAmountIls, fiatRatio, cryptoRatio, vipPointsRatio } = validated;

    // Validate that ratios sum up to 1.0 (with floating precision margin)
    const ratioSum = fiatRatio + cryptoRatio + vipPointsRatio;
    if (Math.abs(ratioSum - 1.0) > 0.01) {
      return { success: false, error: "סך כל האחוזים בפיצול התשלום חייב להיות שווה ל-100%" };
    }

    // Simulated live exchange rates
    const rates = {
      USD: 0.27,
      EUR: 0.25,
      BTC: 0.0000042,
      ETH: 0.000078,
      VIP_POINT_ILS: 0.5, // 1 VIP point = 0.5 ILS
    };

    const fiatPart = parseFloat((totalAmountIls * fiatRatio).toFixed(2));
    const cryptoPartIls = totalAmountIls * cryptoRatio;
    const cryptoBtc = parseFloat((cryptoPartIls * rates.BTC).toFixed(6));
    const vipPointsNeeded = Math.round((totalAmountIls * vipPointsRatio) / rates.VIP_POINT_ILS);

    const lockExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min rate lock

    return {
      success: true,
      data: {
        totalAmountIls,
        fiatAmount: fiatPart,
        cryptoBtcAmount: cryptoBtc,
        vipPointsNeeded,
        lockExpiresAt,
        rates,
      },
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, error: error.issues?.[0]?.message || error.message };
    }
    return { success: false, error: "שגיאה בחישוב המרת המטבעות" };
  }
}

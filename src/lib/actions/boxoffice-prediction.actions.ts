'use server';

import { BoxOfficePredictionInputSchema, PredictionMarketResult } from '../validations/boxoffice-prediction.schema';

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function submitBoxOfficePredictionAction(
  rawInput: unknown
): Promise<ActionResult<PredictionMarketResult>> {
  try {
    const input = BoxOfficePredictionInputSchema.parse(rawInput);

    let multiplier = 1.85;
    let marketConsensusPercent = 74;

    if (input.predictionTarget === 'OVER_250M') {
      multiplier = 2.4;
      marketConsensusPercent = 58;
    } else if (input.predictionTarget === 'BLOCKBUSTER_500M') {
      multiplier = 4.2;
      marketConsensusPercent = 31;
    }

    const predictedPayout = Math.round(input.stakeAmount * multiplier);

    return {
      success: true,
      data: {
        stakeAmount: input.stakeAmount,
        predictedPayout,
        multiplier,
        marketConsensusPercent,
        status: 'Staked & Locked in Quantum Vault',
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to submit box office prediction stake',
    };
  }
}

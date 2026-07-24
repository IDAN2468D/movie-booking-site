'use server';

import { BiometricSeatSchema, AcousticProfileResult } from '../validations/biometric-seat.schema';

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function calculateBiometricAcousticsAction(
  rawInput: unknown
): Promise<ActionResult<AcousticProfileResult>> {
  try {
    const input = BiometricSeatSchema.parse(rawInput);
    
    // Calculate acoustic sweet-spot metrics based on row distance and preferences
    const rowDistanceFactor = Math.abs(input.row - 6); // Row 6 is acoustic focal center
    const colCenterFactor = Math.abs(input.col - 8);   // Col 8 is screen center line
    const distancePenalty = (rowDistanceFactor * 3) + (colCenterFactor * 2);
    
    const sweetSpotScore = Math.max(40, Math.min(100, Math.round(100 - distancePenalty + (input.clarityPreference * 0.15))));
    const dbBoost = Number(((100 - distancePenalty * 0.5) * 0.95).toFixed(1));
    const surroundResonance = Math.round(75 + (input.bassPreference * 0.25) - (rowDistanceFactor * 1.5));
    
    let vibeTag = 'Standard Acoustics';
    if (sweetSpotScore >= 90) vibeTag = 'THX Acoustic Gold';
    else if (sweetSpotScore >= 75) vibeTag = 'Dolby Spatial Optimum';
    else if (input.bassPreference > 70) vibeTag = 'Sub-Bass Heavy Zone';

    return {
      success: true,
      data: {
        sweetSpotScore,
        dbBoost,
        surroundResonance,
        vibeTag,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Invalid biometric acoustic payload',
    };
  }
}

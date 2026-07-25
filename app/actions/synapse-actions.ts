'use server';

import { SynapseStateSchema, SynapseAlignmentResult, SynapseStateInput } from '@/lib/validations/synapse';

export async function calculateSynapseAlignmentAction(input: SynapseStateInput): Promise<{
  success: boolean;
  data?: SynapseAlignmentResult;
  error?: string;
}> {
  try {
    const validated = SynapseStateSchema.parse(input);

    const isHigh = validated.sensoryThreshold === 'high';
    const isMedium = validated.sensoryThreshold === 'medium';

    const baseFreq = isHigh ? 12000 : isMedium ? 6000 : 2500;
    const targetFrequency = Math.min(20000, Math.max(200, Math.round(baseFreq * (validated.alignmentPercentage / 100))));

    let refractionTunnelColor = 'rgba(56, 189, 248, 0.4)';
    if (validated.alignmentPercentage > 75) {
      refractionTunnelColor = 'rgba(168, 85, 247, 0.6)';
    } else if (validated.alignmentPercentage > 40) {
      refractionTunnelColor = 'rgba(59, 130, 246, 0.5)';
    }

    const sensoryStatus = validated.alignmentPercentage >= 100
      ? 'SYNAPTIC_RESONANCE_ACHIEVED'
      : validated.alignmentPercentage > 50
      ? 'FREQUENCY_ALIGNING'
      : 'INITIALIZING_PRELUDE';

    return {
      success: true,
      data: {
        alignmentPercentage: validated.alignmentPercentage,
        refractionTunnelColor,
        targetFrequency,
        sensoryStatus,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to process synapse alignment';
    return { success: false, error: msg };
  }
}

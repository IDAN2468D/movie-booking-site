"use server";

import { FluidMatrixSchema, FluidMatrixInput } from "@/lib/validations/fluid-matrix";

export async function actionCalculateFluidState(input: FluidMatrixInput) {
  try {
    const validated = FluidMatrixSchema.parse(input);
    const resonanceIndex = Math.floor((validated.cursorX + validated.cursorY) % 7);
    const notes = ["C4", "D4", "E4", "G4", "A4", "C5", "E5"];

    return {
      success: true,
      data: {
        scaledViscosity: (validated.viscosity * 1.15).toFixed(2),
        computedFrequency: 261.63 * Math.pow(2, resonanceIndex / 12),
        activeNote: notes[resonanceIndex],
        particleCount: validated.particleCount,
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message || "Fluid calculation failed" };
  }
}

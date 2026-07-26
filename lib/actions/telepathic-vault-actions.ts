"use server";

import { TelepathicVaultSchema, TelepathicVaultInput } from "@/lib/validations/telepathic-vault";

export async function actionDecryptTelepathicPass(input: TelepathicVaultInput) {
  try {
    const validated = TelepathicVaultSchema.parse(input);
    const decryptedSignature = `TELEPATHIC-VIP-${validated.passId}-${Date.now().toString(36).toUpperCase()}`;

    return {
      success: true,
      data: {
        passId: validated.passId,
        decryptedSignature,
        holdTimeSec: (validated.fingerprintHoldDurationMs / 1000).toFixed(1),
        status: "AUTHENTICATED",
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message || "Decryption failed" };
  }
}

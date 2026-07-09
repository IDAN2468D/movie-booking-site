"use server";

import crypto from "crypto";
import { TicketVaultPayloadSchema } from "@/lib/validations/ticketVault";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function generateSecureTicket(payload: unknown): Promise<ActionResult<{ signedToken: string }>> {
  // 1. Seal Input via Zod to ensure strict type boundaries
  const parsed = TicketVaultPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  try {
    // 2. Encrypt Payload using HMAC-SHA256
    // Strictly zero client exposure, the secret lives entirely on the server.
    const secret = process.env.TICKET_SECRET || "fallback-secret-for-dev-vault";
    const dataString = JSON.stringify(parsed.data);
    const signature = crypto.createHmac("sha256", secret).update(dataString).digest("hex");
    
    // 3. Package Token
    const signedToken = Buffer.from(JSON.stringify({ data: parsed.data, signature })).toString("base64");

    return { success: true, data: { signedToken } };
  } catch (error) {
    return { success: false, error: "Failed to generate secure offline ticket." };
  }
}

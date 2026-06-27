'use server';

import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

import { ObjectId } from "mongodb";

export async function getTemporalVaults() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const vaults = await db.collection("temporal_vaults").find({}).toArray();
    return { success: true, data: JSON.parse(JSON.stringify(vaults)) };
  } catch (error) {
    return { success: false, error: "Failed to fetch temporal vaults" };
  }
}

export async function unlockTemporalVault(vaultId: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection("temporal_vaults").updateOne(
      { _id: new ObjectId(vaultId) },
      { $set: { status: "decrypting", drmToken: "AWAITING_KEY" } }
    );
    revalidatePath("/vip/liquid-capital");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to unlock vault" };
  }
}

'use server';

import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export async function getQuantumLoyalty() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const loyalty = await db.collection("quantum_loyalty").find({}).toArray();
    return { success: true, data: JSON.parse(JSON.stringify(loyalty)) };
  } catch (error) {
    return { success: false, error: "Failed to fetch quantum loyalty" };
  }
}

export async function boostQuantumTier(userId: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection("quantum_loyalty").updateOne(
      { userId },
      { $inc: { points: 1000, multiplier: 0.1 } }
    );
    revalidatePath("/vip/liquid-capital");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to boost tier" };
  }
}

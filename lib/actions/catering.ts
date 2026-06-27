'use server';

import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

import { ObjectId } from "mongodb";

export async function getCateringPredictions() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const predictions = await db.collection("catering").find({}).toArray();
    return { success: true, data: JSON.parse(JSON.stringify(predictions)) };
  } catch (error) {
    return { success: false, error: "Failed to fetch catering predictions" };
  }
}

export async function placeCateringOrder(orderId: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection("catering").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: "delivering" } }
    );
    revalidatePath("/vip/liquid-capital");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to place order" };
  }
}

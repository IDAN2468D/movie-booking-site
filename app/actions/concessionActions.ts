"use server";

import clientPromise from "@/lib/mongodb";
import { ConcessionOrderSchema } from "@/lib/validations/concession";
import { ObjectId } from "mongodb";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function submitConcessionOrder(payload: unknown): Promise<ActionResult<{ orderId: string }>> {
  const parsed = ConcessionOrderSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  try {
    const client = await clientPromise;
    const db = client.db("cinemax");
    const result = await db.collection("concessions").insertOne({
      ...parsed.data,
      status: "PENDING",
      createdAt: new Date()
    });

    return { success: true, data: { orderId: result.insertedId.toString() } };
  } catch (error) {
    return { success: false, error: "Database transaction failed." };
  }
}

export async function updateConcessionStatus(orderId: string, status: string): Promise<ActionResult<{ updatedCount: number }>> {
  try {
    const client = await clientPromise;
    const db = client.db("cinemax");
    const result = await db.collection("concessions").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return { success: false, error: "Order not found." };
    }
    
    return { success: true, data: { updatedCount: result.modifiedCount } };
  } catch (error) {
    return { success: false, error: "Database transaction failed." };
  }
}

'use server';

import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { deliveryPhaseSchema, groupComboSchema, biometricFilterSchema } from "../validations/catering";

export async function getCateringPredictions() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const predictions = await db.collection("catering").find({}).toArray();
    
    // Map to guarantee phases exists for each prediction item
    const formatted = predictions.map(p => {
      const phases = p.phases || Array(p.items.length).fill("Trailers");
      return {
        ...p,
        _id: p._id.toString(),
        phases
      };
    });
    
    return { success: true, data: formatted };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, error: "Failed to place order" };
  }
}

export async function updateDeliveryPhaseAction(rawPayload: unknown) {
  try {
    const validated = deliveryPhaseSchema.parse(rawPayload);
    const client = await clientPromise;
    const db = client.db();
    
    // Fetch the existing catering order to update or initialize the phases array
    const order = await db.collection("catering").findOne({ _id: new ObjectId(validated.orderId) });
    if (!order) {
      return { success: false, error: "Order not found" };
    }
    
    const phases = order.phases || Array(order.items.length).fill("Trailers");
    phases[validated.itemIdx] = validated.phase;
    
    await db.collection("catering").updateOne(
      { _id: new ObjectId(validated.orderId) },
      { $set: { phases } }
    );
    
    revalidatePath("/vip/liquid-capital");
    return { success: true, data: phases };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update delivery phase" };
  }
}

export async function parseGroupComboAction(rawPayload: unknown) {
  try {
    const validated = groupComboSchema.parse(rawPayload);
    
    const combos: Record<string, { name: string; price: number; items: string[] }> = {
      "duo-quantum": {
        name: "קומבו קוונטום זוגי",
        price: 120,
        items: ["Popcorn Large", "Soft Drink Large", "Nachos Extra", "Soft Drink Medium"]
      },
      "quad-multiverse": {
        name: "קומבו מולטיוורס מרובע",
        price: 240,
        items: ["Popcorn Extra Large", "Popcorn Large", "Soft Drink Large", "Soft Drink Large", "Churro Bites", "M&Ms"]
      }
    };
    
    const combo = combos[validated.comboId];
    if (!combo) {
      return { success: false, error: "Combo package not found" };
    }
    
    const pricePerSeat = combo.price / validated.seatCount;
    
    return {
      success: true,
      data: {
        comboName: combo.name,
        totalPrice: combo.price,
        pricePerSeat,
        items: combo.items,
        seats: validated.seats,
      }
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to parse group combo" };
  }
}

export async function getBiometricProfile(userId: string) {
  try {
    const validated = biometricFilterSchema.parse({
      userId,
      allergyTokens: ["nuts", "dairy"] // default mock tokens for test/seed
    });
    
    return {
      success: true,
      data: validated
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to fetch biometric profile" };
  }
}


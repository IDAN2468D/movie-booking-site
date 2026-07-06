'use server';

import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

import { ObjectId } from "mongodb";

export async function getPhantomInvites() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const invites = await db.collection("phantom_invites").find({}).toArray();
    return { success: true, data: JSON.parse(JSON.stringify(invites)) };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, error: "Failed to fetch phantom invites" };
  }
}

export async function syncPhantomInvite(inviteId: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection("phantom_invites").updateOne(
      { _id: new ObjectId(inviteId) },
      { $set: { status: "synced", accessKey: "WEBRTC_ACTIVE" } }
    );
    revalidatePath("/vip/liquid-capital");
    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, error: "Failed to sync invite" };
  }
}

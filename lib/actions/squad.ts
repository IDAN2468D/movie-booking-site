'use server';

import clientPromise from '../mongodb';
import { ObjectId } from 'mongodb';
import { squadContributeSchema } from '../validations/squad';
import { revalidatePath } from 'next/cache';

export async function getActiveSquads() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const squads = await db.collection('squadbudgets').find({ status: 'funding' }).toArray();
    
    return { 
      success: true, 
      data: squads.map(s => ({ ...s, _id: s._id.toString() })) 
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function contributeToSquad(userId: string, userName: string, rawData: any) {
  try {
    const parsedData = squadContributeSchema.safeParse(rawData);
    if (!parsedData.success) return { success: false, error: 'Invalid data' };
    
    const { squadId, amount } = parsedData.data;
    
    const client = await clientPromise;
    const db = client.db();
    
    const squad = await db.collection('squadbudgets').findOne({ _id: new ObjectId(squadId), status: 'funding' });
    if (!squad) return { success: false, error: 'Squad not found or already funded' };
    
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const availablePoints = user?.points || 5000;
    if (availablePoints < amount) return { success: false, error: 'Insufficient points' };
    
    const updateResult = await db.collection('squadbudgets').findOneAndUpdate(
      { _id: new ObjectId(squadId) },
      { 
        $inc: { currentAmount: amount },
        $push: {
          contributors: { userId: new ObjectId(userId), name: userName, amount, date: new Date() }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      },
      { returnDocument: 'after' }
    );
    
    revalidatePath('/vip/liquid-capital');
    return { success: true, data: updateResult };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

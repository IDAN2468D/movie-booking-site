'use server';

import clientPromise from '../mongodb';
import { ObjectId } from 'mongodb';
import { oracleBetSchema } from '../validations/oracle';
import { revalidatePath } from 'next/cache';

export async function getActivePredictions() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const predictions = await db.collection('oraclebets').find({ status: 'active' }).toArray();
    
    return { 
      success: true, 
      data: predictions.map(p => ({ ...p, _id: p._id.toString() })) 
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function placeOracleBet(userId: string, rawData: any) {
  try {
    const parsedData = oracleBetSchema.safeParse(rawData);
    if (!parsedData.success) return { success: false, error: 'Invalid data' };
    
    const { predictionId, optionId, amount } = parsedData.data;
    
    const client = await clientPromise;
    const db = client.db();
    
    const prediction = await db.collection('oraclebets').findOne({ _id: new ObjectId(predictionId), status: 'active' });
    if (!prediction) return { success: false, error: 'Prediction not active' };
    
    // Check points
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const availablePoints = user?.points || 5000;
    if (availablePoints < amount) return { success: false, error: 'Insufficient points' };
    
    // Update pool
    const updateResult = await db.collection('oraclebets').findOneAndUpdate(
      { _id: new ObjectId(predictionId) },
      { 
        $inc: { 
          [`options.${optionId}.totalPool`]: amount 
        },
        $push: {
          bets: { userId: new ObjectId(userId), optionId, amount, date: new Date() }
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

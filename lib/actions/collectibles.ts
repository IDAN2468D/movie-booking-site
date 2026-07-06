'use server';

import clientPromise from '../mongodb';
import { ObjectId } from 'mongodb';
import { collectiblePurchaseSchema } from '../validations/collectibles';
import { revalidatePath } from 'next/cache';

export async function getCollectibles() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const collectibles = await db.collection('cinecollectibles').find({ stock: { $gt: 0 } }).toArray();
    
    return { 
      success: true, 
      data: collectibles.map(c => ({ ...c, _id: c._id.toString() })) 
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function purchaseCollectible(userId: string, rawData: any) {
  try {
    const parsedData = collectiblePurchaseSchema.safeParse(rawData);
    if (!parsedData.success) return { success: false, error: 'Invalid data' };
    
    const { collectibleId } = parsedData.data;
    
    const client = await clientPromise;
    const db = client.db();
    
    const collectible = await db.collection('cinecollectibles').findOne({ _id: new ObjectId(collectibleId), stock: { $gt: 0 } });
    if (!collectible) return { success: false, error: 'Collectible out of stock or not found' };
    
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const availablePoints = user?.points || 5000;
    if (availablePoints < collectible.price) return { success: false, error: 'Insufficient points' };
    
    const updateResult = await db.collection('cinecollectibles').findOneAndUpdate(
      { _id: new ObjectId(collectibleId), stock: { $gt: 0 } },
      { $inc: { stock: -1 } },
      { returnDocument: 'after' }
    );
    
    if (!updateResult) return { success: false, error: 'Sold out just now' };
    
    revalidatePath('/vip/liquid-capital');
    return { success: true, data: updateResult };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

'use server';

import clientPromise from '../mongodb';
import { ObjectId } from 'mongodb';
import { bidSchema } from '../validations/auction';
import { revalidatePath } from 'next/cache';

export async function getActiveAuctions() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const now = new Date();
    
    // Fetch active auctions that haven't ended yet
    const auctions = await db.collection('seatauctions').find({
      status: 'active',
      endTime: { $gt: now }
    }).sort({ endTime: 1 }).toArray();
    
    // Convert ObjectId to string for client component
    const serializedAuctions = auctions.map(a => ({
      ...a,
      _id: a._id.toString(),
      highestBidder: a.highestBidder?.toString() || null,
    }));
    
    return { success: true, data: serializedAuctions };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch auctions';
    console.error('Failed to get auctions from DB:', error);
    return { success: false, error: errorMessage };
  }
}

export async function placeBid(userId: string, userName: string, rawData: { auctionId: string, bidAmount: number }) {
  try {
    const parsedData = bidSchema.safeParse(rawData);
    if (!parsedData.success) {
      return { success: false, error: 'Invalid bid data' };
    }
    
    const { auctionId, bidAmount } = parsedData.data;
    
    const client = await clientPromise;
    const db = client.db();
    
    // For standalone MongoDB instances without replica sets, transactions might fail.
    // We will use atomic findOneAndUpdate instead of a full transaction to ensure compatibility.
    
    const auction = await db.collection('seatauctions').findOne({ 
      _id: new ObjectId(auctionId), 
      status: 'active', 
      endTime: { $gt: new Date() } 
    });
    
    if (!auction) {
      return { success: false, error: 'Auction not found, ended, or inactive' };
    }
    
    if (bidAmount <= auction.currentBid) {
      return { success: false, error: 'Bid must be strictly higher than the current highest bid' };
    }
    
    // Fetch user to verify points (basic check)
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    const availablePoints = user.points !== undefined ? user.points : 5000;
    if (availablePoints < bidAmount) {
      return { success: false, error: 'Insufficient loyalty points' };
    }
    
    // Atomically update the auction only if currentBid is strictly less than bidAmount
    const updateResult = await db.collection('seatauctions').findOneAndUpdate(
      { 
        _id: new ObjectId(auctionId), 
        currentBid: { $lt: bidAmount } // Atomic filter boundary check
      },
      { 
        $set: { 
          currentBid: bidAmount,
          highestBidder: new ObjectId(userId),
          highestBidderName: userName
        } 
      },
      { returnDocument: 'after' }
    );
    
    if (!updateResult) {
      return { success: false, error: 'Someone else placed a bid at the exact same time. Please try again.' };
    }
    
    revalidatePath('/vip/liquid-capital');
    
    return { success: true, data: updateResult };
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to place bid';
    console.error('Failed to place bid:', error);
    return { success: false, error: errorMessage };
  }
}

'use server';

import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import SeatLock from '@/lib/models/SeatLock';
import { Ticket } from '@/lib/models/Ticket';
import { LoyaltyUser } from '@/lib/models/Loyalty';
import crypto from 'crypto';

const TransactionPayloadSchema = z.object({
  userId: z.string(),
  showtimeId: z.string(),
  seatIds: z.array(z.string()).min(1),
  paymentToken: z.string(),
  idempotencyKey: z.string().uuid(),
  isFlashOffer: z.boolean().optional().default(false),
});

export async function processSecureBooking(payload: unknown) {
  try {
    await connectToDatabase();
    
    const parsed = TransactionPayloadSchema.safeParse(payload);
    
    if (!parsed.success) {
      return { success: false, error: 'Invalid transaction payload', details: parsed.error.flatten() };
    }

    const { userId, showtimeId, seatIds, paymentToken, isFlashOffer } = parsed.data;

    // Verify SeatLocks are owned by user and not expired
    const validLocks = await SeatLock.find({
      seatId: { $in: seatIds },
      showtimeId,
      userId,
      status: 'held',
      lockExpiresAt: { $gt: new Date() }
    });

    if (validLocks.length !== seatIds.length) {
       return { success: false, error: 'Seat locks expired or invalid. Please select your seats again.' };
    }

    // Mock Payment Gateway processing (delay 1.5s)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate Payment Responses based on payment token
    if (paymentToken === 'mock-declined') {
      // Instant Rollback
      await SeatLock.deleteMany({ _id: { $in: validLocks.map(l => l._id) } });
      return { success: false, error: 'Payment declined. Seats released instantly.' };
    }

    if (paymentToken === 'mock-timeout') {
      // 3-Minute Grace Lock Rollback
      const threeMinutesFromNow = new Date(Date.now() + 3 * 60 * 1000);
      await SeatLock.updateMany(
        { _id: { $in: validLocks.map(l => l._id) } },
        { $set: { lockExpiresAt: threeMinutesFromNow } }
      );
      return { success: false, error: 'Payment network timeout. Seats reserved for 3 more minutes.' };
    }

    // Payment Success
    await SeatLock.updateMany(
      { _id: { $in: validLocks.map(l => l._id) } },
      { $set: { status: 'booked' } }
    );

    // Gamification & Loyalty Logic (Sprint 13)
    const pointsEarned = isFlashOffer ? 100 : 50;

    const ticket = await Ticket.create({
      userId,
      showtimeId,
      seatIds,
      bookingReference: crypto.randomUUID(),
      qrHash: crypto.createHash('sha256').update(Date.now().toString()).digest('hex'),
      status: 'active',
      acquiredVia: isFlashOffer ? 'flash_offer' : 'standard',
      pulsePointsEarned: pointsEarned,
    });

    const userLoyalty = await LoyaltyUser.findOneAndUpdate(
      { userId },
      { $inc: { points: pointsEarned } },
      { new: true, upsert: true }
    );

    let newTier = 'Bronze';
    if (userLoyalty.points >= 5000) newTier = 'Liquid Elite';
    else if (userLoyalty.points >= 1500) newTier = 'Gold';
    else if (userLoyalty.points >= 500) newTier = 'Silver';

    if (userLoyalty.tier !== newTier) {
      userLoyalty.tier = newTier;
      await userLoyalty.save();
    }

    return { 
      success: true, 
      message: 'Booking confirmed!', 
      ticketId: ticket._id.toString(),
      pointsEarned, 
      currentTier: newTier 
    };
    
  } catch (error: any) {
    console.error('Transaction Error:', error);
    return { success: false, error: 'Internal server error during transaction.' };
  }
}

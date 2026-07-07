"use server";

import mongoose from 'mongoose';
import SwipeSession from '../models/SwipeSession';
import { catalogFiltersSchema } from '../validations/swipeSession';
import { broadcastToSession } from '../wsTrigger';

export type ActionResponse<T = any> = { success: boolean; data?: T; error?: string };

// Helper to generate a 6-digit alphanumeric string
function generateSessionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createSwipeSession(
  hostUserId: string,
  catalogFilters?: any
): Promise<ActionResponse> {
  try {
    const sessionId = generateSessionId();
    
    let parsedFilters = undefined;
    if (catalogFilters) {
      const parsed = catalogFiltersSchema.safeParse(catalogFilters);
      if (!parsed.success) {
        return { success: false, error: 'Invalid catalog filters' };
      }
      parsedFilters = parsed.data;
    }

    const newSession = await SwipeSession.create({
      sessionId,
      hostUserId: new mongoose.Types.ObjectId(hostUserId),
      participants: [new mongoose.Types.ObjectId(hostUserId)],
      sessionStatus: 'active',
      catalogFilters: parsedFilters,
    });

    return { success: true, data: { sessionId: newSession.sessionId } };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create session' };
  }
}

export async function joinSwipeSession(
  sessionId: string,
  participantUserId: string
): Promise<ActionResponse> {
  try {
    const participantObjectId = new mongoose.Types.ObjectId(participantUserId);

    const updatedSession = await SwipeSession.findOneAndUpdate(
      { sessionId, sessionStatus: 'active' },
      { $addToSet: { participants: participantObjectId } },
      { new: true }
    );

    if (!updatedSession) {
      return { success: false, error: 'Session not found or not active' };
    }

    await broadcastToSession(sessionId, {
      type: 'participant_joined',
      payload: { sessionId, participantUserId },
    });

    return { success: true, data: { sessionId: updatedSession.sessionId } };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to join session' };
  }
}

export async function recordSwipe(
  sessionId: string,
  userId: string,
  movieId: string,
  direction: 'like' | 'dislike'
): Promise<ActionResponse> {
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const movieObjectId = new mongoose.Types.ObjectId(movieId);

    const updatedSession = await SwipeSession.findOneAndUpdate(
      { sessionId, sessionStatus: 'active' },
      {
        $push: {
          swipes: {
            userId: userObjectId,
            movieId: movieObjectId,
            direction,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedSession) {
      return { success: false, error: 'Session not found or not active' };
    }

    await broadcastToSession(sessionId, {
      type: 'swipe_recorded',
      payload: { sessionId, userId, movieId },
    });

    if (direction === 'like') {
      await checkSessionMatch(sessionId);
    }

    return { success: true, data: { sessionId } };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to record swipe' };
  }
}

async function checkSessionMatch(sessionId: string): Promise<void> {
  try {
    // 1. Fetch the session to get participants count
    const session = await SwipeSession.findOne({ sessionId, sessionStatus: 'active' }).lean();
    if (!session) return;
    
    const participantsCount = session.participants.length;

    // 2. Aggregation to find if any movie has likes equal to participantsCount
    const aggregationPipeline = [
      { $match: { sessionId, sessionStatus: 'active' } },
      { $unwind: '$swipes' },
      { $match: { 'swipes.direction': 'like' } },
      {
        $group: {
          _id: '$swipes.movieId',
          uniqueUsers: { $addToSet: '$swipes.userId' },
        },
      },
      {
        $project: {
          movieId: '$_id',
          likesCount: { $size: '$uniqueUsers' },
        },
      },
      {
        $match: { likesCount: { $gte: participantsCount } }, // using gte just in case, though eq is fine
      },
      { $limit: 1 } // Stop at first match
    ];

    const matchResult = await SwipeSession.aggregate(aggregationPipeline);

    if (matchResult && matchResult.length > 0) {
      const matchedMovieId = matchResult[0].movieId;
      
      // 3. Update session status atomically
      await SwipeSession.findOneAndUpdate(
        { sessionId, sessionStatus: 'active' },
        {
          $set: {
            sessionStatus: 'matched',
            matchedMovieId,
          },
        }
      );

      // 4. Broadcast Match Found to all session sockets
      await broadcastToSession(sessionId, {
        type: 'match_found',
        payload: { sessionId, matchedMovieId: matchedMovieId.toString() },
      });
    }
  } catch (error) {
    console.error('Error checking session match:', error);
  }
}

'use server';

import clientPromise from '../mongodb';
import { ObjectId } from 'mongodb';
import { MatchSessionRoomSchema, SwipePayloadSchema } from '../validations/matcher';

export async function initMatchSession(hostId: string) {
  try {
    const parsedData = MatchSessionRoomSchema.safeParse({ hostId, participants: [hostId] });
    if (!parsedData.success) {
      return { success: false, error: 'Invalid room initialization data' };
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('matchSessions').insertOne({
      ...parsedData.data,
      createdAt: new Date(),
    });

    return { 
      success: true, 
      data: { sessionId: result.insertedId.toString() } 
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function joinMatchSession(sessionId: string, userId: string) {
  try {
    if (!ObjectId.isValid(sessionId)) {
      return { success: false, error: 'Invalid session ID' };
    }

    const client = await clientPromise;
    const db = client.db();

    const updateResult = await db.collection('matchSessions').findOneAndUpdate(
      { _id: new ObjectId(sessionId), status: 'waiting' },
      { 
        $addToSet: { participants: userId } as any
      },
      { returnDocument: 'after' }
    );

    if (!updateResult) {
      return { success: false, error: 'Session not found or no longer waiting' };
    }

    return { success: true, data: updateResult };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function submitSwipeAction(rawData: any, userId: string) {
  try {
    const parsedData = SwipePayloadSchema.safeParse(rawData);
    if (!parsedData.success) {
      return { success: false, error: 'Invalid swipe payload' };
    }

    const { movieId, direction, sessionId } = parsedData.data;

    const client = await clientPromise;
    const db = client.db();

    // Log the swipe action
    await db.collection('swipeActions').insertOne({
      userId,
      movieId,
      direction,
      sessionId: sessionId ? new ObjectId(sessionId) : null,
      timestamp: new Date(),
    });

    // If it's a right swipe in a group session, check for matches
    if (direction === 'right' && sessionId && ObjectId.isValid(sessionId)) {
      const matchKey = `likes.${movieId}`;
      
      const updateResult = await db.collection('matchSessions').findOneAndUpdate(
        { _id: new ObjectId(sessionId) },
        { 
          $addToSet: { [matchKey]: userId } as any
        },
        { returnDocument: 'after' }
      );

      if (updateResult) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resultDoc = updateResult as any;
        const likesForMovie = resultDoc.likes?.[movieId] || [];
        const participants = resultDoc.participants || [];
        
        // If everyone in the session liked this movie
        if (participants.length > 0 && likesForMovie.length === participants.length) {
          await db.collection('matchSessions').updateOne(
            { _id: new ObjectId(sessionId) },
            { 
              $addToSet: { activeMatches: movieId } as any,
              $set: { status: 'resolved', resolvedMovieId: movieId } as any
            }
          );
          
          return { success: true, data: { isMatch: true, movieId } };
        }
      }
    }

    return { success: true, data: { isMatch: false } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

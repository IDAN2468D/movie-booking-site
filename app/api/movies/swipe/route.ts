import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import SwipeSession from '@/src/lib/models/SwipeSession';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { user_id, movie_id, action, session_id } = await req.json();

    if (!user_id || !movie_id || !action || !session_id) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const session = await SwipeSession.findOne({ sessionId: session_id, sessionStatus: 'active' });
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found or inactive' }, { status: 404 });
    }

    const newSwipe = {
      userId: new mongoose.Types.ObjectId(user_id),
      movieId: new mongoose.Types.ObjectId(movie_id),
      direction: action,
      timestamp: new Date()
    };

    const updatedSession = await SwipeSession.findOneAndUpdate(
      { sessionId: session_id, sessionStatus: 'active' },
      { $push: { swipes: newSwipe } },
      { new: true }
    );

    if (!updatedSession) {
      return NextResponse.json({ success: false, error: 'Failed to update session' }, { status: 500 });
    }

    // Immediate trigger match engine
    if (action === 'like') {
      const likesForMovie = updatedSession.swipes.filter(
        s => s.movieId.toString() === movie_id && s.direction === 'like'
      );
      
      const participantIds = updatedSession.participants.map(p => p.toString());
      const hostId = updatedSession.hostUserId.toString();
      
      // Ensure host is also matched if they are meant to be part of the match
      const allRequiredIds = new Set([...participantIds, hostId]);
      const likedUserIds = new Set(likesForMovie.map(s => s.userId.toString()));
      
      let isMatch = true;
      for (const id of allRequiredIds) {
        if (!likedUserIds.has(id)) {
          isMatch = false;
          break;
        }
      }

      if (isMatch) {
        const matchUpdate = await SwipeSession.findOneAndUpdate(
          { sessionId: session_id, sessionStatus: 'active' },
          { sessionStatus: 'matched', matchedMovieId: new mongoose.Types.ObjectId(movie_id) },
          { new: true }
        );
        
        if (matchUpdate) {
          // Here a WebSocket or SSE event `MatchFound` is triggered to broadcast `matchedMovieId`.
          return NextResponse.json({ success: true, matchFound: true, matchedMovieId: movie_id });
        }
      }
    }

    return NextResponse.json({ success: true, matchFound: false });
  } catch (error: any) {
    console.error('Error in /api/movies/swipe:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

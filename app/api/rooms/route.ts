import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { JoinRoomSchema, SwipeSchema } from '@/lib/validations/room';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (body.action === 'like' || body.action === 'pass') {
      return await handleSwipe(body);
    }
    
    const parsed = JoinRoomSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid room data', data: parsed.error.format() }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    const rooms = db.collection<any>('rooms');
    
    const { roomCode, userId } = parsed.data;
    
    const room = await rooms.findOneAndUpdate(
      { roomCode },
      { 
        $addToSet: { participants: userId },
        $setOnInsert: { likedMovies: [], status: 'active', createdAt: new Date() }
      } as any,
      { upsert: true, returnDocument: 'after' }
    );
    
    return NextResponse.json({ success: true, data: room });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function handleSwipe(body: any) {
  try {
    const parsed = SwipeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid swipe data', data: parsed.error.format() }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    const rooms = db.collection<any>('rooms');
    
    const { roomCode, userId, movieId, action } = parsed.data;
    
    if (action === 'like') {
      await rooms.updateOne(
        { roomCode },
        { $push: { likedMovies: { movieId, userId } } } as any
      );
      
      const room = await rooms.findOne({ roomCode });
      if (room) {
        const likesForMovie = room.likedMovies.filter((l: any) => l.movieId === movieId);
        if (likesForMovie.length >= 2 && room.participants.length >= 2) {
          await rooms.updateOne(
            { roomCode },
            { $set: { status: 'matched', matchedMovieId: movieId } }
          );
          return NextResponse.json({ success: true, data: { match: true, movieId } });
        }
      }
    }
    
    return NextResponse.json({ success: true, data: { match: false } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

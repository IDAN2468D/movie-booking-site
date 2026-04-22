import { NextResponse } from 'next/server';
import { getMovieVideos } from '@/lib/tmdb';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const movieId = parseInt(id, 10);

  if (isNaN(movieId)) {
    return NextResponse.json([], { status: 400 });
  }

  try {
    const videos = await getMovieVideos(movieId);
    return NextResponse.json(videos);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

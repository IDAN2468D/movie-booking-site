import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';

const CatalogRequestSchema = z.object({
  personaVector: z.array(z.string()).default([]),
});

const MOCK_MOVIES = [
  { id: '1', title: 'Interstellar', genre: 'Sci-Fi', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MvrId5cB.jpg' },
  { id: '2', title: 'The Dark Knight', genre: 'Action', posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
  { id: '3', title: 'Dune: Part Two', genre: 'Sci-Fi', posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGjjc9CW.jpg' },
  { id: '4', title: 'La La Land', genre: 'Romance', posterUrl: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Vy0.jpg' },
  { id: '5', title: 'Blade Runner 2049', genre: 'Sci-Fi', posterUrl: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg' },
];

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = CatalogRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error }, { status: 400 });
    }

    const { personaVector } = parsed.data;
    
    let sortedMovies = [...MOCK_MOVIES];

    // Semantic Similarity Logic Mock:
    // If the persona vector includes "Sci-Fi Fan", boost Sci-Fi movies.
    if (personaVector.some(p => p.toLowerCase().includes('sci-fi'))) {
      sortedMovies.sort((a, b) => {
        if (a.genre === 'Sci-Fi' && b.genre !== 'Sci-Fi') return -1;
        if (a.genre !== 'Sci-Fi' && b.genre === 'Sci-Fi') return 1;
        return 0;
      });
    }

    return NextResponse.json({ success: true, data: sortedMovies });

  } catch (error) {
    console.error('Semantic Catalog API Error:', error);
    return NextResponse.json({ error: 'Failed to process catalog request' }, { status: 500 });
  }
}

import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../../app/api/movies/match/route';

// Mock NextAuth
vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(() => Promise.resolve({
    user: { id: 'mock-user-id', email: 'test@moviebook.com' }
  }))
}));

// Mock MongoDB
vi.mock('@/lib/mongodb', () => {
  return {
    default: Promise.resolve({
      db: () => ({
        collection: (name: string) => ({
          find: () => ({
            toArray: vi.fn().mockResolvedValue([
              { 
                movie: { id: 123 },
                showtime: '19:30',
                status: 'confirmed',
                seats: ['A1', 'A2'],
                date: new Date().toISOString().split('T')[0]
              }
            ])
          })
        })
      })
    })
  };
});

describe('Swipe Matcher API', () => {
  it('should return error if no liked movies provided', async () => {
    const req = new NextRequest('http://localhost/api/movies/match', {
      method: 'POST',
      body: JSON.stringify({ userId: 'mock-user-id', likedMovieIds: [] })
    });
    
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe('No liked movies provided');
  });

  it('should find a match with available seats', async () => {
    const req = new NextRequest('http://localhost/api/movies/match', {
      method: 'POST',
      body: JSON.stringify({ userId: 'mock-user-id', likedMovieIds: [123, 456] })
    });
    
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.movieId).toBe(123);
    expect(data.data.showtime).toBe('19:30');
    expect(data.data.availableSeats).toBe(48); // 50 total - 2 occupied
  });
});

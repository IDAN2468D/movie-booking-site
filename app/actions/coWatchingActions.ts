'use server';

import { z } from 'zod';

export const CoWatchingMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  mood: z.enum(['hyped', 'chill', 'scared', 'emotional', 'popcorn_ready']),
  isReady: z.boolean(),
  seatNumber: z.string().optional(),
});

export const CoWatchingSessionSchema = z.object({
  sessionId: z.string(),
  movieTitle: z.string(),
  hostName: z.string(),
  members: z.array(CoWatchingMemberSchema),
  syncedTimestampSec: z.number(),
  isActive: z.boolean(),
});

export type CoWatchingMember = z.infer<typeof CoWatchingMemberSchema>;
export type CoWatchingSession = z.infer<typeof CoWatchingSessionSchema>;

const MOCK_SESSIONS: { [id: string]: CoWatchingSession } = {
  sync_cinema_alpha: {
    sessionId: 'sync_cinema_alpha',
    movieTitle: 'דילמת המד"ב 2026: אופק האירועים',
    hostName: 'דניאל ק.',
    syncedTimestampSec: 42,
    isActive: true,
    members: [
      {
        id: 'user_1',
        name: 'דניאל (מארח)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        mood: 'hyped',
        isReady: true,
        seatNumber: 'VIP-A4',
      },
      {
        id: 'user_2',
        name: 'מאיה ש.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        mood: 'popcorn_ready',
        isReady: true,
        seatNumber: 'VIP-A5',
      },
      {
        id: 'user_3',
        name: 'רועי ל.',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
        mood: 'emotional',
        isReady: false,
        seatNumber: 'VIP-A6',
      },
    ],
  },
};

export async function getCoWatchingSessionAction(sessionId = 'sync_cinema_alpha') {
  try {
    const session = MOCK_SESSIONS[sessionId] || MOCK_SESSIONS['sync_cinema_alpha'];
    return {
      success: true,
      data: session,
    };
  } catch {
    return {
      success: false,
      error: 'Failed to retrieve co-watching session',
    };
  }
}

export async function toggleMemberReadyAction(sessionId: string, memberId: string) {
  try {
    const session = MOCK_SESSIONS[sessionId] || MOCK_SESSIONS['sync_cinema_alpha'];
    const member = session.members.find((m) => m.id === memberId);
    if (member) {
      member.isReady = !member.isReady;
    }
    return {
      success: true,
      data: session,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'שגיאה בעדכון מוכנות הצופה',
    };
  }
}

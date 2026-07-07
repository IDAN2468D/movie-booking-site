"use client";

import { useState, useEffect, useCallback } from 'react';
import type { BroadcastEvent } from '../lib/wsTrigger';

export interface SwipeSessionState {
  sessionId: string | null;
  participants: string[];
  matchedMovieId: string | null;
  status: 'idle' | 'active' | 'matched' | 'expired';
}

export function useSwipeSession(initialSessionId: string | null = null) {
  const [sessionState, setSessionState] = useState<SwipeSessionState>({
    sessionId: initialSessionId,
    participants: [],
    matchedMovieId: null,
    status: initialSessionId ? 'active' : 'idle',
  });

  useEffect(() => {
    if (!sessionState.sessionId) return;

    // Simulate WebSocket connection to room based on sessionId
    // In production, this targets the configured WS/Pusher endpoint
    const socket = new WebSocket(`ws://localhost:3000/api/ws?sessionId=${sessionState.sessionId}`);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as BroadcastEvent;
        
        switch (data.type) {
          case 'participant_joined':
            setSessionState(prev => ({
              ...prev,
              participants: Array.from(new Set([...prev.participants, data.payload.participantUserId]))
            }));
            break;
            
          case 'swipe_recorded':
            // Optional: Can be used to trigger haptic feedback or visual ping
            break;
            
          case 'match_found':
            setSessionState(prev => ({
              ...prev,
              status: 'matched',
              matchedMovieId: data.payload.matchedMovieId
            }));
            break;
        }
      } catch (err) {
        console.error('WebSocket payload parsing error:', err);
      }
    };

    return () => {
      socket.close();
    };
  }, [sessionState.sessionId]);

  const joinSession = useCallback((id: string) => {
    setSessionState(prev => ({ ...prev, sessionId: id, status: 'active' }));
  }, []);

  return { sessionState, joinSession };
}

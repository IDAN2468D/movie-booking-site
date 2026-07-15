'use client';

import React, { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWatchParty, useWatchPartyStore } from '@/hooks/useWatchParty';
import { HolographicCursor } from '@/components/booking/HolographicCursor';
import { useAcousticFeedback } from '@/hooks/useAcousticFeedback';

interface PhantomCursorsProps {
  userId: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function PhantomCursors({ userId, containerRef }: PhantomCursorsProps) {
  const { emitCursorMove } = useWatchParty();
  const cursors = useWatchPartyStore((state) => state.cursors);
  const { playSpatialClick } = useAcousticFeedback();

  const lastMoveTime = useRef<number>(0);
  const userColor = React.useMemo(() => `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      const now = Date.now();
      // Throttle mouse moves to ~15fps (66ms) to prevent network bloat
      if (now - lastMoveTime.current < 66) return;
      lastMoveTime.current = now;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      emitCursorMove({ x, y, userId: userId || 'guest', color: userColor });
    };

    container.addEventListener('pointermove', handlePointerMove);
    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
    };
  }, [containerRef, emitCursorMove, userId, userColor]);

  // Spatial audio feedback on peer click events
  useEffect(() => {
    const handlePeerClick = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const { col, row } = customEvent.detail;
        const peerSeatId = `${row}${col}`;
        playSpatialClick(peerSeatId);
      }
    };

    window.addEventListener('watchparty_peer_click', handlePeerClick);
    return () => {
      window.removeEventListener('watchparty_peer_click', handlePeerClick);
    };
  }, [playSpatialClick]);

  return (
    <AnimatePresence>
      {Object.entries(cursors).map(([socketId, cursor]) => (
        <HolographicCursor
          key={socketId}
          x={cursor.x}
          y={cursor.y}
          color={cursor.color}
          userId={cursor.userId}
        />
      ))}
    </AnimatePresence>
  );
}

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import io, { Socket } from 'socket.io-client';
import { CursorMovePayload, PeerClickPayload } from '../lib/schemas/watchParty';

export interface PeerCursor extends CursorMovePayload {
  socketId: string;
}

interface WatchPartyState {
  cursors: Record<string, PeerCursor>;
  updateCursor: (socketId: string, cursor: PeerCursor) => void;
  removeCursor: (socketId: string) => void;
  clearCursors: () => void;
}

export const useWatchPartyStore = create<WatchPartyState>((set) => ({
  cursors: {},
  updateCursor: (socketId, cursor) => set((state) => ({
    cursors: { ...state.cursors, [socketId]: cursor }
  })),
  removeCursor: (socketId) => set((state) => {
    const next = { ...state.cursors };
    delete next[socketId];
    return { cursors: next };
  }),
  clearCursors: () => set({ cursors: {} })
}));

export function useWatchParty() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { updateCursor, removeCursor } = useWatchPartyStore();

  useEffect(() => {
    fetch('/api/socket/io').finally(() => {
      const socketInstance = io({
        path: '/api/socket/io',
        addTrailingSlash: false,
      });

      socketInstance.on('connect', () => {
        setSocket(socketInstance);
      });

      socketInstance.on('cursor_sync', (payload: PeerCursor) => {
        updateCursor(payload.socketId, payload);
      });

      socketInstance.on('peer_click_sync', (payload: PeerClickPayload & { socketId: string }) => {
        // We dispatch a custom event that SeatMap can listen to, or we could handle it via Zustand
        window.dispatchEvent(new CustomEvent('watchparty_peer_click', { detail: payload }));
      });

      socketInstance.on('presence_remove', (socketId: string) => {
        removeCursor(socketId);
      });

      return () => {
        socketInstance.disconnect();
      };
    });
  }, [updateCursor, removeCursor]);

  const emitCursorMove = (payload: Omit<PeerCursor, 'socketId'>) => {
    if (socket) {
      socket.emit('cursor_move', payload);
    }
  };

  const emitPeerClick = (col: number, row: string) => {
    if (socket) {
      socket.emit('peer_click', { col, row });
    }
  };

  return { socket, emitCursorMove, emitPeerClick };
}

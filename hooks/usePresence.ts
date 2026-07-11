import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export function usePresence() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [presence, setPresence] = useState<Record<string, string>>({});

  useEffect(() => {
    // We need to trigger the Socket API to ensure it initializes
    fetch('/api/socket/io').finally(() => {
      const socketInstance = io({
        path: '/api/socket/io',
        addTrailingSlash: false,
      });

      socketInstance.on('connect', () => {
        setSocket(socketInstance);
      });

      socketInstance.on('presence_sync', (entries: [string, string][]) => {
        const newPresence: Record<string, string> = {};
        entries.forEach(([id, seatId]) => {
          newPresence[id] = seatId;
        });
        setPresence(newPresence);
      });

      socketInstance.on('presence_update', ({ socketId, seatId }) => {
        setPresence(prev => ({ ...prev, [socketId]: seatId }));
      });

      socketInstance.on('presence_remove', (socketId) => {
        setPresence(prev => {
          const next = { ...prev };
          delete next[socketId];
          return next;
        });
      });

      return () => {
        socketInstance.disconnect();
      };
    });
  }, []);

  const updatePresence = (seatId: string) => {
    if (socket) {
      socket.emit('set_presence', seatId);
    }
  };

  return { presence, updatePresence };
}

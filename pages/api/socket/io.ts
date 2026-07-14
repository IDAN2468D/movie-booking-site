import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });

    // In-memory map to store active user session coordinates
    const presenceMap = new Map<string, string>(); // socketId -> seatId

    io.on('connection', (socket) => {
      socket.emit('presence_sync', Array.from(presenceMap.entries()));

      socket.on('set_presence', (seatId: string) => {
        presenceMap.set(socket.id, seatId);
        socket.broadcast.emit('presence_update', { socketId: socket.id, seatId });
      });

      socket.on('cursor_move', (payload: any) => {
        // Broadcast the cursor move to all other clients
        socket.broadcast.emit('cursor_sync', { socketId: socket.id, ...payload });
      });

      socket.on('peer_click', (payload: any) => {
        // Broadcast the peer click to all other clients
        socket.broadcast.emit('peer_click_sync', { socketId: socket.id, ...payload });
      });

      socket.on('disconnect', () => {
        presenceMap.delete(socket.id);
        socket.broadcast.emit('presence_remove', socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;

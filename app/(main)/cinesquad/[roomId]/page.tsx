import React from 'react';
import { getSquadRoom } from '@/lib/actions/cinesquadActions';
import { CineSquadLobby } from '@/components/cinesquad/CineSquadLobby';

interface SquadRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default async function SquadRoomPage({ params }: SquadRoomPageProps) {
  const { roomId } = await params;
  const roomRes = await getSquadRoom(roomId);

  const initialRoom = roomRes.success && roomRes.data
    ? roomRes.data
    : {
        roomId,
        hostUserId: 'user-host-1',
        movieId: '693134',
        movieTitle: 'חולית: חלק 2',
        showtimeId: 'st-dune-1',
        showtimeLabel: 'היום בשעה 21:00',
        hallName: 'אולם VIP אקוסטי 1',
        ticketUnitPrice: 45,
        splitMode: 'equal' as const,
        expiresAt: new Date(Date.now() + 7200000).toISOString(),
        status: 'lobby' as const,
        members: [
          {
            userId: 'user-host-1',
            name: 'עידן (מארח)',
            selectedSeat: 'D4',
            isHost: true,
            paymentStatus: 'authorized' as const,
            ticketAmount: 45,
            concessionAmount: 0,
            shareAmount: 45,
          },
        ],
      };

  return (
    <div className="min-h-screen px-4 md:px-12 py-8 space-y-8">
      <CineSquadLobby initialRoom={initialRoom} currentUserId="user-host-1" />
    </div>
  );
}

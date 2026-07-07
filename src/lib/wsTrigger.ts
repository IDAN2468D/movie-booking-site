export type BroadcastEvent =
  | { type: 'participant_joined'; payload: { sessionId: string; participantUserId: string } }
  | { type: 'swipe_recorded'; payload: { sessionId: string; userId: string; movieId: string } }
  | { type: 'match_found'; payload: { sessionId: string; matchedMovieId: string } }
  | { type: 'order_state_changed'; payload: { orderId: string; newState: OrderState } };

export type OrderState = 'payment_confirmed' | 'popcorn_popping' | 'ready_for_pickup' | 'hall_doors_open';

export async function broadcastToSession(sessionId: string, event: BroadcastEvent): Promise<void> {
  // In a production implementation, this would trigger Pusher, Socket.io, or an Edge WebSocket.
  // For the scope of this backend action integration, we define the strict payload signature and boundary.
  
  console.log(`[WebSocket Sync] Broadcasting to room ${sessionId}:`, event.type);
  
  try {
    // Example: await pusherServer.trigger(`session-${sessionId}`, event.type, event.payload);
  } catch (error) {
    console.error(`Failed to broadcast event ${event.type} to session ${sessionId}:`, error);
  }
}

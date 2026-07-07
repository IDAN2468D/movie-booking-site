"use server";

import { broadcastToSession, OrderState } from '../wsTrigger';

export const ORDER_STATES: OrderState[] = [
  'payment_confirmed',
  'popcorn_popping',
  'ready_for_pickup',
  'hall_doors_open'
];

export async function updateOrderState(orderId: string, newState: OrderState) {
  try {
    // Strictly isolated logic: In a real transactional system, this acts as the post-commit trigger.
    // For this experiential tracker layer, we focus entirely on the broadcast hook execution.
    
    // Transmit real-time signal via our WebSocket pipeline
    // The order room is targeted directly using the orderId
    await broadcastToSession(orderId, {
      type: 'order_state_changed',
      payload: { orderId, newState }
    });

    return { success: true, data: { orderId, newState } };
  } catch (error: any) {
    console.error(`Failed to update order state for ${orderId}:`, error);
    return { success: false, error: error.message || 'Failed to sync order state' };
  }
}

'use server';

import { TemporalShowtimeQuerySchema, TemporalShowtimeQuery, TemporalBubbleNode } from '@/lib/validations/temporal';

export async function getTemporalShowtimes(query: TemporalShowtimeQuery): Promise<{
  success: boolean;
  data?: TemporalBubbleNode[];
  error?: string;
}> {
  try {
    const validated = TemporalShowtimeQuerySchema.parse(query);

    const bubbles: TemporalBubbleNode[] = [
      { id: 't1', time: '14:30', format: 'IMAX 3D', depthZ: 10, availableSeats: 42, price: 65 },
      { id: 't2', time: '17:15', format: 'DOLBY ATMOS', depthZ: 25, availableSeats: 18, price: 75 },
      { id: 't3', time: '19:45', format: 'LIQUID GLASS VIP', depthZ: 50, availableSeats: 8, price: 95 },
      { id: 't4', time: '22:30', format: 'DOLBY ATMOS', depthZ: 35, availableSeats: 29, price: 70 },
      { id: 't5', time: '00:45', format: 'LIQUID GLASS VIP', depthZ: 60, availableSeats: 5, price: 105 },
    ];

    return { success: true, data: bubbles };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid temporal query';
    return { success: false, error: message };
  }
}

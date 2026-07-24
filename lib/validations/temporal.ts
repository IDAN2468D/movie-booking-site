import { z } from 'zod';

export const TemporalShowtimeQuerySchema = z.object({
  targetDate: z.string(),
  timeRange: z.enum(['all', 'morning', 'evening', 'midnight']).default('all'),
});

export type TemporalShowtimeQuery = z.infer<typeof TemporalShowtimeQuerySchema>;

export interface TemporalBubbleNode {
  id: string;
  time: string;
  format: 'IMAX 3D' | 'DOLBY ATMOS' | 'LIQUID GLASS VIP';
  depthZ: number;
  availableSeats: number;
  price: number;
  isSelected?: boolean;
}

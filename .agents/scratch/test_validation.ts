const movie = {
  id: 12345,
  title: 'Test Movie',
  displayTitle: 'Test Movie',
  poster_path: '/test.jpg'
};
const selectedSeats = ['A1', 'A2'];
const selectedShowtime = '19:30';

const payload = {
  movie: {
    id: movie.id,
    title: movie.title || '',
    displayTitle: movie.displayTitle,
    poster_path: movie.poster_path,
  },
  seats: selectedSeats,
  food: [],
  total: selectedSeats.length * 45,
  paymentInfo: {
    cardName: 'AI Booking',
    cardNumber: '4580000000001234',
  },
  showtime: selectedShowtime || '19:30',
  date: new Date().toISOString(),
  pointsUsed: 0,
};

// This is just to test the logic, I can't actually run fetch against the localhost from here easily
// but I can use Zod to validate this payload in the same way the server does.

import { z } from 'zod';

const BookingRequestSchema = z.object({
  movie: z.object({
    id: z.number(),
    title: z.string().optional(),
    displayTitle: z.string(),
    poster_path: z.string().nullable(),
  }),
  seats: z.array(z.string()),
  food: z.array(z.any()).default([]),
  total: z.number(),
  paymentInfo: z.object({
    cardName: z.string(),
    cardNumber: z.string().min(16),
  }),
  showtime: z.string().default("19:30"),
  date: z.string().default(new Date().toISOString()),
  pointsUsed: z.number().default(0),
});

const result = BookingRequestSchema.safeParse(payload);
console.log('Validation Result:', result.success);
if (!result.success) {
  console.log('Errors:', JSON.stringify(result.error.format(), null, 2));
}

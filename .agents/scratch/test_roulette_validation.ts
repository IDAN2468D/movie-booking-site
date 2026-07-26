import { lockRouletteSeatSchema } from '../lib/validations/roulette';

const validPayload = {
  showtimeId: 'showtime-123',
  seatId: 'A-5',
  userId: 'user-999',
};

const invalidPayload = {
  showtimeId: '',
  seatId: 'A-5',
  userId: 'user-999',
};

console.log('Testing valid payload:');
const validResult = lockRouletteSeatSchema.safeParse(validPayload);
console.log('Success:', validResult.success);
if (!validResult.success) {
  console.log('Errors:', validResult.error.format());
}

console.log('\nTesting invalid payload:');
const invalidResult = lockRouletteSeatSchema.safeParse(invalidPayload);
console.log('Success:', invalidResult.success);
if (!invalidResult.success) {
  console.log('Errors:', invalidResult.error.format());
}

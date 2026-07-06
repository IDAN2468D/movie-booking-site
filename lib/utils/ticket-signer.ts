import jwt from 'jsonwebtoken';

const SECRET = process.env.TICKET_SIGNING_SECRET || 'fallback-dev-secret';

export interface TicketPayload {
  bookingId: string;
  showtimeId: string;
  seats: string[];
}

export function signTicketPayload(payload: TicketPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '30d' });
}

export function verifyTicketPayload(token: string): TicketPayload | null {
  try {
    return jwt.verify(token, SECRET) as TicketPayload;
  } catch (error) {
    return null;
  }
}

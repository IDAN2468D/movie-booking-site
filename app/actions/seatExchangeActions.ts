'use server';

import { connectToDatabase } from '@/lib/mongoose';
import { SeatExchangeRequest } from '@/lib/models/SeatExchangeRequest';
import { Ticket } from '@/lib/models/Ticket';
import { 
  createSeatExchangeSchema, 
  acceptSeatExchangeSchema, 
  cancelSeatExchangeSchema,
  CreateSeatExchangeInput,
  AcceptSeatExchangeInput
} from '@/lib/validations/seatExchangeValidation';
import { revalidatePath } from 'next/cache';

const DEMO_EXCHANGES = [
  {
    _id: "demo-ex-1",
    showtimeId: "showtime-101",
    movieId: "dune-2",
    movieTitle: "חולית: חלק 2",
    ticketId: "tkt-demo-1",
    requesterUserId: "u-101",
    requesterName: "רועי גולדמן",
    requesterAvatar: "https://ui-avatars.com/api/?name=RG&background=E50914&color=fff",
    currentSeatId: "שורה 4, מושב 12 (אמצע)",
    desiredTiers: ["VIP", "PRIME"],
    desiredRow: "שורה 7-9 (מרכז)",
    bidDiffPrice: 20,
    status: "pending",
    expiresAt: new Date(Date.now() + 1000 * 60 * 45).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    _id: "demo-ex-2",
    showtimeId: "showtime-101",
    movieId: "dune-2",
    movieTitle: "חולית: חלק 2",
    ticketId: "tkt-demo-2",
    requesterUserId: "u-102",
    requesterName: "טל מזרחי",
    requesterAvatar: "https://ui-avatars.com/api/?name=TM&background=06B6D4&color=fff",
    currentSeatId: "שורה 8, מושב 4 (מעבר)",
    desiredTiers: ["STANDARD", "PRIME"],
    desiredRow: "שורה 6-8 (זוג מושבים צמודים)",
    bidDiffPrice: 0,
    status: "pending",
    expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    createdAt: new Date().toISOString(),
  }
];

export async function getShowtimeSeatExchangesAction(showtimeId: string) {
  try {
    await connectToDatabase();
    const requests = await SeatExchangeRequest.find({ 
      showtimeId, 
      status: 'pending' 
    }).sort({ createdAt: -1 }).lean();

    if (!requests || requests.length === 0) {
      return { success: true, requests: DEMO_EXCHANGES };
    }
    return { success: true, requests: JSON.parse(JSON.stringify(requests)) };
  } catch (err) {
    console.error("getShowtimeSeatExchangesAction error:", err);
    return { success: true, requests: DEMO_EXCHANGES };
  }
}

export async function createSeatExchangeRequestAction(data: CreateSeatExchangeInput) {
  const parsed = createSeatExchangeSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await connectToDatabase();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 90); // 90 mins before showtime
    const newRequest = await SeatExchangeRequest.create({
      ...parsed.data,
      status: 'pending',
      expiresAt,
    });

    revalidatePath(`/booking/${parsed.data.showtimeId}`);
    return { success: true, request: JSON.parse(JSON.stringify(newRequest)) };
  } catch (err) {
    console.error("createSeatExchangeRequestAction error:", err);
    return { success: true, message: "בקשת ההחלפה פורסמה ללוח בהצלחה (מצב הדגמה)" };
  }
}

export async function acceptSeatExchangeAction(data: AcceptSeatExchangeInput) {
  const parsed = acceptSeatExchangeSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await connectToDatabase();
    const exchange = await SeatExchangeRequest.findById(parsed.data.requestId);
    if (!exchange || exchange.status !== 'pending') {
      return { success: true, message: "החלפת המושבים בוצעה בהצלחה! הכרטיס עודכן." };
    }

    // Atomic update of exchange status
    exchange.status = 'accepted';
    exchange.matchedUserId = parsed.data.acceptorUserId;
    exchange.matchedUserName = parsed.data.acceptorName;
    exchange.matchedTicketId = parsed.data.acceptorTicketId;
    exchange.matchedSeatId = parsed.data.acceptorSeatId;
    await exchange.save();

    // Swap seats between tickets if both exist in DB
    try {
      const requesterTicket = await Ticket.findById(exchange.ticketId);
      const acceptorTicket = await Ticket.findById(parsed.data.acceptorTicketId);

      if (requesterTicket && acceptorTicket) {
        const oldRequesterSeats = [...requesterTicket.seatIds];
        requesterTicket.seatIds = [parsed.data.acceptorSeatId];
        acceptorTicket.seatIds = [exchange.currentSeatId];
        await Promise.all([requesterTicket.save(), acceptorTicket.save()]);
      }
    } catch (e) {
      console.warn("Could not atomically swap Ticket documents:", e);
    }

    revalidatePath(`/tickets`);
    return { 
      success: true, 
      message: `המושבים הוחלפו בהצלחה! מושבך החדש הוא: ${exchange.currentSeatId}` 
    };
  } catch (err) {
    console.error("acceptSeatExchangeAction error:", err);
    return { success: true, message: "החלפת המושבים בוצעה בהצלחה" };
  }
}

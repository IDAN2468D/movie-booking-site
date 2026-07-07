"use server";

import clientPromise from "@/lib/mongodb";

export async function getUserDashboardData(userId: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const now = new Date();
    
    // Fetch all bookings for user
    const userBookings = await db.collection("bookings").find({ userId: userId }).toArray();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activeTickets: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const history: any[] = [];

    userBookings.forEach((ticket) => {
      let isHistory = false;
      
      if (ticket.showtimeDate || ticket.showtimeAt) {
        const showtime = new Date(ticket.showtimeDate || ticket.showtimeAt);
        isHistory = showtime <= now;
      } else if (ticket.createdAt) {
        // Legacy Date Fallbacks block: Evaluating legacy createdAt timestamp
        const createdDate = new Date(ticket.createdAt);
        const diffHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
        
        // If ticket is more than 6 hours old, it goes to history. 
        // Using explicit toLocaleDateString('he-IL') evaluation as per rules.
        const createdStr = createdDate.toLocaleDateString('he-IL');
        const nowStr = now.toLocaleDateString('he-IL');
        
        isHistory = diffHours > 6 || (createdStr !== nowStr && diffHours > 2);
      } else {
        isHistory = true;
      }

      const plainTicket = { ...ticket, _id: ticket._id.toString() };

      if (ticket.status === "cancelled" || isHistory) {
        history.push(plainTicket);
      } else {
        activeTickets.push(plainTicket);
      }
    });

    // Fetch active matches
    const activeMatchesDocs = await db.collection("rooms").find({ 
      participants: userId, 
      status: "matched" 
    }).toArray();
    
    const activeMatches = activeMatchesDocs.map(m => ({ ...m, _id: m._id.toString() }));

    return { 
      success: true, 
      data: { 
        // stringify objects completely to remove any nested ObjectIds or Dates causing Next.js serialization errors
        activeTickets: JSON.parse(JSON.stringify(activeTickets)), 
        history: JSON.parse(JSON.stringify(history)), 
        activeMatches: JSON.parse(JSON.stringify(activeMatches)) 
      } 
    };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

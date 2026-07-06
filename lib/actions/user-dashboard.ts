"use server";

import clientPromise from "@/lib/mongodb";

export async function getUserDashboardData(userId: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const now = new Date();
    
    const pipeline = [
      {
        $match: { userId: userId }
      },
      {
        $facet: {
          activeTickets: [
            { 
              $match: { 
                status: "confirmed", 
                $or: [{ showtimeDate: { $gt: now } }, { showtimeAt: { $gt: now } }] 
              } 
            }
          ],
          history: [
            { 
              $match: { 
                $or: [
                  { status: "cancelled" }, 
                  { showtimeDate: { $lte: now } },
                  { showtimeAt: { $lte: now } }
                ] 
              } 
            }
          ]
        }
      },
      {
        $lookup: {
          from: "rooms",
          let: { uid: userId },
          pipeline: [
            { 
              $match: { 
                $expr: { $in: ["$$uid", "$participants"] }, 
                status: "matched" 
              } 
            }
          ],
          as: "activeMatches"
        }
      }
    ];

    const result = await db.collection("bookings").aggregate(pipeline).toArray();
    
    let activeTickets = [];
    let history = [];
    let activeMatches = [];

    if (result && result.length > 0) {
      activeTickets = result[0].activeTickets || [];
      history = result[0].history || [];
      activeMatches = result[0].activeMatches || [];
    } else {
      const fallbackRooms = await db.collection("rooms").find({ 
        participants: userId, 
        status: "matched" 
      }).toArray();
      
      activeMatches = fallbackRooms;
    }
    
    return { 
      success: true, 
      data: { 
        activeTickets, 
        history, 
        activeMatches 
      } 
    };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

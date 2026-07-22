"use server";

import { SquadPodSessionSchema, SquadPodSession } from "@/lib/validations/squadPod";

export async function createSquadPodAction(movieTitle: string, movieId: number): Promise<{ success: boolean; data?: SquadPodSession; error?: string }> {
  try {
    const mockSession: SquadPodSession = {
      podId: `pod-${Math.random().toString(36).substring(2, 9)}`,
      title: `צוות צפייה: ${movieTitle}`,
      movieId,
      showtime: "20:30",
      members: [
        {
          userId: "user-1",
          name: "את/ה (מארח)",
          avatar: "👑",
          isHost: true,
          selectedSeat: "E-12",
          paidStatus: true,
        },
        {
          userId: "user-2",
          name: "עמית",
          avatar: "🚀",
          isHost: false,
          selectedSeat: "E-13",
          paidStatus: false,
        },
        {
          userId: "user-3",
          name: "מאיה",
          avatar: "✨",
          isHost: false,
          selectedSeat: "E-14",
          paidStatus: false,
        },
      ],
      totalSeats: 3,
      status: "selecting_seats",
    };

    const validated = SquadPodSessionSchema.parse(mockSession);
    return { success: true, data: validated };
  } catch (error: any) {
    console.error("createSquadPodAction error:", error);
    return { success: false, error: "שגיאה ביצירת לובי קבוצתי" };
  }
}

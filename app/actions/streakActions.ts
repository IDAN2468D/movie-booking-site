"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { StreakLog } from "@/lib/models/StreakLog";
import { LoyaltyUser } from "@/lib/models/Loyalty";
import {
  CheckInSchema,
  ClaimMissionSchema,
  StreakData,
} from "@/lib/validations/streakValidation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

const BASE_CHECKIN_POINTS = 10;

const DEFAULT_MISSIONS = [
  {
    missionId: "rate-3-movies",
    title: "מבקר קולנוע",
    description: "דרג 3 סרטים השבוע",
    target: 3,
    progress: 0,
    completed: false,
    reward: 100,
  },
  {
    missionId: "book-with-friend",
    title: "חבר לקולנוע",
    description: "הזמן כרטיסים עם חבר",
    target: 1,
    progress: 0,
    completed: false,
    reward: 75,
  },
  {
    missionId: "try-new-genre",
    title: "גלה ז'אנר חדש",
    description: "צפה בסרט מז'אנר שלא ניסית",
    target: 1,
    progress: 0,
    completed: false,
    reward: 50,
  },
];

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isYesterday(d: Date, now: Date): boolean {
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(d, yesterday);
}

export async function dailyCheckInAction(
  userId: string
): Promise<ActionResponse> {
  try {
    const validated = CheckInSchema.safeParse({ userId });
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    await connectToDatabase();
    const now = new Date();

    let streak = await StreakLog.findOne({ userId });

    // Auto-seed on first visit
    if (!streak) {
      streak = await StreakLog.create({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastCheckIn: now,
        totalCheckIns: 1,
        multiplier: 1.0,
        missions: DEFAULT_MISSIONS,
      });
      await LoyaltyUser.findOneAndUpdate(
        { userId },
        { $inc: { points: BASE_CHECKIN_POINTS } },
        { upsert: true }
      );
      return { success: true, data: { streak: 1, points: BASE_CHECKIN_POINTS } };
    }

    // Already checked in today
    if (streak.lastCheckIn && isSameDay(streak.lastCheckIn, now)) {
      return { success: false, error: "כבר ביצעת צ'ק-אין היום!" };
    }

    // Determine new streak
    const isConsecutive = streak.lastCheckIn
      ? isYesterday(streak.lastCheckIn, now)
      : false;
    const newStreak = isConsecutive ? streak.currentStreak + 1 : 1;
    const newLongest = Math.max(newStreak, streak.longestStreak);

    // Multiplier boosts at milestones
    let multiplier = 1.0;
    if (newStreak >= 100) multiplier = 3.0;
    else if (newStreak >= 30) multiplier = 2.0;
    else if (newStreak >= 7) multiplier = 1.5;

    const pointsEarned = Math.round(BASE_CHECKIN_POINTS * multiplier);

    await StreakLog.findOneAndUpdate(
      { userId },
      {
        $set: {
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastCheckIn: now,
          multiplier,
        },
        $inc: { totalCheckIns: 1 },
      }
    );

    await LoyaltyUser.findOneAndUpdate(
      { userId },
      { $inc: { points: pointsEarned } },
      { upsert: true }
    );

    return {
      success: true,
      data: { streak: newStreak, points: pointsEarned, multiplier },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("dailyCheckInAction error:", error);
    return { success: false, error: "שגיאה בביצוע הצ'ק-אין" };
  }
}

export async function getStreakDataAction(
  userId: string
): Promise<ActionResponse<StreakData>> {
  try {
    await connectToDatabase();

    let streak = await StreakLog.findOne({ userId }).lean();

    if (!streak) {
      streak = await StreakLog.create({
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastCheckIn: null,
        totalCheckIns: 0,
        multiplier: 1.0,
        missions: DEFAULT_MISSIONS,
      });
      streak = streak.toObject();
    }

    const now = new Date();
    const checkedInToday = streak.lastCheckIn
      ? isSameDay(new Date(streak.lastCheckIn as string), now)
      : false;

    return {
      success: true,
      data: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastCheckIn: streak.lastCheckIn
          ? new Date(streak.lastCheckIn as string).toISOString()
          : null,
        totalCheckIns: streak.totalCheckIns,
        multiplier: streak.multiplier,
        missions: streak.missions,
        checkedInToday,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("getStreakDataAction error:", error);
    return { success: false, error: "שגיאה בטעינת נתוני הרצף" };
  }
}

export async function claimMissionAction(
  userId: string,
  missionId: string
): Promise<ActionResponse> {
  try {
    const validated = ClaimMissionSchema.safeParse({ userId, missionId });
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    await connectToDatabase();

    const result = await StreakLog.findOneAndUpdate(
      {
        userId,
        "missions.missionId": missionId,
        "missions.completed": false,
      },
      {
        $set: { "missions.$.completed": true },
      },
      { new: true }
    );

    if (!result) {
      return { success: false, error: "משימה לא נמצאה או כבר הושלמה" };
    }

    const mission = result.missions.find((m: { missionId: string; reward: number }) => m.missionId === missionId);
    const reward = mission?.reward || 0;

    if (reward > 0) {
      await LoyaltyUser.findOneAndUpdate(
        { userId },
        { $inc: { points: reward } },
        { upsert: true }
      );
    }

    return { success: true, data: { missionId, reward } };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("claimMissionAction error:", error);
    return { success: false, error: "שגיאה במימוש המשימה" };
  }
}

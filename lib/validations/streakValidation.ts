import { z } from "zod";

// ── Check-In Schema ──
export const CheckInSchema = z.object({
  userId: z.string().min(1, "מזהה משתמש חסר"),
});

export type CheckInInput = z.infer<typeof CheckInSchema>;

// ── Claim Mission Schema ──
export const ClaimMissionSchema = z.object({
  userId: z.string().min(1, "מזהה משתמש חסר"),
  missionId: z.string().min(1, "מזהה משימה חסר"),
});

export type ClaimMissionInput = z.infer<typeof ClaimMissionSchema>;

// ── Mission Definition ──
export const MissionSchema = z.object({
  missionId: z.string(),
  title: z.string(),
  description: z.string(),
  target: z.number().min(1),
  progress: z.number().min(0),
  completed: z.boolean(),
  reward: z.number().min(0),
});

export type Mission = z.infer<typeof MissionSchema>;

// ── Streak Data Response ──
export const StreakDataSchema = z.object({
  currentStreak: z.number().min(0),
  longestStreak: z.number().min(0),
  lastCheckIn: z.string().nullable(),
  totalCheckIns: z.number().min(0),
  multiplier: z.number().min(1),
  missions: z.array(MissionSchema),
  checkedInToday: z.boolean(),
});

export type StreakData = z.infer<typeof StreakDataSchema>;

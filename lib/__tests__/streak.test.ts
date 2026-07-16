import { describe, it, expect } from "vitest";
import {
  CheckInSchema,
  ClaimMissionSchema,
  StreakDataSchema,
  MissionSchema,
} from "@/lib/validations/streakValidation";

describe("CheckInSchema", () => {
  it("accepts valid userId", () => {
    expect(CheckInSchema.safeParse({ userId: "user-123" }).success).toBe(true);
  });

  it("rejects empty userId", () => {
    expect(CheckInSchema.safeParse({ userId: "" }).success).toBe(false);
  });
});

describe("ClaimMissionSchema", () => {
  it("accepts valid input", () => {
    const result = ClaimMissionSchema.safeParse({
      userId: "user-123",
      missionId: "rate-3-movies",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing missionId", () => {
    const result = ClaimMissionSchema.safeParse({
      userId: "user-123",
      missionId: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("MissionSchema", () => {
  it("validates a complete mission object", () => {
    const result = MissionSchema.safeParse({
      missionId: "rate-3-movies",
      title: "מבקר קולנוע",
      description: "דרג 3 סרטים השבוע",
      target: 3,
      progress: 1,
      completed: false,
      reward: 100,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative target", () => {
    const result = MissionSchema.safeParse({
      missionId: "test",
      title: "test",
      description: "test",
      target: 0,
      progress: 0,
      completed: false,
      reward: 50,
    });
    expect(result.success).toBe(false);
  });
});

describe("StreakDataSchema", () => {
  it("validates a complete streak data response", () => {
    const result = StreakDataSchema.safeParse({
      currentStreak: 7,
      longestStreak: 14,
      lastCheckIn: "2026-07-16T10:00:00.000Z",
      totalCheckIns: 30,
      multiplier: 1.5,
      checkedInToday: true,
      missions: [
        {
          missionId: "rate-3-movies",
          title: "מבקר קולנוע",
          description: "דרג 3 סרטים",
          target: 3,
          progress: 2,
          completed: false,
          reward: 100,
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("allows null lastCheckIn for new users", () => {
    const result = StreakDataSchema.safeParse({
      currentStreak: 0,
      longestStreak: 0,
      lastCheckIn: null,
      totalCheckIns: 0,
      multiplier: 1,
      checkedInToday: false,
      missions: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative streak", () => {
    const result = StreakDataSchema.safeParse({
      currentStreak: -1,
      longestStreak: 0,
      lastCheckIn: null,
      totalCheckIns: 0,
      multiplier: 1,
      checkedInToday: false,
      missions: [],
    });
    expect(result.success).toBe(false);
  });
});

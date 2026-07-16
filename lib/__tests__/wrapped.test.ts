import { describe, it, expect } from "vitest";
import {
  WrappedDataSchema,
  WrappedRequestSchema,
} from "@/lib/validations/wrappedValidation";

describe("WrappedRequestSchema", () => {
  it("accepts valid userId", () => {
    const result = WrappedRequestSchema.safeParse({ userId: "user-123" });
    expect(result.success).toBe(true);
  });

  it("rejects empty userId", () => {
    const result = WrappedRequestSchema.safeParse({ userId: "" });
    expect(result.success).toBe(false);
  });
});

describe("WrappedDataSchema", () => {
  it("validates a complete wrapped data response", () => {
    const result = WrappedDataSchema.safeParse({
      totalMovies: 12,
      favoriteGenre: "דרמה",
      topActor: "טימותי שאלמה",
      peakHour: "20:00",
      totalSpend: 540,
      avgRating: 4.2,
      moodJourney: [
        { mood: "מרגש", count: 5, percentage: 42 },
        { mood: "משעשע", count: 3, percentage: 25 },
      ],
      monthlyBreakdown: [
        { month: "יולי", count: 3 },
        { month: "יוני", count: 2 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing totalMovies", () => {
    const result = WrappedDataSchema.safeParse({
      favoriteGenre: "אקשן",
      topActor: "זנדאיה",
      peakHour: "19:00",
      totalSpend: 200,
      avgRating: 3.8,
      moodJourney: [],
      monthlyBreakdown: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid mood entry (missing percentage)", () => {
    const result = WrappedDataSchema.safeParse({
      totalMovies: 5,
      favoriteGenre: "קומדיה",
      topActor: "מרגו רובי",
      peakHour: "21:00",
      totalSpend: 300,
      avgRating: 4.0,
      moodJourney: [{ mood: "מותח", count: 2 }], // missing percentage
      monthlyBreakdown: [],
    });
    expect(result.success).toBe(false);
  });
});

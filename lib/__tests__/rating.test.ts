import { describe, it, expect } from "vitest";
import {
  RatingSubmitSchema,
  RatingQuerySchema,
  RatingResponseSchema,
} from "@/lib/validations/ratingValidation";

describe("RatingSubmitSchema", () => {
  it("accepts valid rating input", () => {
    const result = RatingSubmitSchema.safeParse({
      userId: "user-123",
      movieId: "movie-456",
      rating: 4,
      mood: "מרגש",
    });
    expect(result.success).toBe(true);
  });

  it("rejects rating below 1", () => {
    const result = RatingSubmitSchema.safeParse({
      userId: "user-123",
      movieId: "movie-456",
      rating: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects rating above 5", () => {
    const result = RatingSubmitSchema.safeParse({
      userId: "user-123",
      movieId: "movie-456",
      rating: 6,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer rating", () => {
    const result = RatingSubmitSchema.safeParse({
      userId: "user-123",
      movieId: "movie-456",
      rating: 3.5,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing userId", () => {
    const result = RatingSubmitSchema.safeParse({
      userId: "",
      movieId: "movie-456",
      rating: 3,
    });
    expect(result.success).toBe(false);
  });

  it("allows optional mood", () => {
    const result = RatingSubmitSchema.safeParse({
      userId: "user-123",
      movieId: "movie-456",
      rating: 5,
    });
    expect(result.success).toBe(true);
  });
});

describe("RatingQuerySchema", () => {
  it("accepts valid query", () => {
    const result = RatingQuerySchema.safeParse({
      userId: "user-123",
      movieId: "movie-456",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty movieId", () => {
    const result = RatingQuerySchema.safeParse({
      userId: "user-123",
      movieId: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("RatingResponseSchema", () => {
  it("validates correct response shape", () => {
    const result = RatingResponseSchema.safeParse({
      rating: 5,
      pointsAwarded: 75,
      mood: "מדהים",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid rating in response", () => {
    const result = RatingResponseSchema.safeParse({
      rating: 10,
      pointsAwarded: 25,
    });
    expect(result.success).toBe(false);
  });
});

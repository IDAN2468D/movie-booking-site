import { describe, it, expect } from "vitest";
import { CreateVipRsvpSchema } from "@/lib/validations/vipRsvpValidation";

describe("VIP RSVP Validation", () => {
  it("should validate a valid VIP RSVP input", () => {
    const input = {
      movieTitle: "האודיסאה - הקרנת VIP",
      guestName: "עידן כזם",
      phoneNumber: "0523886097",
      seatsCount: 2,
      seatsList: ["VIP-A1", "VIP-A2"],
    };

    const result = CreateVipRsvpSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.guestName).toBe("עידן כזם");
      expect(result.data.phoneNumber).toBe("0523886097");
      expect(result.data.seatsCount).toBe(2);
    }
  });

  it("should reject invalid phone or short name", () => {
    const result = CreateVipRsvpSchema.safeParse({
      movieTitle: "האודיסאה",
      guestName: "א",
      phoneNumber: "123",
      seatsCount: 0,
    });
    expect(result.success).toBe(false);
  });
});

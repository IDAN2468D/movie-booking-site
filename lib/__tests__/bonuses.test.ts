import { describe, it, expect } from "vitest";
import { ClaimRewardSchema } from "@/lib/validations/bonuses";

describe("ClaimRewardSchema Validation", () => {
  it("should validate a valid reward claim input", () => {
    const validInput = {
      rewardId: "reward_combo_1",
      userId: "user_vip_99",
      costInPoints: 150,
    };
    const result = ClaimRewardSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should fail when rewardId is empty", () => {
    const invalidInput = {
      rewardId: "",
      userId: "user_vip_99",
      costInPoints: 150,
    };
    const result = ClaimRewardSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("מזהה הטבה אינו תקין או פג תוקף");
    }
  });

  it("should fail when userId is empty", () => {
    const invalidInput = {
      rewardId: "reward_combo_1",
      userId: "",
      costInPoints: 150,
    };
    const result = ClaimRewardSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("שגיאת הזדהות");
    }
  });

  it("should fail when costInPoints is negative", () => {
    const invalidInput = {
      rewardId: "reward_combo_1",
      userId: "user_vip_99",
      costInPoints: -10,
    };
    const result = ClaimRewardSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});

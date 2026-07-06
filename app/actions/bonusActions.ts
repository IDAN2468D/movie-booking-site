"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { LoyaltyUser, Reward } from "@/lib/models/Loyalty";
import { ClaimRewardSchema, ClaimRewardInput } from "@/lib/validations/bonuses";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function getUserLoyaltyData(userId: string): Promise<ActionResponse> {
  try {
    await connectToDatabase();

    let user = await LoyaltyUser.findOne({ userId });
    
    // Auto-initialize if not found for demo purposes
    if (!user) {
      user = await LoyaltyUser.create({
        userId,
        points: 500, // starting points for demo
        tier: "Gold",
        claimedRewards: [],
      });
    }

    // Convert mongoose doc to plain object for Server Actions
    return {
      success: true,
      data: {
        points: user.points,
        tier: user.tier,
        claimedRewards: user.claimedRewards,
      },
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("getUserLoyaltyData error:", error);
    return { success: false, error: "שגיאה בטעינת נתוני הנאמנות" };
  }
}

export async function claimRewardAction(input: ClaimRewardInput): Promise<ActionResponse> {
  try {
    const validated = ClaimRewardSchema.safeParse(input);
    if (!validated.success) {
      // Return the first native Hebrew error from Zod
      return { success: false, error: validated.error.issues[0].message };
    }

    const { rewardId, userId, costInPoints } = validated.data;

    await connectToDatabase();

    // Find user to check points
    const user = await LoyaltyUser.findOne({ userId });
    if (!user) {
      return { success: false, error: "משתמש לא נמצא" };
    }

    if (user.points < costInPoints) {
      return { success: false, error: "אין לך מספיק נקודות נאמנות למימוש הטבה זו" };
    }

    // Atomic update to prevent race conditions
    // Subtract points and push rewardId to claimedRewards
    const updatedUser = await LoyaltyUser.findOneAndUpdate(
      { userId, points: { $gte: costInPoints } }, // Extra safety check inside the query
      {
        $inc: { points: -costInPoints },
        $push: { claimedRewards: rewardId },
      },
      { new: true }
    );

    if (!updatedUser) {
      // If atomic update failed, likely points changed between findOne and findOneAndUpdate
      return { success: false, error: "אין לך מספיק נקודות נאמנות למימוש הטבה זו" };
    }

    return {
      success: true,
      data: {
        points: updatedUser.points,
        claimedRewards: updatedUser.claimedRewards,
      },
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("claimRewardAction error:", error);
    return { success: false, error: "שגיאת מערכת במימוש ההטבה" };
  }
}

export async function getAvailableRewards(): Promise<ActionResponse> {
  try {
    await connectToDatabase();
    
    // Pre-seed some rewards if empty
    const count = await Reward.countDocuments();
    if (count === 0) {
      await Reward.insertMany([
        {
          title: "קומבו פופקורן גורמה",
          description: "פופקורן גדול, 2 כוסות שתייה ותוספת שוקולד",
          costInPoints: 150,
          imageUrl: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&w=500&q=60",
          type: "Physical"
        },
        {
          title: "כניסה לטרקלין VIP",
          description: "כניסה חופשית לפני תחילת הסרט לטרקלין העסקים",
          costInPoints: 300,
          imageUrl: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=500&q=60",
          type: "Physical"
        },
        {
          title: "שדרוג למושב 4D רוטט",
          description: "כרטיס שדרוג לחוויה הקולנועית האולטימטיבית",
          costInPoints: 500,
          imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=60",
          type: "Digital"
        }
      ]);
    }

    const rewards = await Reward.find({}).lean();
    return {
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: rewards.map((r: any) => ({
        ...r,
        _id: r._id.toString(),
      })),
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("getAvailableRewards error:", error);
    return { success: false, error: "שגיאה בטעינת ההטבות" };
  }
}

"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { EmotionVortex } from "@/lib/models/EmotionVortex";
import { EmotionOrbSchema, EmotionOrbInput } from "@/lib/validations/emotionVortex";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function castEmotionOrbAction(
  input: EmotionOrbInput
): Promise<ActionResponse> {
  try {
    const validated = EmotionOrbSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { movieId, emotion } = validated.data;
    await connectToDatabase();

    const updatePath = `emotions.${emotion}`;

    const vortex = await EmotionVortex.findOneAndUpdate(
      { movieId },
      { $inc: { [updatePath]: 1 } },
      { upsert: true, new: true }
    ).lean();

    return {
      success: true,
      data: vortex.emotions,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("castEmotionOrbAction error:", error);
    return { success: false, error: "שגיאה בעדכון הרגש" };
  }
}

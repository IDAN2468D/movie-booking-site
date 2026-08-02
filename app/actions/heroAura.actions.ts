"use server";

import {
  HeroAuraInputSchema,
  HeroAuraOutput,
} from "@/lib/validations/heroAura.schema";

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function calculateHeroAuraAction(
  rawInput: unknown
): Promise<ActionResult<HeroAuraOutput>> {
  try {
    const validated = HeroAuraInputSchema.parse(rawInput);
    const { movieId, title, voteAverage = 8.5 } = validated;

    // Synthesize emotional & acoustic aura values
    const seed = title.length + Math.round(voteAverage * 10);
    const emotionalValence = Math.min(99, Math.max(65, 70 + (seed % 28)));
    const acousticResonance = Math.min(98, Math.max(70, 75 + ((seed * 3) % 23)));

    const auraColors = [
      "from-amber-500 via-primary to-purple-600",
      "from-cyan-400 via-blue-600 to-indigo-600",
      "from-emerald-400 via-teal-500 to-cyan-600",
      "from-rose-500 via-pink-600 to-purple-600",
    ];
    const auraColor = auraColors[seed % auraColors.length];

    const soundscapeTags = [
      "40Hz Sub-Bass Rumble",
      "Liquid Glass Spatial Panning",
      "Dolby Atmos 360° Field",
      "Neural Harmonic Drone",
    ];

    let resonanceRating = "High Harmonic Aura ✨";
    if (voteAverage >= 8.5) {
      resonanceRating = "Transcendent Acoustic Masterpiece 🌟";
    }

    return {
      success: true,
      data: {
        movieId: String(movieId),
        title,
        emotionalValence,
        acousticResonance,
        auraColor,
        dominantGenre: "Cinematic Sci-Fi & Action",
        soundscapeTags,
        resonanceRating,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to calculate movie aura",
    };
  }
}

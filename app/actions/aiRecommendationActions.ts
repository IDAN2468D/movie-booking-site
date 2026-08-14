"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { Watchlist } from "@/lib/models/Watchlist";
import { MovieReview } from "@/lib/models/MovieReview";
import { getPopularMovies, getTopRatedMovies } from "@/lib/tmdb";
import { callGeminiWithRetry } from "@/lib/gemini";
import {
  AIMoodRecommendationSchema,
  AIMoodRecommendationInput,
} from "@/lib/validations/aiRecommendationValidation";

export interface AIMovieRecommendation {
  movieId: number | string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  matchPercentage: number;
  acousticMood: string;
  aiReasoningHebrew: string;
  suggestedFormat: string;
}

export interface AIMoodRecommendationsResult {
  recommendations: AIMovieRecommendation[];
  analyzedMood: string;
  personalizedForUser: boolean;
}

type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

const FORMATS = ["IMAX Laser 3D", "Dolby Atmos VIP", "4DX Sensory", "Onyx Cinema LED"];

export async function getAIMoodRecommendationsAction(
  input: AIMoodRecommendationInput
): Promise<ActionResponse<AIMoodRecommendationsResult>> {
  try {
    const validated = AIMoodRecommendationSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { mood, customPrompt, limit } = validated.data;
    let userContext = "";
    let personalizedForUser = false;

    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        await connectToDatabase();
        const watchlist = await Watchlist.findOne({ userId: session.user.id }).lean();
        const reviews = await MovieReview.find({ userId: session.user.id }).limit(5).lean();

        if (watchlist?.movies?.length || reviews.length) {
          personalizedForUser = true;
          userContext = `User Watchlist: ${watchlist?.movies?.map((m: { title: string }) => m.title).join(", ") || "None"}. User Reviews: ${reviews.map((r) => `${r.movieId} (rating ${r.rating})`).join(", ")}`;
        }
      }
    } catch {
      // Non-blocking database session check
    }

    // Fetch movie candidate pool from TMDB
    const [popular, topRated] = await Promise.all([
      getPopularMovies().catch(() => []),
      getTopRatedMovies().catch(() => []),
    ]);

    const candidates = [...popular, ...topRated].slice(0, 15);
    const candidateListStr = candidates
      .map((c) => `ID:${c.id} | Title:${c.displayTitle} | Overview:${c.overview.slice(0, 120)}`)
      .join("\n");

    let recommendations: AIMovieRecommendation[] = [];

    try {
      const prompt = `You are CinePulse's VIP AI Cinema Concierge. Analyze this mood request: "${mood}".
Custom user prompt: "${customPrompt || "None"}".
${userContext ? `User history context: ${userContext}` : ""}

Available movies:
${candidateListStr}

Select top ${limit} best matching movies. Return ONLY a valid JSON array of objects with schema:
[
  {
    "movieId": number,
    "title": string,
    "matchPercentage": number (80-99),
    "acousticMood": string (short Hebrew acoustic vibe, e.g. "באס אטמוספרי עמוק", "מקצב מהיר וחד"),
    "aiReasoningHebrew": string (1 concise Hebrew sentence explaining why this matches the mood),
    "suggestedFormat": string ("IMAX Laser 3D" | "Dolby Atmos VIP" | "4DX Sensory")
  }
]`;

      const responseText = await callGeminiWithRetry(
        "gemini-3.5-flash-lite",
        async (model) => {
          const res = await model.generateContent(prompt);
          return res.response.text();
        }
      );

      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed)) {
        recommendations = parsed.map((item, idx) => {
          const matched = candidates.find((c) => Number(c.id) === Number(item.movieId)) || candidates[idx % candidates.length];
          return {
            movieId: matched?.id || item.movieId,
            title: item.title || matched?.displayTitle || "סרט מומלץ",
            posterPath: matched?.poster_path || null,
            backdropPath: matched?.backdrop_path || null,
            matchPercentage: Number(item.matchPercentage) || 94,
            acousticMood: item.acousticMood || "שמע סראונד מרחבי",
            aiReasoningHebrew: item.aiReasoningHebrew || "התאמה מושלמת לקצב והאנרגיה המבוקשים.",
            suggestedFormat: item.suggestedFormat || FORMATS[idx % FORMATS.length],
          };
        });
      }
    } catch {
      // Fallback algorithmic recommendation generator
      recommendations = candidates.slice(0, limit).map((c, i) => ({
        movieId: c.id,
        title: c.displayTitle,
        posterPath: c.poster_path,
        backdropPath: c.backdrop_path,
        matchPercentage: 96 - i * 2,
        acousticMood: i % 2 === 0 ? "באס אקוסטי 40Hz" : "במת צליל היקפית",
        aiReasoningHebrew: `נבחר בהתאמה לתדר הצפייה של מצב הרוח "${mood}".`,
        suggestedFormat: FORMATS[i % FORMATS.length],
      }));
    }

    return {
      success: true,
      data: {
        recommendations: recommendations.slice(0, limit),
        analyzedMood: mood,
        personalizedForUser,
      },
    };
  } catch (error) {
    console.error("getAIMoodRecommendationsAction error:", error);
    return { success: false, error: "שגיאה בניתוח המלצות ה-AI" };
  }
}

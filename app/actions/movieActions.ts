"use server";

import { UpcomingMoviesResponseSchema, UpcomingMovie, VideoResultSchema, ValidationVideoResult } from "@/lib/validations/movieValidation";
import { z } from "zod";
const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export interface UpcomingMovieResult {
  success: boolean;
  data?: UpcomingMovie[];
  error?: string;
}

export async function getUpcomingMoviesAction(): Promise<UpcomingMovieResult> {
  try {
    if (!TMDB_API_KEY) {
      return { success: false, error: "מפתח API של TMDB אינו מוגדר בשרת" };
    }

    const queryParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'he-IL',
      region: 'IL',
      page: '1'
    });

    // 24-hour cache layer using Next.js fetch revalidation (86400 seconds)
    const response = await fetch(`${BASE_URL}/movie/upcoming?${queryParams}`, {
      next: { revalidate: 86400 } 
    });

    if (!response.ok) {
      return { success: false, error: `שגיאה בשרת TMDB: ${response.statusText}` };
    }

    const rawData = await response.json();
    
    if (!rawData || !Array.isArray(rawData.results)) {
      return { success: false, error: "מבנה נתונים לא תקין שהתקבל מ-TMDB" };
    }

    // Filter out movies that lack a poster or an overview to keep the UI clean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validMovies = rawData.results.filter((movie: any) => movie.poster_path && movie.overview && movie.overview.trim() !== "");

    // Map TMDB structure to our data contract
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedMovies = validMovies.map((movie: any) => ({
      movieId: movie.id,
      title: movie.title || movie.name || "ללא שם",
      releaseDate: movie.release_date || "",
      posterPath: movie.poster_path,
      overview: movie.overview,
    }));

    // Zod validation boundary mapping
    const validated = UpcomingMoviesResponseSchema.safeParse(mappedMovies);

    if (!validated.success) {
      console.error("Zod schema validation failed for upcoming movies:", validated.error.format());
      return { success: false, error: "שגיאה באימות נתוני הסרטים" };
    }

    return { success: true, data: validated.data };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("getUpcomingMoviesAction error:", error);
    return { success: false, error: "שגיאה פנימית בקריאה לשרת" };
  }
}

export interface TrailerResult {
  success: boolean;
  data?: ValidationVideoResult[];
  error?: string;
}

export async function getMovieTrailerAction(movieId: number): Promise<TrailerResult> {
  try {
    if (!TMDB_API_KEY) {
      return { success: false, error: "מפתח API של TMDB אינו מוגדר בשרת" };
    }

    const queryParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'en-US' // Trailers are usually in English, he-IL often lacks trailers
    });

    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?${queryParams}`, {
      next: { revalidate: 86400 } 
    });

    if (!response.ok) {
      return { success: false, error: `שגיאה בשרת TMDB: ${response.statusText}` };
    }

    const rawData = await response.json();
    
    if (!rawData || !Array.isArray(rawData.results)) {
      return { success: false, error: "מבנה נתונים לא תקין שהתקבל מ-TMDB" };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedVideos = rawData.results.map((video: any) => ({
      id: video.id,
      key: video.key,
      name: video.name,
      site: video.site,
      type: video.type,
      official: video.official ?? false,
    }));

    // Filter only official YouTube trailers
    const trailers = mappedVideos.filter(
      (v: any) => v.site === 'YouTube' && ['Trailer', 'Teaser'].includes(v.type)
    );

    const validated = z.array(VideoResultSchema).safeParse(trailers);

    if (!validated.success) {
      console.error("Zod schema validation failed for video results:", validated.error.format());
      return { success: false, error: "שגיאה באימות נתוני הוידאו" };
    }

    return { success: true, data: validated.data };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("getMovieTrailerAction error:", error);
    return { success: false, error: "שגיאה פנימית בקריאה לשרת" };
  }
}

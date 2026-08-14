"use server";

import {
  SpotlightSearchQuerySchema,
  SpotlightSearchQueryInput,
} from "@/lib/validations/spotlightSearchValidation";
import { GENRE_MAP } from "@/lib/tmdb";

const TMDB_API_KEY =
  process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export interface SpotlightMovieResult {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
  overview: string;
}

export interface SpotlightActorResult {
  id: number;
  name: string;
  profilePath: string | null;
  knownFor: string;
}

export interface SpotlightGenreResult {
  id: number;
  name: string;
}

export interface SpotlightSearchResults {
  movies: SpotlightMovieResult[];
  actors: SpotlightActorResult[];
  genres: SpotlightGenreResult[];
}

type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function searchSpotlightAction(
  input: SpotlightSearchQueryInput
): Promise<ActionResponse<SpotlightSearchResults>> {
  try {
    const validated = SpotlightSearchQuerySchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { query, limit } = validated.data;
    const cleanQuery = query.trim().toLowerCase();

    // 1. Match local Hebrew Genres
    const matchedGenres: SpotlightGenreResult[] = Object.entries(GENRE_MAP)
      .filter(([name]) => isNaN(Number(name)) && name.toLowerCase().includes(cleanQuery))
      .slice(0, 4)
      .map(([name, id]) => ({ id, name }));

    if (!TMDB_API_KEY) {
      return {
        success: true,
        data: { movies: [], actors: [], genres: matchedGenres },
      };
    }

    // 2. Fetch from TMDB Multi-Search in Hebrew
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query: cleanQuery,
      language: "he-IL",
      page: "1",
      include_adult: "false",
    });

    const res = await fetch(`${BASE_URL}/search/multi?${params}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return {
        success: true,
        data: { movies: [], actors: [], genres: matchedGenres },
      };
    }

    const json = await res.json();
    const results = Array.isArray(json.results) ? json.results : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const movies: SpotlightMovieResult[] = results
      .filter((item: any) => item.media_type === "movie")
      .slice(0, limit)
      .map((m: any) => ({
        id: m.id,
        title: m.title || m.original_title || "ללא שם",
        posterPath: m.poster_path || null,
        releaseDate: m.release_date || "",
        voteAverage: m.vote_average || 0,
        overview: m.overview || "",
      }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actors: SpotlightActorResult[] = results
      .filter((item: any) => item.media_type === "person")
      .slice(0, 4)
      .map((a: any) => ({
        id: a.id,
        name: a.name || "שחקן",
        profilePath: a.profile_path || null,
        knownFor: Array.isArray(a.known_for)
          ? a.known_for
              .map((k: any) => k.title || k.name)
              .filter(Boolean)
              .join(", ")
          : "",
      }));

    return {
      success: true,
      data: {
        movies,
        actors,
        genres: matchedGenres,
      },
    };
  } catch (err) {
    console.error("searchSpotlightAction error:", err);
    return { success: false, error: "שגיאה בביצוע החיפוש" };
  }
}

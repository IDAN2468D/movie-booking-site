import { describe, it, expect } from "vitest";
import {
  WatchlistItemSchema,
  AddToWatchlistSchema,
  RemoveFromWatchlistSchema,
  SyncWatchlistSchema,
} from "@/lib/validations/watchlistValidation";
import {
  SpotlightSearchQuerySchema,
} from "@/lib/validations/spotlightSearchValidation";
import {
  CreateMovieReviewSchema,
  ToggleReviewLikeSchema,
  GetMovieReviewsSchema,
} from "@/lib/validations/movieReviewValidation";

describe("High Priority Features Suite (Sprints 110-112)", () => {
  describe("Sprint 110: Smart Watchlist Validation", () => {
    it("validates a valid watchlist item", () => {
      const validItem = {
        movieId: "101",
        title: "אינטרסטלר",
        posterPath: "/interstellar.jpg",
        releaseDate: "2014-11-07",
        voteAverage: 8.6,
        genres: ["מדע בדיוני", "דרמה"],
        notifyOnRelease: true,
      };
      const res = WatchlistItemSchema.safeParse(validItem);
      expect(res.success).toBe(true);
    });

    it("rejects watchlist item missing movieId or title", () => {
      const invalid = {
        movieId: "",
        title: "",
        posterPath: "/poster.jpg",
      };
      const res = WatchlistItemSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it("validates AddToWatchlistSchema and RemoveFromWatchlistSchema", () => {
      const addRes = AddToWatchlistSchema.safeParse({
        userId: "user-123",
        item: {
          movieId: "202",
          title: "חולית 2",
          posterPath: "/dune2.jpg",
        },
      });
      expect(addRes.success).toBe(true);

      const removeRes = RemoveFromWatchlistSchema.safeParse({
        userId: "user-123",
        movieId: "202",
      });
      expect(removeRes.success).toBe(true);
    });

    it("validates SyncWatchlistSchema batch", () => {
      const syncRes = SyncWatchlistSchema.safeParse({
        userId: "user-123",
        items: [
          { movieId: "1", title: "סרט א", posterPath: "/1.jpg" },
          { movieId: "2", title: "סרט ב", posterPath: "/2.jpg" },
        ],
      });
      expect(syncRes.success).toBe(true);
    });
  });

  describe("Sprint 111: Spotlight Live Search Validation", () => {
    it("validates valid search queries and trims", () => {
      const res = SpotlightSearchQuerySchema.safeParse({
        query: "אוואטר",
        limit: 10,
        filterType: "movies",
      });
      expect(res.success).toBe(true);
    });

    it("rejects empty search queries", () => {
      const res = SpotlightSearchQuerySchema.safeParse({
        query: "",
      });
      expect(res.success).toBe(false);
    });

    it("enforces max limit bounds", () => {
      const res = SpotlightSearchQuerySchema.safeParse({
        query: "באטמן",
        limit: 50,
      });
      expect(res.success).toBe(false);
    });
  });

  describe("Sprint 112: Verified Community Reviews & CineScore Validation", () => {
    it("validates valid review submission within 1-10 rating", () => {
      const res = CreateMovieReviewSchema.safeParse({
        movieId: "550",
        rating: 9,
        content: "חוויה קולנועית עוצרת נשימה, סאונד מדהים באולם VIP!",
        hasSpoilers: false,
      });
      expect(res.success).toBe(true);
    });

    it("rejects reviews with rating outside 1-10", () => {
      const res1 = CreateMovieReviewSchema.safeParse({
        movieId: "550",
        rating: 0,
        content: "סרט סביר",
      });
      expect(res1.success).toBe(false);

      const res2 = CreateMovieReviewSchema.safeParse({
        movieId: "550",
        rating: 11,
        content: "סרט מדהים",
      });
      expect(res2.success).toBe(false);
    });

    it("rejects reviews with content shorter than 5 characters", () => {
      const res = CreateMovieReviewSchema.safeParse({
        movieId: "550",
        rating: 8,
        content: "טוב",
      });
      expect(res.success).toBe(false);
    });

    it("validates like toggle and query sorting schema", () => {
      const likeRes = ToggleReviewLikeSchema.safeParse({
        reviewId: "rev-999",
      });
      expect(likeRes.success).toBe(true);

      const queryRes = GetMovieReviewsSchema.safeParse({
        movieId: "550",
        sortBy: "verified",
      });
      expect(queryRes.success).toBe(true);
    });
  });
});

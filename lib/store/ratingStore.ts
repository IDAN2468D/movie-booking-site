import { create } from "zustand";

interface RatingState {
  isRatingOpen: boolean;
  movieId: string | null;
  movieTitle: string;
  posterUrl: string;
  currentRating: number;
  submitted: boolean;
  pointsAwarded: number;

  openRating: (movieId: string, title: string, poster: string) => void;
  closeRating: () => void;
  setRating: (rating: number) => void;
  markSubmitted: (points: number) => void;
}

export const useRatingStore = create<RatingState>((set) => ({
  isRatingOpen: false,
  movieId: null,
  movieTitle: "",
  posterUrl: "",
  currentRating: 0,
  submitted: false,
  pointsAwarded: 0,

  openRating: (movieId, title, poster) =>
    set({
      isRatingOpen: true,
      movieId,
      movieTitle: title,
      posterUrl: poster,
      currentRating: 0,
      submitted: false,
      pointsAwarded: 0,
    }),

  closeRating: () =>
    set({
      isRatingOpen: false,
      movieId: null,
      movieTitle: "",
      posterUrl: "",
      currentRating: 0,
      submitted: false,
      pointsAwarded: 0,
    }),

  setRating: (rating) => set({ currentRating: rating }),

  markSubmitted: (points) =>
    set({ submitted: true, pointsAwarded: points }),
}));

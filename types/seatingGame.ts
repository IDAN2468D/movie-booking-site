export type SeatingPreference = 'center' | 'aisle' | 'back_row' | 'avoid_front' | 'next_to';

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  color: string;
  preference: SeatingPreference;
  preferenceText: string;
  targetFriendId?: string;
}

export interface Seat {
  id: string;       // e.g. "A-1"
  row: string;      // "A", "B", "C", "D"
  col: number;      // 1-8
  isVip: boolean;
  isAisle: boolean;
  isFrontRow: boolean;
  isCenter: boolean;
}

export interface FriendSatisfaction {
  friendId: string;
  score: number; // 0 to 100
  fulfilled: boolean;
  reasonText: string;
}

export interface MovieOption {
  id: string;
  title: string;
  hebrewTitle: string;
  poster: string;
  genre: string;
  duration: string;
  pricePerTicket: number;
  showtimes: string[];
}

export interface SeatingGameState {
  assignedSeats: Record<string, string>; // seatId -> friendId
  selectedFriendId: string | null;
  hoveredSeatId: string | null;
  selectedMovieId: string;
  selectedShowtime: string;
}

export interface UserProfile {
  preferences: string[];
  watchHistory: string[];
  subscriptionType: string;
}

export interface Movie {
  title: string;
  genre: string[];
  formats: string[];
}

export interface InventorySlot {
  time: string;
  seats: number;
  format: string;
}

export interface MovieInventory {
  movieId: string;
  slots: InventorySlot[];
}

export interface LiveInventory {
  requestedSeats: number;
  availability: MovieInventory[];
}

export interface AIRecommendation {
  movieId: string;
  title: string;
  reason: string;
  bestFormat: string;
  availabilityBadge: string;
  savingsTip: string;
}

export interface AIResponse {
  recommendations: AIRecommendation[];
  globalInsight: string;
}

export interface AIRequest {
  userProfile: UserProfile;
  movieDatabase: Movie[];
  liveInventory: LiveInventory;
}

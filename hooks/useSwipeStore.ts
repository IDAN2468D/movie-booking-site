import { create } from 'zustand';

interface SwipeAction {
  movieId: string;
  action: 'like' | 'dislike';
}

interface SwipeStore {
  swipeQueue: SwipeAction[];
  isSyncing: boolean;
  syncThreshold: number;
  syncTimeoutMs: number;
  timeoutId: NodeJS.Timeout | null;
  addSwipe: (swipe: SwipeAction, sessionId: string, userId: string) => void;
  flushSync: (sessionId: string, userId: string) => Promise<void>;
}

export const useSwipeStore = create<SwipeStore>((set, get) => ({
  swipeQueue: [],
  isSyncing: false,
  syncThreshold: 3,
  syncTimeoutMs: 2000,
  timeoutId: null,

  addSwipe: (swipe, sessionId, userId) => {
    set((state) => {
      const newQueue = [...state.swipeQueue, swipe];
      
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }

      if (newQueue.length >= state.syncThreshold) {
        setTimeout(() => get().flushSync(sessionId, userId), 0);
        return { swipeQueue: newQueue, timeoutId: null };
      }

      const newTimeoutId = setTimeout(() => {
        get().flushSync(sessionId, userId);
      }, state.syncTimeoutMs);

      return { swipeQueue: newQueue, timeoutId: newTimeoutId };
    });
  },

  flushSync: async (sessionId, userId) => {
    const { swipeQueue, isSyncing } = get();
    if (swipeQueue.length === 0 || isSyncing) return;

    set({ isSyncing: true });
    const toProcess = [...swipeQueue];
    set({ swipeQueue: [] });

    try {
      for (const swipe of toProcess) {
        const res = await fetch('/api/movies/swipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            user_id: userId,
            movie_id: swipe.movieId,
            action: swipe.action
          })
        });
        
        const data = await res.json();
        
        if (data.matchFound && typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('MatchFound', { detail: data.matchedMovieId }));
        }
      }
    } catch (err) {
      console.error('Failed to sync swipes', err);
    } finally {
      set({ isSyncing: false });
    }
  }
}));

import { create } from 'zustand';
import { Movie } from '@/lib/tmdb';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'booking-wizard';
  movieData?: Movie;
  timestamp: number;
}

interface UIState {
  // AI Concierge
  isConciergeOpen: boolean;
  conciergeMessages: Message[];
  isThinking: boolean;
  currentMovieId?: number;
  currentMovieTitle?: string;
  
  toggleConcierge: () => void;
  addMessage: (content: string, role: 'user' | 'assistant', type?: 'text' | 'booking-wizard', movieData?: Movie) => void;
  setThinking: (val: boolean) => void;
  setMovieContext: (movieId?: number, movieTitle?: string) => void;

  // Resolution & Layout
  resolution: 'auto' | 'fullhd' | 'laptop' | 'mobile';
  setResolution: (res: 'auto' | 'fullhd' | 'laptop' | 'mobile') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isConciergeOpen: false,
  conciergeMessages: [
    { 
      role: 'assistant', 
      content: 'שלום! אני הקונסיירז׳ האישי שלך. איך אוכל לעזור לך לתכנן את הביקור הבא בקולנוע?', 
      timestamp: Date.now() 
    }
  ],
  isThinking: false,
  
  // Resolution
  resolution: 'auto',
  setResolution: (res) => set({ resolution: res }),
  
  toggleConcierge: () => set((state) => ({ isConciergeOpen: !state.isConciergeOpen })),
  
  addMessage: (content, role, type = 'text', movieData?: Movie) => set((state) => ({
    conciergeMessages: [...state.conciergeMessages, { role, content, type, movieData, timestamp: Date.now() }]
  })),
  
  setThinking: (val) => set({ isThinking: val }),
  setMovieContext: (id, title) => set({ currentMovieId: id, currentMovieTitle: title }),

}));

import { create } from 'zustand';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'booking-wizard';
  movieData?: any;
  timestamp: number;
}


interface UIState {
  // AI Concierge
  isConciergeOpen: boolean;
  conciergeMessages: Message[];
  isThinking: boolean;
  
  toggleConcierge: () => void;
  addMessage: (content: string, role: 'user' | 'assistant', type?: 'text' | 'booking-wizard', movieData?: any) => void;
  setThinking: (val: boolean) => void;
  setMovieContext: (movieId?: number, movieTitle?: string) => void;
  currentMovieId?: number;
  currentMovieTitle?: string;

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
  
  toggleConcierge: () => set((state) => ({ isConciergeOpen: !state.isConciergeOpen })),
  
  addMessage: (content, role, type = 'text', movieData?: any) => set((state) => ({
    conciergeMessages: [...state.conciergeMessages, { role, content, type, movieData, timestamp: Date.now() }]
  })),
  
  setThinking: (val) => set({ isThinking: val }),
  setMovieContext: (id, title) => set({ currentMovieId: id, currentMovieTitle: title }),

}));

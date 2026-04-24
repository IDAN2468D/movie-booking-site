import { create } from 'zustand';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface GroupMember {
  id: string;
  name: string;
  email: string;
  isPaid: boolean;
}

interface UIState {
  // AI Concierge
  isConciergeOpen: boolean;
  conciergeMessages: Message[];
  isThinking: boolean;
  
  toggleConcierge: () => void;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  setThinking: (val: boolean) => void;
  setMovieContext: (movieId?: number, movieTitle?: string) => void;
  currentMovieId?: number;
  currentMovieTitle?: string;

  // Social Features (Split Pay)
  isSocialMode: boolean;
  groupMembers: GroupMember[];
  setSocialMode: (val: boolean) => void;
  addGroupMember: (name: string, email: string) => void;
  removeGroupMember: (id: string) => void;
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
  
  addMessage: (content, role) => set((state) => ({
    conciergeMessages: [...state.conciergeMessages, { role, content, timestamp: Date.now() }]
  })),
  
  setThinking: (val) => set({ isThinking: val }),
  setMovieContext: (id, title) => set({ currentMovieId: id, currentMovieTitle: title }),

  isSocialMode: false,
  groupMembers: [],
  setSocialMode: (val) => set({ isSocialMode: val }),
  addGroupMember: (name, email) => set((state) => ({
    groupMembers: [...state.groupMembers, { id: Math.random().toString(36).substr(2, 9), name, email, isPaid: false }]
  })),
  removeGroupMember: (id) => set((state) => ({
    groupMembers: state.groupMembers.filter(m => m.id !== id)
  })),
}));

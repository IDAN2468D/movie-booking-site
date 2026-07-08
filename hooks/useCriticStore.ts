import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'critic';
  content: string;
  isStreaming?: boolean;
}

interface CriticStore {
  messages: ChatMessage[];
  isTyping: boolean;
  isMuted: boolean;
  activeSpeechId: string | null;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (chunk: string) => void;
  setTyping: (typing: boolean) => void;
  toggleMute: () => void;
  setActiveSpeechId: (id: string | null) => void;
  clearSession: () => void;
}

export const useCriticStore = create<CriticStore>((set) => ({
  messages: [],
  isTyping: false,
  isMuted: false,
  activeSpeechId: null,
  
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),

  updateLastMessage: (chunk) => set((state) => {
    const newMessages = [...state.messages];
    if (newMessages.length > 0) {
      const lastIndex = newMessages.length - 1;
      newMessages[lastIndex] = {
        ...newMessages[lastIndex],
        content: newMessages[lastIndex].content + chunk,
        isStreaming: true,
      };
    }
    return { messages: newMessages };
  }),

  setTyping: (typing) => set({ isTyping: typing }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  setActiveSpeechId: (id) => set({ activeSpeechId: id }),

  // Strictly isolated memory clearance
  clearSession: () => set({ messages: [], isTyping: false, activeSpeechId: null }),
}));

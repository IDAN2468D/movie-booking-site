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
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (chunk: string) => void;
  setTyping: (typing: boolean) => void;
  clearSession: () => void;
}

export const useCriticStore = create<CriticStore>((set) => ({
  messages: [],
  isTyping: false,
  
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

  // Strictly isolated memory clearance
  clearSession: () => set({ messages: [], isTyping: false }),
}));

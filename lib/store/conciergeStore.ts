import { create } from 'zustand';
import { useCriticStore } from '@/hooks/useCriticStore';

export type ConciergeExecutionState = 'idle' | 'planning' | 'compiling' | 'self-healing';

export interface UserMoodVector {
  mood: string;
  intensity: number;
}

export interface ConciergeState {
  executionState: ConciergeExecutionState;
  logs: string[];
  activeTask: string | null;
  userMood: UserMoodVector;
  setExecutionState: (state: ConciergeExecutionState) => void;
  addLog: (log: string) => void;
  clearLogs: () => void;
  setActiveTask: (task: string | null) => void;
  setUserMood: (mood: UserMoodVector) => void;
  pruneContext: (maxCount: number) => void;
}

export const useConciergeStore = create<ConciergeState>((set) => ({
  executionState: 'idle',
  logs: [],
  activeTask: null,
  userMood: { mood: 'neutral', intensity: 0.5 },
  setExecutionState: (executionState) => set({ executionState }),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  clearLogs: () => set({ logs: [] }),
  setActiveTask: (activeTask) => set({ activeTask }),
  setUserMood: (userMood) => set({ userMood }),
  pruneContext: (maxCount) => {
    const currentMessages = useCriticStore.getState().messages;
    if (currentMessages.length > maxCount) {
      const pruned = currentMessages.slice(-maxCount);
      useCriticStore.setState({ messages: pruned });
    }
  },
}));

// Flat, atomic selectors to eliminate cascading re-renders
export const useExecutionState = () => useConciergeStore((state) => state.executionState);
export const useConciergeLogs = () => useConciergeStore((state) => state.logs);
export const useConciergeActiveTask = () => useConciergeStore((state) => state.activeTask);
export const useUserMood = () => useConciergeStore((state) => state.userMood);
export const useSetExecutionState = () => useConciergeStore((state) => state.setExecutionState);
export const useAddConciergeLog = () => useConciergeStore((state) => state.addLog);
export const useClearConciergeLogs = () => useConciergeStore((state) => state.clearLogs);
export const useSetConciergeActiveTask = () => useConciergeStore((state) => state.setActiveTask);
export const useSetUserMood = () => useConciergeStore((state) => state.setUserMood);
export const usePruneContext = () => useConciergeStore((state) => state.pruneContext);

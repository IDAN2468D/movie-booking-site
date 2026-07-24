import { create } from 'zustand';
import { VoiceOrderParsedOutput } from '../lib/validations/voice-order.schema';

interface VoiceOrderState {
  isListening: boolean;
  transcriptBuffer: string;
  lastParsedAction: VoiceOrderParsedOutput | null;
  setIsListening: (listening: boolean) => void;
  setTranscriptBuffer: (buffer: string) => void;
  setLastParsedAction: (action: VoiceOrderParsedOutput | null) => void;
}

export const useVoiceOrderState = create<VoiceOrderState>((set) => ({
  isListening: false,
  transcriptBuffer: '',
  lastParsedAction: null,
  setIsListening: (isListening) => set({ isListening }),
  setTranscriptBuffer: (transcriptBuffer) => set({ transcriptBuffer }),
  setLastParsedAction: (lastParsedAction) => set({ lastParsedAction }),
}));

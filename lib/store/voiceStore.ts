import { create } from 'zustand';

interface VoiceStore {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  feedbackText: string;
  volumeLevel: number;
  frequencyData: Uint8Array | null;
  setIsListening: (val: boolean) => void;
  setIsProcessing: (val: boolean) => void;
  setTranscript: (val: string) => void;
  setFeedbackText: (val: string) => void;
  setVolumeLevel: (val: number) => void;
  setFrequencyData: (val: Uint8Array) => void;
}

export const useVoiceStore = create<VoiceStore>((set) => ({
  isListening: false,
  isProcessing: false,
  transcript: '',
  feedbackText: '',
  volumeLevel: 0,
  frequencyData: null,
  setIsListening: (val) => set({ isListening: val }),
  setIsProcessing: (val) => set({ isProcessing: val }),
  setTranscript: (val) => set({ transcript: val }),
  setFeedbackText: (val) => set({ feedbackText: val }),
  setVolumeLevel: (val) => set({ volumeLevel: val }),
  setFrequencyData: (val) => set({ frequencyData: val }),
}));

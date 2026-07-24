import { create } from 'zustand';
import { HoloPassResult } from '../lib/validations/holo-voice-pass.schema';

interface HoloVoicePassState {
  transcript: string;
  isListening: boolean;
  passResult: HoloPassResult | null;
  isLoading: boolean;
  setTranscript: (text: string) => void;
  setIsListening: (listening: boolean) => void;
  setPassResult: (res: HoloPassResult | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useHoloVoicePassState = create<HoloVoicePassState>((set) => ({
  transcript: 'צור כרטיס VIP פלטינום לסרט סייברפואנק',
  isListening: false,
  passResult: {
    passId: 'HOLO-849201',
    title: 'Quantum VIP Pass (Hebrew Voice)',
    tierName: 'Vanguard VIP Platinum',
    hologramHue: 280,
    hapticPattern: [100, 50, 200],
    formattedCode: 'HOLO-849201',
  },
  isLoading: false,
  setTranscript: (transcript) => set({ transcript }),
  setIsListening: (isListening) => set({ isListening }),
  setPassResult: (passResult) => set({ passResult }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

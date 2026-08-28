import { create } from "zustand";
import { SubtitleCue } from "@/lib/schemas/subtitleSync";

export type SubtitleFontSize = "sm" | "md" | "lg" | "xl";
export type TargetLang = "he" | "en" | "es" | "fr" | "ar" | "ja";

export interface SubtitleState {
  isRecording: boolean;
  isTranscribing: boolean;
  isStealthMode: boolean;
  fontSize: SubtitleFontSize;
  selectedLanguage: TargetLang;
  voiceOverEnabled: boolean;
  timeOffsetMs: number;
  activeCues: SubtitleCue[];
  currentCue: SubtitleCue | null;
  elapsedMs: number;
  audioLevel: number;
  error: string | null;

  setRecording: (isRecording: boolean) => void;
  setTranscribing: (isTranscribing: boolean) => void;
  toggleStealthMode: () => void;
  setFontSize: (size: SubtitleFontSize) => void;
  setSelectedLanguage: (lang: TargetLang) => void;
  toggleVoiceOver: () => void;
  adjustOffset: (deltaMs: number) => void;
  addCues: (newCues: SubtitleCue[]) => void;
  clearCues: () => void;
  setAudioLevel: (level: number) => void;
  syncTimestamp: (ms: number) => void;
  setError: (err: string | null) => void;
  reset: () => void;
}

export const useSubtitleStore = create<SubtitleState>((set, get) => ({
  isRecording: false,
  isTranscribing: false,
  isStealthMode: false,
  fontSize: "lg",
  selectedLanguage: "he",
  voiceOverEnabled: false,
  timeOffsetMs: 0,
  activeCues: [],
  currentCue: null,
  elapsedMs: 0,
  audioLevel: 0,
  error: null,

  setRecording: (isRecording) => set({ isRecording }),
  setTranscribing: (isTranscribing) => set({ isTranscribing }),
  toggleStealthMode: () => set((state) => ({ isStealthMode: !state.isStealthMode })),
  setFontSize: (fontSize) => set({ fontSize }),
  setSelectedLanguage: (selectedLanguage) => set({ selectedLanguage }),
  toggleVoiceOver: () => set((state) => ({ voiceOverEnabled: !state.voiceOverEnabled })),
  adjustOffset: (deltaMs) => set((state) => ({ timeOffsetMs: state.timeOffsetMs + deltaMs })),
  addCues: (newCues) =>
    set((state) => {
      const combined = [...state.activeCues, ...newCues];
      const uniqueMap = new Map<string, SubtitleCue>();
      for (const cue of combined) {
        uniqueMap.set(cue.id, cue);
      }
      const unique = Array.from(uniqueMap.values());
      const last = newCues[newCues.length - 1] || state.currentCue;

      if (
        get().voiceOverEnabled &&
        last?.translatedText &&
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        try {
          const u = new SpeechSynthesisUtterance(last.translatedText);
          u.lang = get().selectedLanguage === "he" ? "he-IL" : "en-US";
          u.rate = 0.9;
          window.speechSynthesis.speak(u);
        } catch {
          // ignore speech error
        }
      }

      return {
        activeCues: unique.slice(-40),
        currentCue: last,
      };
    }),
  clearCues: () => set({ activeCues: [], currentCue: null, elapsedMs: 0 }),
  setAudioLevel: (audioLevel) => set({ audioLevel }),
  syncTimestamp: (elapsedMs) => {
    const { activeCues } = get();
    const match = activeCues.find(
      (c) => elapsedMs >= c.startTimeMs && elapsedMs <= c.endTimeMs
    );
    set({ elapsedMs, currentCue: match || activeCues[activeCues.length - 1] || null });
  },
  setError: (error) => set({ error }),
  reset: () =>
    set({
      isRecording: false,
      isTranscribing: false,
      activeCues: [],
      currentCue: null,
      elapsedMs: 0,
      audioLevel: 0,
      error: null,
    }),
}));

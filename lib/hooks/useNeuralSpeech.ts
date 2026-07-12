import { useEffect, useCallback, useRef } from 'react';
import { useAudioVolume, useAudioMuted, useSetSpeaking } from '@/lib/store/audioStore';

export function useNeuralSpeech() {
  const volume = useAudioVolume();
  const isMuted = useAudioMuted();
  const setSpeaking = useSetSpeaking();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const sanitizeText = (text: string): string => {
    // Filter out emojis, brackets, markdown formats, non-speech characters
    return text
      .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')
      .replace(/[\[\]\(\)\*#_~`\-+]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [setSpeaking]);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || isMuted) return;

    stop();

    const sanitized = sanitizeText(text);
    if (!sanitized) return;

    const utterance = new SpeechSynthesisUtterance(sanitized);
    utterance.lang = 'he-IL';
    utterance.volume = volume;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [volume, isMuted, setSpeaking, stop]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { speak, stop };
}

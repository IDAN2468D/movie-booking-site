'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudioContextManager } from './useAudioContextManager';

interface UseOrbVoiceEngineOptions {
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

export function useOrbVoiceEngine({ onResult, onError }: UseOrbVoiceEngineOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const { playChime, playHapticBass } = useAudioContextManager();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'he-IL';

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
      if (event.results[current].isFinal) {
        onResult?.(text);
        playHapticBass(60, 0.15);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      onError?.(event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [onResult, onError, playHapticBass]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
      playChime(784, 0.2); // G5 Harmonic Chime
    } catch {
      // Already running or blocked
    }
  }, [playChime]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
      playChime(523.25, 0.15, 'triangle');
    } catch {
      // Safety catch
    }
  }, [playChime]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
}

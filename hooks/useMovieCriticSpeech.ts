import { useState, useEffect, useCallback, useRef } from 'react';
import { useCriticStore } from './useCriticStore';

export function useMovieCriticSpeech(speechId: string) {
  const [activeWordIndex, setActiveWordIndex] = useState<{ start: number; end: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const processedLengthRef = useRef(0);

  // Must be invoked directly within a user gesture (e.g. click)
  const unlockAudioContext = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const dummy = new SpeechSynthesisUtterance('');
      dummy.volume = 0;
      window.speechSynthesis.speak(dummy);
    }
  }, []);

  const speakSentence = useCallback((sentence: string, globalOffset: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = 'he-IL';
    utterance.rate = 1.0;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const start = globalOffset + event.charIndex;
        const remaining = sentence.slice(event.charIndex);
        const spaceMatch = remaining.match(/\s|$/);
        const end = spaceMatch && spaceMatch.index !== undefined 
          ? start + spaceMatch.index 
          : globalOffset + sentence.length;
          
        setActiveWordIndex({ start, end });
      }
    };

    utterance.onstart = () => setIsPlaying(true);
    
    utterance.onend = () => {
      setActiveWordIndex(null);
      if (!window.speechSynthesis.pending && !window.speechSynthesis.speaking) {
        setIsPlaying(false);
        const store = useCriticStore.getState();
        if (store.activeSpeechId === speechId) store.setActiveSpeechId(null);
      }
    };

    utterance.onerror = () => {
      setActiveWordIndex(null);
      if (!window.speechSynthesis.pending) {
        setIsPlaying(false);
        const store = useCriticStore.getState();
        if (store.activeSpeechId === speechId) store.setActiveSpeechId(null);
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [speechId]);

  const processStream = useCallback((text: string, isFinished: boolean) => {
    const { isMuted } = useCriticStore.getState();
    if (isMuted) return;

    if (!text) {
      processedLengthRef.current = 0;
      return;
    }

    const unprocessed = text.slice(processedLengthRef.current);
    
    // Split by sentence terminators (periods, question marks, exclamation points, newlines)
    const sentenceRegex = /([^.!?\n]+[.!?\n]+)/g;
    let match;
    let lastProcessedIndex = 0;

    while ((match = sentenceRegex.exec(unprocessed)) !== null) {
      const sentence = match[0];
      speakSentence(sentence, processedLengthRef.current + match.index);
      lastProcessedIndex = match.index + sentence.length;
    }

    processedLengthRef.current += lastProcessedIndex;

    // Flush remaining text if stream is finalized
    if (isFinished && processedLengthRef.current < text.length) {
      const remaining = text.slice(processedLengthRef.current);
      if (remaining.trim()) {
        speakSentence(remaining, processedLengthRef.current);
      }
      processedLengthRef.current = text.length; 
    }
  }, [speakSentence]);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setActiveWordIndex(null);
    setIsPlaying(false);
    processedLengthRef.current = 0;
    const store = useCriticStore.getState();
    if (store.activeSpeechId === speechId) store.setActiveSpeechId(null);
  }, [speechId]);

  const resetProcessedLength = useCallback(() => {
    processedLengthRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { activeWordIndex, isPlaying, processStream, stop, resetProcessedLength, unlockAudioContext };
}

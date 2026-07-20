import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useVoiceStore } from '@/lib/store/voiceStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognition = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;

export const useVoiceEngine = () => {
  const router = useRouter();
  const { isListening, setIsListening, setTranscript, setVolumeLevel, setFrequencyData, setIsProcessing, setFeedbackText } = useVoiceStore();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const startVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      sourceRef.current = audioCtxRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const avg = sum / dataArray.length;
        
        setVolumeLevel(avg);
        setFrequencyData(new Uint8Array(dataArray));
        
        animationRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.error("Microphone access denied:", err);
      setIsListening(false);
    }
  };

  const stopVisualizer = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(e => console.error("AudioCtx close error:", e));
    }
    setVolumeLevel(0);
  }, [setVolumeLevel]);

  const handleCommand = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai/voice-nav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text })
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        const { action, route, feedback } = data.data;
        
        if (feedback) {
          setFeedbackText(feedback);
          const utterance = new SpeechSynthesisUtterance(feedback);
          utterance.lang = 'he-IL';
          utterance.volume = 0.7; // Lower TTS volume slightly
          utterance.rate = 0.85; // Speak slightly slower for better comprehension
          
          if (action === 'navigate' && route) {
            utterance.onend = () => router.push(route);
            utterance.onerror = () => router.push(route);
          }
          
          window.speechSynthesis.speak(utterance);
        } else if (action === 'navigate' && route) {
          router.push(route);
        }
      }
    } catch (e) {
      console.error("Gemini Nav Error:", e);
    } finally {
      setIsProcessing(false);
    }
  }, [router, setIsProcessing, setFeedbackText]);

  useEffect(() => {
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.lang = 'he-IL';
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognitionRef.current.onresult = (event: any) => {
      const current = event.resultIndex;
      const t = event.results[current][0].transcript;
      setTranscript(t);
      handleCommand(t);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      stopVisualizer();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, [handleCommand, setIsListening, setTranscript, stopVisualizer]);

  useEffect(() => {
    if (isListening) {
      startVisualizer();
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Recognition start error:", e);
      }
    } else {
      stopVisualizer();
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        console.error("Recognition stop error:", e);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  return {
    isListening,
    toggleListening: () => setIsListening(!isListening)
  };
};

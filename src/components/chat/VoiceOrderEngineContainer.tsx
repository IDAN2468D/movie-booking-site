'use client';

import React, { useRef } from 'react';
import { useVoiceOrderState } from '@/hooks/useVoiceOrderState';
import { parseVoiceOrderAction } from '@/lib/actions/voice-order.actions';
import { VoiceOrderEngineView } from './VoiceOrderEngineView';

export const VoiceOrderEngineContainer: React.FC = () => {
  const {
    isListening,
    transcriptBuffer,
    lastParsedAction,
    setIsListening,
    setTranscriptBuffer,
    setLastParsedAction,
  } = useVoiceOrderState();

  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setTranscriptBuffer('Web Speech API אינו נתמך בדפדפן זה');
        return;
      }

      const rec = new SpeechRecognition();
      rec.lang = 'he-IL';
      rec.interimResults = true;

      rec.onstart = () => setIsListening(true);
      rec.onresult = (e: any) => {
        const current = e.results[e.results.length - 1][0].transcript;
        setTranscriptBuffer(current);
      };
      rec.onend = async () => {
        setIsListening(false);
        if (transcriptBuffer.trim()) {
          const res = await parseVoiceOrderAction({ transcript: transcriptBuffer });
          if (res.success && res.data) {
            setLastParsedAction(res.data);
          }
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <VoiceOrderEngineView
      isListening={isListening}
      transcriptBuffer={transcriptBuffer}
      lastParsedAction={lastParsedAction}
      onStartListening={startListening}
      onStopListening={stopListening}
    />
  );
};

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Sparkles, Navigation, Volume2, Command, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { processVoiceCommand } from '@/lib/actions/voice-command-actions';

export const VoiceAiCommandShell: React.FC = () => {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'he-IL';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const speakHebrewText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (document.visibilityState === 'hidden') return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'he-IL';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartListening = () => {
    if (!recognitionRef.current) {
      alert('דפדפן זה אינו תומך ב-Web Speech API. נסה ב-Chrome / Edge.');
      return;
    }
    setTranscript('');
    setAiReply('');
    setIsListening(true);
    recognitionRef.current.start();
  };

  const handleStopListeningAndExecute = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    if (!transcript.trim()) return;

    setIsProcessing(true);
    const res = await processVoiceCommand({ transcript });
    setIsProcessing(false);

    if (res.success && res.data) {
      setAiReply(res.data.replyHebrew);
      speakHebrewText(res.data.replyHebrew);

      if (res.data?.targetUrl) {
        const url = res.data.targetUrl;
        // Guaranteed redirect after short audio prompt start
        const timer = setTimeout(() => {
          router.push(url);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto p-8 rounded-3xl border border-white/12 bg-neutral-950/70 backdrop-blur-[40px] saturate-[250%] text-white shadow-2xl text-right" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400">
            <Command className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h3 className="font-['Outfit'] font-black text-2xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
              Hands-Free Voice AI Command Shell
            </h3>
            <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              שליטה קולית חכמה בעברית לניווט והזמנת כרטיסים ללא מגע ידים
            </p>
          </div>
        </div>
      </div>

      {/* Voice Orb Interaction Area */}
      <div className="flex flex-col items-center justify-center my-8 text-center">
        <div className="relative flex items-center justify-center w-36 h-36 mb-6">
          {/* Animated Waveform Aura */}
          {isListening && (
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/40 via-indigo-500/40 to-pink-500/40 blur-xl"
            />
          )}

          <button
            onClick={isListening ? handleStopListeningAndExecute : handleStartListening}
            className={`relative z-10 w-28 h-28 rounded-full border flex items-center justify-center transition-all active:scale-95 shadow-2xl ${
              isListening
                ? 'bg-gradient-to-br from-pink-500 to-rose-600 border-pink-300 text-white shadow-[0_0_40px_rgba(236,72,153,0.7)] animate-pulse'
                : 'bg-gradient-to-br from-cyan-500 to-indigo-600 border-cyan-300/40 text-white hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
            }`}
          >
            {isListening ? <Mic className="w-12 h-12" /> : <MicOff className="w-12 h-12" />}
          </button>
        </div>

        <p className="text-sm font-bold text-neutral-300 mb-2">
          {isListening ? '🎙️ מקשיב לבקשה שלך בעברית...' : 'לחץ על המיקרופון ואמור הוראה (למשל: "קח אותי לפסקולים")'}
        </p>

        {transcript && (
          <div className="mt-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-cyan-300 font-mono text-sm max-w-lg">
            "{transcript}"
          </div>
        )}
      </div>

      {/* AI Reply & Action Display */}
      <AnimatePresence>
        {aiReply && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-500/40 text-center flex items-center justify-between"
          >
            <div className="flex items-center gap-3 text-right">
              <Volume2 className="w-5 h-5 text-cyan-400 shrink-0 animate-bounce" />
              <span className="text-sm font-bold text-white">{aiReply}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-cyan-400 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

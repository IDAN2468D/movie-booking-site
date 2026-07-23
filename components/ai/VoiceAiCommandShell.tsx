'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Sparkles, Volume2, Command, ArrowRight, AlertCircle, Compass, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { processVoiceCommand } from '@/lib/actions/voice-command-actions';

const QUICK_COMMANDS = [
  { label: '🎵 פסקולים', phrase: 'קח אותי לפסקולים' },
  { label: '🎟️ הכרטיסים שלי', phrase: 'סרטים שלי' },
  { label: '🍿 תפריט מזנון', phrase: 'פתח את תפריט המזנון' },
  { label: '👑 מתחם VIP', phrase: 'מעביר ל-VIP' },
  { label: '❤️ מועדפים', phrase: 'פתח מועדפים' },
  { label: '👤 פרופיל אישי', phrase: 'הפרופיל שלי' },
];

export const VoiceAiCommandShell: React.FC = () => {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');
  const isExecutingRef = useRef<boolean>(false);

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

  const executeCommand = useCallback(async (phrase: string) => {
    const cleanText = phrase.trim();
    if (!cleanText || isExecutingRef.current) return;

    isExecutingRef.current = true;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await processVoiceCommand({ transcript: cleanText });
      if (res.success && res.data) {
        setAiReply(res.data.replyHebrew);
        speakHebrewText(res.data.replyHebrew);

        if (res.data.targetUrl) {
          const url = res.data.targetUrl;
          setTimeout(() => {
            router.push(url);
          }, 800);
        }
      } else if (res.error) {
        setErrorMessage(res.error);
      }
    } catch (err) {
      setErrorMessage('שגיאה בעבוד פקודת הקול');
    } finally {
      setIsProcessing(false);
      isExecutingRef.current = false;
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'he-IL';

        recognition.onstart = () => {
          setIsListening(true);
          setErrorMessage(null);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          transcriptRef.current = currentTranscript;
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setErrorMessage('גישה למיקרופון נחסמה. אנא אפשר הרשאות מיקרופון בדפדפן.');
          } else if (event.error === 'no-speech') {
            setErrorMessage('לא זוהה דיבור. לחץ שוב או בחר פקודה מהירה.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          if (transcriptRef.current.trim() && !isExecutingRef.current) {
            executeCommand(transcriptRef.current);
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, [executeCommand]);

  const handleStartListening = () => {
    if (!recognitionRef.current) {
      setErrorMessage('דפדפן זה אינו תומך ב-Web Speech API. נסה ב-Chrome / Edge.');
      return;
    }
    setTranscript('');
    transcriptRef.current = '';
    setAiReply('');
    setErrorMessage(null);
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Speech start error:', e);
    }
  };

  const handleStopListeningAndExecute = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Speech stop error:', e);
      }
    }
    setIsListening(false);
    if (transcriptRef.current.trim()) {
      executeCommand(transcriptRef.current);
    }
  };

  const handleQuickCommandClick = (phrase: string) => {
    setTranscript(phrase);
    transcriptRef.current = phrase;
    executeCommand(phrase);
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
              שליטה קולית אוטומטית בעברית - הדיבור מעביר עמוד באופן מידי ללא לחיצה
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
            disabled={isProcessing}
            className={`relative z-10 w-28 h-28 rounded-full border flex items-center justify-center transition-all active:scale-95 shadow-2xl ${
              isProcessing
                ? 'bg-purple-900/60 border-purple-500/40 text-purple-300'
                : isListening
                ? 'bg-gradient-to-br from-pink-500 to-rose-600 border-pink-300 text-white shadow-[0_0_40px_rgba(236,72,153,0.7)] animate-pulse'
                : 'bg-gradient-to-br from-cyan-500 to-indigo-600 border-cyan-300/40 text-white hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-12 h-12 animate-spin text-cyan-300" />
            ) : isListening ? (
              <Mic className="w-12 h-12" />
            ) : (
              <MicOff className="w-12 h-12" />
            )}
          </button>
        </div>

        <p className="text-sm font-bold text-neutral-300 mb-2">
          {isProcessing
            ? '⚡ מעבד הוראה קולית ומתחבר ל-AI...'
            : isListening
            ? '🎙️ מקשיב לבקשה שלך בעברית (יתבצע אוטומטית בסיום הדיבור)...'
            : 'לחץ על המיקרופון ואמור הוראה קולית בעברית'}
        </p>

        {errorMessage && (
          <div className="mt-3 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {transcript && (
          <div className="mt-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-cyan-300 font-mono text-sm max-w-lg">
            "{transcript}"
          </div>
        )}
      </div>

      {/* Quick Command Suggestion Chips */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-xs font-semibold text-neutral-400 mb-3 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-cyan-400" />
          פקודות מהירות לדוגמה (לחץ לבדיקה מידית):
        </p>
        <div className="flex flex-wrap gap-2.5">
          {QUICK_COMMANDS.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickCommandClick(cmd.phrase)}
              disabled={isProcessing}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-neutral-300 hover:text-cyan-300 transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              {cmd.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Reply & Action Display */}
      <AnimatePresence>
        {aiReply && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-500/40 text-center flex items-center justify-between"
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


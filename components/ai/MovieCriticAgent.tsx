'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface MovieCriticAgentProps {
  text: string;
}

export function MovieCriticAgent({ text }: MovieCriticAgentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSynth(window.speechSynthesis);
      
      // Pre-load voices
      window.speechSynthesis.onvoiceschanged = () => {
        setSynth(window.speechSynthesis);
      };
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!synth) return;

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
    } else {
      synth.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Default to Hebrew, fallback to English if not available
      utterance.lang = 'he-IL'; 
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      const voices = synth.getVoices();
      const hebrewVoice = voices.find(v => v.lang.includes('he')) || voices.find(v => v.lang.includes('en'));
      if (hebrewVoice) {
        utterance.voice = hebrewVoice;
      }
      
      synth.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <motion.button
      onClick={toggleSpeech}
      className={`relative flex items-center justify-center p-2.5 rounded-full backdrop-blur-md border transition-all duration-200 z-10 ${
        isPlaying 
          ? 'bg-violet-500/20 border-violet-400/30 shadow-[0_0_12px_rgba(139,92,246,0.4)]' 
          : 'bg-white/5 border-white/10 hover:bg-white/15'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isPlaying ? "עצור קריינות" : "הפעל מבקר סרטים אקוסטי"}
    >
      {isPlaying && (
        <span className="absolute inset-0 rounded-full animate-ping bg-violet-400/30" />
      )}
      {isPlaying ? (
        <VolumeX className="w-5 h-5 text-violet-300 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] relative z-10" />
      ) : (
        <Volume2 className="w-5 h-5 text-white/70 group-hover:text-white transition-colors relative z-10" />
      )}
    </motion.button>
  );
}

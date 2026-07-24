'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useHoloVoicePassState } from '../../hooks/useHoloVoicePassState';
import { generateHoloVoicePassAction } from '../../lib/actions/holo-voice-pass.actions';

export const HoloVoicePassView: React.FC = () => {
  const {
    transcript,
    isListening,
    passResult,
    isLoading,
    setTranscript,
    setIsListening,
    setPassResult,
    setIsLoading,
  } = useHoloVoicePassState();

  const playHoloBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  };

  const handleListen = () => {
    playHoloBeep();
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setTranscript('צור כרטיס VIP זהב לקולנוע');
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'he-IL';
      recognition.interimResults = false;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } catch {
      setIsListening(false);
    }
  };

  const handleGeneratePass = async () => {
    if (!transcript.trim()) return;
    playHoloBeep();
    setIsLoading(true);
    const res = await generateHoloVoicePassAction({
      voiceTranscript: transcript,
      themeColor: 'purple',
    });
    if (res.success && res.data) {
      setPassResult(res.data);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-950/40 backdrop-blur-[40px] border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-neutral-100 font-sans max-w-xl mx-auto space-y-5" dir="rtl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h3 className="font-['Outfit'] text-xl font-bold text-pink-400">
            מחולל כרטיסי VIP בפקודה קולית
          </h3>
          <p className="text-xs text-neutral-400 font-['Inter']">זיהוי קולי בעברית וכספת הולוגרפית תלת-ממדית</p>
        </div>
        <span className="px-3 py-1 text-xs font-mono rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
          Speech AI בעברית
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="דבר או הקלד הוראה לכרטיס (למשל: צור כרטיס VIP זהב)..."
          dir="rtl"
          className="flex-1 bg-neutral-900/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-neutral-200 focus:outline-none focus:border-pink-400 font-['Inter']"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleListen}
          className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all font-['Outfit'] ${
            isListening
              ? 'bg-red-500/30 border-red-500 text-red-200 animate-pulse'
              : 'bg-neutral-900/80 border-white/10 text-neutral-300 hover:border-pink-400'
          }`}
        >
          {isListening ? '🎙️ מקשיב...' : '🎙️ קול'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGeneratePass}
          disabled={isLoading}
          className="bg-pink-600 hover:bg-pink-500 text-white font-['Outfit'] font-bold px-4 py-2 rounded-xl text-sm transition-all"
        >
          {isLoading ? 'יוצר...' : 'צור כרטיס'}
        </motion.button>
      </div>

      {passResult && (
        <motion.div
          initial={{ rotateY: -15, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-pink-900/40 via-purple-900/30 to-black border border-pink-500/30 text-center space-y-3 transform-gpu shadow-[0_0_30px_rgba(236,72,153,0.25)]"
        >
          <div className="text-[10px] uppercase font-mono tracking-widest text-pink-300">
            {passResult.tierName}
          </div>
          <div className="text-xl font-bold font-['Outfit'] text-white">{passResult.title}</div>
          <div className="inline-block px-4 py-1.5 rounded-lg bg-black/60 border border-pink-400/40 font-mono text-sm text-pink-200">
            {passResult.formattedCode}
          </div>
        </motion.div>
      )}
    </div>
  );
};

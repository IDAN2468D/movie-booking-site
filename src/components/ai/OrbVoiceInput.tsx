'use client';

import React from 'react';
import { Mic, Volume2 } from 'lucide-react';
import { useOrbVoiceEngine } from '../../hooks/useOrbVoiceEngine';

interface OrbVoiceInputProps {
  onVoiceCommand: (text: string) => void;
}

const VOICE_PROMPTS = [
  'תמליץ לי על מותחן פסיכולוגי',
  'סרט רומנטי לדייט מושלם',
  'אקשן מפוצץ עם סאונד עוצמתי',
];

export const OrbVoiceInput: React.FC<OrbVoiceInputProps> = ({ onVoiceCommand }) => {
  const { isListening, transcript, isSupported, toggleListening } = useOrbVoiceEngine({
    onResult: (text) => onVoiceCommand(text),
  });

  if (!isSupported) return null;

  return (
    <div className="flex flex-col gap-2.5 p-3 rounded-2xl bg-gradient-to-br from-white/5 to-cyan-950/20 border border-white/10" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleListening}
            className={`relative p-2.5 rounded-xl border transition-all duration-300 ${
              isListening
                ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-white/5 border-white/10 text-cyan-400 hover:bg-white/10 hover:border-cyan-400/40'
            }`}
            aria-label={isListening ? 'הפסק הקלטה' : 'הפעל פקודה קולית'}
          >
            {isListening ? (
              <>
                <span className="absolute -inset-1 rounded-xl bg-rose-500/30 animate-ping" />
                <Mic className="w-4 h-4 animate-pulse relative z-10" />
              </>
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
          <div>
            <span className="text-xs font-bold text-white block">פקודה קולית חכמה</span>
            <span className="text-[10px] text-white/50">
              {isListening ? 'מקשיב עכשיו... דבר בחופשיות' : 'לחץ לדיבור בעברית'}
            </span>
          </div>
        </div>

        {transcript && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
            <Volume2 className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="text-[11px] text-cyan-300 max-w-[140px] truncate">{transcript}</span>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      {!isListening && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {VOICE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onVoiceCommand(prompt)}
              className="text-[10px] text-white/60 hover:text-white px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-right"
            >
              &ldquo;{prompt}&rdquo;
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

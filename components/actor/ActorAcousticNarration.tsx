'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Languages } from 'lucide-react';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { motion, AnimatePresence } from 'framer-motion';
import { useActorNarrationEngine } from '@/hooks/useActorNarrationEngine';

interface ActorAcousticNarrationProps {
  actorName: string;
  biography: string;
  notableRoles: string[];
}

export function ActorAcousticNarration({
  actorName,
  biography,
  notableRoles,
}: ActorAcousticNarrationProps) {
  const [script, setScript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isPlaying, lang, setLang, speakText, stopNarration } = useActorNarrationEngine();

  const handleStartNarration = async () => {
    if (isPlaying) {
      stopNarration();
      return;
    }

    let currentScript = script;
    if (!currentScript) {
      setIsLoading(true);
      const rolesText = notableRoles.slice(0, 3).join(', ');
      currentScript = lang === 'he'
        ? `${actorName}, מהכוחות הבולטים בקולנוע העכשווי. עם תפקידים בלתי נשכחים ב-${rolesText}, הוא משלב עומק דרמטי ונוכחות מהפנטת על המסך.`
        : `${actorName}, one of the standout forces in contemporary cinema. Known for iconic performances in ${rolesText}.`;
      setScript(currentScript);
      setIsLoading(false);
    }

    speakText(currentScript);
  };

  return (
    <div className="relative p-6 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-4 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Volume2 size={20} />
          </div>
          <div>
            <h3 className="text-base font-black text-white font-rubik flex items-center gap-2">
              קריינות ביוגרפית אקוסטית AI
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">432Hz</span>
            </h3>
            <p className="text-xs text-off-white/60">מסע קולי קולנועי מונחה בינה מלאכותית</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => {
              setLang(lang === 'he' ? 'en' : 'he');
              setScript(null);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-off-white/80 transition-all"
          >
            <Languages size={13} />
            <span>{lang === 'he' ? 'עברית' : 'English'}</span>
          </button>

          {/* Play/Stop Button */}
          <button
            disabled={isLoading}
            onClick={handleStartNarration}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs transition-all shadow-lg active:scale-95 ${
              isPlaying
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'bg-primary text-black font-black hover:bg-primary/90'
            }`}
          >
            {isLoading ? (
              <LoadingIndicator variant="spinner" size={14} color="#000" label="" />
            ) : isPlaying ? (
              <>
                <VolumeX size={14} />
                <span>עצור קריינות</span>
              </>
            ) : (
              <>
                <Volume2 size={14} />
                <span>השמע פרופיל קולי</span>
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {script && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2"
          >
            <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-300">
              <Sparkles size={12} />
              <span>תסריט ביוגרפי מסונתז:</span>
            </div>
            <p className="text-xs text-off-white/90 leading-relaxed font-medium">{script}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

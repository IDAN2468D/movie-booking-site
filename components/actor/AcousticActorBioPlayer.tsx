'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Play, Pause, Film, Volume2, Award } from 'lucide-react';
import { fetchActorBioData } from '@/app/actions/actorBioActions';

export function AcousticActorBioPlayer() {
  const [actorName] = useState('טימותי שאלאמה');
  const [isPlaying, setIsPlaying] = useState(false);
  const [bioText, setBioText] = useState('שחקן קולנוע מוביל בסדרת Dune וסרטי איכות היפר-סנסוריים.');
  const [filmography] = useState(['חולית: חלק 2', 'וונקה', 'קרא לי בשמך', 'בין כוכבים']);

  const handleToggleNarration = async () => {
    if (isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    const res = await fetchActorBioData({ actorName: 'Timothée Chalamet' });
    if (res.success && res.data) {
      setBioText(res.data.acousticNarrationText);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(res.data.acousticNarrationText);
        utterance.lang = 'he-IL';
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      } else {
        setIsPlaying(true);
      }
    }
  };

  return (
    <div dir="rtl" className="w-full max-w-xl p-6 rounded-2xl bg-neutral-900/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl text-right">
      <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">{actorName}</h3>
            <p className="text-xs text-neutral-400">Acoustic Actor Bio & TMDB Audio Reel</p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          120Hz Reel
        </span>
      </div>

      <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50 mb-4">
        <p className="text-sm text-neutral-200 leading-relaxed mb-3">{bioText}</p>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleNarration}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'עצור קריינות אקוסטית' : 'השמע קריינות AI (Hebrew Speech)'}
          </button>
          {isPlaying && (
            <div className="flex items-center gap-1 text-emerald-400 animate-pulse text-xs font-mono">
              <Volume2 className="w-4 h-4" />
              <span>משמיע קול...</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <span className="text-xs text-emerald-300 font-semibold mb-2 block flex items-center gap-1">
          <Film className="w-3.5 h-3.5" />
          פילמוגרפיה נבחרת:
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filmography.map((film, idx) => (
            <motion.span
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 text-xs text-neutral-300 border border-neutral-700 whitespace-nowrap"
            >
              {film}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-800 text-xs text-neutral-400">
        <span className="flex items-center gap-1 text-emerald-400">
          <Award className="w-3.5 h-3.5" />
          TMDB Filmography Sync
        </span>
        <span>Liquid Glass 4.0</span>
      </div>
    </div>
  );
}

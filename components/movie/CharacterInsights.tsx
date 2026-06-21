'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, User, ShieldAlert, Target } from 'lucide-react';
import { cn } from '@/lib/utils/index';

interface Character {
  name: string;
  role: string;
  motivation: string;
  fatalFlaw: string;
  secretGoal: string;
  emotionalIntensity: number;
}

interface CharacterInsightsProps {
  movieTitle: string;
  overview: string;
  genres: string[];
}

export const CharacterInsights = ({ movieTitle, overview, genres }: CharacterInsightsProps) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/character-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieTitle, overview, genres })
      });
      const data = await res.json();
      if (data.success && data.characters) {
        setCharacters(data.characters);
      }
    } catch (e) {
      console.error('Failed to load character insights:', e);
    } finally {
      setLoading(false);
    }
  }, [movieTitle, overview, genres]);

  useEffect(() => {
    if (overview) {
      requestAnimationFrame(() => {
        fetchInsights();
      });
    }
  }, [overview, fetchInsights]);

  if (loading) {
    return (
      <div className="w-full bg-[#0A0A0A]/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 flex flex-col items-center justify-center min-h-[300px] text-right" dir="rtl">
        <div className="w-12 h-12 rounded-full border-t-2 border-primary animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-400">Gemini סורק כעת את נרטיב הסרט ומנתח פרופילים פסיכולוגיים...</p>
      </div>
    );
  }

  if (characters.length === 0) return null;

  const current = characters[activeIdx];

  return (
    <div className="w-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[40px] p-6 md:p-8 relative overflow-hidden shadow-2xl text-right" dir="rtl">
      {/* Refractive gradient background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-cyan-500/5 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
          <Brain size={18} className="text-cyan-400 animate-pulse" />
        </div>
        <div>
          <h3 className="text-sm font-black text-white tracking-tight font-display uppercase">מנתח הדמויות של Gemini</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">MovieLens 3.0 Engine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Character Sidebar selector */}
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar pb-2 md:pb-0">
          {characters.map((char, idx) => (
            <button
              key={char.name}
              onClick={() => setActiveIdx(idx)}
              className={cn(
                "flex-shrink-0 w-full text-right p-4 rounded-2xl border transition-all flex items-center justify-between",
                activeIdx === idx 
                  ? "bg-primary/20 border-primary/40 text-primary shadow-[0_0_20px_rgba(255,159,10,0.15)]"
                  : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
              )}
            >
              <div className="flex items-center gap-3">
                <User size={14} className={activeIdx === idx ? 'text-primary' : 'text-slate-500'} />
                <div>
                  <p className="text-xs font-black">{char.name}</p>
                  <p className="text-[9px] text-slate-500">{char.role}</p>
                </div>
              </div>
              <ChevronLeft size={14} className="opacity-40" />
            </button>
          ))}
        </div>

        {/* Character Card View */}
        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[32px] p-6 relative flex flex-col justify-between min-h-[250px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="space-y-4"
            >
              <div>
                <h4 className="text-lg font-black text-white mb-1 flex items-center gap-2">
                  {current.name}
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold">
                    {current.role}
                  </span>
                </h4>
              </div>

              {/* Motivations and Goals */}
              <div className="space-y-3 pt-2">
                <div className="flex gap-3 text-right">
                  <Target size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">מניע מרכזי</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{current.motivation}</p>
                  </div>
                </div>

                <div className="flex gap-3 text-right">
                  <ShieldAlert size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">פגם טרגי / חולשה</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{current.fatalFlaw}</p>
                  </div>
                </div>

                <div className="flex gap-3 text-right">
                  <Sparkles size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">שאיפה סודית</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{current.secretGoal}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Intensity Score */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">עוצמה רגשית</span>
            <div className="flex items-center gap-2 flex-1 max-w-[120px] ml-2">
              <div className="h-1.5 bg-white/10 rounded-full w-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${current.emotionalIntensity}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                />
              </div>
              <span className="text-[10px] font-black text-primary">{current.emotionalIntensity}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal mini-chevron helper to prevent Lucide resolution issues
interface ChevronLeftProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

function ChevronLeft({ size = 24, ...props }: ChevronLeftProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

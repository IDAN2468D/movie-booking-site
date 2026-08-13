'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Brain, Sparkles, Activity } from 'lucide-react';
import { fetchActorEmotionMetrics, EmotionMetrics } from '@/app/actions/actorEmotionActions';

interface ActorRoleEmotionGraphProps {
  actorName: string;
  filmography?: string[];
}

export function ActorRoleEmotionGraph({ actorName, filmography = [] }: ActorRoleEmotionGraphProps) {
  const [metrics, setMetrics] = useState<EmotionMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilm, setSelectedFilm] = useState<EmotionMetrics | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const res = await fetchActorEmotionMetrics({ actorName, filmography });
      if (isMounted && res.success && res.data) {
        setMetrics(res.data.metrics);
        if (res.data.metrics.length > 0) {
          setSelectedFilm(res.data.metrics[0]);
        }
      }
      if (isMounted) setLoading(false);
    }
    loadData();
    return () => { isMounted = false; };
  }, [actorName, filmography]);

  return (
    <div dir="rtl" className="w-full p-8 rounded-[2rem] bg-neutral-950/40 border border-white/[0.12] backdrop-blur-[40px] saturate-[250%] shadow-2xl text-right">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white font-['Outfit'] flex items-center gap-2">
              מניפת רגשות ודמויות
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs text-neutral-400 font-['Inter']">Gemini 3.5 Neural Role Emotion Graph</p>
          </div>
        </div>
        <span className="px-3 py-1 text-xs font-mono rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
          120Hz Liquid
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-neutral-400 text-sm gap-2">
          <Activity className="w-5 h-5 animate-spin text-cyan-400" />
          <span>מנתח נתוני רגשות היפר-סנסוריים...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {metrics.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFilm(item)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-['Outfit'] transition-all border whitespace-nowrap ${
                  selectedFilm?.filmTitle === item.filmTitle
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'bg-neutral-900/60 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                {item.filmTitle}
              </button>
            ))}
          </div>

          {selectedFilm && (
            <motion.div
              key={selectedFilm.filmTitle}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-neutral-900/80 border border-white/10 space-y-4"
            >
              <div className="flex justify-between items-center text-sm font-bold text-white font-['Outfit']">
                <span className="text-cyan-400">טון מוביל: {selectedFilm.dominantTone}</span>
                <span className="text-xs text-neutral-400 font-mono">{selectedFilm.filmTitle}</span>
              </div>

              <div className="space-y-3 font-['Inter']">
                <div>
                  <div className="flex justify-between text-xs text-neutral-300 mb-1">
                    <span>עוצמה רגשית (Intensity)</span>
                    <span className="font-mono text-cyan-300">{Math.round(selectedFilm.intensity * 100)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedFilm.intensity * 100}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_10px_#00F0FF]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-neutral-300 mb-1">
                    <span>עומק דרמטי (Dramatism)</span>
                    <span className="font-mono text-purple-300">{Math.round(selectedFilm.dramatism * 100)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedFilm.dramatism * 100}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_10px_#EC4899]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-neutral-300 mb-1">
                    <span>קצב אקשן ומתח (Action)</span>
                    <span className="font-mono text-emerald-300">{Math.round(selectedFilm.actionScore * 100)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedFilm.actionScore * 100}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_#10B981]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

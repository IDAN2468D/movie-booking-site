'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Rss, Clock, Sparkles } from 'lucide-react';
import type { NewsCuratorOutput } from '@/lib/schemas/newsCurator';

const playHoverSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
};

const playSuccessSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5); // 40Hz sub-bass drop
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
};

const getSentimentColor = (sentiment?: string) => {
  switch(sentiment) {
    case 'exciting': return 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]';
    case 'dramatic': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]';
    case 'rumor': return 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]';
    default: return 'bg-neutral-400 shadow-[0_0_10px_rgba(156,163,175,0.8)]';
  }
};

export default function NewsWidget({ fullWidth = false }: { fullWidth?: boolean }) {
  const [newsData, setNewsData] = useState<NewsCuratorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/ai/news-curator');
        const data = await res.json();
        
        if (data.success && data.data) {
          setNewsData(data.data);
          playSuccessSound();
        } else {
          setError(data.error || 'שגיאה בטעינת חדשות');
        }
      } catch (err) {
        setError('שגיאה בחיבור לשרת');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
    
    // Refresh news every hour
    const interval = setInterval(fetchNews, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full ${fullWidth ? 'max-w-full h-[600px]' : 'max-w-sm'} rounded-[32px] overflow-hidden bg-neutral-950/40 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 relative group`}>
      
      {/* Liquid Glass Background Shimmer */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)' }} />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:12px_12px]" />

      <div className="p-6 relative z-10 flex flex-col h-full min-h-[400px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/10 border border-indigo-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Newspaper size={20} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="font-outfit font-black text-white text-lg tracking-wide uppercase drop-shadow-md">חדשות קולנוע</h3>
              <div className="flex items-center gap-1.5 text-[10px] text-indigo-300/70 font-bold tracking-widest uppercase">
                <Sparkles size={10} className="text-indigo-400" />
                AI CURATED
              </div>
            </div>
          </div>
          <Rss size={20} className={`text-indigo-400 ${isLoading ? 'animate-pulse' : 'opacity-50'}`} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-4"
              >
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-t-2 border-indigo-400"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
                    <Sparkles size={20} className="animate-pulse" />
                  </div>
                </div>
                <p className="text-sm font-black text-indigo-300/70 uppercase tracking-widest animate-pulse">הסוכן אוסף חדשות...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <p className="text-red-400/80 text-sm font-bold text-center">{error}</p>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`space-y-4 overflow-y-auto pr-2 custom-scrollbar ${fullWidth ? 'h-[450px]' : 'h-[300px]'}`}
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.3) transparent' }}
              >
                {newsData?.news.map((item, i) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onMouseEnter={playHoverSound}
                    className="p-4 rounded-[20px] relative bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all duration-300 group/item cursor-pointer overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-full h-1 opacity-50 ${getSentimentColor(item.sentiment).split(' ')[0]}`} />
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${getSentimentColor(item.sentiment)}`} />
                      <h4 className="text-white font-bold text-sm leading-tight group-hover/item:text-indigo-300 transition-colors">{item.title}</h4>
                    </div>
                    <p className="text-white/60 text-xs leading-relaxed mb-3">{item.summary}</p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-white/40 font-bold uppercase tracking-wider">
                      <span>{item.source}</span>
                      <div className="flex items-center gap-1">
                        <Clock size={10} />
                        {item.date}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!isLoading && newsData && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-bold uppercase tracking-widest">
            <span>עודכן לאחרונה</span>
            <span className="text-indigo-400/70">{newsData.lastUpdated}</span>
          </div>
        )}
      </div>
    </div>
  );
}

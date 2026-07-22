'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Rss, Clock, Sparkles, ExternalLink, Tag } from 'lucide-react';
import type { NewsCuratorOutput, NewsArticle } from '@/lib/schemas/newsCurator';

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
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch {}
};

const getSentimentBadge = (sentiment?: string) => {
  switch(sentiment) {
    case 'exciting': return { label: '🔥 חם', color: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' };
    case 'dramatic': return { label: '⚡ דרמטי', color: 'bg-gradient-to-r from-red-500 to-rose-600 text-white' };
    case 'rumor': return { label: '🕵️ שמועה', color: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' };
    default: return { label: '🎬 חדשות', color: 'bg-white/10 text-neutral-300' };
  }
};

export default function NewsWidget({ fullWidth = false }: { fullWidth?: boolean }) {
  const [newsData, setNewsData] = useState<NewsCuratorOutput | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
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
        } else {
          setError(data.error || 'שגיאה בטעינת חדשות');
        }
      } catch {
        setError('שגיאה בחיבור לשרת');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full ${fullWidth ? 'max-w-7xl min-h-[750px]' : 'max-w-sm h-[600px]'} rounded-[32px] overflow-hidden bg-neutral-950/40 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 relative group text-right`} dir="rtl">
      <div className="p-6 relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/10 border border-indigo-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <Newspaper size={24} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="font-['Outfit'] font-black text-white text-xl tracking-wide uppercase drop-shadow-md">חדשות קולנוע ועידכוני TMTB</h3>
              <div className="flex items-center gap-1.5 text-xs text-indigo-300/80 font-semibold tracking-widest uppercase">
                <Sparkles size={12} className="text-indigo-400 animate-pulse" />
                AI CURATED LIVE FEED ({newsData?.news.length || 0} כתבות)
              </div>
            </div>
          </div>
          <Rss size={22} className={`text-indigo-400 ${isLoading ? 'animate-pulse' : 'opacity-60'}`} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.3) transparent' }}>
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin" />
              <p className="text-sm font-bold text-indigo-300/70 animate-pulse">הסוכן אוסף ומנתח כתבות ותמונות...</p>
            </div>
          ) : error ? (
            <div className="h-64 flex items-center justify-center text-red-400 text-sm font-bold">{error}</div>
          ) : (
            <div className={fullWidth ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-4"}>
              {newsData?.news.map((item, i) => {
                const badge = getSentimentBadge(item.sentiment);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onMouseEnter={playHoverSound}
                    onClick={() => setSelectedArticle(item)}
                    className="group/card rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.07] hover:border-indigo-500/40 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col transform-gpu hover:-translate-y-1 shadow-lg"
                  >
                    {item.imageUrl && (
                      <div className="relative h-40 w-full overflow-hidden">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 transform-gpu" />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-md ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                    )}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-white font-bold text-base leading-snug group-hover/card:text-indigo-300 transition-colors mb-2">{item.title}</h4>
                        <p className="text-neutral-300/80 text-xs leading-relaxed line-clamp-3 mb-3">{item.summary}</p>
                      </div>
                      <div>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {item.tags.map(tag => (
                              <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 flex items-center gap-1">
                                <Tag size={8} /> {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[11px] text-neutral-400 border-t border-white/5 pt-2">
                          <span className="font-semibold text-indigo-300/90">{item.source}</span>
                          <span className="flex items-center gap-1"><Clock size={10} /> {item.date}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal for Article Detail */}
        <AnimatePresence>
          {selectedArticle && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="max-w-lg w-full rounded-3xl bg-neutral-900 border border-white/20 overflow-hidden shadow-2xl p-6 relative text-right">
                {selectedArticle.imageUrl && (
                  <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="w-full h-48 object-cover rounded-2xl mb-4 border border-white/10" />
                )}
                <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2 inline-block">
                  {selectedArticle.source} • {selectedArticle.date}
                </span>
                <h3 className="text-xl font-bold text-white mb-3 leading-snug">{selectedArticle.title}</h3>
                <p className="text-neutral-300 text-sm leading-relaxed mb-6">{selectedArticle.summary}</p>
                <button onClick={() => setSelectedArticle(null)} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all">
                  סגור כתבה
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        {!isLoading && newsData && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
            <span>עדכונים חיים מבוססי AI ו-RAG</span>
            <span className="text-indigo-400 font-mono font-bold">{newsData.lastUpdated}</span>
          </div>
        )}
      </div>
    </div>
  );
}

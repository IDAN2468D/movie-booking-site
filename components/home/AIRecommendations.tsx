'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Info, Ticket, CheckCircle, Clock } from 'lucide-react';
import { AIResponse } from '@/types/ai';
import { useBookingStore } from '@/lib/store';
import { Movie } from '@/lib/tmdb';

export default function AIRecommendations() {
  const [data, setData] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { setSelectedMovie, selectedMovie, setSeats, setSelectedShowtime } = useBookingStore();

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        // Mocking the request with the data provided by the user
        const response = await fetch('/api/ai/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userProfile: {
              preferences: ["מדע בדיוני", "פעולה", "סייברפאנק"],
              watchHistory: ["חולית: חלק שני", "בלייד ראנר 2049", "המטריקס: התחייה"],
              subscriptionType: "מנוי פרימיום"
            },
            movieDatabase: [
              {
                title: "אופק ניאון 2026",
                genre: ["מדע בדיוני", "פעולה"],
                formats: ["איימקס", "4DX", "סטנדרטי"]
              },
              {
                title: "היער השקט",
                genre: ["דרמה", "מסתורין"],
                formats: ["סטנדרטי"]
              },
              {
                title: "מתקפת סייבר",
                genre: ["פעולה", "סייברפאנק"],
                formats: ["4DX", "סטנדרטי"]
              }
            ],
            liveInventory: {
              requestedSeats: 3,
              availability: [
                {
                  movieId: "אופק_ניאון_2026",
                  slots: [
                    { time: "2026-04-21T19:00:00Z", seats: 10, format: "IMAX" },
                    { time: "2026-04-21T21:30:00Z", seats: 2, format: "4DX" }
                  ]
                },
                {
                  movieId: "מתקפת_סייבר",
                  slots: [
                    { time: "2026-04-21T20:00:00Z", seats: 5, format: "4DX" }
                  ]
                }
              ]
            }
          })
        });

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching AI recommendations:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  if (loading) return (
    <div className="w-full h-48 flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-8 h-8 border-t-2 border-orange-500 rounded-full"
      />
    </div>
  );

  if (!data) return null;

  return (
    <section className="px-4 md:px-10 my-10 md:my-16">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 md:mb-10 text-right md:text-right">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary/30 to-orange-500/10 rounded-2xl border border-primary/20 shadow-[0_0_20px_rgba(255,159,10,0.2)]">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-0.5">Personalized</p>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter font-outfit">מומלץ עבורך</h2>
          </div>
        </div>
        <span className="md:mr-auto px-4 py-1.5 bg-white/5 backdrop-blur-3xl border border-white/10 text-slate-400 text-[10px] font-black rounded-full uppercase tracking-widest text-center md:text-right">
          מנוע AI 2026 • פרימיום
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {data.recommendations.map((rec, index) => (
            <motion.div
              key={rec.movieId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Link 
                href={`/movie/${index + 1300000}`} // Use a real-looking ID for E2E tests
                className={`block relative group overflow-hidden bg-white/5 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-500 shadow-2xl cursor-pointer text-right ${
                  selectedMovie?.title === rec.title 
                    ? 'border-orange-500 shadow-orange-500/20' 
                    : 'border-white/10 hover:border-orange-500/50'
                }`}
                onClick={() => {
                  const movieProxy: Movie = {
                    id: index + 1300000,
                    title: rec.title,
                    displayTitle: rec.title,
                    poster_path: '',
                    backdrop_path: '',
                    vote_average: 9.5,
                    release_date: '2026-04-21',
                    overview: rec.reason,
                    genre_ids: []
                  };
                  setSelectedMovie(movieProxy);
                }}
              >
                <div className="absolute top-0 left-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Ticket className="w-12 h-12 text-white" />
                </div>

                <span className="inline-block px-3 py-1 bg-orange-500 text-black text-[10px] font-bold rounded-full mb-3">
                  {rec.bestFormat}
                </span>

                <h3 className="text-xl font-bold text-white mb-2">{rec.title}</h3>
                <p className="text-sm text-white/60 mb-4 line-clamp-3">
                  {rec.reason}
                </p>

                <div className="flex flex-col gap-3 mt-auto">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/5 justify-start">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] text-slate-300 font-medium">{rec.availabilityBadge}</span>
                  </div>
                  
                  <div className="flex items-start gap-2 p-3 bg-orange-500/10 rounded-xl justify-start">
                    <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-orange-200/80 leading-relaxed italic">
                      {rec.savingsTip}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 relative group"
      >
        {/* Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 via-emerald-400/10 to-green-500/20 rounded-[32px] blur-xl opacity-50" />
        
        <div className="relative bg-black/40 backdrop-blur-[50px] saturate-[200%] border border-green-500/30 rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 text-right overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
           {/* Animated Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
           
           <div className="flex-1 space-y-3 relative z-10 w-full">
              <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 <p className="text-[10px] md:text-xs text-green-400 uppercase font-black tracking-[0.3em]">תובנת AI גלובלית</p>
              </div>
              <p className="text-base md:text-lg text-white font-bold leading-relaxed font-outfit">
                {data.globalInsight}
              </p>
              <div className="flex items-center gap-2 text-green-300/60 text-[10px] font-medium justify-center md:justify-start">
                <CheckCircle size={12} />
                <span>ניתוח פרימיום הושלם - מותאם אישית</span>
              </div>
           </div>

           <div className="flex items-center gap-4 w-full md:w-auto relative z-10">
              <button 
                onClick={() => {
                  if (!data.recommendations.length) return;
                  
                  const bestRec = data.recommendations[0];
                  const movieProxy: Movie = {
                    id: 9999,
                    title: bestRec.title,
                    displayTitle: bestRec.title,
                    poster_path: '',
                    backdrop_path: '',
                    vote_average: 9.8,
                    release_date: '2026-04-21',
                    overview: bestRec.reason,
                    genre_ids: []
                  };

                  setSelectedMovie(movieProxy);
                  const timeMatch = bestRec.availabilityBadge.match(/\d{2}:\d{2}/);
                  setSelectedShowtime(timeMatch ? timeMatch[0] : "19:30");
                  setSeats(['s-19', 's-20', 's-21']);

                  // Better toast/modal logic would go here
                  alert(`הזמנה אופטימלית הופעלה: ${bestRec.title}`);
                }}
                className="flex-1 md:flex-none px-8 py-4 bg-green-500 text-black font-black rounded-2xl hover:bg-green-400 transition-all duration-300 text-xs md:text-sm shadow-[0_10px_30px_rgba(34,197,94,0.3)] active:scale-95 uppercase tracking-widest whitespace-nowrap"
              >
                הזמן באופן אופטימלי
              </button>
              
              <div className="hidden md:flex p-3 bg-green-500/20 rounded-2xl border border-green-500/20 group-hover:scale-110 transition-transform duration-500">
                <CheckCircle className="w-8 h-8 text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              </div>
           </div>
        </div>
      </motion.div>
    </section>
  );
}

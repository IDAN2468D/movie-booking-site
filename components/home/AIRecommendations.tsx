'use client';

import React, { useEffect, useState } from 'react';
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
    <section className="px-10 my-10">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-orange-500/20 rounded-lg">
          <Sparkles className="w-5 h-5 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">מומלץ עבורך</h2>
        <span className="text-xs bg-white/10 text-white/50 px-2 py-1 rounded-full uppercase tracking-wider mr-auto">
          מנוע AI 2026
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
              onClick={() => {
                // Synthesize a movie object if needed, or find in a real DB
                const movieProxy: Movie = {
                  id: index + 1000,
                  title: rec.title,
                  displayTitle: rec.title,
                  poster_path: '', // AI recs might not have these yet
                  backdrop_path: '',
                  vote_average: 9.5,
                  release_date: '2026-04-21',
                  overview: rec.reason,
                  genre_ids: []
                };
                setSelectedMovie(movieProxy);
              }}
              className={`relative group overflow-hidden bg-white/5 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-500 shadow-2xl cursor-pointer text-right ${
                selectedMovie?.title === rec.title 
                  ? 'border-orange-500 shadow-orange-500/20' 
                  : 'border-white/10 hover:border-orange-500/50'
              }`}
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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-4 text-right"
      >
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

            // 1. Select Movie
            setSelectedMovie(movieProxy);
            
            // 2. Select Optimal Showtime (Based on AI recommendation)
            const timeMatch = bestRec.availabilityBadge.match(/\d{2}:\d{2}/);
            if (timeMatch) {
              setSelectedShowtime(timeMatch[0]);
            } else {
              setSelectedShowtime("19:30"); // Default
            }

            // 3. Select Best Seats (Middle of the hall)
            setSeats(['s-19', 's-20', 's-21']);

            // Visual feedback
            alert(`הזמנה אופטימלית הופעלה עבור: ${bestRec.title}\n\n• פורמט: ${bestRec.bestFormat}\n• מושבים: שורה אמצעית (H19-H21)\n• לוגיקה: מותאם עבור המנוי שלך והעדפות מדע בדיוני.`);
          }}
          className="mr-auto px-6 py-2 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-colors text-sm shadow-lg shadow-green-500/20"
        >
          הזמן באופן אופטימלי
        </button>
        <div className="flex-1">
          <p className="text-[10px] text-green-400 uppercase font-bold tracking-widest mb-1">תובנת AI גלובלית</p>
          <p className="text-sm text-white/90 font-medium">{data.globalInsight}</p>
        </div>
        <div className="p-2 bg-green-500/20 rounded-full">
          <CheckCircle className="w-6 h-6 text-green-500" />
        </div>
      </motion.div>
    </section>
  );
}

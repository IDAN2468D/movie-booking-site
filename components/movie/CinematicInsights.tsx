"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CinematicResearchOutput } from "@/lib/schemas/researcher";

interface CinematicInsightsProps {
  movieTitle: string;
}

export default function CinematicInsights({ movieTitle }: CinematicInsightsProps) {
  const [data, setData] = useState<CinematicResearchOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/researcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieTitle }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      setData(result.data);
    } catch (err: any) {
      setError(err.message || "שגיאה בטעינת התובנות הקולנועיות.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-12 mb-24">
      {/* Liquid Glass 4.0 Container */}
      <div 
        className="relative overflow-hidden rounded-3xl p-8 transition-all duration-500
                   backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40
                   border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_inset_0_-1px_1px_rgba(0,0,0,0.4)]"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15)"
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 z-10 relative">
          <div>
            <h2 className="text-3xl font-outfit text-white tracking-wide drop-shadow-md">
              תובנות קולנועיות עמוקות
            </h2>
            <p className="text-neutral-400 font-inter text-sm mt-1">מופעל ע״י Gemini 3.1 Flash Lite</p>
          </div>
          <button 
            onClick={fetchInsights}
            disabled={loading}
            className="mt-4 md:mt-0 px-6 py-2.5 rounded-full font-inter text-sm text-white font-medium
                       bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            {loading ? "מנתח את המטריקס..." : "חלץ מידע"}
          </button>
        </div>

        <div className="relative min-h-[150px] w-full z-10">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 flex items-center justify-center transform-gpu will-change-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                  <span className="font-outfit text-blue-400 tracking-widest text-sm uppercase">שאיבת נתונים נוירולוגית מתבצעת...</span>
                </div>
              </motion.div>
            )}

            {error && !loading && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-inter text-sm"
              >
                {error}
              </motion.div>
            )}

            {data && !loading && !error && (
              <motion.div 
                key="data"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 transform-gpu will-change-transform"
              >
                {/* Column 1 */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-outfit text-white/90 border-b border-white/10 pb-2 mb-3">השפעה תרבותית</h3>
                    <p className="text-neutral-300 font-inter text-sm leading-relaxed">{data.culturalImpact}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-outfit text-white/90 border-b border-white/10 pb-2 mb-3">מאחורי הקלעים</h3>
                    <p className="text-neutral-300 font-inter text-sm leading-relaxed">{data.behindTheScenes}</p>
                  </div>
                </div>
                {/* Column 2 */}
                <div>
                  <h3 className="text-lg font-outfit text-white/90 border-b border-white/10 pb-2 mb-3">טריוויה</h3>
                  <ul className="space-y-3">
                    {data.trivia.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-neutral-300 font-inter text-sm leading-relaxed">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {!data && !loading && !error && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center opacity-50"
              >
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-4">
                  <span className="text-2xl opacity-50">🎬</span>
                </div>
                <p className="font-inter text-sm text-white/50">לחץ על 'חלץ מידע' כדי להתחיל סריקת Gemini 3.1 Flash Lite.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

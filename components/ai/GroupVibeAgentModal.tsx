"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Users, Sparkles, X, CheckCircle2 } from "lucide-react";
import { calculateGroupCompatibility } from "@/lib/actions/groupMatchActions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GroupVibeAgentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    compatibilityScore: number;
    recommendedMovie: string;
    overlapGenres: string[];
    vibeSummary: string;
  } | null>(null);

  const startVoiceAnalysis = async () => {
    setIsListening(true);
    setTimeout(async () => {
      setIsListening(false);
      setAnalyzing(true);
      const res = await calculateGroupCompatibility({
        groupId: "grp_101",
        groupName: "Cinephiles Squad",
        members: [
          { userId: "u1", userName: "אלכס", preferredGenres: ["Sci-Fi", "Action"] },
          { userId: "u2", userName: "דניאל", preferredGenres: ["Sci-Fi", "Thriller"] },
        ],
      });
      setAnalyzing(false);
      if (res.success && res.data) {
        setResult(res.data);
      }
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-xl text-white"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-cyan-500/20 p-2.5 text-cyan-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-outfit">CineMatch AR Group Matchmaker</h3>
                <p className="text-xs text-slate-400">סוכן קולי Gemini 3.5 לחישוב חפיפת טעמים קבוצתית</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <div className="flex justify-center">
              <div className="relative flex items-center justify-center">
                <div className="h-32 w-32 rounded-full border-2 border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center opacity-80" />
                <div className="absolute h-32 w-32 rounded-full border-2 border-purple-500/30 bg-purple-500/10 flex items-center justify-center -mr-12 opacity-80" />
                <div className="absolute z-10 font-bold text-lg text-white drop-shadow">
                  {result ? `${result.compatibilityScore}%` : "Vibe Match"}
                </div>
              </div>
            </div>

            <div className="text-center">
              {isListening ? (
                <div className="flex items-center justify-center gap-2 text-cyan-400 font-semibold animate-pulse">
                  <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  מקשיב לשיחת הקבוצה ומשלף העדפות...
                </div>
              ) : analyzing ? (
                <div className="text-purple-400 font-semibold animate-pulse">
                  מחשב ציון חפיפת דיאגרמת Venn עם Gemini 3.5...
                </div>
              ) : result ? (
                <div className="space-y-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 text-right">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>סרט מומלץ: {result.recommendedMovie}</span>
                  </div>
                  <p className="text-xs text-slate-300">{result.vibeSummary}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {result.overlapGenres.map((g) => (
                      <span key={g} className="rounded-md bg-cyan-500/20 px-2.5 py-1 text-xs text-cyan-300 font-medium">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  לחץ על הלחצן להפעלת הסוכן הקולי לקבלת המלצת סרט מותאמת אישית לכל החברים.
                </p>
              )}
            </div>

            {!result && (
              <button
                onClick={startVoiceAnalysis}
                disabled={isListening || analyzing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 py-3 font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all"
              >
                <Mic className="h-5 w-5" />
                {isListening ? "הקלטה פעילה..." : "הפעל סוכן קולי CineMatch"}
              </button>
            )}
          </div>

          <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
            <button onClick={onClose} className="rounded-xl bg-white/10 px-5 py-2 text-xs font-semibold text-white hover:bg-white/20">
              סגור
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

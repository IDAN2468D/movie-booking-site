"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { processVoiceSearchAction } from "@/app/actions/voiceSearch.actions";
import { VoiceSearchOutput } from "@/lib/validations/voiceSearch.schema";

interface NeuralMoodEngineModalProps {
  onClose: () => void;
  onMoodMatched: (result: VoiceSearchOutput) => void;
}

const MOOD_ORBS = [
  { id: "action", label: "💥 אקשן ואדרנלין", color: "from-rose-500 to-amber-500" },
  { id: "comedy", label: "😂 קומדיה וצחוק", color: "from-amber-400 to-yellow-500" },
  { id: "scifi", label: "🌌 מדע בדיוני ותלת-ממד", color: "from-cyan-400 to-blue-600" },
  { id: "drama", label: "🎭 דרמה ורגש עמוק", color: "from-purple-500 to-indigo-600" },
  { id: "horror", label: "👻 אימה ומתח עוצר נשימה", color: "from-emerald-500 to-teal-700" },
];

export function NeuralMoodEngineModal({ onClose, onMoodMatched }: NeuralMoodEngineModalProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectMood = async (mood: typeof MOOD_ORBS[0]) => {
    setSelectedMood(mood.id);
    setLoading(true);

    const res = await processVoiceSearchAction({
      transcript: mood.label,
      selectedMood: mood.label,
    });

    if (res.success && res.data) {
      onMoodMatched(res.data);
      setTimeout(onClose, 800);
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-lg p-6 rounded-3xl backdrop-blur-[40px] saturate-[250%] bg-neutral-950/90 border border-white/15 text-white shadow-2xl"
          dir="rtl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <h3 className="font-['Outfit'] text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-primary to-purple-400">
              🔮 מנוע התאמה רגשי (Neural Mood Engine)
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center font-bold text-sm"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-neutral-400 mb-6 font-['Inter']">
            בחר או לחץ על בועת המצב רוח שלך לקבלת המלצות סרטים מותאמות אישית
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {MOOD_ORBS.map((orb) => (
              <motion.button
                key={orb.id}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleSelectMood(orb)}
                disabled={loading}
                className={`px-4 py-3 rounded-2xl bg-gradient-to-r ${orb.color} text-white font-bold text-xs shadow-lg transition-all border border-white/20 flex items-center gap-2 ${
                  selectedMood === orb.id ? "ring-2 ring-white scale-105" : "opacity-85 hover:opacity-100"
                }`}
              >
                <span>{orb.label}</span>
              </motion.button>
            ))}
          </div>

          {loading && (
            <div className="text-center py-4 text-xs font-mono text-cyan-400 animate-pulse">
              מתאים סרטים מועדפים לפי תדרי רגש...
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

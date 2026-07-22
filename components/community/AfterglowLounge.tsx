"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Award, CheckCircle2, Sparkles } from "lucide-react";
import { getAfterglowTriviaAction, AfterglowTriviaQuestion } from "@/app/actions/afterglowActions";

interface AfterglowLoungeProps {
  movieTitle?: string;
}

export function AfterglowLounge({ movieTitle = "דילמת המד\"ב 2026" }: AfterglowLoungeProps) {
  const [questions, setQuestions] = useState<AfterglowTriviaQuestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    getAfterglowTriviaAction(movieTitle).then((res) => {
      if (res.success && res.data) {
        setQuestions(res.data);
      }
    });
  }, [movieTitle]);

  const handleSelectOption = (idx: number) => {
    setSelectedIndex(idx);
    if (questions.length > 0 && idx === questions[0].correctIndex) {
      setScore(100);
    } else {
      setScore(50);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6 p-6 bg-neutral-950/80 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]" dir="rtl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-outfit text-lg font-bold text-white">מתחם Afterglow לאחר הצפייה</h4>
            <span className="text-xs text-cyan-400">צ'אט מוגן ספוילרים + טריוויית פרסים</span>
          </div>
        </div>
        <span className="text-xs bg-cyan-500/10 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
          Live Post-Show
        </span>
      </div>

      {questions.length > 0 && score === null ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-white">{questions[0].question}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {questions[0].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className="p-3 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-medium text-white text-right transition-all"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : score !== null ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto" />
          <h4 className="font-outfit text-lg font-bold text-white">זכית בשובר הנחה למזנון!</h4>
          <p className="text-xs text-white/60">קיבלת קופון של 15% הנחה לקנייה הבאה בבר ה-VIP.</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-300 font-mono font-bold text-xs rounded-xl">
            <Sparkles className="w-3.5 h-3.5" /> CODE: AFTERGLOW15
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { HelpCircle, RefreshCw, Trophy, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TriviaItem {
  question: string;
  answer: string;
}

const MOCK_TRIVIA: TriviaItem[] = [
  { question: "מה היה התקציב המוערך להפקה?", answer: "מעל 200 מיליון דולר" },
  { question: "כמה זמן נמשכו הצילומים?", answer: "כ-140 ימי צילום בשלוש יבשות" },
  { question: "האם הסרט מבוסס על ספר?", answer: "כן, הוא מבוסס על רב-מכר עולמי" },
];

export default function MovieTrivia({ movieTitle }: { movieTitle: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_TRIVIA.length);
    }, 200);
  };

  return (
    <section className="mt-16 text-right" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 text-primary">
            <Brain size={20} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">אתגר הטריוויה: {movieTitle}</h2>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
          <Trophy size={16} className="text-primary" />
          <span className="text-xs font-black text-white">ניקוד: {score}</span>
        </div>
      </div>

      <div className="relative h-[250px] perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, rotateY: -20 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 20 }}
            className="w-full h-full"
          >
            <div 
              className={`w-full h-full cursor-pointer transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
              onClick={() => {
                if (!isFlipped) setScore(s => s + 10);
                setIsFlipped(!isFlipped);
              }}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white/[0.02] border border-white/5 rounded-[40px] p-10 flex flex-col items-center justify-center text-center backdrop-blur-md">
                <HelpCircle size={40} className="text-primary/40 mb-6" />
                <h3 className="text-xl font-bold text-white leading-relaxed max-w-[500px]">
                  {MOCK_TRIVIA[currentIndex].question}
                </h3>
                <p className="mt-6 text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">לחץ לחשיפת התשובה</p>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary/10 border border-primary/20 rounded-[40px] p-10 flex flex-col items-center justify-center text-center backdrop-blur-md">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                  <Trophy size={24} className="text-primary" />
                </div>
                <p className="text-lg font-black text-white">{MOCK_TRIVIA[currentIndex].answer}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="mt-8 flex items-center gap-2 text-[10px] text-primary font-black uppercase tracking-widest hover:underline"
                >
                  לשאלה הבאה <RefreshCw size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </section>
  );
}

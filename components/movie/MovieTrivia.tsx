'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, RefreshCw, Sparkles, Trophy, Brain } from 'lucide-react';

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
    }, 150);
  };

  return (
    <section className="mt-24 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-yellow/20 rounded-[20px] flex items-center justify-center border border-yellow/30 text-yellow shadow-[0_0_30px_rgba(229,255,0,0.2)]">
            <Brain size={28} />
          </div>
          <div>
            <p className="text-[10px] text-yellow font-display uppercase tracking-[0.5em] mb-1">CINE-QUIZ MODE</p>
            <h2 className="text-4xl font-display text-off-white tracking-tighter uppercase leading-none">אתגר הטריוויה</h2>
            <p className="text-xs text-off-white/40 font-body mt-2">{movieTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-display text-primary uppercase tracking-[0.3em]">TOTAL SCORE</span>
            <span className="text-2xl font-display text-off-white tracking-tighter">{score} <span className="text-primary">PTS</span></span>
          </div>
          <button 
            onClick={handleNext}
            className="group flex items-center gap-3 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 px-6 py-4 rounded-full transition-all duration-500"
          >
            <span className="text-[10px] font-display text-off-white/60 group-hover:text-primary uppercase tracking-[0.2em]">NEXT QUESTION</span>
            <RefreshCw size={14} className="text-primary group-hover:rotate-180 transition-transform duration-700" />
          </button>
        </div>
      </div>

      <div className="relative perspective-2000 h-[450px] w-full max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, rotateX: 10 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div
              className="relative w-full h-full cursor-pointer"
              onClick={() => {
                if (!isFlipped) setScore(s => s + 50);
                setIsFlipped(!isFlipped);
              }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front Side */}
              <div 
                className="absolute inset-0 backface-hidden bg-white/[0.03] border border-white/10 rounded-[48px] p-12 flex flex-col items-center justify-center text-center overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-yellow/10 opacity-30" />
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-shimmer" />
                
                <div className="relative mb-8">
                  <div className="absolute inset-0 blur-2xl bg-primary/20 scale-150 animate-pulse" />
                  <HelpCircle size={48} className="text-primary relative" />
                </div>
                
                <p className="text-[10px] font-display text-primary uppercase tracking-[0.6em] mb-6">QUESTION {currentIndex + 1}</p>
                <h3 className="text-3xl md:text-4xl font-body text-off-white leading-[1.3] font-light max-w-md">
                  {MOCK_TRIVIA[currentIndex].question}
                </h3>
                
                <div className="mt-12 flex items-center gap-2 text-off-white/20">
                  <span className="text-[9px] font-display uppercase tracking-widest italic">לחץ לחשיפת התשובה</span>
                </div>
              </div>

              {/* Back Side */}
              <div 
                className="absolute inset-0 backface-hidden bg-primary border border-primary/50 rounded-[48px] p-12 flex flex-col items-center justify-center text-center overflow-hidden"
                style={{ transform: 'rotateY(180deg)' }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,255,0,0.2)_0%,transparent_70%)]" />
                
                <Trophy size={48} className="text-yellow mb-8 drop-shadow-[0_0_20px_rgba(229,255,0,0.5)]" />
                
                <p className="text-[10px] font-display text-yellow uppercase tracking-[0.6em] mb-6">CORRECT ANSWER</p>
                <h3 className="text-3xl md:text-4xl font-display text-off-white leading-tight uppercase tracking-tighter max-w-md">
                  {MOCK_TRIVIA[currentIndex].answer}
                </h3>
                
                <div className="mt-12 flex items-center gap-4">
                  <div className="px-6 py-2 bg-black/20 rounded-full border border-white/10">
                    <span className="text-[10px] font-display text-white/60 uppercase tracking-widest">BOOSTED +50</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .perspective-2000 {
          perspective: 2000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
      `}</style>
    </section>
  );
}


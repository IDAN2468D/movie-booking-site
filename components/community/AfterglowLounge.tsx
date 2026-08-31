'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Award, Sparkles, Gem, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import {
  getAfterglowTriviaAction,
  getAfterglowDiscussionsAction,
  AfterglowTriviaQuestion,
  AfterglowComment,
} from '@/app/actions/afterglowActions';
import { SpoilerRevealCard } from './SpoilerRevealCard';

interface AfterglowLoungeProps {
  movieTitle?: string;
}

export function AfterglowLounge({ movieTitle = 'דילמת המד"ב 2026' }: AfterglowLoungeProps) {
  const [questions, setQuestions] = useState<AfterglowTriviaQuestion[]>([]);
  const [comments, setComments] = useState<AfterglowComment[]>([]);
  const [activeTab, setActiveTab] = useState<'discussions' | 'trivia'>('discussions');
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    getAfterglowTriviaAction(movieTitle).then((res) => {
      if (res.success && res.data) setQuestions(res.data);
    });
    getAfterglowDiscussionsAction().then((res) => {
      if (res.success && res.data) setComments(res.data);
    });
  }, [movieTitle]);

  const handleSelectOption = (idx: number) => {
    if (questions.length > 0 && idx === questions[0].correctIndex) {
      setScore(100);
    } else {
      setScore(50);
    }
  };

  return (
    <div className="w-full bg-neutral-950/80 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-2xl my-8 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-outfit text-xl font-bold text-white flex items-center gap-2">
              מתחם Afterglow לאחר ההקרנה
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck size={11} /> צופים מאומתים
              </span>
            </h4>
            <span className="text-xs text-cyan-400 font-medium">טרקלין שיח מוגן ספוילרים + קפסולות זיכרון אספניות</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/memory-capsules"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all"
          >
            <Gem size={13} />
            <span>הנפק שבר זיכרון</span>
          </Link>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('discussions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'discussions' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-400 hover:text-white'
              }`}
            >
              דיונים ({comments.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('trivia')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'trivia' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-gray-400 hover:text-white'
              }`}
            >
              טריוויה 🏆
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'discussions' && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <SpoilerRevealCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      {activeTab === 'trivia' && (
        <div className="space-y-4">
          {questions.length > 0 && score === null ? (
            <div className="space-y-3 bg-white/[0.02] p-4 rounded-2xl border border-white/10">
              <p className="text-sm font-semibold text-white">{questions[0].question}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {questions[0].options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className="p-3 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-medium text-white text-right transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-5 bg-gradient-to-br from-cyan-950/40 to-neutral-900 border border-cyan-500/30 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6 animate-bounce" />
              </div>
              <h5 className="font-bold text-white text-base">כל הכבוד! ענית על שאלת הטריוויה</h5>
              <p className="text-xs text-gray-300">
                צברת <strong className="text-cyan-400">+{score} נקודות מוניטין קולנועי</strong> וכרטיס אספנות דיגיטלי!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, BookOpen, GitFork } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { WhatIfSandboxModal } from './WhatIfSandboxModal';

export function WhatIfScenario({ movieTitle }: { movieTitle: string }) {
  const [scenario, setScenario] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenario.trim() || isGenerating) return;

    setIsGenerating(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieTitle, scenario }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.text);
      } else {
        setResult('מצטערים, התרחשה שגיאה בעת כתיבת התסריט האלטרנטיבי.');
      }
    } catch {
      setResult('שגיאת תקשורת עם מודל ה-AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full bg-[#111] backdrop-blur-xl border border-white/5 rounded-[32px] overflow-hidden mb-12 p-8 relative shadow-2xl" dir="rtl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 flex items-center justify-center border border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.2)]">
            <BookOpen className="w-6 h-6 text-fuchsia-400" />
          </div>
          <div className="text-right">
            <h3 className="text-2xl font-display font-bold text-white mb-1">What If...? (תסריטים חלופיים)</h3>
            <p className="text-sm text-gray-400">שאל את ה-AI &quot;מה היה קורה אם...&quot; וקבל עלילה חדשה לגמרי</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSandboxOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-fuchsia-500/20 hover:bg-fuchsia-500/30 border border-fuchsia-500/40 text-fuchsia-300 font-bold text-xs rounded-2xl shadow-lg transition-all"
        >
          <GitFork className="w-4 h-4" />
          <span>פתח מעבדת תסריטים מרובת ענפים</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 mb-8">
        <div className="relative flex items-center">
          <input
            type="text"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder='למשל: "מה היה קורה אם הנבל היה מנצח בסוף?"'
            className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pr-5 pl-16 text-white placeholder:text-gray-600 focus:outline-none focus:border-fuchsia-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!scenario.trim() || isGenerating}
            className="absolute left-2 w-12 h-12 bg-fuchsia-500 rounded-xl flex items-center justify-center text-white hover:bg-fuchsia-400 disabled:opacity-50 disabled:bg-white/10 disabled:text-gray-500 transition-colors"
          >
            {isGenerating ? <LoadingIndicator variant="spinner" size="sm" color="#ffffff" label="יוצר תסריט..." /> : <Send className="w-5 h-5 -ml-1" />}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-4 text-fuchsia-400 font-medium"
          >
            <LoadingIndicator variant="orbit" size="md" color="#d946ef" label="יוצר תסריט..." />
            <span>כותב מחדש את ההיסטוריה הקולנועית...</span>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 rounded-2xl p-6 border border-fuchsia-500/20 text-gray-300 leading-relaxed shadow-[inset_0_0_30px_rgba(217,70,239,0.05)]"
          >
            <div className="flex items-center gap-2 mb-4 text-fuchsia-400">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold text-lg">התסריט האלטרנטיבי:</span>
            </div>
            <div className="prose prose-invert prose-p:leading-relaxed prose-headings:text-white max-w-none">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <WhatIfSandboxModal
        movieTitle={movieTitle}
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
      />
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IntuitionSearchResult } from '@/lib/validations/intuition';
import { Brain, Search, Sparkles, Wand2 } from 'lucide-react';

interface IntuitionInputViewProps {
  query: string;
  isSearching: boolean;
  results: IntuitionSearchResult[];
  onQueryChange: (text: string) => void;
  onSubmitSearch: (e: React.FormEvent) => void;
}

export const IntuitionInputView: React.FC<IntuitionInputViewProps> = ({
  query,
  isSearching,
  results,
  onQueryChange,
  onSubmitSearch,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-3xl bg-neutral-950/40 border border-white/10 text-right backdrop-blur-xl shadow-2xl relative overflow-hidden" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Brain size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-outfit text-white">חיפוש סמנטי-סנטימנטלי ("שורת האינטואיציה")</h2>
            <p className="text-xs text-neutral-400 font-sans">חיפוש מטאפורות בשפה טבעית & זרימת כספית נוזלית</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 bg-purple-950/40 px-3 py-1 rounded-full border border-purple-800/40">
          <Wand2 size={14} />
          <span>בינה מלאכותית וקטורית בעברית</span>
        </div>
      </div>

      <form onSubmit={onSubmitSearch} className="relative mb-6">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="תאר הרגשה, מטאפורה או אווירה בעברית... (למשל: 'ללכת לאיבוד בחלל')"
            className="w-full py-4 pr-12 pl-32 rounded-2xl bg-neutral-900/80 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-purple-500/60 font-sans shadow-inner transition-all duration-300"
          />
          <Search size={20} className="absolute right-4 text-purple-400" />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute left-3 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-outfit transition-all flex items-center gap-2 shadow-lg shadow-purple-900/40"
          >
            {isSearching ? 'מפענח...' : 'חפש אינטואיטיבית'}
          </button>
        </div>
      </form>

      {/* Results */}
      {results.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-2 font-sans">
            <Sparkles size={14} className="text-purple-400" />
            מטריצת התאמות סמנטיות מבוססות מטאפורה
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {results.map((res) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-2xl bg-neutral-900/80 border border-white/10 relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none transition-all duration-500"
                  style={{ background: res.sentimentGradient }}
                />
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white font-outfit">{res.movieTitle}</span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded">
                      {(res.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">{res.metaphorMatch}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

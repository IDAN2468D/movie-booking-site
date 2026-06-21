'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, BookOpen, ChevronDown, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils/index';

export function CinematicDeepDive({ movieId, movieTitle }: { movieId: number, movieTitle: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [researchData, setResearchData] = useState<string | null>(null);

  const handleDeepDive = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && !researchData) {
      setIsResearching(true);
      try {
        const res = await fetch('/api/ai/research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movieId, movieTitle })
        });
        const data = await res.json();
        if (data.success) {
          setResearchData(data.research);
        } else {
          setResearchData("מצטערים, התרחשה שגיאה במהלך מחקר העומק.");
        }
      } catch (err) {
        setResearchData("שגיאת תקשורת.");
      } finally {
        setIsResearching(false);
      }
    }
  };

  return (
    <div className="w-full bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden mb-12">
      <button 
        onClick={handleDeepDive}
        className="w-full p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.2)] relative">
            <Search className="w-6 h-6 text-purple-400 relative z-10" />
            <Sparkles className="w-4 h-4 text-white absolute top-2 right-2 animate-pulse" />
          </div>
          <div className="text-right">
            <h3 className="text-2xl font-display font-bold text-white mb-1">Cinematic Deep Dive</h3>
            <p className="text-sm text-gray-400">חפירה עמוקה בעזרת AI למאחורי הקלעים והיסטוריית הסרט</p>
          </div>
        </div>
        <ChevronDown className={cn("w-6 h-6 text-gray-500 transition-transform duration-300", isOpen ? "rotate-180" : "")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-8">
              {isResearching && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-xl bg-purple-500/30 animate-pulse" />
                    <Loader2 className="w-12 h-12 text-purple-400 animate-spin relative z-10" />
                  </div>
                  <p className="text-purple-300 font-medium animate-pulse text-lg">סוכני ה-AI מבצעים תחקיר עמוק...</p>
                </div>
              )}

              {researchData && !isResearching && (
                <div className="prose prose-invert prose-p:leading-relaxed-hebrew max-w-none prose-headings:text-purple-300 prose-a:text-purple-400">
                  <ReactMarkdown>{researchData}</ReactMarkdown>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

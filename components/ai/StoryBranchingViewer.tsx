'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Vote, Compass, Volume2 } from 'lucide-react';
import { StoryBranchOption } from '@/lib/ai/storyBranching';

interface StoryBranchingViewerProps {
  movieId: string;
  initialBranches?: StoryBranchOption[];
  directorNote?: string;
}

export const StoryBranchingViewer: React.FC<StoryBranchingViewerProps> = ({
  movieId,
  initialBranches = [
    { id: 'b1', titleHe: 'עימות במתח גבוה', descriptionHe: 'הגיבור תוקף חזיתית ומפעיל את מערכת התאורה של האולם.', predictedOutcomeHe: 'הגברת הסאונד המרחבי ל-120dB.', votes: 4 },
    { id: 'b2', titleHe: 'עקיפה טקטית', descriptionHe: 'נסיגה מהירה וגילוי מסדרון סודי בבניין.', predictedOutcomeHe: 'תאורת אווירה מעומעמת באולם.', votes: 2 }
  ],
  directorNote = 'החלטת הקהל בזמן אמת תשנה את התסריט והאקוסטיקה באולם.'
}) => {
  const [branches, setBranches] = useState<StoryBranchOption[]>(initialBranches);
  const [votedId, setVotedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVote = (id: string) => {
    if (votedId) return;
    setVotedId(id);
    setBranches(prev =>
      prev.map(b => b.id === id ? { ...b, votes: b.votes + 1 } : b)
    );
  };

  const totalVotes = branches.reduce((acc, b) => acc + b.votes, 0) || 1;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-3xl bg-black/60 border border-purple-500/30 backdrop-blur-xl shadow-[0_0_50px_rgba(168,85,247,0.15)] text-white" dir="rtl">
      <div className="flex items-center justify-between mb-4 border-b border-purple-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-['Outfit'] text-lg font-bold text-purple-300">CineSync What-If: הסתעפות עלילתית בלייב</h3>
            <p className="text-xs text-gray-400 font-['Inter']">{directorNote}</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-full font-semibold">
          הצבעה פעילה
        </span>
      </div>

      <div className="space-y-4">
        {branches.map(branch => {
          const percentage = Math.round((branch.votes / totalVotes) * 100);
          const isSelected = votedId === branch.id;

          return (
            <motion.div
              key={branch.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleVote(branch.id)}
              className={`relative overflow-hidden p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-900/40 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                  : 'bg-white/5 border-white/10 hover:border-purple-500/50'
              }`}
            >
              <div
                className="absolute inset-0 bg-purple-600/20 pointer-events-none transition-all duration-500"
                style={{ width: `${percentage}%`, right: 0 }}
              />

              <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-1 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-base">{branch.titleHe}</h4>
                    {isSelected && <span className="text-xs text-purple-300 font-bold">(הצבעתך נקלטה)</span>}
                  </div>
                  <p className="text-xs text-gray-300">{branch.descriptionHe}</p>
                  <div className="flex items-center gap-2 text-[11px] text-purple-400 pt-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>השפעה אקוסטית: {branch.predictedOutcomeHe}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold font-['Outfit'] text-purple-300">{percentage}%</span>
                  <span className="text-[10px] text-gray-400">{branch.votes} קולות</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

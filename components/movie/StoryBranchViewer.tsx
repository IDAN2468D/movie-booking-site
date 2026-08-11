"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GitFork, Sparkles, Film, ArrowRight } from "lucide-react";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import { generateStoryBranchScenario } from "@/lib/actions/storyBranchActions";

interface Props {
  movieId: string;
  movieTitle: string;
}

export const StoryBranchViewer: React.FC<Props> = ({ movieId, movieTitle }) => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [branches, setBranches] = useState([
    {
      id: "b1",
      choice: "מה אם הגיבור לא היה עולה על הרכבת?",
      summary: "גילוי מוקדם של המזימה ועימות חזיתי בתחנה המרכזית.",
      score: 95,
    },
    {
      id: "b2",
      choice: "מה אם הנבל היה מגלה את האמת בשלב המערכה הראשונה?",
      summary: "שינוי טקטי מהיר והעברת הקרב למעמקי האוקיינוס.",
      score: 91,
    },
  ]);

  const handleGenerate = async () => {
    if (!customPrompt.trim()) return;
    setGenerating(true);
    const res = await generateStoryBranchScenario(movieId, customPrompt);
    setGenerating(false);
    if (res.success && res.data) {
      setBranches((prev) => [
        ...prev,
        {
          id: res.data.nodeId,
          choice: res.data.choiceText,
          summary: res.data.consequenceSummary,
          score: res.data.aiConfidenceScore,
        },
      ]);
      setCustomPrompt("");
    }
  };

  return (
    <div className="rounded-2xl border border-purple-500/20 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-xl text-white" dir="rtl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-500/20 p-2.5 text-purple-400">
            <GitFork className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-outfit">סימולטור עלילה חלופית AI "What-If"</h3>
            <p className="text-xs text-slate-400">חקירת הסתעפויות תסריט לסרט: {movieTitle}</p>
          </div>
        </div>
        <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
      </div>

      <div className="mt-6 space-y-4">
        <div className="relative rounded-xl border border-white/10 bg-black/40 p-4">
          <svg className="absolute inset-0 h-full w-full opacity-20 pointer-events-none">
            <path d="M 20 20 L 100 80 M 20 20 L 100 140" stroke="#8B5CF6" strokeWidth="2" fill="none" />
          </svg>
          <div className="space-y-3 relative z-10">
            {branches.map((b) => (
              <motion.div
                key={b.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedBranch(b.id)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  selectedBranch === b.id
                    ? "border-purple-500 bg-purple-950/40 backdrop-blur-lg"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-purple-200">{b.choice}</span>
                  <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300 font-semibold">
                    Gemini {b.score}%
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">{b.summary}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="רשום תרחיש חלופי (למשל: מה אם הדמות המשנית שרדה?)..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
          />
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-purple-500 transition-all"
          >
            {generating ? <LoadingIndicator variant="spinner" size={16} color="#ffffff" label="מפיק תסריט..." /> : <Sparkles className="h-4 w-4" />}
            {generating ? "מפיק תסריט..." : "חולל ענף AI"}
          </button>
        </div>
      </div>
    </div>
  );
};

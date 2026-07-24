'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useScreenplayBranchState } from '../../hooks/useScreenplayBranchState';
import { generateScreenplayBranchAction } from '../../lib/actions/screenplay-branch.actions';

export const ScreenplayBranchView: React.FC = () => {
  const {
    promptText,
    selectedBranchId,
    result,
    isLoading,
    setPromptText,
    setSelectedBranchId,
    setResult,
    setIsLoading,
  } = useScreenplayBranchState();

  const playClickSound = (freq = 520) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {}
  };

  const handleSimulate = async () => {
    if (!promptText.trim()) return;
    playClickSound(600);
    setIsLoading(true);
    const res = await generateScreenplayBranchAction({
      movieId: 'm-101',
      movieTitle: 'Cyber Blade 2099',
      genre: 'Sci-Fi Action',
      userChoicePrompt: promptText,
    });
    if (res.success && res.data) {
      setResult(res.data);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-950/40 backdrop-blur-[40px] border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-neutral-100 font-sans max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-xl font-semibold text-purple-400">
            AI Screenplay Branch Simulator
          </h3>
          <p className="text-xs text-neutral-400">Alternate Ending & Climax Generator</p>
        </div>
        <span className="px-3 py-1 text-xs font-mono rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
          GenAI Interactive
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Enter alternate decision prompt..."
          className="flex-1 bg-neutral-900/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-neutral-200 focus:outline-none focus:border-purple-400"
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSimulate}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-4 py-2 rounded-xl text-sm transition-all"
        >
          {isLoading ? 'Simulating...' : 'Branch'}
        </motion.button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-neutral-900/40 border border-white/5 space-y-2">
            <h4 className="text-sm font-semibold text-purple-300 font-heading">
              {result.currentNodeTitle}
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">{result.storySnippet}</p>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-neutral-400">Select Divergent Trajectory:</div>
            <div className="grid gap-2">
              {result.options.map((opt) => (
                <motion.div
                  key={opt.id}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    playClickSound(700);
                    setSelectedBranchId(opt.id);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedBranchId === opt.id
                      ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                      : 'bg-neutral-900/60 border-white/10 text-neutral-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-heading font-semibold text-sm">{opt.title}</span>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/20">
                      {opt.probabilityScore}% Match
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">{opt.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

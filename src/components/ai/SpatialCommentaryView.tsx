'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSpatialCommentaryState } from '../../hooks/useSpatialCommentaryState';
import { fetchSpatialCommentaryAction } from '../../lib/actions/spatial-commentary.actions';

export const SpatialCommentaryView: React.FC = () => {
  const {
    currentTimestampSec,
    selectedPos,
    commentaries,
    activeCommentaryId,
    isLoading,
    setCurrentTimestampSec,
    setSelectedPos,
    setCommentaries,
    setActiveCommentaryId,
    setIsLoading,
  } = useSpatialCommentaryState();

  const playPannedAudio = (pan: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      if (panner) {
        panner.pan.setValueAtTime(pan, ctx.currentTime);
        osc.connect(panner);
        panner.connect(gain);
      } else {
        osc.connect(gain);
      }
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  };

  const handleFetchCommentary = async (pos: 'LEFT' | 'CENTER' | 'RIGHT') => {
    setSelectedPos(pos);
    const panVal = pos === 'LEFT' ? -0.8 : pos === 'RIGHT' ? 0.8 : 0;
    playPannedAudio(panVal);
    setIsLoading(true);
    const res = await fetchSpatialCommentaryAction({
      movieId: 'm-101',
      timestampSec: currentTimestampSec,
      spatialPosition: pos,
    });
    if (res.success && res.data) {
      setCommentaries(res.data);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-950/40 backdrop-blur-[40px] border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-neutral-100 font-sans max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-xl font-semibold text-blue-400">
            Director's Spatial Audio Commentary
          </h3>
          <p className="text-xs text-neutral-400">GenAI Spatial Sound Trivia & Insight</p>
        </div>
        <span className="px-3 py-1 text-xs font-mono rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
          {currentTimestampSec}s
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(['LEFT', 'CENTER', 'RIGHT'] as const).map((pos) => (
          <motion.button
            key={pos}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleFetchCommentary(pos)}
            className={`p-3 rounded-xl border text-center transition-all ${
              selectedPos === pos
                ? 'bg-blue-500/20 border-blue-400 text-blue-200'
                : 'bg-neutral-900/60 border-white/10 text-neutral-400 hover:border-white/20'
            }`}
          >
            <div className="text-[10px] text-neutral-500 font-mono">Audio Pan</div>
            <div className="text-xs font-bold font-heading">{pos}</div>
          </motion.button>
        ))}
      </div>

      <div className="space-y-3">
        {commentaries.map((c) => (
          <motion.div
            key={c.id}
            whileHover={{ y: -2 }}
            onClick={() => {
              playPannedAudio(c.panningValue);
              setActiveCommentaryId(c.id);
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeCommentaryId === c.id
                ? 'bg-blue-500/20 border-blue-400 text-blue-100'
                : 'bg-neutral-900/40 border-white/5 text-neutral-300'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold font-heading text-blue-300">{c.speakerName}</span>
              <span className="text-[10px] font-mono text-cyan-400">+{c.audioBoostDb} dB Boost</span>
            </div>
            <p className="text-xs italic text-neutral-300">"{c.quote}"</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

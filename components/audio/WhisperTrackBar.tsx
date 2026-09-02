'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Volume2, Sliders, Play, Pause, Radio, Zap } from 'lucide-react';
import { useWhisperTrack } from '@/hooks/useWhisperTrack';
import { WhisperTrackModal } from './WhisperTrackModal';

export const WhisperTrackBar: React.FC = () => {
  const {
    isPlaying,
    channel,
    volume,
    latencyOffsetMs,
    eqPreset,
    togglePlay,
    selectChannel,
    changeVolume,
    changeLatency,
    changeEq,
  } = useWhisperTrack();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getChannelLabel = () => {
    switch (channel) {
      case 'dialogue_boost': return 'דיאלוג מוגבר (Dialogue Boost)';
      case 'directors_commentary': return 'פרשנות במאי חיה';
      case 'original_audio': return 'שפת מקור באוזניות';
      default: return 'ערוץ מותאם אישית';
    }
  };

  return (
    <>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-96 z-40 bg-zinc-950/90 border border-white/10 backdrop-blur-2xl rounded-2xl p-3 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.2)] text-right"
        dir="rtl"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "השהה שמע אישי" : "הפעל שמע אישי באוזניות"}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
              isPlaying
                ? 'bg-cyan-500 text-zinc-950 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current mr-0.5" />}
          </button>

          {/* Title & Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-bold">
              <Radio className={`w-3 h-3 ${isPlaying ? 'animate-pulse' : ''}`} />
              <span>WhisperTrack™ • שמע אישי באולם</span>
            </div>
            <p className="text-xs font-black text-white truncate font-outfit mt-0.5">
              {getChannelLabel()}
            </p>
          </div>

          {/* Calibrate Settings Trigger */}
          <button
            onClick={() => setIsModalOpen(true)}
            title="כיול שמע ואקולייזר"
            aria-label="כיול שמע ואקולייזר"
            className="p-2 text-zinc-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <WhisperTrackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isPlaying={isPlaying}
        channel={channel}
        volume={volume}
        latencyOffsetMs={latencyOffsetMs}
        eqPreset={eqPreset}
        togglePlay={togglePlay}
        selectChannel={selectChannel}
        changeVolume={changeVolume}
        changeLatency={changeLatency}
        changeEq={changeEq}
      />
    </>
  );
};

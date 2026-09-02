'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Sliders, Play, Pause, Radio, ChevronDown, ChevronUp, X } from 'lucide-react';
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
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const getChannelLabel = () => {
    switch (channel) {
      case 'dialogue_boost': return 'דיאלוג מוגבר (Dialogue Boost)';
      case 'directors_commentary': return 'פרשנות במאי חיה';
      case 'original_audio': return 'שפת מקור באוזניות';
      default: return 'ערוץ שמע מותאם אישית';
    }
  };

  if (isDismissed && !isPlaying) {
    return null;
  }

  return (
    <>
      <div 
        className="fixed bottom-24 md:bottom-6 right-4 left-4 md:left-auto md:right-[17.5rem] z-40 max-w-sm"
        dir="rtl"
      >
        <AnimatePresence mode="wait">
          {isMinimized ? (
            /* Minimized Pill Mode */
            <motion.button
              key="minimized-pill"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => setIsMinimized(false)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-zinc-950/90 hover:bg-zinc-900 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_8px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(6,182,212,0.25)] text-right transition-all group"
            >
              <span className="relative flex h-2.5 w-2.5">
                {isPlaying && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlaying ? 'bg-cyan-500' : 'bg-zinc-500'}`} />
              </span>
              <Headphones className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-white font-outfit">WhisperTrack™</span>
              <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
            </motion.button>
          ) : (
            /* Full Floating Bar Mode */
            <motion.div
              key="full-bar"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full bg-zinc-950/95 border border-white/15 backdrop-blur-2xl rounded-2xl p-3 shadow-[0_12px_35px_rgba(0,0,0,0.85),0_0_25px_rgba(6,182,212,0.18)] text-right"
            >
              <div className="flex items-center justify-between gap-2.5">
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
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                  <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-bold">
                    <Radio className={`w-3 h-3 ${isPlaying ? 'animate-pulse' : ''}`} />
                    <span className="truncate">WhisperTrack™ • שמע באולם</span>
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
                  className="p-2 text-zinc-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors shrink-0"
                >
                  <Sliders className="w-4 h-4" />
                </button>

                {/* Minimize Button */}
                <button
                  onClick={() => setIsMinimized(true)}
                  title="מזער נגן"
                  aria-label="מזער נגן שמע אישי"
                  className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-white/5 transition-colors shrink-0"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Close/Dismiss Button (When not playing) */}
                {!isPlaying && (
                  <button
                    onClick={() => setIsDismissed(true)}
                    title="סגור נגן"
                    aria-label="סגור נגן שמע אישי"
                    className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-white/5 transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Music, Sparkles } from 'lucide-react';
import { generateNeuralSoundtrack } from '@/lib/actions/soundtrack-actions';
import { neuralAudioEngine } from '@/lib/audio/neural-audio-engine';
import { HarmonicConfig } from '@/lib/validations/soundtrack-schema';

interface NeuralSoundtrackSynthProps {
  movieId: string;
  title: string;
  genres: string[];
}

export const NeuralSoundtrackSynth: React.FC<NeuralSoundtrackSynthProps> = ({
  movieId,
  title,
  genres,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<HarmonicConfig | null>(null);

  useEffect(() => {
    return () => {
      neuralAudioEngine.stop();
    };
  }, []);

  const handleToggleSoundtrack = async () => {
    if (isPlaying) {
      neuralAudioEngine.stop();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    const res = await generateNeuralSoundtrack({ movieId, title, genres });
    setIsLoading(false);

    if (res.success && res.data) {
      setConfig(res.data);
      neuralAudioEngine.start(res.data);
      setIsPlaying(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlaying || !config) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const sweptCutoff = 400 + ratio * 3600;
    neuralAudioEngine.setCutoff(sweptCutoff);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative p-5 rounded-2xl border border-white/10 bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] text-neutral-100 transform-gpu overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Music className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide font-['Outfit'] text-white/90">
              Neural Soundtrack Resonator
            </h4>
            <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-purple-400" />
              {config ? config.mood : 'Procedural AI Ambient Synthesis'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleSoundtrack}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-medium transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <>
              <Square className="w-3.5 h-3.5 text-red-400 fill-current" /> Stop
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" /> Synthesize
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-1.5 h-10"
          >
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: ['20%', '100%', '30%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6 + (i % 5) * 0.15,
                  ease: 'easeInOut',
                }}
                className="w-1 bg-gradient-to-t from-purple-500 to-indigo-400 rounded-full transform-gpu"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Headphones, Sparkles, Volume2, Mic, Radio } from 'lucide-react';
import { CommentaryTrack, CommentaryPersona } from '@/lib/schemas/directorsCut.schema';
import { fetchDirectorsCutCommentary } from '@/lib/actions/directorsCutActions';
import { useDirectorsCutAudio } from '@/hooks/useDirectorsCutAudio';
import { PersonaSelector } from './PersonaSelector';
import { SceneTimelineScrubber } from './SceneTimelineScrubber';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

interface DirectorsCutPlayerProps {
  movieId: string;
  movieTitle?: string;
}

export function DirectorsCutPlayer({ movieId, movieTitle }: DirectorsCutPlayerProps) {
  const [persona, setPersona] = useState<CommentaryPersona>('director');
  const [track, setTrack] = useState<CommentaryTrack | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchDirectorsCutCommentary({ movieId, persona }).then((res) => {
      if (isMounted && res.success && res.data) {
        setTrack(res.data);
      }
      if (isMounted) setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [movieId, persona]);

  const {
    isPlaying,
    currentSec,
    activeSegmentIndex,
    activeSegment,
    togglePlay,
    seekTo,
  } = useDirectorsCutAudio(track?.segments || []);

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-[36px] bg-black/60 backdrop-blur-3xl border border-cyan-500/20 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-black">
              <Headphones size={16} />
              <span>ערוץ פרשנות אודיו חכם • Director&apos;s Cut Companion</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-rubik">
              {track?.movieTitle || movieTitle || 'סרט קולנוע'}
            </h2>
            <p className="text-xs text-off-white/60">{track?.description}</p>
          </div>

          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-primary hover:from-cyan-400 hover:to-primary text-black font-black text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all active:scale-95 shrink-0"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            <span>{isPlaying ? 'השהה קריינות AI' : 'הפעל פרשנות שמע חיה'}</span>
          </button>
        </div>

        {/* Persona Selectors */}
        <PersonaSelector selectedPersona={persona} onSelectPersona={setPersona} />
      </div>

      {isLoading ? (
        <div className="h-[250px] flex items-center justify-center">
          <LoadingIndicator variant="spinner" size={32} color="#06B6D4" label="טוען תובנות ופרשנות..." />
        </div>
      ) : track ? (
        <div className="space-y-6">
          {/* Active Commentary Glass Card */}
          <AnimatePresence mode="wait">
            {activeSegment && (
              <motion.div
                key={activeSegment.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-6 md:p-8 rounded-[32px] bg-black/50 backdrop-blur-3xl border border-white/15 shadow-2xl space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                    {activeSegment.sceneName}
                  </span>
                  {activeSegment.triviaTag && (
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Sparkles size={13} />
                      {activeSegment.triviaTag}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-white font-rubik">{activeSegment.headline}</h3>
                <p className="text-base text-off-white/90 leading-relaxed-hebrew font-medium">
                  {activeSegment.commentaryText}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-off-white/50">
                  <div className="flex items-center gap-2">
                    <Mic size={14} className={isPlaying ? 'text-primary animate-pulse' : ''} />
                    <span>קריין: {track.narratorName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-cyan-400">
                    <Radio size={14} />
                    <span>מיקוד אקוסטי: {activeSegment.acousticFocus}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timeline Scrubber */}
          <SceneTimelineScrubber
            segments={track.segments}
            currentSec={currentSec}
            activeSegmentIndex={activeSegmentIndex}
            onSeek={seekTo}
          />
        </div>
      ) : null}
    </div>
  );
}

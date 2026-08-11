'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { generateAiMovieAnimations } from '@/lib/actions/ai-movie-animation.actions';
import { AiMovieAnimationFrame } from '@/lib/validations/ai-movie-animation.schema';
import { useAiMovieAnimation } from '@/hooks/useAiMovieAnimation';
import AiMovieAnimationStudioView from './AiMovieAnimationStudioView';

interface AiMovieAnimationStudioContainerProps {
  movieId: number;
  movieTitle: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  overview?: string;
}

export default function AiMovieAnimationStudioContainer({
  movieId,
  movieTitle,
  posterPath = null,
  backdropPath = null,
  overview = '',
}: AiMovieAnimationStudioContainerProps) {
  const [frames, setFrames] = useState<AiMovieAnimationFrame[]>([]);
  const [activeStyle, setActiveStyle] = useState<'cyberpunk' | 'retro_film' | 'epic_glow' | 'noir' | 'fantasy'>('cyberpunk');
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    activeFrameIndex,
    isPlaying,
    togglePlay,
    nextFrame,
    prevFrame,
    playSpatialTone,
  } = useAiMovieAnimation();

  const loadAnimations = useCallback(
    async (stylePreset: 'cyberpunk' | 'retro_film' | 'epic_glow' | 'noir' | 'fantasy', customPrompt?: string) => {
      setIsGenerating(true);
      try {
        const res = await generateAiMovieAnimations({
          movieId,
          movieTitle,
          posterPath,
          backdropPath,
          overview,
          stylePreset,
          customPrompt,
        });

        if (res.success && res.data) {
          setFrames(res.data.frames);
          setActiveStyle(stylePreset);
          playSpatialTone();
        }
      } catch (err) {
        console.error('Failed to load AI animations:', err);
      } finally {
        setIsGenerating(false);
      }
    },
    [movieId, movieTitle, posterPath, backdropPath, overview, playSpatialTone]
  );

  useEffect(() => {
    loadAnimations('cyberpunk');
  }, [loadAnimations]);

  const handleStyleChange = (style: 'cyberpunk' | 'retro_film' | 'epic_glow' | 'noir' | 'fantasy') => {
    loadAnimations(style);
  };

  const handleGenerateCustom = (prompt: string) => {
    loadAnimations(activeStyle, prompt);
  };

  return (
    <AiMovieAnimationStudioView
      movieTitle={movieTitle}
      frames={frames}
      activeFrameIndex={activeFrameIndex}
      isPlaying={isPlaying}
      isGenerating={isGenerating}
      activeStyle={activeStyle}
      onNext={() => nextFrame(frames.length || 1)}
      onPrev={() => prevFrame(frames.length || 1)}
      onTogglePlay={togglePlay}
      onStyleChange={handleStyleChange}
      onGenerateCustom={handleGenerateCustom}
    />
  );
}

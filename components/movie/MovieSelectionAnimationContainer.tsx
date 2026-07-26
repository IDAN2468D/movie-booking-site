'use client';

import React, { useEffect, useState } from 'react';
import { generateMovieAnimationPreset } from '@/lib/actions/movie-selection-animation.actions';
import { MovieSelectionAnimationPreset } from '@/lib/validations/movie-selection-animation.schema';
import { useMovieSelectionAnimation } from '@/hooks/useMovieSelectionAnimation';
import MovieSelectionAnimationView from './MovieSelectionAnimationView';

interface MovieSelectionAnimationContainerProps {
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
  genres?: string[];
  rating?: number;
}

const DEFAULT_PRESET: MovieSelectionAnimationPreset = {
  glowColor: 'rgba(255, 159, 10, 0.8)',
  secondaryGlow: 'rgba(255, 20, 100, 0.6)',
  rotationSpeed: 12,
  particleCount: 40,
  hologramIntensity: 0.8,
  themeName: 'קלאסיקה זהובה',
};

export default function MovieSelectionAnimationContainer({
  movieId,
  movieTitle,
  posterPath,
  genres = [],
  rating = 8.0,
}: MovieSelectionAnimationContainerProps) {
  const [preset, setPreset] = useState<MovieSelectionAnimationPreset>(DEFAULT_PRESET);
  const { isActive, triggerAnimation, resetAnimation } = useMovieSelectionAnimation();

  useEffect(() => {
    let mounted = true;

    async function loadPreset() {
      const res = await generateMovieAnimationPreset({
        movieId,
        movieTitle,
        genres,
        rating,
      });

      if (mounted && res.success && res.data) {
        setPreset(res.data);
      }
    }

    loadPreset();
    return () => {
      mounted = false;
    };
  }, [movieId, movieTitle, genres, rating]);

  return (
    <MovieSelectionAnimationView
      movieTitle={movieTitle}
      posterPath={posterPath}
      preset={preset}
      isActive={isActive}
      onTrigger={triggerAnimation}
      onClose={resetAnimation}
    />
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MoodInput, MoodRecommendation } from '@/lib/validations/mood';
import { getMoodBasedRecommendations } from '@/app/actions/mood-actions';
import { MoodRefractorView } from './MoodRefractorView';

export const MoodRefractorContainer: React.FC = () => {
  const [mood, setMood] = useState<MoodInput>({
    valence: 0.7,
    arousal: 0.6,
    dominance: 0.5,
  });
  const [recommendations, setRecommendations] = useState<MoodRecommendation[]>([]);

  const blurRadius = Math.round(20 - mood.arousal * 15);

  const fetchRecommendations = useCallback(async (currentMood: MoodInput) => {
    const res = await getMoodBasedRecommendations(currentMood);
    if (res.success && res.data) {
      setRecommendations(res.data);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations(mood);
  }, [mood, fetchRecommendations]);

  const handleMoodChange = (key: keyof MoodInput, value: number) => {
    setMood((prev) => ({ ...prev, [key]: value }));
  };

  const handlePresetSelect = (preset: MoodInput['preset']) => {
    let presetValues: MoodInput = { valence: 0.5, arousal: 0.5, dominance: 0.5, preset };
    if (preset === 'melancholy') presetValues = { valence: 0.2, arousal: 0.3, dominance: 0.4, preset };
    if (preset === 'hype') presetValues = { valence: 0.9, arousal: 0.95, dominance: 0.8, preset };
    if (preset === 'cyber_euphoria') presetValues = { valence: 0.85, arousal: 0.7, dominance: 0.9, preset };
    if (preset === 'cosmic_horror') presetValues = { valence: 0.15, arousal: 0.8, dominance: 0.2, preset };
    setMood(presetValues);
  };

  const handleHoverAudio = (freq: number) => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio fallback silent failure
    }
  };

  return (
    <MoodRefractorView
      mood={mood}
      blurRadius={blurRadius}
      recommendations={recommendations}
      onMoodChange={handleMoodChange}
      onPresetSelect={handlePresetSelect}
      onHoverAudio={handleHoverAudio}
    />
  );
};

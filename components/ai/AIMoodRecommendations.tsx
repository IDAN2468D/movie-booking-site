'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, Ticket, Film, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb';
import WatchlistButton from '@/components/watchlist/WatchlistButton';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { AIMoodSelector } from './AIMoodSelector';
import {
  getAIMoodRecommendationsAction,
  AIMovieRecommendation,
} from '@/app/actions/aiRecommendationActions';

export function AIMoodRecommendations() {
  const [selectedMood, setSelectedMood] = useState('אדרנלין ואקשן שיא');
  const [customPrompt, setCustomPrompt] = useState('');
  const [recommendations, setRecommendations] = useState<AIMovieRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPersonalized, setIsPersonalized] = useState(false);

  const fetchRecommendations = useCallback(async (moodToFetch: string, customText?: string) => {
    setLoading(true);
    try {
      const res = await getAIMoodRecommendationsAction({
        mood: moodToFetch,
        customPrompt: customText || undefined,
        limit: 4,
      });

      if (res.success && res.data) {
        setRecommendations(res.data.recommendations);
        setIsPersonalized(res.data.personalizedForUser);
      }
    } catch (err) {
      console.error('Failed to fetch AI mood recommendations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations(selectedMood);
  }, [selectedMood, fetchRecommendations]);

  const handleCustomSubmit = () => {
    if (customPrompt.trim()) {
      fetchRecommendations(customPrompt, customPrompt);
    }
  };

  return (
    <div className="w-full space-y-6" dir="rtl">
      {/* Header with AI Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-primary/20 text-primary border border-primary/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-lg md:text-xl font-black text-white">המלצות AI אישיות ומצב רוח</h2>
          </div>
          <p className="text-xs text-white/50 mt-1">
            מנוע מבוסס <span className="text-primary font-bold">gemini-3.5-flash-lite</span> וניתוח אקוסטי בזמן אמת
          </p>
        </div>
        {isPersonalized && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>מותאם אישית להיסטוריה שלך</span>
          </div>
        )}
      </div>

      {/* Mood Selector Controls */}
      <AIMoodSelector
        selectedMood={selectedMood}
        onSelectMood={setSelectedMood}
        customPrompt={customPrompt}
        onCustomPromptChange={setCustomPrompt}
        onSubmitCustomPrompt={handleCustomSubmit}
        loading={loading}
      />

      {/* Recommendations Cards Grid */}
      {loading ? (
        <div className="w-full h-56 flex items-center justify-center bg-white/[0.02] rounded-3xl border border-white/5">
          <LoadingIndicator variant="orbit" size="lg" label="Gemini AI מנתח התאמה קולנועית ואקוסטית..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {recommendations.map((movie, idx) => (
              <motion.div
                key={movie.movieId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="group relative rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 hover:border-primary/50 overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300"
              >
                {/* Poster & Badges Header */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
                  <Image
                    src={getImageUrl(movie.backdropPath || movie.posterPath, 'w500')}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                  {/* Match Percentage Badge */}
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-primary/40 text-primary text-[11px] font-black flex items-center gap-1 shadow-lg">
                    <Activity className="w-3 h-3 text-primary animate-pulse" />
                    <span>{movie.matchPercentage}% התאמה</span>
                  </div>

                  {/* Quick Watchlist Bookmark Button */}
                  <div className="absolute top-2.5 left-2.5">
                    <WatchlistButton
                      movie={{
                        id: Number(movie.movieId),
                        title: movie.title,
                        poster_path: movie.posterPath || undefined,
                      }}
                      size="sm"
                    />
                  </div>

                  {/* Suggested Format Pill */}
                  <div className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded-lg bg-white/10 backdrop-blur-md text-[10px] font-bold text-white/90 border border-white/10">
                    {movie.suggestedFormat}
                  </div>
                </div>

                {/* Content & AI Reasoning */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-[11px] text-white/70 mt-1 line-clamp-2 leading-relaxed bg-white/[0.02] p-2 rounded-xl border border-white/5">
                      💡 {movie.aiReasoningHebrew}
                    </p>
                  </div>

                  {/* Bottom Acoustic Mood Tag & CTA */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-primary/80 font-medium truncate max-w-[120px]">
                      🎵 {movie.acousticMood}
                    </span>
                    <Link
                      href={`/movie/${movie.movieId}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/20 hover:bg-primary text-primary hover:text-black text-xs font-bold transition-all"
                    >
                      <Ticket className="w-3 h-3" />
                      <span>הזמן</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default AIMoodRecommendations;

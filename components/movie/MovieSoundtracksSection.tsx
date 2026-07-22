'use client';

import React, { useEffect, useState } from 'react';
import { Disc3, Music2, Sparkles } from 'lucide-react';
import type { SoundtrackItem } from '@/lib/schemas/soundtrack';
import { SoundtrackPlayerCard } from '../soundtrack/SoundtrackPlayerCard';

interface MovieSoundtracksSectionProps {
  movieId: number;
  movieTitle: string;
}

export function MovieSoundtracksSection({ movieId, movieTitle }: MovieSoundtracksSectionProps) {
  const [tracks, setTracks] = useState<SoundtrackItem[]>([]);
  const [activeTrack, setActiveTrack] = useState<SoundtrackItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSoundtracks() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/movies/soundtracks?movieId=${movieId}`);
        const data = await res.json();
        if (data.success && data.data?.soundtracks) {
          setTracks(data.data.soundtracks);
          if (data.data.soundtracks.length > 0) {
            setActiveTrack(data.data.soundtracks[0]);
          }
        }
      } catch (err) {
        console.warn('Failed to load soundtracks:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSoundtracks();
  }, [movieId]);

  if (isLoading || tracks.length === 0) return null;

  return (
    <div className="w-full my-12 text-right" dir="rtl">
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/10 border border-indigo-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Disc3 size={24} className="text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h3 className="font-['Outfit'] font-black text-white text-2xl tracking-wide uppercase">
              פסקול רשמי — {movieTitle}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-indigo-300/80 font-semibold tracking-widest uppercase">
              <Sparkles size={12} className="text-indigo-400" />
              ORIGINAL MOTION PICTURE SOUNDTRACK ({tracks.length} שירים)
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Player */}
        {activeTrack && (
          <div className="w-full flex justify-center">
            <SoundtrackPlayerCard track={activeTrack} />
          </div>
        )}

        {/* Tracklist */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-lg mb-3 flex items-center gap-2">
            <Music2 size={18} className="text-indigo-400" />
            רשימת שירים ואלבומים
          </h4>
          {tracks.map((t, idx) => (
            <div
              key={t.id}
              onClick={() => setActiveTrack(t)}
              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                activeTrack?.id === t.id
                  ? 'bg-indigo-500/20 border-indigo-500/50 shadow-lg'
                  : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-neutral-400 w-6">#{idx + 1}</span>
                <div>
                  <h5 className="font-bold text-white text-sm">{t.songTitle}</h5>
                  <p className="text-xs text-neutral-400">{t.artist}</p>
                </div>
              </div>
              <span className="font-mono text-xs text-indigo-300">{t.duration || '3:00'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

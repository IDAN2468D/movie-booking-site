'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { VideoResult } from '@/lib/tmdb';
import TrailerModal from './TrailerModal';

interface Props {
  movieId: number;
  movieTitle: string;
  variant?: 'default' | 'hero';
}

/**
 * A self-contained trailer button that fetches video data
 * from the TMDB API on click and opens a player modal.
 */
export default function TrailerButton({ movieId, movieTitle, variant = 'default' }: Props) {
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (videos.length > 0) {
      setShowModal(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/movie-videos/${movieId}`);
      const data: VideoResult[] = await res.json();
      setVideos(data);
      if (data.length > 0) {
        setShowModal(true);
      }
    } catch (err) {
      console.error('Failed to load trailers', err);
    } finally {
      setLoading(false);
    }
  };

  const isHero = variant === 'hero';

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className={
          isHero
            ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all border border-white/10 active:scale-95 disabled:opacity-50'
            : 'bg-white/5 hover:bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border border-white/10 active:scale-95 text-sm disabled:opacity-50'
        }
      >
        <Play size={isHero ? 20 : 16} className="fill-white" />
        {loading ? 'טוען...' : 'טריילר'}
      </button>

      <TrailerModal
        videos={videos}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        movieTitle={movieTitle}
      />
    </>
  );
}

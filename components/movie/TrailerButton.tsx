'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
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
      <motion.button
        whileHover={{ scale: 1.05, translateY: -2, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        disabled={loading}
        className={
          isHero
            ? 'bg-white/10 backdrop-blur-3xl saturate-[250%] brightness-125 text-white px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black flex items-center justify-center gap-2 md:gap-3 transition-all border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group disabled:opacity-50 text-xs md:text-base'
            : 'bg-white/10 backdrop-blur-2xl saturate-[200%] text-white px-6 py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all border border-white/20 shadow-xl relative overflow-hidden group text-sm disabled:opacity-50'
        }
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="relative z-10 drop-shadow-md">{loading ? 'טוען...' : 'טריילר'}</span>
        <Play size={isHero ? 16 : 16} className="fill-white relative z-10 group-hover:scale-110 transition-transform md:size-[20px]" />
      </motion.button>

      <TrailerModal
        videos={videos}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        movieTitle={movieTitle}
      />
    </>
  );
}

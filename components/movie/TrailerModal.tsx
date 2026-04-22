'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Film } from 'lucide-react';
import { VideoResult } from '@/lib/tmdb';

interface Props {
  videos: VideoResult[];
  isOpen: boolean;
  onClose: () => void;
  movieTitle: string;
}

export default function TrailerModal({ videos, isOpen, onClose, movieTitle }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = videos[activeIndex];

  if (!current) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-[92vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-1" dir="rtl">
              <div className="flex items-center gap-3">
                <Film size={18} className="text-[#FF9F0A]" />
                <h3 className="text-white font-black text-lg">{movieTitle}</h3>
                <span className="text-slate-500 text-sm font-bold">— {current.name}</span>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/10"
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            {/* YouTube Player */}
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl shadow-black/50 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${current.key}?autoplay=1&rel=0&modestbranding=1&hl=he`}
                title={current.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Video Selector (if multiple trailers) */}
            {videos.length > 1 && (
              <div className="mt-4 flex gap-2 flex-wrap justify-center" dir="rtl">
                {videos.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveIndex(i)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      i === activeIndex
                        ? 'bg-[#FF9F0A] text-white border-[#FF9F0A] shadow-lg shadow-orange-500/20'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {v.type === 'Trailer' ? '🎬' : '🎞️'} {v.name}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

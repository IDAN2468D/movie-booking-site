'use client';

import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { MovieOption } from '@/types/seatingGame';
import { Film, Clock, Ticket, Check } from 'lucide-react';

interface MovieSelectorBarProps {
  movies: MovieOption[];
  selectedMovie: MovieOption;
  selectedShowtime: string;
  onSelectMovie: (movie: MovieOption) => void;
  onSelectShowtime: (showtime: string) => void;
}

export const MovieSelectorBar: React.FC<MovieSelectorBarProps> = ({
  movies,
  selectedMovie,
  selectedShowtime,
  onSelectMovie,
  onSelectShowtime,
}) => {
  const [failedPosters, setFailedPosters] = useState<Record<string, boolean>>({});

  // Mouse-drag scroll state
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasMoved = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.8;
    if (Math.abs(walk) > 4) hasMoved.current = true;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  }, []);

  return (
    <div className="bg-slate-900/95 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-6 shadow-2xl space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">בחירת סרט ושעת הקרנה</h3>
            <p className="text-xs text-slate-400">בכרו מתוך הסרטים המובילים באולם</p>
          </div>
        </div>
        <span className="text-xs font-mono text-cyan-400 font-bold bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
          ₪{selectedMovie.pricePerTicket} לכרטיס
        </span>
      </div>

      {/* Movie Cards — Drag-to-scroll, no scrollbar */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex gap-3 overflow-x-auto cursor-grab select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => {
          const isSelected = movie.id === selectedMovie.id;
          const posterSrc = failedPosters[movie.id]
            ? `/api/proxy/image?url=${encodeURIComponent(movie.poster)}`
            : movie.poster;

          return (
            <div
              key={movie.id}
              onClick={() => {
                if (!hasMoved.current) onSelectMovie(movie);
              }}
              className={`group relative flex items-center gap-3 p-2.5 rounded-2xl border-2 transition-all flex-shrink-0 w-[230px] ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-500/15'
                  : 'bg-slate-950/70 hover:bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              {/* Poster thumbnail */}
              <div className={`relative w-[52px] h-[76px] rounded-xl overflow-hidden flex-shrink-0 shadow-lg border-2 transition-all ${
                isSelected ? 'border-cyan-400/60' : 'border-slate-600/50'
              }`}>
                <Image
                  src={posterSrc}
                  alt={movie.hebrewTitle}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="52px"
                  onError={() => setFailedPosters((prev) => ({ ...prev, [movie.id]: true }))}
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-cyan-400/10" />
                )}
              </div>

              {/* Movie info */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-black text-[13px] text-white truncate leading-tight">{movie.hebrewTitle}</h4>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate">{movie.genre}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Clock className="w-3 h-3 text-cyan-500/70" />
                  <span>{movie.duration}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Showtimes Selector */}
      <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-800/80">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 me-2">
          <Ticket className="w-4 h-4 text-cyan-400" />
          שעות הקרנה פנויות:
        </span>
        {selectedMovie.showtimes.map((time) => {
          const isTimeSelected = time === selectedShowtime;
          return (
            <button
              key={time}
              onClick={() => onSelectShowtime(time)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                isTimeSelected
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-lg shadow-cyan-500/25 scale-105'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

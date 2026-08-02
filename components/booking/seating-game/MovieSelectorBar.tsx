'use client';

import React from 'react';
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
  const [failedPosters, setFailedPosters] = React.useState<Record<string, boolean>>({});

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

      {/* Movie Cards Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {movies.map((movie) => {
          const isSelected = movie.id === selectedMovie.id;
          const tmdbOriginal = movie.hebrewTitle.includes('גלדיאטור') || movie.title.toLowerCase().includes('gladiator')
            ? 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg'
            : movie.hebrewTitle.includes('דיונה') || movie.title.toLowerCase().includes('dune')
            ? 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'
            : movie.hebrewTitle.includes('אווטאר') || movie.title.toLowerCase().includes('avatar')
            ? 'https://image.tmdb.org/t/p/w500/t6HIrqRAclMCA60NsSmeqe9RmNV.jpg'
            : movie.poster;

          const posterSrc = failedPosters[movie.id] 
            ? `/api/proxy/image?url=${encodeURIComponent(tmdbOriginal)}`
            : tmdbOriginal;

          return (
            <div
              key={movie.id}
              onClick={() => onSelectMovie(movie)}
              className={`group relative flex items-center gap-3.5 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/20 scale-[1.02]'
                  : 'bg-slate-950/80 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Poster thumbnail */}
              <div className="relative w-14 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md border border-slate-700">
                <Image
                  src={posterSrc}
                  alt={movie.hebrewTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="56px"
                  onError={() => setFailedPosters((prev) => ({ ...prev, [movie.id]: true }))}
                />
              </div>

              {/* Movie info */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-white truncate">{movie.hebrewTitle}</h4>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate">{movie.genre}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Clock className="w-3 h-3 text-cyan-400" />
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

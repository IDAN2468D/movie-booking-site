'use client';

import React from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { Star, Ticket, Trash2, Calendar } from 'lucide-react';
import { Movie, getImageUrl } from '@/lib/tmdb';
import { useBookingStore } from '@/lib/store';

interface WatchlistCardProps {
  movie: Movie;
  onRemove: (movie: Movie) => void;
}

export default function WatchlistCard({ movie, onRemove }: WatchlistCardProps) {
  const setSelectedMovie = useBookingStore((state) => state.setSelectedMovie);

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'בקרוב';

  return (
    <div className="group relative rounded-3xl overflow-hidden bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(255,20,100,0.15)] flex flex-col">
      {/* Poster Media Box */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden">
        <NextImage
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={movie.displayTitle || movie.title || 'סרט'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-black/30" />

        {/* Delete from Watchlist Quick Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(movie);
          }}
          className="absolute top-3 left-3 p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white/70 hover:text-rose-400 hover:bg-rose-500/20 transition-all active:scale-90"
          title="הסר מרשימת הצפייה"
        >
          <Trash2 size={16} />
        </button>

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-xs font-black text-amber-400">
            <Star size={12} className="fill-amber-400" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Info & Actions */}
      <div className="p-5 flex-1 flex flex-col justify-between text-right" dir="rtl">
        <div>
          <h3 className="text-lg font-black text-white line-clamp-1 group-hover:text-primary transition-colors">
            {movie.displayTitle || movie.title}
          </h3>

          <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
            <Calendar size={12} />
            <span>{releaseYear}</span>
            {movie.overview && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="line-clamp-1">{movie.overview}</span>
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <Link
            href={`/movie/${movie.id}`}
            onClick={() => setSelectedMovie(movie)}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-rose-600 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>הזמן כרטיסים</span>
            <Ticket size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

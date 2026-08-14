'use client';

import React, { useState } from 'react';
import { Bookmark, Check } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useBookingStore } from '@/lib/store';
import { addToWatchlistAction, removeFromWatchlistAction } from '@/app/actions/watchlistActions';
import { Movie } from '@/lib/tmdb';

interface WatchlistButtonProps {
  movie: Partial<Movie> & { id: number | string; title?: string; displayTitle?: string; poster_path?: string };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function WatchlistButton({
  movie,
  className = '',
  size = 'md',
  showLabel = false,
}: WatchlistButtonProps) {
  const { data: session } = useSession();
  const { favorites, toggleFavorite } = useBookingStore();
  const [isPending, setIsPending] = useState(false);

  const movieIdStr = String(movie.id);
  const isSaved = favorites.some((m) => String(m.id) === movieIdStr);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Haptic feedback
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }

    // Toggle in local store
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await toggleFavorite(movie as any);

    // Sync to Mongoose Watchlist if authenticated
    if (session?.user?.id) {
      setIsPending(true);
      try {
        if (!isSaved) {
          await addToWatchlistAction({
            userId: session.user.id,
            item: {
              movieId: movieIdStr,
              title: movie.title || movie.displayTitle || 'ללא שם',
              posterPath: movie.poster_path || '',
              releaseDate: movie.release_date || '',
              voteAverage: movie.vote_average || 0,
              genres: [],
              notifyOnRelease: false,
            },
          });
        } else {
          await removeFromWatchlistAction({
            userId: session.user.id,
            movieId: movieIdStr,
          });
        }
      } catch (err) {
        console.error('Watchlist sync error:', err);
      } finally {
        setIsPending(false);
      }
    }
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={isSaved ? 'הסר מרשימת הצפייה' : 'הוסף לרשימת הצפייה'}
      className={`relative group flex items-center justify-center gap-2 rounded-xl transition-all duration-300 transform-gpu active:scale-90 ${
        isSaved
          ? 'bg-primary text-black shadow-[0_0_20px_rgba(255,20,100,0.4)] border border-primary'
          : 'bg-black/40 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 hover:border-white/20'
      } ${size === 'sm' ? 'p-2 text-xs' : size === 'lg' ? 'p-3.5 text-sm font-bold' : 'p-2.5 text-xs'} ${className}`}
    >
      {isSaved ? (
        <Check className={`${iconSizes[size]} transition-transform duration-300 group-hover:scale-110`} />
      ) : (
        <Bookmark className={`${iconSizes[size]} transition-transform duration-300 group-hover:scale-110`} />
      )}
      {showLabel && (
        <span className="font-semibold">{isSaved ? 'ברשימה' : 'שמור לצפייה'}</span>
      )}
    </button>
  );
}

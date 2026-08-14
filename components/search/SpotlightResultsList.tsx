'use client';

import React from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { Film, User, Tag, Star, ArrowLeft } from 'lucide-react';
import {
  SpotlightMovieResult,
  SpotlightActorResult,
  SpotlightGenreResult,
} from '@/app/actions/spotlightSearchActions';
import { getImageUrl } from '@/lib/tmdb';

interface SpotlightResultsListProps {
  movies: SpotlightMovieResult[];
  actors: SpotlightActorResult[];
  genres: SpotlightGenreResult[];
  onSelect: () => void;
}

export default function SpotlightResultsList({
  movies,
  actors,
  genres,
  onSelect,
}: SpotlightResultsListProps) {
  const hasResults = movies.length > 0 || actors.length > 0 || genres.length > 0;

  if (!hasResults) {
    return (
      <div className="py-12 text-center text-white/40 text-sm" dir="rtl">
        לא נמצאו תוצאות עבור החיפוש המבוקש.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1 pl-2 scrollbar-thin scrollbar-thumb-white/10" dir="rtl">
      {/* 1. Genres Section */}
      {genres.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary mb-2 px-2">
            <Tag size={12} />
            <span>ז&apos;אנרים וקטגוריות</span>
          </div>
          <div className="flex flex-wrap gap-2 px-2">
            {genres.map((g) => (
              <Link
                key={g.id}
                href={`/?genre=${encodeURIComponent(g.name)}`}
                onClick={onSelect}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-primary/20 hover:border-primary/40 border border-white/10 text-xs font-bold text-white transition-all active:scale-95"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 2. Movies Section */}
      {movies.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary mb-2 px-2">
            <Film size={12} />
            <span>סרטים ({movies.length})</span>
          </div>
          <div className="space-y-1.5">
            {movies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                onClick={onSelect}
                className="group flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/10">
                    <NextImage
                      src={getImageUrl(movie.posterPath, 'w500')}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                      {movie.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                      {movie.releaseDate && (
                        <span>{new Date(movie.releaseDate).getFullYear()}</span>
                      )}
                      {movie.voteAverage > 0 && (
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star size={10} className="fill-amber-400" />
                          {movie.voteAverage.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ArrowLeft size={16} className="text-white/30 group-hover:text-primary transition-transform group-hover:-translate-x-1 ml-2" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 3. Actors Section */}
      {actors.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary mb-2 px-2">
            <User size={12} />
            <span>שחקנים ויוצרים ({actors.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {actors.map((actor) => (
              <Link
                key={actor.id}
                href={`/actor/${actor.id}`}
                onClick={onSelect}
                className="group flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 transition-all active:scale-95"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-black/60 shrink-0 border border-white/10">
                  <NextImage
                    src={getImageUrl(actor.profilePath, 'w500')}
                    alt={actor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">
                    {actor.name}
                  </h4>
                  {actor.knownFor && (
                    <p className="text-[10px] text-white/40 truncate">{actor.knownFor}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

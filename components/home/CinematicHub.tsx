"use client";

import React, { useOptimistic, useTransition, useState } from "react";
import Image from "next/image";
import { toggleBookmarkAction, logMovieViewAction } from "@/app/actions/movieHubActions";

interface Movie {
  id: string;
  title: string;
  image: string;
}

interface CinematicHubProps {
  userId: string;
  initialBookmarkedIds: string[];
  recommendedMovies: Movie[];
}

export function CinematicHub({ userId, initialBookmarkedIds, recommendedMovies }: CinematicHubProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [optimisticBookmarks, addOptimisticBookmark] = useOptimistic(
    initialBookmarkedIds,
    (state: string[], movieId: string) => {
      if (state.includes(movieId)) {
        return state.filter((id) => id !== movieId);
      }
      return [...state, movieId];
    }
  );

  const handleBookmarkToggle = (movieId: string) => {
    startTransition(async () => {
      setErrorMsg(null);
      addOptimisticBookmark(movieId);
      const result = await toggleBookmarkAction(userId, movieId);
      if (!result.success && result.error) {
        setErrorMsg(result.error);
      }
    });
  };

  return (
    <div className="flex flex-col bg-[#05070B] min-h-screen font-['Assistant',_'Rubik',_sans-serif] text-white overflow-hidden" dir="rtl">
      {/* Hero Canopy */}
      <section className="relative w-full h-[60vh] min-h-[500px]">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/6a4219aea2284eb3e0677f4a_cover-img-doubled.webp"
            alt="Cinematic Hero Banner"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/60 to-transparent z-10" />
        </div>
        
        {/* Floating Glass Card (Liquid Glass 3.0) */}
        <div className="absolute bottom-12 start-8 z-20 backdrop-blur-xl bg-slate-900/30 border border-white/10 rounded-2xl p-8 max-w-lg shadow-[0_0_40px_rgba(0,0,0,0.5),_inset_0_0_0_1px_rgba(255,255,255,0.1)] saturate-[200%] brightness-110">
          <h1 className="text-4xl md:text-5xl font-bold leading-relaxed mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            בגלל שאתה אוהב סרטים
          </h1>
          <p className="text-lg text-gray-300 leading-loose mb-6">
            גלה את ההמלצות המותאמות אישית שלך. חוויית קולנוע עוצרת נשימה מתחילה כאן.
          </p>
          <button className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform duration-300">
            התחל לצפות
          </button>
        </div>
      </section>

      {/* Error Message display */}
      {errorMsg && (
        <div className="w-full bg-red-900/50 text-red-200 p-4 text-center border-b border-red-500/20 backdrop-blur-md relative z-30">
          {errorMsg}
        </div>
      )}

      {/* Interactive Reel & Watchlist Feed */}
      <section className="relative z-20 py-16 ps-8 pe-4 before:absolute before:inset-y-0 before:start-0 before:w-16 before:bg-gradient-to-e before:from-[#05070B] before:to-transparent before:z-10">
        <h2 className="text-2xl font-bold mb-8 flex items-center space-x-4 space-x-reverse leading-relaxed py-1">
          <span className="w-2 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"></span>
          <span>מומלצים עבורך</span>
        </h2>
        
        <div className="flex overflow-x-auto scrollbar-none gap-6 pb-8 snap-x snap-mandatory pe-8">
          {recommendedMovies.map((movie) => {
            const isBookmarked = optimisticBookmarks.includes(movie.id);
            
            return (
              <div 
                key={movie.id} 
                className="snap-start shrink-0 w-64 md:w-72 flex flex-col group"
              >
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden backdrop-blur-xl bg-slate-900/30 border border-white/5 transition-all duration-500 hover:border-white/20">
                  <Image
                    src={movie.image}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  
                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    <button 
                      onClick={() => handleBookmarkToggle(movie.id)}
                      className="self-end p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors"
                      aria-label="Toggle Bookmark"
                    >
                      <svg 
                        className={`w-6 h-6 transition-colors ${isBookmarked ? 'fill-blue-500 text-blue-500' : 'fill-none text-white'}`} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                    
                    <button 
                      className="w-full py-2 rounded-lg bg-blue-600/80 hover:bg-blue-500 text-white font-medium backdrop-blur-md transition-colors"
                      onClick={() => {
                        startTransition(() => {
                          logMovieViewAction(userId, movie.id);
                        });
                      }}
                    >
                      צפה עכשיו
                    </button>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-200 truncate leading-relaxed py-1">{movie.title}</h3>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

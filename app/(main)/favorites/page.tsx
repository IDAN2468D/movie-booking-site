'use client';

import React from 'react';
import { Heart, Share2, Ticket } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import { Movie } from '@/lib/tmdb';
import NextImage from 'next/image';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites, toggleFavorite, setSelectedMovie } = useBookingStore();

  const handleShare = (movie: Movie) => {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: `בדוק את הסרט הזה: ${movie.title}`,
        url: window.location.origin + `/movie/${movie.id}`,
      });
    } else {
      alert('השיתוף אינו נתמך בדפדפן זה. הקישור הועתק ללוח.');
      navigator.clipboard.writeText(window.location.origin + `/movie/${movie.id}`);
    }
  };

  return (
    <div className="p-10 pb-20 text-right" dir="rtl">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">המועדפים <span className="text-primary">שלי</span></h1>
          <p className="text-slate-400 font-medium">כל הסרטים ששמרת לצפייה מאוחרת</p>
        </div>
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
          <Heart size={32} className="text-primary fill-primary" />
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Heart size={40} className="text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">אין לך מועדפים עדיין</h2>
          <p className="text-slate-500 mb-8">התחל לסמן סרטים בלב כדי לראות אותם כאן</p>
          <Link href="/" className="px-8 py-3 bg-primary text-background rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
            גלה סרטים חדשים
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favorites.map((movie) => (
            <div key={movie.id} className="group relative glass rounded-[32px] overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500">
              <div className="h-[400px] relative overflow-hidden">
                <NextImage 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                  <button 
                    onClick={() => toggleFavorite(movie)}
                    className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-primary hover:bg-primary hover:text-background transition-all"
                  >
                    <Heart size={20} className="fill-current" />
                  </button>
                  <button 
                    onClick={() => handleShare(movie)}
                    className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-white hover:text-background transition-all"
                  >
                    <Share2 size={20} />
                  </button>
                </div>

                <div className="absolute bottom-6 left-6 right-6 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                   <Link 
                    href={`/movie/${movie.id}`}
                    onClick={() => setSelectedMovie(movie)}
                    className="w-full py-4 bg-primary text-background rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                   >
                     הזמן עכשיו <Ticket size={16} />
                   </Link>
                </div>
              </div>
              
              <div className="p-6 text-right">
                <h3 className="text-xl font-black text-white mb-2 line-clamp-1">{movie.title}</h3>
                <div className="flex items-center gap-4 justify-end">
                   <p className="text-xs font-bold text-slate-500">{new Date(movie.release_date).getFullYear()}</p>
                   <div className="w-1 h-1 rounded-full bg-slate-700" />
                   <p className="text-xs font-black text-primary">★ {movie.vote_average.toFixed(1)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

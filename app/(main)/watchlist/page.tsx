'use client';

import React, { useEffect } from 'react';
import { Bookmark, Sparkles, Film } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useBookingStore } from '@/lib/store';
import WatchlistGrid from '@/components/watchlist/WatchlistGrid';
import { Movie } from '@/lib/tmdb';

export default function WatchlistPage() {
  const { data: session } = useSession();
  const { favorites, toggleFavorite, syncFavorites } = useBookingStore();

  useEffect(() => {
    if (session?.user?.id) {
      syncFavorites(session.user.id);
    }
  }, [session?.user?.id, syncFavorites]);

  const handleRemove = (movie: Movie) => {
    toggleFavorite(movie);
  };

  return (
    <main className="min-h-screen p-6 sm:p-10 pb-24 max-w-7xl mx-auto" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-black tracking-widest text-primary uppercase mb-2">
            <Sparkles size={14} />
            <span>ניהול רשימות אישיות</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>רשימת הצפייה</span>
            <span className="text-primary font-serif italic">שלי</span>
          </h1>
          <p className="text-white/50 text-sm mt-2">
            הסרטים שסימנת לצפייה מאוחרת עם התראות והזמנה מהירה
          </p>
        </div>

        {/* Counter Pill */}
        <div className="px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center gap-3 shadow-xl">
          <Film className="w-5 h-5 text-primary" />
          <div className="text-right">
            <div className="text-xs text-white/50">סה&quot;כ שמורים</div>
            <div className="text-lg font-black text-white">{favorites.length} סרטים</div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <WatchlistGrid movies={favorites} onRemove={handleRemove} />
    </main>
  );
}

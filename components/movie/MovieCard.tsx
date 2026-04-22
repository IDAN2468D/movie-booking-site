'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie, getImageUrl } from '@/lib/tmdb';
import { Star, Calendar, Heart, Share2 } from 'lucide-react';
import { useBookingStore } from '@/lib/store';

interface MovieCardProps {
  movie: Movie;
}

import { motion } from 'framer-motion';

export const MovieCard = ({ movie }: MovieCardProps) => {
  const { setSelectedMovie, selectedMovie, toggleFavorite, favorites } = useBookingStore();
  const isSelected = selectedMovie?.id === movie.id;
  const isFavorite = favorites.some(m => m.id === movie.id);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <motion.div 
      layout
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`movie-card group relative overflow-hidden rounded-2xl bg-[#2C2C2C] transition-all duration-500 cursor-pointer border-2 ${
        isSelected 
          ? 'border-[#FF9F0A] shadow-[0_0_30px_rgba(255,159,10,0.3)] ring-1 ring-[#FF9F0A]' 
          : 'border-white/5 hover:border-[#FF9F0A]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]'
      }`}
    >
      <Link href={`/movie/${movie.id}`} className="block">
        <div className="aspect-[2/3] relative w-full overflow-hidden">
          <Image
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Quick Info Badge */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
            <Star className="w-3 h-3 text-[#FF9F0A] fill-[#FF9F0A]" />
            <span className="text-[10px] font-bold text-white">{movie.vote_average.toFixed(1)}</span>
          </div>

          {/* Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <button 
              onClick={handleFavorite}
              className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                isFavorite 
                ? 'bg-primary border-primary text-background' 
                : 'bg-white/10 backdrop-blur-md border-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Heart size={14} className={isFavorite ? 'fill-current' : ''} />
            </button>
            <button 
              onClick={handleShare}
              className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10 text-white hover:bg-white/20 transition-all"
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>
      </Link>
      
      <div className="p-4 bg-gradient-to-b from-[#2C2C2C] to-[#1A1A1A] text-right">
        <Link href={`/movie/${movie.id}`}>
          <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-[#FF9F0A] transition-colors">{movie.title}</h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedMovie(movie);
            }}
            className="text-[10px] font-bold bg-[#FF9F0A] text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-orange-500/20 translate-y-2 group-hover:translate-y-0 active:scale-90"
          >
            הזמן עכשיו
          </button>
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="w-3 h-3" />
            <span className="text-[10px]">{new Date(movie.release_date).getFullYear()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie, getImageUrl } from '@/lib/tmdb';
import { Star, Calendar, Heart, Share2 } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { MagneticButton } from '../ui/MagneticButton';
import { KineticText } from '../effects/KineticText';
import { MarkerHighlight } from '../fx/MarkerHighlight';
import PosterRefractor from '../effects/PosterRefractor';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const { setSelectedMovie, selectedMovie, toggleFavorite, favorites, setDraggingMovieName } = useBookingStore();
  const isSelected = selectedMovie?.id === movie.id;
  const isFavorite = favorites.some(m => m.id === movie.id);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 300, damping: 30 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;
    x.set(mouseXPos / rect.width - 0.5);
    y.set(mouseYPos / rect.height - 0.5);
    cardRef.current.style.setProperty('--x', `${mouseXPos}px`);
    cardRef.current.style.setProperty('--y', `${mouseYPos}px`);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: movie.displayTitle, url: window.location.origin + `/movie/${movie.id}` });
    } else {
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
      ref={cardRef}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      layout
      draggable
      onDragStartCapture={() => setDraggingMovieName(movie.displayTitle)}
      onDragEndCapture={() => setDraggingMovieName(null)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
      className={`gradient-border-card group relative overflow-hidden rounded-[24px] md:rounded-[40px] transition-all duration-500 cursor-pointer border-[0.5px] ${
        isSelected 
          ? 'border-primary bg-primary/10 shadow-[0_0_60px_rgba(255,20,100,0.3)]' 
          : 'border-white/10 bg-[#0A0A0A]/40 backdrop-blur-[40px] saturate-[200%] brightness-110 shadow-2xl'
      }`}
    >
      {/* Dynamic Cursor-Tracked Gradient Border Effect */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
        style={{
          background: 'radial-gradient(450px circle at var(--x, 50%) var(--y, 50%), rgba(255, 20, 100, 0.95), rgba(59, 130, 246, 0.8), transparent 65%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <Link href={`/movie/${movie.id}`} className="block" data-testid="movie-link">
        <div className="aspect-[2/3] relative w-full overflow-hidden shimmer-mask" style={{ transform: 'translateZ(20px)' }}>
          <PosterRefractor
            src={getImageUrl(movie.poster_path || movie.backdrop_path)}
            alt={movie.displayTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80 pointer-events-none" />
          
          <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-[#0F0F0F]/60 backdrop-blur-xl px-3 py-1 rounded-2xl border border-white/10 flex items-center gap-1.5 shadow-2xl z-20">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-[11px] font-black text-white">{movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}</span>
          </div>

          <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-20">
            <button 
              onClick={handleFavorite}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                isFavorite ? 'bg-primary border-primary text-white' : 'bg-[#0A0A0A]/60 border-white/10 text-white hover:bg-primary'
              }`}
            >
              <Heart size={15} className={isFavorite ? 'fill-current' : ''} />
            </button>
            <button 
              onClick={handleShare}
              className="w-9 h-9 bg-[#0A0A0A]/60 rounded-xl flex items-center justify-center border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </Link>
      
      <div className="p-4 md:p-5 relative text-right z-20" style={{ transform: 'translateZ(30px)' }}>
        <h3 className="text-sm md:text-lg font-black text-white line-clamp-1 group-hover:text-primary transition-colors tracking-tight font-display uppercase mb-1">
          <KineticText text={movie.displayTitle} tag="span" />
        </h3>
        <div className="flex items-center justify-between mt-3 gap-2">
          <MagneticButton 
            onClick={(e) => {
              e?.preventDefault();
              setSelectedMovie(movie);
            }}
            className="text-xs font-black bg-gradient-to-r from-primary to-yellow text-white px-5 py-2.5 rounded-xl uppercase tracking-widest flex-1 text-center"
          >
            <MarkerHighlight color="#000000" delay={0.1} strokeWidth={4}>
              הזמן כרטיסים
            </MarkerHighlight>
          </MagneticButton>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{movie.release_date ? new Date(movie.release_date).getFullYear() || 'TBA' : 'TBA'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

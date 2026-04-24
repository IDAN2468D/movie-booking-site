'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie, getImageUrl } from '@/lib/tmdb';
import { Star, Calendar, Heart, Share2 } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const { setSelectedMovie, selectedMovie, toggleFavorite, favorites, setDraggingMovieName } = useBookingStore();
  const isSelected = selectedMovie?.id === movie.id;
  const isFavorite = favorites.some(m => m.id === movie.id);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });
  
  // Glint Position
  const glintX = useSpring(useTransform(mouseX, [0, 100], [-50, 150]), { stiffness: 200, damping: 30 });
  const glintY = useSpring(useTransform(mouseY, [0, 100], [-50, 150]), { stiffness: 200, damping: 30 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;

    x.set(mouseXPos / width - 0.5);
    y.set(mouseYPos / height - 0.5);
    mouseX.set((mouseXPos / width) * 100);
    mouseY.set((mouseYPos / height) * 100);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: `Check out this movie: ${movie.title}`,
        url: window.location.origin + `/movie/${movie.id}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/movie/${movie.id}`);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('movie', JSON.stringify(movie));
    e.dataTransfer.effectAllowed = 'copy';
    setDraggingMovieName(movie.title);
    
    const dragIcon = document.createElement('div');
    dragIcon.className = 'w-20 h-32 bg-primary/20 backdrop-blur-xl rounded-xl border border-primary/30 fixed top-[-1000px]';
    document.body.appendChild(dragIcon);
    e.dataTransfer.setDragImage(dragIcon, 10, 10);
    setTimeout(() => document.body.removeChild(dragIcon), 0);
  };

  const handleDragEnd = () => {
    setDraggingMovieName(null);
  };

  return (
    <motion.div 
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      layout
      draggable
      onDragStartCapture={handleDragStart}
      onDragEndCapture={handleDragEnd}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      className={`movie-card group relative overflow-hidden rounded-[32px] transition-all duration-500 cursor-pointer border ${
        isSelected 
          ? 'border-primary bg-primary/10 shadow-[0_0_60px_rgba(255,159,10,0.2)]' 
          : 'border-white/10 bg-white/[0.03] backdrop-blur-3xl saturate-[200%] brightness-110 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)]'
      }`}
    >
      {/* Holographic Glint */}
      <motion.div 
        style={{
          background: 'radial-gradient(circle at center, rgba(10, 239, 255, 0.15) 0%, transparent 70%)',
          left: glintX,
          top: glintY,
          width: '200px',
          height: '200px',
        }}
        className="absolute pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl"
      />

      <Link href={`/movie/${movie.id}`} className="block">
        <div className="aspect-[2/3] relative w-full overflow-hidden" style={{ transform: 'translateZ(20px)' }}>
          <Image
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 saturate-[1.1]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Refraction Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-4 left-4 bg-[#0F0F0F]/60 backdrop-blur-xl px-3 py-1.5 rounded-2xl border border-white/10 flex items-center gap-1.5 shadow-2xl">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-[11px] font-black text-white tracking-tighter">
              {typeof movie.vote_average === 'number' && !isNaN(movie.vote_average) 
                ? movie.vote_average.toFixed(1) 
                : '0.0'}
            </span>
          </div>

          <div className="absolute top-4 right-4 flex flex-col gap-2.5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
            <button 
              onClick={handleFavorite}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-xl ${
                isFavorite 
                ? 'bg-primary border-primary text-background' 
                : 'bg-[#0F0F0F]/40 backdrop-blur-xl border-white/10 text-white hover:bg-primary hover:text-background hover:border-primary'
              }`}
            >
              <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
            </button>
            <button 
              onClick={handleShare}
              className="w-10 h-10 bg-[#0F0F0F]/40 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 text-white hover:bg-white/20 transition-all duration-500 shadow-xl"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </Link>
      
      <div className="p-5 relative text-right" style={{ transform: 'translateZ(30px)' }}>
        <h3 className="text-base font-black text-white line-clamp-1 group-hover:text-primary transition-colors tracking-tight font-outfit mb-1">{movie.title}</h3>
        <div className="flex items-center justify-between mt-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedMovie(movie);
            }}
            className="text-[11px] font-black bg-primary text-background px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-[0_10px_20px_rgba(255,159,10,0.2)] translate-y-2 group-hover:translate-y-0 uppercase tracking-widest"
          >
            הזמן עכשיו
          </motion.button>
          <div className="flex items-center gap-1.5 text-slate-500 font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[11px] tracking-widest uppercase">
              {movie.release_date ? new Date(movie.release_date).getFullYear() || 'N/A' : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

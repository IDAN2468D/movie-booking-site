'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface ResilientImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  fallbackTitle?: string;
}

const CINEMA_FALLBACKS = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1200',
];

export function ResilientImage({
  src,
  alt,
  fallbackTitle,
  className = '',
  unoptimized = true,
  ...props
}: ResilientImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string | null>(typeof src === 'string' ? src : null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (typeof src === 'string') {
      setCurrentSrc(src);
      setAttempt(0);
    }
  }, [src]);

  const handleError = () => {
    if (attempt < CINEMA_FALLBACKS.length) {
      setCurrentSrc(CINEMA_FALLBACKS[attempt]);
      setAttempt((prev) => prev + 1);
    } else {
      setCurrentSrc(null); // Final procedural fallback
    }
  };

  if (!currentSrc) {
    return (
      <div 
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-[#120a1c] to-black text-white/90 overflow-hidden border border-white/10 ${className}`}
        style={{
          backdropFilter: 'blur(30px)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15)',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600/20 via-purple-900/10 to-transparent" />
        <svg 
          className="w-14 h-14 text-red-500/60 mb-3 animate-pulse relative z-10" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
        </svg>
        <span className="text-sm font-bold tracking-widest text-white/80 px-4 text-center font-['Outfit'] relative z-10">
          {fallbackTitle || alt || 'חוויה קולנועית'}
        </span>
      </div>
    );
  }

  return (
    <Image
      {...props}
      unoptimized={unoptimized}
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}

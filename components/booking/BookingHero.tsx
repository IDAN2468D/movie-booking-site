'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Calendar, Clock, Star } from 'lucide-react';
import { Movie, getImageUrl } from '@/lib/tmdb';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BookingHeroProps {
  movie: Movie;
  branchName: string;
  selectedDate: string | null;
  selectedShowtime: string | null;
  heroRef: React.RefObject<HTMLDivElement | null>;
  posterRef: React.RefObject<HTMLDivElement | null>;
}

export default function BookingHero({
  movie,
  branchName,
  selectedDate,
  selectedShowtime,
  heroRef,
  posterRef,
}: BookingHeroProps) {
  
  useEffect(() => {
    if (!posterRef.current || !heroRef.current) return;

    const scrollerEl = document.querySelector('main');
    if (!scrollerEl) return;

    const ctx = gsap.context(() => {
      // Scale down and fade out the poster as user scrolls past the hero
      gsap.to(posterRef.current, {
        opacity: 0,
        scale: 0.6,
        y: 40,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          scroller: scrollerEl,
          start: 'bottom 80%',
          end: 'bottom 20%',
          scrub: true,
        },
      });

      // Fade out the hero metadata details on scroll
      gsap.to('.hero-text-details', {
        opacity: 0,
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          scroller: scrollerEl,
          start: 'bottom 90%',
          end: 'bottom 40%',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [heroRef, posterRef]);

  return (
    <div
      ref={heroRef}
      id="hero-trigger"
      className="relative min-h-[60vh] w-full flex items-center justify-center overflow-hidden py-16 px-6 border-b border-white/5"
    >
      {/* Background Backdrop Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.displayTitle}
          fill
          sizes="100vw"
          className="object-cover opacity-35 saturate-[1.2]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-[#050505]/40" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-cyan-500/5 opacity-30" />
      </div>

      {/* Hero Content Wrapper */}
      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center gap-10 text-center md:text-right">
        {/* Animated Movie Poster */}
        <div className="flex-shrink-0 relative">
          <div
            ref={posterRef}
            className="hero-poster-source w-[180px] h-[270px] md:w-[220px] md:h-[330px] rounded-[32px] overflow-hidden border border-white/20 shadow-[0_25px_50px_rgba(0,0,0,0.8)] relative"
          >
            <Image
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.displayTitle}
              fill
              sizes="(max-width: 768px) 180px, 220px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Text Details Area (Will fade out on scroll) */}
        <div className="hero-text-details flex-1 space-y-6">
          <div className="space-y-2">
            <span className="px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.25em] inline-flex items-center gap-1.5">
              <Star size={12} className="fill-primary" />
              {movie.vote_average ? movie.vote_average.toFixed(1) : '8.4'} / 10
            </span>
            <h1 className="text-4xl md:text-6xl font-black font-display text-white tracking-tight uppercase leading-none text-glow">
              {movie.displayTitle}
            </h1>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
              <MapPin size={14} className="text-primary" />
              <span>{branchName}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
              <Calendar size={14} className="text-primary" />
              <span>{selectedDate}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
              <Clock size={14} className="text-primary" />
              <span>{selectedShowtime}</span>
            </div>
          </div>
          
          <p className="text-slate-400 font-medium text-sm max-w-xl md:max-w-none leading-relaxed line-clamp-3">
            {movie.overview}
          </p>
        </div>
      </div>

      {/* Holographic Refraction Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

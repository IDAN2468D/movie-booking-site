---

## name: movie-entrance-animation description: Generates, designs, and integrates Next.js and Framer Motion movie entrance animations with shared element transitions (layoutId), backdrop zoom, and staggered content reveals. Use when designing movie page entrance animations, page transitions, or cinematic Hero sections in React.

# Movie Entrance Animation Skill

An instruction guide for AI agents to design, construct, and integrate cinematic entrance animations for movie detail pages in Next.js 15, React, Framer Motion, and Tailwind CSS.

## Objective

Enable seamless 3D/cinematic page entrance transitions when a user navigates to a movie page. The key features include:

1. **Shared Element Transition (`layoutId`)**: Smooth transformation of the movie poster from the feed/card into the main Hero section.  
2. **Backdrop Zoom & Parallax**: Atmospheric background image reveal with subtle scale reduction and dark gradient overlays.  
3. **Staggered Content Reveal**: Sequential fade-in and slide-up of genres, rating, title, synopsis, and action buttons.

## File & Architecture Pattern

### 1\. Hero Entrance Component (`components/movie/MovieEntranceAnimation.tsx`)

'use client';

import { motion } from 'framer-motion';

import Image from 'next/image';

interface MovieData {

  id: string;

  title: string;

  backdropUrl: string;

  posterUrl: string;

  rating: number;

  genres: string\[\];

  overview: string;

}

interface MovieEntranceAnimationProps {

  movie: MovieData;

  onBookClick?: () \=\> void;

}

const containerVariants \= {

  hidden: { opacity: 0 },

  visible: {

    opacity: 1,

    transition: {

      staggerChildren: 0.12,

      delayChildren: 0.2,

    },

  },

};

const itemVariants \= {

  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },

  visible: {

    opacity: 1,

    y: 0,

    filter: 'blur(0px)',

    transition: { duration: 0.6, ease: \[0.16, 1, 0.3, 1\] },

  },

};

export default function MovieEntranceAnimation({ movie, onBookClick }: MovieEntranceAnimationProps) {

  return (

    \<div className="relative min-h-screen w-full overflow-hidden bg-black text-white dir-rtl"\>

      {/\* 1\. Backdrop Background Animation \*/}

      \<motion.div

        initial={{ scale: 1.12, opacity: 0 }}

        animate={{ scale: 1, opacity: 0.55 }}

        transition={{ duration: 1.2, ease: \[0.16, 1, 0.3, 1\] }}

        className="absolute inset-0 z-0 pointer-events-none"

      \>

        \<Image

          src={movie.backdropUrl}

          alt={movie.title}

          fill

          priority

          className="object-cover object-center filter brightness-75"

        /\>

        \<div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" /\>

        \<div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" /\>

      \</motion.div\>

      {/\* 2\. Staggered Content Container \*/}

      \<motion.div

        variants={containerVariants}

        initial="hidden"

        animate="visible"

        className="relative z-10 container mx-auto px-6 pt-28 pb-16 min-h-screen flex flex-col md:flex-row items-center md:items-end justify-center md:justify-start gap-8"

      \>

        {/\* Movie Poster \- Shared Element Transition \*/}

        \<motion.div

          layoutId={\`movie-poster-${movie.id}\`}

          initial={{ scale: 0.85, opacity: 0, rotateY: \-12 }}

          animate={{ scale: 1, opacity: 1, rotateY: 0 }}

          transition={{ duration: 0.8, ease: \[0.16, 1, 0.3, 1\] }}

          className="relative w-64 h-96 md:w-80 md:h-\[480px\] rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 border border-white/15 shrink-0"

        \>

          \<Image

            src={movie.posterUrl}

            alt={movie.title}

            fill

            className="object-cover"

          /\>

        \</motion.div\>

        {/\* Details & Metadata \*/}

        \<div className="flex flex-col gap-4 text-center md:text-right max-w-2xl"\>

          \<motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center md:justify-start gap-2"\>

            {movie.genres.map((genre) \=\> (

              \<span

                key={genre}

                className="px-3 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium backdrop-blur-md"

              \>

                {genre}

              \</span\>

            ))}

            \<span className="px-3 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold backdrop-blur-md"\>

              ★ {movie.rating}

            \</span\>

          \</motion.div\>

          \<motion.h1

            variants={itemVariants}

            className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400"

          \>

            {movie.title}

          \</motion.h1\>

          \<motion.p variants={itemVariants} className="text-slate-300 text-base md:text-lg leading-relaxed line-clamp-4"\>

            {movie.overview}

          \</motion.p\>

          \<motion.div variants={itemVariants} className="pt-4 flex items-center justify-center md:justify-start gap-4"\>

            \<button

              onClick={onBookClick}

              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105 active:scale-95"

            \>

              הזמן כרטיסים עכשיו

            \</button\>

          \</motion.div\>

        \</div\>

      \</motion.div\>

    \</div\>

  );

}

### 2\. Integration in Page (`app/(main)/movie/[id]/page.tsx`)

import MovieEntranceAnimation from '@/components/movie/MovieEntranceAnimation';

export default async function MoviePage({ params }: { params: Promise\<{ id: string }\> }) {

  const { id } \= await params;

  const movie \= {

    id,

    title: 'חולית: חלק שני',

    backdropUrl: '/posters/dune2.svg',

    posterUrl: '/posters/dune2.svg',

    rating: 8.8,

    genres: \['מד"ב', 'פעולה', 'הרפתקאות'\],

    overview: 'פול אטריידס מתאחד עם צ\\'אני והפרמנים בעודו יוצא למסע נקמה נגד הקושרים שהרסו את משפחתו.',

  };

  return \<MovieEntranceAnimation movie={movie} /\>;

}

## Best Practices & Guidelines

- **Matching layoutId**: Ensure card/poster in feed matches `layoutId={`movie-poster-${movie.id}`}`.  
- **Image Priority**: Use `priority` property on `next/image` to prevent flash-of-unstyle during entrance.  
- **RTL Readiness**: Ensure layout flex directions support `dir-rtl` / Hebrew text naturally.


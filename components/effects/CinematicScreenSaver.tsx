'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScreenSaverStore, selectIsScreenSaverActive } from '@/lib/store/screenSaverStore';

const MOVIES = [
  {
    id: 1,
    title: 'חולית: חלק שני',
    description: 'פול אטריאידס מתאחד עם צ\'אני והדררים בנתיב של נקמה נגד הקושרים שהשמידו את משפחתו.',
    year: '2024',
    genres: ['מדע בדיוני', 'הרפתקאות', 'פעולה'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg'
  },
  {
    id: 2,
    title: 'אופנהיימר',
    description: 'סיפורו של המדען האמריקאי ג\'יי רוברט אופנהיימר, ותפקידו המכריע בפיתוח פצצת האטום.',
    year: '2023',
    genres: ['ביוגרפיה', 'דרמה', 'היסטוריה'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg'
  },
  {
    id: 3,
    title: 'בלייד ראנר 2049',
    description: 'חשיפת סוד קבור על ידי בלייד ראנר צעיר מובילה אותו למסע חיפוש אחר ריק דקארד שנעדר 30 שנה.',
    year: '2017',
    genres: ['מדע בדיוני', 'מסתורין', 'פעולה'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/ilRyazdUWJlVybfqD0A3HlA9bC4.jpg'
  },
  {
    id: 4,
    title: 'בין כוכבים',
    description: 'צוות חוקרים נוסע דרך חור תולעת בחלל בניסיון להבטיח את הישרדותה של האנושות ולמצוא כוכב חדש.',
    year: '2014',
    genres: ['מדע בדיוני', 'הרפתקאות', 'דרמה'],
    backdropUrl: 'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg'
  }
];

const INTERVAL_MS = 6000;

export function CinematicScreenSaver() {
  const isScreenSaverActive = useScreenSaverStore(selectIsScreenSaverActive);
  const [activeIndex, setActiveIndex] = useState(0);

  // Cinematic Ambient Audio Engine
  useEffect(() => {
    if (!isScreenSaverActive) return;

    let audio: HTMLAudioElement;
    try {
      // Using a universally supported .mp3 relaxing track instead of .ogg to prevent NotSupportedError
      audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3');
      audio.loop = true;
      audio.volume = 0; // Start at 0 for fade in
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Fade in manually since HTMLAudioElement doesn't have setTargetAtTime
          let vol = 0;
          const maxVol = 0.08; // Very soft, atmospheric volume
          const fadeInterval = setInterval(() => {
            if (vol < maxVol) {
              vol += 0.01;
              audio.volume = Math.min(vol, maxVol);
            } else {
              clearInterval(fadeInterval);
            }
          }, 200);
        }).catch((e) => {
          console.warn("Audio autoplay prevented", e);
        });
      }
      
      return () => {
        // Fade out before pausing
        let vol = audio.volume;
        const fadeOutInterval = setInterval(() => {
          if (vol > 0.01) {
            vol -= 0.01;
            audio.volume = Math.max(vol, 0);
          } else {
            clearInterval(fadeOutInterval);
            audio.pause();
            audio.src = '';
          }
        }, 100);
      };
    } catch (e) {
      console.warn("Audio blocked or unsupported", e);
    }
  }, [isScreenSaverActive]);

  useEffect(() => {
    if (!isScreenSaverActive) {
      return;
    }

    const intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % MOVIES.length);
    }, INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isScreenSaverActive]);

  if (!isScreenSaverActive) {
    return null;
  }

  const currentMovie = MOVIES[activeIndex];

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto bg-[#0A0A0A] overflow-hidden isolate" dir="rtl">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.5, ease: 'easeInOut' } }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${currentMovie.backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent pointer-events-none" />

      <div className="absolute bottom-24 right-24 left-24 z-10 flex flex-col items-start text-right">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="max-w-4xl"
          >
            <h1 
              className="text-6xl md:text-8xl font-black text-white tracking-widest mb-4"
              style={{ fontFamily: "'Outfit', 'Rubik', sans-serif", textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
            >
              {currentMovie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-white/90" style={{ fontFamily: "'Inter', 'Assistant', sans-serif" }}>
              <span className="px-3 py-1 bg-white/20 rounded border border-white/10 text-sm font-bold tracking-widest shadow-lg">
                {currentMovie.year}
              </span>
              {currentMovie.genres.map((genre) => (
                <span key={genre} className="text-sm font-bold tracking-widest flex items-center gap-2 drop-shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {genre}
                </span>
              ))}
            </div>

            <p 
              className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed max-w-2xl drop-shadow-xl"
              style={{ fontFamily: "'Inter', 'Assistant', sans-serif", textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
            >
              {currentMovie.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute top-12 left-12 z-10 flex items-center gap-3" dir="ltr">
        <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.9)]" />
        <span className="text-white/70 text-xs tracking-[0.2em] font-bold uppercase drop-shadow-md" style={{ fontFamily: "'Inter', sans-serif" }}>
          מצב המתנה
        </span>
      </div>
    </div>
  );
}

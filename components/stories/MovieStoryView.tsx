'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';

export interface Story {
  id: string;
  movieTitle: string;
  posterUrl: string;
  videoUrl: string;
}

interface MovieStoryViewProps {
  stories: Story[];
  initialIndex?: number;
  onClose: () => void;
}

export const MovieStoryView: React.FC<MovieStoryViewProps> = ({ stories, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const pointerDownTime = useRef<number>(0);
  const progressReqRef = useRef<number>(0);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStory = stories[currentIndex];

  const nextStory = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories, onClose]);

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setProgress(0);
    }
  };

  // Reset states on index change
  useEffect(() => {
    setProgress(0);
    setIsPaused(false);
    setVideoFailed(false);
    if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => setIsMuted(true));
    }
    return () => {
      if (progressReqRef.current) cancelAnimationFrame(progressReqRef.current);
      if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
    };
  }, [currentIndex]);

  // Video progress tracker
  const trackProgress = useCallback(() => {
    if (videoRef.current && !isPaused && !videoFailed) {
      const vid = videoRef.current;
      const duration = (isNaN(vid.duration) || !isFinite(vid.duration)) ? 15 : vid.duration;
      setProgress((vid.currentTime / duration) * 100);
    }
    progressReqRef.current = requestAnimationFrame(trackProgress);
  }, [isPaused, videoFailed]);

  useEffect(() => {
    progressReqRef.current = requestAnimationFrame(trackProgress);
    return () => {
      if (progressReqRef.current) cancelAnimationFrame(progressReqRef.current);
    };
  }, [trackProgress]);

  // Pause / Resume Video
  useEffect(() => {
    if (videoRef.current && !videoFailed) {
      if (isPaused) videoRef.current.pause();
      else videoRef.current.play().catch(() => {});
    }
  }, [isPaused, videoFailed]);

  // Handle fallback timer when video fails to load (due to NotSupportedError / no source)
  useEffect(() => {
    if (videoFailed) {
      let currentProgress = 0;
      fallbackTimerRef.current = setInterval(() => {
        if (!isPaused) {
          currentProgress += 2.5; // reaches 100% in 4 seconds
          setProgress(currentProgress);
          if (currentProgress >= 100) {
            if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
            nextStory();
          }
        }
      }, 100);
    }
    return () => {
      if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
    };
  }, [videoFailed, isPaused, nextStory]);

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsPaused(false);
    if (Date.now() - pointerDownTime.current < 250) {
      if (isMuted && videoRef.current) {
        videoRef.current.muted = false;
        setIsMuted(false);
        return;
      }
      if (e.clientX < window.innerWidth / 2) nextStory();
      else prevStory();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-[#05070B] flex flex-col font-sans select-none touch-none" dir="rtl">
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="absolute inset-0">
          {!videoFailed ? (
            <video
              ref={videoRef}
              src={currentStory.videoUrl}
              className="w-full h-full object-cover"
              playsInline
              muted={isMuted}
              autoPlay
              onEnded={nextStory}
              onError={() => setVideoFailed(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
              {currentStory.posterUrl && <Image src={currentStory.posterUrl} alt={currentStory.movieTitle} fill className="object-cover opacity-60 filter blur-sm scale-110" />}
              <span className="text-white/60 text-xs z-10 font-bold bg-black/40 px-4 py-2 rounded-full border border-white/10">הסרטון אינו נתמך - מעבר אוטומטי...</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />
          <div className="absolute inset-0 z-40" onPointerDown={() => { setIsPaused(true); pointerDownTime.current = Date.now(); }} onPointerUp={handlePointerUp} />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-0 inset-x-0 p-4 z-50 flex flex-col gap-4">
        <div className="flex gap-1.5 w-full">
          {stories.map((story, idx) => (
            <div key={story.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div className="h-full bg-white rounded-full origin-right" initial={false} animate={{ scaleX: idx < currentIndex ? 1 : idx === currentIndex ? progress / 100 : 0 }} transition={{ duration: 0.1, ease: "linear" }} />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden relative shadow-lg">
              {currentStory.posterUrl && <Image src={currentStory.posterUrl} alt={currentStory.movieTitle} width={40} height={40} className="object-cover w-full h-full" />}
            </div>
            <span className="text-white font-medium text-sm">{currentStory.movieTitle}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleMute} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90">{isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}</button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90"><X className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

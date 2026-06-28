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

export const MovieStoryView: React.FC<MovieStoryViewProps> = ({ 
  stories, 
  initialIndex = 0, 
  onClose 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showMuteTooltip, setShowMuteTooltip] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const pointerDownTime = useRef<number>(0);
  const progressReqRef = useRef<number>(0);

  const currentStory = stories[currentIndex];

  // Cleanup and load new video on index change
  useEffect(() => {
    setProgress(0);
    setIsPaused(false);
    
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        setIsMuted(true);
      });
    }

    return () => {
      // Strict cleanup when unmounting/changing
      if (progressReqRef.current) {
        cancelAnimationFrame(progressReqRef.current);
      }
    };
  }, [currentIndex]);

  // Video progress tracking
  const trackProgress = useCallback(() => {
    if (videoRef.current && !isPaused) {
      const vid = videoRef.current;
      // Default to 15s if duration is Infinity or NaN (common with some streaming formats)
      const duration = (isNaN(vid.duration) || !isFinite(vid.duration)) ? 15 : vid.duration;
      const current = vid.currentTime;
      setProgress((current / duration) * 100);
    }
    progressReqRef.current = requestAnimationFrame(trackProgress);
  }, [isPaused]);

  useEffect(() => {
    progressReqRef.current = requestAnimationFrame(trackProgress);
    return () => {
      if (progressReqRef.current) cancelAnimationFrame(progressReqRef.current);
    };
  }, [trackProgress]);

  // Pause / Resume Video based on state
  useEffect(() => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isPaused]);

  const handleVideoEnded = () => {
    nextStory();
  };

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose(); // Close if it's the last story
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      // If tapping prev on first story, maybe restart video
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        setProgress(0);
      }
    }
  };

  // Touch & Pointer Gestures
  const handlePointerDown = () => {
    setIsPaused(true);
    pointerDownTime.current = Date.now();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsPaused(false);
    const duration = Date.now() - pointerDownTime.current;
    
    // If it's a quick tap
    if (duration < 250) {
      // First tap unmutes if muted (Instagram style)
      if (isMuted) {
        if (videoRef.current) {
          videoRef.current.muted = false;
          setIsMuted(false);
          setShowMuteTooltip(false);
        }
        return;
      }

      const x = e.clientX;
      const width = window.innerWidth;
      
      // In RTL context: Left tap means Next, Right tap means Prev
      if (x < width / 2) {
        nextStory();
      } else {
        prevStory();
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
      setShowMuteTooltip(false);
    }
  };

  // Hide tooltip automatically after a few seconds if they already unmuted
  useEffect(() => {
    if (!isMuted) {
      setShowMuteTooltip(false);
    }
  }, [isMuted]);

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-[#05070B] flex flex-col font-sans select-none touch-none" 
      dir="rtl"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="absolute inset-0"
        >
          {/* Video Background */}
          <video
            ref={videoRef}
            src={currentStory.videoUrl}
            className="w-full h-full object-cover"
            playsInline
            muted={isMuted}
            autoPlay
            onEnded={handleVideoEnded}
          />
          
          {/* Overlay Gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />

          {/* Dedicated Gesture Overlay (Sits under buttons, above video) */}
          <div 
            className="absolute inset-0 z-40"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => setIsPaused(false)}
            onPointerLeave={() => setIsPaused(false)}
          />

          {/* Background Preloader for Next Story */}
          {currentIndex < stories.length - 1 && (
            <video
              src={stories[currentIndex + 1].videoUrl}
              preload="auto"
              className="hidden"
              muted
            />
          )}

          {/* Background Preloader for Previous Story (in case they go back) */}
          {currentIndex > 0 && (
            <video
              src={stories[currentIndex - 1].videoUrl}
              preload="auto"
              className="hidden"
              muted
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Top Header Layer */}
      <div className="absolute top-0 inset-x-0 p-4 z-50 flex flex-col gap-4">
        {/* Progress Bars (RTL strictly respected via flex-row) */}
        <div className="flex gap-1.5 w-full">
          {stories.map((story, idx) => (
            <div key={story.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white rounded-full origin-right"
                initial={false}
                animate={{
                  scaleX: idx < currentIndex ? 1 : idx === currentIndex ? progress / 100 : 0
                }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
          ))}
        </div>

        {/* Profile / Movie Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden relative shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {currentStory.posterUrl ? (
                <Image src={currentStory.posterUrl} alt={currentStory.movieTitle} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-500" />
              )}
            </div>
            <span className="text-white font-medium text-sm drop-shadow-md">
              {currentStory.movieTitle}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMute}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 hover:text-white hover:bg-black/60 transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 hover:text-white hover:bg-black/60 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Mute Indicator */}
      <AnimatePresence>
        {isMuted && showMuteTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="px-5 py-2.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 text-white/90 text-sm font-light tracking-wide shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-2">
              <span>לחץ להפעלת סאונד</span>
              <Volume2 className="w-4 h-4 text-[#00F0FF]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

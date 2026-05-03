"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { markStoryAsViewed } from "@/lib/actions/stories";
import { useBookingStore } from "@/lib/store";

export interface StoryData {
  _id: string;
  movieId: string;
  title: string;
  posterUrl: string;
  duration: number;
  hasViewed: boolean;
}

interface StoryViewerProps {
  stories: StoryData[];
  initialIndex: number;
  onClose: () => void;
  onStoryViewed: (id: string) => void;
}

export default function StoryViewer({ stories, initialIndex, onClose, onStoryViewed }: StoryViewerProps) {
  const { allMovies, setSelectedMovie } = useBookingStore();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const currentStory = stories[currentIndex];
  
  const frameRef = useRef<number>(null);
  const startTimeRef = useRef<number | null>(null);
  const isPaused = useRef(false);

  // Mark story as viewed when it appears
  useEffect(() => {
    if (currentStory && !currentStory.hasViewed) {
      markStoryAsViewed(currentStory._id);
      onStoryViewed(currentStory._id);
    }
  }, [currentIndex, currentStory, onStoryViewed]);

  // Handle automatic progress
  useEffect(() => {
    if (!currentStory) return;
    
    setProgress(0);
    startTimeRef.current = null;
    const duration = currentStory.duration || 5000;

    const animateProgress = (timestamp: number) => {
      if (isPaused.current) {
        // Shift start time so progress doesn't jump
        if (startTimeRef.current) startTimeRef.current += (timestamp - lastTimestamp);
      } else {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);

        if (newProgress >= 100) {
          handleNext();
          return;
        }
      }
      lastTimestamp = timestamp;
      frameRef.current = requestAnimationFrame(animateProgress);
    };

    let lastTimestamp = performance.now();
    frameRef.current = requestAnimationFrame(animateProgress);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, currentStory]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setProgress(0);
      startTimeRef.current = null;
    }
  };

  if (!currentStory) return null;

  const content = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
        dir="ltr" // Force LTR for standard Instagram-like tap interactions
      >
        <div className="relative w-full h-full max-w-md md:h-[90vh] md:rounded-3xl overflow-hidden bg-black shadow-2xl">
          
          {/* Progress Bars */}
          <div className="absolute top-0 inset-x-0 p-4 z-50 flex gap-1">
            {stories.map((story, i) => (
              <div key={story._id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{
                    width: i === currentIndex ? `${progress}%` : i < currentIndex ? "100%" : "0%"
                  }}
                  transition={{ ease: "linear", duration: 0 }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-8 inset-x-0 p-4 z-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 relative">
                <Image src={currentStory.posterUrl} alt="" fill className="object-cover" />
              </div>
              <span className="text-white font-medium drop-shadow-md">{currentStory.title}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Image */}
          <div className="relative w-full h-full">
            <Image
              src={currentStory.posterUrl}
              alt={currentStory.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            
            <div className="absolute bottom-10 left-0 right-0 p-6 text-center" dir="rtl">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-2">{currentStory.title}</h2>
              <Link 
                href={`/movie/${currentStory.movieId}`}
                className="mt-4 px-8 py-3 bg-primary text-black font-black rounded-full backdrop-blur-md transition-all shadow-[0_10px_30px_rgba(255,159,10,0.4)] active:scale-95 hover:scale-105 inline-block"
                onClick={(e) => { 
                  // 1. Find the movie in the store to trigger immediate booking
                  const movie = allMovies.find(m => m.id.toString() === currentStory.movieId);
                  if (movie) {
                    // Prevent navigation if we can handle it in the current page
                    e.preventDefault();
                    setSelectedMovie(movie);
                    // 2. Trigger mobile booking if needed
                    window.dispatchEvent(new CustomEvent('open-mobile-booking'));
                    // 3. Close the viewer
                    onClose(); 
                  }
                  // If movie not found in store, let the Link handle navigation to the movie page
                }}
              >
                הזמן עכשיו
              </Link>
            </div>
          </div>

          {/* Tap Areas */}
          <div className="absolute inset-0 z-40 flex">
            <div
              className="w-1/3 h-full cursor-pointer"
              onClick={handlePrev}
              onPointerDown={() => isPaused.current = true}
              onPointerUp={() => isPaused.current = false}
              onPointerLeave={() => isPaused.current = false}
            />
            <div
              className="w-2/3 h-full cursor-pointer"
              onClick={handleNext}
              onPointerDown={() => isPaused.current = true}
              onPointerUp={() => isPaused.current = false}
              onPointerLeave={() => isPaused.current = false}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return typeof document !== "undefined" ? createPortal(content, document.body) : null;
}

'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  videoId: string;
  onError: () => void;
}

export default function YouTubeBackground({ videoId, onError }: Props) {
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Preconnect to YouTube for faster load times */}
      <link rel="preconnect" href="https://www.youtube-nocookie.com" />
      <link rel="preconnect" href="https://s.ytimg.com" />

      {/* Video Container - Scaled up to hide YouTube branding/borders */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 0.8 : 0 }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 left-1/2 w-[150vw] md:w-[120vw] h-[150vh] md:h-[120vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${videoId}&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3`}
          className="absolute inset-0 w-full h-full scale-[1.2]"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          onLoad={() => {
            // Slight delay after iframe loads to allow video stream to buffer
            setTimeout(() => setIsReady(true), 800);
          }}
          onError={onError}
        />
      </motion.div>

      {/* Floating Audio Controls Layer */}
      <AnimatePresence>
        {isReady && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-10 left-10 md:bottom-12 md:left-12 z-[50]"
            dir="rtl"
          >
            <button
              onClick={toggleMute}
              className="flex items-center gap-3 px-4 py-3 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 rounded-full text-white shadow-2xl transition-all group pointer-events-auto"
            >
              <div className="p-2 bg-white/10 rounded-full group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </div>
              <span className="text-sm font-black uppercase tracking-widest hidden md:block">
                {isMuted ? 'הפעל סאונד' : 'השתק טריילר'}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

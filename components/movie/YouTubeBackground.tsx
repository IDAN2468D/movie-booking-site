'use client';

import React, { useState, useEffect, useRef } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  videoId: string;
  onError: () => void;
}

export default function YouTubeBackground({ videoId, onError }: Props) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const onReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
    event.target.mute();
    event.target.playVideo();
  };

  const onPlay = (event: YouTubeEvent) => {
    setIsReady(true);
  };

  const onStateChange = (event: YouTubeEvent) => {
    // If video ended (state 0), restart it
    if (event.data === 0) {
      event.target.playVideo();
    }
  };

  const toggleMute = () => {
    if (player) {
      if (isMuted) {
        player.unMute();
      } else {
        player.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1 as 1 | 0 | undefined,
      controls: 0 as 1 | 0 | undefined,
      disablekb: 1 as 1 | 0 | undefined,
      fs: 0 as 1 | 0 | undefined,
      modestbranding: 1 as 1 | 0 | undefined,
      playsinline: 1 as 1 | 0 | undefined,
      rel: 0 as 1 | 0 | undefined,
      iv_load_policy: 3 as 1 | 3 | undefined,
      mute: 1 as 1 | 0 | undefined,
    },
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Preconnect to YouTube for faster load times */}
      <link rel="preconnect" href="https://www.youtube-nocookie.com" />
      <link rel="preconnect" href="https://s.ytimg.com" />

      {/* Video Container - Scaled up to hide YouTube branding/borders */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-1/2 left-1/2 w-[150vw] md:w-[120vw] h-[150vh] md:h-[120vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          onPlay={onPlay}
          onStateChange={onStateChange}
          onError={onError}
          className="absolute inset-0 w-full h-full scale-[1.2] opacity-80"
          iframeClassName="w-full h-full"
        />
      </motion.div>

      {/* Floating Audio Controls Layer (above video, below gradients) */}
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

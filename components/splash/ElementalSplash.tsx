'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAcousticEngine } from '@/lib/hooks/useAcousticEngine';
import { ElementalSplashControls, ElementalVariant } from './ElementalSplashControls';

interface ElementalSplashProps {
  onComplete: () => void;
  autoDismissDelay?: number;
  initialVariant?: ElementalVariant;
}

export const ElementalSplash: React.FC<ElementalSplashProps> = ({
  onComplete,
  autoDismissDelay,
  initialVariant = 'all',
}) => {
  const [activeVariant, setActiveVariant] = useState<ElementalVariant>(initialVariant);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    playCinematicImpact,
    playSubBassDrop,
    playSpatializedClick,
    initAudio,
  } = useAcousticEngine();

  // Initial cinematic audio sequence
  useEffect(() => {
    initAudio();
    if (!audioMuted) {
      playCinematicImpact();
    }
  }, [initAudio, playCinematicImpact, audioMuted]);

  const handleEnter = useCallback(() => {
    if (isExiting) return;
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    setIsExiting(true);
    if (!audioMuted) {
      playSubBassDrop();
    }
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [isExiting, audioMuted, playSubBassDrop, onComplete]);

  // Optional auto-dismiss timer for home load
  useEffect(() => {
    if (!autoDismissDelay || autoDismissDelay <= 0) return;
    dismissTimerRef.current = setTimeout(() => {
      handleEnter();
    }, autoDismissDelay);
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [autoDismissDelay, handleEnter]);

  // Notify iframe when focused element variant changes
  const handleSelectVariant = (variant: ElementalVariant) => {
    // Cancel auto-dismiss so the user can interact freely
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    setActiveVariant(variant);
    if (!audioMuted) {
      playSpatializedClick(window.innerWidth / 2, window.innerHeight / 2);
    }
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'elements-focus', variant },
        '*'
      );
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEnter]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(16px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-[#060708] overflow-hidden select-none"
          dir="rtl"
        >
          {/* Isolated WebGL2 Elements Canvas via Sandboxed Iframe */}
          <iframe
            ref={iframeRef}
            src="/splash/elemental-splash.html"
            title="CinePulse Elemental Splash"
            sandbox="allow-scripts"
            onLoad={() => {
              if (initialVariant !== 'all' && iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage({ type: 'elements-focus', variant: initialVariant }, '*');
              }
            }}
            className="w-full h-full border-0 absolute inset-0 z-0 pointer-events-auto"
          />

          {/* Luxury Floating Brand Header & Typography */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="absolute top-8 inset-x-0 mx-auto flex flex-col items-center pointer-events-none z-30"
          >
            <div className="flex items-center gap-1.5 md:gap-2 text-4xl sm:text-5xl md:text-6xl font-black font-['Outfit'] tracking-tight">
              <span className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">MOVIE</span>
              <motion.span
                className="text-[#FFB800] drop-shadow-[0_0_25px_rgba(255,184,0,0.7)]"
                animate={{ opacity: [1, 0.85, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                BOOK
              </motion.span>
            </div>
            <p className="text-[11px] sm:text-xs text-white/70 tracking-[0.25em] uppercase font-mono mt-1 drop-shadow-md">
              CinePulse · חוויית קולנוע פרימיום ועתידנית
            </p>
          </motion.div>

          {/* Interactive Controls Overlay */}
          <ElementalSplashControls
            activeVariant={activeVariant}
            onSelectVariant={handleSelectVariant}
            onEnter={handleEnter}
            onSkip={handleEnter}
            audioMuted={audioMuted}
            onToggleAudio={() => setAudioMuted((prev) => !prev)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

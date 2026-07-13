'use client';

import { useEffect, useRef } from 'react';
import { useScreenSaverStore, selectSetIsScreenSaverActive } from '@/lib/store/screenSaverStore';

const INACTIVITY_TIMEOUT = 15000;

export function ScreenSaverListener() {
  const setIsScreenSaverActive = useScreenSaverStore(selectSetIsScreenSaverActive);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCoords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const startTimer = () => {
      if (document.visibilityState === 'hidden') return;
      
      timeoutRef.current = setTimeout(() => {
        setIsScreenSaverActive(true);
      }, INACTIVITY_TIMEOUT);
    };

    const handleActivity = (e?: Event) => {
      if (e && e.type === 'mousemove') {
        const mouseEvent = e as MouseEvent;
        if (lastCoords.current.x === mouseEvent.clientX && lastCoords.current.y === mouseEvent.clientY) {
          return;
        }
        lastCoords.current = { x: mouseEvent.clientX, y: mouseEvent.clientY };
      }

      setIsScreenSaverActive(false);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      startTimer();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsScreenSaverActive(false);
      } else {
        handleActivity();
      }
    };

    startTimer();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setIsScreenSaverActive]);

  return null;
}

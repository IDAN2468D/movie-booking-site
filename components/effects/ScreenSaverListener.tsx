'use client';

import { useEffect, useRef } from 'react';
import { useScreenSaverStore } from '@/lib/store/screenSaverStore';

export function ScreenSaverListener() {
  const setIsScreenSaverActive = useScreenSaverStore((state) => state.setIsScreenSaverActive);
  const isScreenSaverActive = useScreenSaverStore((state) => state.isScreenSaverActive);
  const inactivityTimeout = useScreenSaverStore((state) => state.inactivityTimeout);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCoords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (inactivityTimeout === 0) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    const startTimer = () => {
      if (document.visibilityState === 'hidden') return;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setIsScreenSaverActive(true);
      }, inactivityTimeout);
    };

    const handleActivity = (e?: Event) => {
      if (e && e.type === 'mousemove') {
        const mouseEvent = e as MouseEvent;
        if (lastCoords.current.x === mouseEvent.clientX && lastCoords.current.y === mouseEvent.clientY) {
          return;
        }
        lastCoords.current = { x: mouseEvent.clientX, y: mouseEvent.clientY };
      }

      // If screensaver is active, don't dismiss immediately on micro mouse movements to allow control interaction
      if (!isScreenSaverActive) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        startTimer();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsScreenSaverActive(false);
      } else {
        startTimer();
      }
    };

    startTimer();

    window.addEventListener('mousemove', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('mousedown', handleActivity, { passive: true });
    window.addEventListener('touchstart', handleActivity, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleVisibilityChange);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleVisibilityChange);
    };
  }, [inactivityTimeout, isScreenSaverActive, setIsScreenSaverActive]);

  return null;
}

"use client";

import { useState, useEffect } from 'react';

export function useNetworkGuard() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Initial state
    setIsOnline(typeof window !== 'undefined' ? navigator.onLine : true);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

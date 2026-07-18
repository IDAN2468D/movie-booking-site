'use client';

import { useState, useEffect } from 'react';
import type { CryptoRateData } from '@/app/api/pricing/crypto/route';

export const useCryptoPricing = () => {
  const [rates, setRates] = useState<CryptoRateData | null>(null);
  const [history, setHistory] = useState<CryptoRateData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchRates = async () => {
      if (isLocked) return; // Skip fetch if price is locked

      try {
        const res = await fetch('/api/pricing/crypto');
        const json = await res.json();
        
        if (json.success && isMounted) {
          setRates(json.data);
          setHistory(prev => {
            const next = [...prev, json.data];
            // Keep the last 15 ticks for a smooth sparkline
            return next.length > 15 ? next.slice(next.length - 15) : next;
          });
          setError(null);
        } else if (!json.success && isMounted) {
          setError(json.error);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRates();
    // Poll every 10 seconds for more frequent sparkline updates
    const intervalId = setInterval(fetchRates, 10000); 

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [isLocked]);

  const lockPrice = () => setIsLocked(true);
  const unlockPrice = () => setIsLocked(false);

  return { rates, history, loading, error, isLocked, lockPrice, unlockPrice };
};

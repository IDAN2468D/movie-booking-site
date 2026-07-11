'use client';

import { usePathname } from 'next/navigation';
import { useSwipeStore } from './useSwipeStore';
import { usePredictiveSeatStore } from '@/lib/store/predictiveSeatStore';
import { useEffect, useState } from 'react';

export interface AppStateContext {
  currentPath: string;
  isSwiping: boolean;
  flashOfferActive: boolean;
}

export function useCognitiveContext(): AppStateContext {
  const pathname = usePathname();
  const { swipeQueue } = useSwipeStore();
  const { activeOffer } = usePredictiveSeatStore();
  
  const [context, setContext] = useState<AppStateContext>({
    currentPath: pathname || '/',
    isSwiping: false,
    flashOfferActive: false,
  });

  useEffect(() => {
    setContext({
      currentPath: pathname || '/',
      isSwiping: swipeQueue.length > 0,
      flashOfferActive: !!activeOffer,
    });
  }, [pathname, swipeQueue.length, activeOffer]);

  return context;
}

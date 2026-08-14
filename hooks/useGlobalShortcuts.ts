'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTrailerStore } from '@/lib/store/trailer-store';

export function useGlobalShortcuts() {
  const router = useRouter();
  const lastKeyRef = useRef<string | null>(null);
  const keyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Custom event to toggle trailer from UI or shortcuts modal
    const handleTrailerToggleEvent = () => {
      const trailerState = useTrailerStore.getState();
      if (trailerState.isOpen) {
        trailerState.closeTrailer();
      } else {
        trailerState.openTrailer({
          movieId: trailerState.movieId || '693134',
          movieTitle: trailerState.movieTitle || 'חולית: חלק 2 (Dune: Part Two)',
          trailerKey: trailerState.trailerKey || 'Way9Dexny3w',
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut if user is typing in form inputs
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.tagName === 'SELECT')
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const code = e.code;

      // 0. Escape: Close trailer or modals
      if (key === 'escape' || code === 'Escape') {
        const trailerState = useTrailerStore.getState();
        if (trailerState.isOpen) {
          trailerState.closeTrailer();
        }
        window.dispatchEvent(new CustomEvent('close-shortcuts-modal'));
        return;
      }

      // 1. Help modal: '?' or 'Shift+/' or Slash key
      if (e.key === '?' || (e.shiftKey && (key === '/' || code === 'Slash'))) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('toggle-shortcuts-modal'));
        return;
      }

      // 2. Spotlight search: Cmd+K / Ctrl+K (supports English and Hebrew keymap)
      if ((e.metaKey || e.ctrlKey) && (key === 'k' || key === 'ל' || code === 'KeyK')) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-spotlight-search'));
        return;
      }

      // 3. Toggle Trailer Player: 't' / 'א' / KeyT (standalone)
      const isKeyT = key === 't' || key === 'א' || code === 'KeyT';
      if (isKeyT && !e.metaKey && !e.ctrlKey && lastKeyRef.current !== 'g') {
        e.preventDefault();
        handleTrailerToggleEvent();
        return;
      }

      // 4. Sequential Shortcuts: 'g' then [key] (supports English & Hebrew keymap)
      const isKeyG = key === 'g' || key === 'ע' || code === 'KeyG';
      if (isKeyG && !e.metaKey && !e.ctrlKey) {
        lastKeyRef.current = 'g';
        if (keyTimeoutRef.current) clearTimeout(keyTimeoutRef.current);
        keyTimeoutRef.current = setTimeout(() => {
          lastKeyRef.current = null;
        }, 1200);
        return;
      }

      if (lastKeyRef.current === 'g') {
        lastKeyRef.current = null;
        if (keyTimeoutRef.current) clearTimeout(keyTimeoutRef.current);

        const isH = key === 'h' || key === 'י' || code === 'KeyH';
        const isT = key === 't' || key === 'א' || code === 'KeyT';
        const isW = key === 'w' || key === '\'' || code === 'KeyW';
        const isL = key === 'l' || key === 'ך' || code === 'KeyL';
        const isV = key === 'v' || key === 'ה' || code === 'KeyV';
        const isF = key === 'f' || key === 'כ' || code === 'KeyF';
        const isC = key === 'c' || key === 'ב' || code === 'KeyC';
        const isP = key === 'p' || key === 'פ' || code === 'KeyP';
        const isN = key === 'n' || key === 'נ' || code === 'KeyN';

        if (isH) { e.preventDefault(); router.push('/'); }
        else if (isT) { e.preventDefault(); router.push('/tickets'); }
        else if (isW) { e.preventDefault(); router.push('/watchlist'); }
        else if (isL) { e.preventDefault(); router.push('/showcase/master-suite'); }
        else if (isV) { e.preventDefault(); router.push('/vip'); }
        else if (isF) { e.preventDefault(); router.push('/food'); }
        else if (isC) { e.preventDefault(); router.push('/concierge'); }
        else if (isP) { e.preventDefault(); router.push('/profile'); }
        else if (isN) { e.preventDefault(); router.push('/news'); }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-floating-trailer', handleTrailerToggleEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-floating-trailer', handleTrailerToggleEvent);
      if (keyTimeoutRef.current) clearTimeout(keyTimeoutRef.current);
    };
  }, [router]);
}


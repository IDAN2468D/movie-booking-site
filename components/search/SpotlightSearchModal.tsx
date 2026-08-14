'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, Sparkles, Command } from 'lucide-react';
import {
  searchSpotlightAction,
  SpotlightSearchResults,
} from '@/app/actions/spotlightSearchActions';
import SpotlightResultsList from './SpotlightResultsList';

interface SpotlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpotlightSearchModal({
  isOpen,
  onClose,
}: SpotlightSearchModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SpotlightSearchResults | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard shortcut listener (Cmd+K / Ctrl+K / ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered from parent or external listener
          const event = new CustomEvent('open-spotlight-search');
          window.dispatchEvent(event);
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchSpotlightAction({ query: query.trim(), limit: 6 });
        if (res.success && res.data) {
          setResults(res.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-2xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-[#0d0e15]/95 border border-white/20 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(255,20,100,0.15)] overflow-hidden z-10"
            dir="rtl"
          >
            {/* Input Header */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
              <Search className="w-5 h-5 text-primary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="חפש סרט, שחקן, במאי או ז'אנר..."
                className="w-full bg-transparent text-white text-base placeholder:text-white/40 focus:outline-none font-medium text-right"
              />
              {loading && <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />}
              {query && !loading && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/40 font-mono">
                <span>ESC</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4">
              {results ? (
                <SpotlightResultsList
                  movies={results.movies}
                  actors={results.actors}
                  genres={results.genres}
                  onSelect={onClose}
                />
              ) : (
                <div className="py-8 text-center" dir="rtl">
                  <div className="flex items-center justify-center gap-2 text-primary text-xs font-bold mb-1">
                    <Sparkles size={14} />
                    <span>חיפוש חי Spotlight ב-CinePulse</span>
                  </div>
                  <p className="text-white/40 text-xs">
                    הקלד שם של סרט, שחקן או קטגוריה לקבלת תוצאות מיידיות
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

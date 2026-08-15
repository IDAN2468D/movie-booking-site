'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, Sparkles, Mic, MicOff } from 'lucide-react';
import { searchSpotlightAction, SpotlightSearchResults } from '@/app/actions/spotlightSearchActions';
import SpotlightResultsList from './SpotlightResultsList';

interface SpotlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FORMAT_TAGS = ['IMAX', 'VIP', '4DX', 'ScreenX', 'אקשן', 'קומדיה', 'מד״ב'];

export default function SpotlightSearchModal({
  isOpen,
  onClose,
}: SpotlightSearchModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState<SpotlightSearchResults | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Global Keyboard shortcut listener (Cmd+K / Ctrl+K / ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('open-spotlight-search'));
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults(null);
      setIsListening(false);
    }
  }, [isOpen]);

  // Voice Search Handler
  const toggleVoiceSearch = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('חיפוש קולי אינו נתמך בדפדפן זה');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = 'he-IL';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => setIsListening(true);
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) setQuery(transcript);
        setIsListening(false);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);

      recognitionRef.current = rec;
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

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
        if (res.success && res.data) setResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-2xl" />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: -10 }} className="relative w-full max-w-2xl bg-[#0d0e15]/95 border border-white/20 rounded-3xl shadow-2xl overflow-hidden z-10" dir="rtl">
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
              <Search className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isListening ? 'מקשיב... דבר עכשיו 🎙️' : 'חפש סרט, שחקן, במאי או פורמט...'}
                aria-label="חיפוש מהיר בספוטלייט"
                className="w-full bg-transparent text-white text-base placeholder:text-white/40 focus:outline-none font-medium text-right"
              />
              <button
                type="button"
                onClick={toggleVoiceSearch}
                aria-label={isListening ? "עצור חיפוש קולי" : "הפעל חיפוש קולי בספוטלייט"}
                className={`p-2 rounded-xl transition-all ${isListening ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-white/5 text-white/60 hover:text-white'}`}
                title="חיפוש קולי בעברית"
              >
                {isListening ? <MicOff size={16} aria-hidden="true" /> : <Mic size={16} aria-hidden="true" />}
              </button>
              {loading && <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" aria-hidden="true" />}
              {query && !loading && (
                <button onClick={() => setQuery('')} aria-label="נקה חיפוש" className="p-1 rounded-lg text-white/40 hover:text-white">
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Quick Format / Genre Filter Pills */}
            <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
              <span className="text-[10px] text-white/40 font-bold shrink-0">סינון מהיר:</span>
              {FORMAT_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="px-2.5 py-0.5 rounded-lg bg-white/5 hover:bg-primary hover:text-black text-white/60 text-[10px] font-black transition-all shrink-0"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Results or Empty Hub */}
            <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {results ? (
                <SpotlightResultsList movies={results.movies} actors={results.actors} genres={results.genres} onSelect={onClose} />
              ) : (
                <div className="py-8 text-center" dir="rtl">
                  <div className="flex items-center justify-center gap-2 text-primary text-xs font-bold mb-1">
                    <Sparkles size={14} />
                    <span>חיפוש חי Spotlight 4.0 Pro</span>
                  </div>
                  <p className="text-white/40 text-xs">הקלד או לחץ על המיקרופון לחיפוש קולי מהיר</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

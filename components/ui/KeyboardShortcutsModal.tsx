'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Command, X, Search, Sparkles, Navigation, Clapperboard, Layers } from 'lucide-react';
import { KeyboardShortcutHint } from './KeyboardShortcutHint';

interface ShortcutItem {
  keys: string[];
  description: string;
  category: 'navigation' | 'actions' | 'general';
  action?: () => void;
  href?: string;
}

export default function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('toggle-shortcuts-modal', handleToggle);
    window.addEventListener('open-shortcuts-modal', handleOpen);
    window.addEventListener('close-shortcuts-modal', handleClose);

    return () => {
      window.removeEventListener('toggle-shortcuts-modal', handleToggle);
      window.removeEventListener('open-shortcuts-modal', handleOpen);
      window.removeEventListener('close-shortcuts-modal', handleClose);
    };
  }, []);

  const shortcuts: ShortcutItem[] = [
    { keys: ['⌘ / Ctrl', 'K'], description: 'פתיחת חיפוש העל Spotlight', category: 'actions', action: () => { setIsOpen(false); window.dispatchEvent(new CustomEvent('open-spotlight-search')); } },
    { keys: ['T'], description: 'הפעלה/השהיית נגן הטריילרים PIP', category: 'actions', action: () => { setIsOpen(false); window.dispatchEvent(new CustomEvent('toggle-floating-trailer')); } },
    { keys: ['?'], description: 'פתיחת/סגירת לוח קיצורי המקלדת', category: 'general', action: () => setIsOpen(false) },
    { keys: ['ESC'], description: 'סגירת מודאלים וחלונות קופצים', category: 'general', action: () => setIsOpen(false) },
    { keys: ['G', 'H'], description: 'מעבר מהיר לעמוד הבית', category: 'navigation', href: '/' },
    { keys: ['G', 'T'], description: 'מעבר לכרטיסים שלי ו-Passbook', category: 'navigation', href: '/tickets' },
    { keys: ['G', 'W'], description: 'מעבר לרשימת הצפייה האישית', category: 'navigation', href: '/watchlist' },
    { keys: ['G', 'L'], description: 'מעבר לסוויטת CinePulse Labs 🚀', category: 'navigation', href: '/showcase/master-suite' },
    { keys: ['G', 'V'], description: 'מעבר למועדון VIP והטבות', category: 'navigation', href: '/vip' },
    { keys: ['G', 'F'], description: 'מעבר למזנון ואוכל קולנועי', category: 'navigation', href: '/food' },
    { keys: ['G', 'C'], description: 'מעבר לעוזר ה-AI של CinePulse', category: 'navigation', href: '/concierge' },
    { keys: ['G', 'P'], description: 'מעבר להגדרות הפרופיל והסטטיסטיקות', category: 'navigation', href: '/profile' },
  ];

  const filtered = shortcuts.filter(
    (s) =>
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.keys.some((k) => k.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExecute = (item: ShortcutItem) => {
    setIsOpen(false);
    if (item.action) item.action();
    else if (item.href) router.push(item.href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-xl" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="relative w-full max-w-xl max-h-[90vh] bg-[#0d0e15]/95 border border-white/20 rounded-3xl p-6 shadow-2xl z-10 text-right overflow-hidden custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                  <Command size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white font-outfit">לוח קיצורי מקלדת</h3>
                  <p className="text-xs text-white/50">שליטה וניווט מהיר במערכת CinePulse</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                aria-label="סגור לוח קיצורי מקלדת"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Search Filter */}
            <div className="relative mb-4">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" aria-hidden="true" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="סנן קיצורי מקלדת..."
                aria-label="סנן קיצורי מקלדת"
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-primary transition-all text-right"
              />
            </div>

            {/* Shortcuts List */}
            <div className="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1 pl-1" role="list">
              {filtered.map((item, index) => (
                <div
                  key={index}
                  role="button"
                  tabIndex={0}
                  aria-label={`הפעל קיצור: ${item.description}`}
                  onClick={() => handleExecute(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleExecute(item);
                    }
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 transition-all cursor-pointer group focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                    {item.description}
                  </span>
                  <KeyboardShortcutHint keys={item.keys} />
                </div>
              ))}
            </div>

            {/* Footer Hint */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40 font-medium">
              <span>לחץ על שורה להפעלה ישירה</span>
              <span className="flex items-center gap-1">
                <span>לחץ</span>
                <kbd className="px-1 py-0.5 rounded bg-white/10 border border-white/20 text-white text-[10px]">?</kbd>
                <span>בכל עת לפתיחת לוח זה</span>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

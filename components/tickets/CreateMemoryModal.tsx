'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, PlusCircle, Star } from 'lucide-react';
import { MemoryCapsuleItem } from '@/lib/validations/memoryCapsule';
import { playSparkleSound } from '@/lib/audio/acousticMemory';

interface CreateMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: Partial<MemoryCapsuleItem>) => Promise<{ success: boolean; error?: string }>;
}

export function CreateMemoryModal({ isOpen, onClose, onCreate }: CreateMemoryModalProps) {
  const [movieTitle, setMovieTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hall, setHall] = useState('אולם VIP 01 - Dolby Atmos');
  const [genre, setGenre] = useState('מד״ב');
  const [iconicQuote, setIconicQuote] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieTitle.trim()) {
      alert('נא להזין שם סרט');
      return;
    }
    setIsSubmitting(true);
    const res = await onCreate({
      movieTitle,
      date: new Date(date).toLocaleDateString('he-IL'),
      hall,
      genre,
      iconicQuote: iconicQuote || 'רסיס זיכרון קולנועי שננצר בנצח.',
      reflection: {
        capsuleId: '',
        rating,
        personalNote,
        emotionalVibe: 'התרגשות',
      },
    });
    setIsSubmitting(false);
    if (res.success) {
      playSparkleSound();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-2xl overflow-y-auto" dir="rtl">
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-neutral-950 border border-white/20 rounded-[36px] p-8 md:p-10 shadow-2xl text-right my-8"
        >
          <button
            onClick={onClose}
            className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/5 border border-white/12 flex items-center justify-center text-white/70 hover:text-white"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3.5 mb-6">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(255,159,10,0.3)]">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black font-outfit text-white">יצירת קפסולת זיכרון חדשה</h3>
              <p className="text-sm text-white/60">הוסף זיכרון אישי מסרט שצפית בו לחשבונך</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-white/80 block mb-1.5">שם הסרט *</label>
              <input
                type="text"
                required
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                placeholder="למשל: אווטאר, באטמן, האביר האפל, בלייד ראנר..."
                className="w-full bg-white/5 border border-white/12 rounded-2xl p-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-primary/60"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1.5">תאריך צפייה</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/12 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-primary/60"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white/80 block mb-1.5">ז׳אנר</label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="מד״ב / דרמה / אקשן"
                  className="w-full bg-white/5 border border-white/12 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-primary/60"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-white/80 block mb-1.5">אולם והקרנה</label>
              <input
                type="text"
                value={hall}
                onChange={(e) => setHall(e.target.value)}
                className="w-full bg-white/5 border border-white/12 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-primary/60"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-white/80 block mb-1.5">ציטוט מפתח או שורת מחץ</label>
              <input
                type="text"
                value={iconicQuote}
                onChange={(e) => setIconicQuote(e.target.value)}
                placeholder="ציטוט שנצרב בזיכרון..."
                className="w-full bg-white/5 border border-white/12 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-primary/60"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-white/80 block mb-1.5">רשמים אישיים וחוויות מהאולם</label>
              <textarea
                rows={2}
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                placeholder="איך הייתה החוויה, מי ישב לצידך ומה הרגשת..."
                className="w-full bg-white/5 border border-white/12 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-primary/60 resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setRating(s)}>
                    <Star className={`w-5 h-5 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-black font-black text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,159,10,0.35)] disabled:opacity-50 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'יוצר...' : 'שמור קפסולה'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

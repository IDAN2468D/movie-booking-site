'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BrainCircuit, Star, Quote, Share2, Sparkles, Check, Users, Film } from 'lucide-react';
import { MemoryCapsuleItem, MemoryReflection } from '@/lib/validations/memoryCapsule';
import { playSparkleSound } from '@/lib/audio/acousticMemory';

interface NeuralFlashbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  capsule: MemoryCapsuleItem | null;
  onSaveReflection: (reflection: MemoryReflection) => Promise<{ success: boolean; error?: string }>;
}

export function NeuralFlashbackModal({ isOpen, onClose, capsule, onSaveReflection }: NeuralFlashbackModalProps) {
  const [rating, setRating] = useState(5);
  const [personalNote, setPersonalNote] = useState('');
  const [companions, setCompanions] = useState('');
  const [favoriteScene, setFavoriteScene] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  useEffect(() => {
    if (capsule) {
      setRating(capsule.reflection?.rating ?? 5);
      setPersonalNote(capsule.reflection?.personalNote ?? '');
      setCompanions(capsule.reflection?.companions ?? '');
      setFavoriteScene(capsule.reflection?.favoriteScene ?? '');
      setIsSavedSuccess(false);
    }
  }, [capsule]);

  if (!capsule) return null;

  const handleSave = async () => {
    setIsSaving(true);
    const res = await onSaveReflection({
      capsuleId: capsule.id,
      rating,
      personalNote,
      companions,
      favoriteScene,
      emotionalVibe: capsule.reflection?.emotionalVibe ?? 'התרגשות',
    });
    setIsSaving(false);
    if (res.success) {
      setIsSavedSuccess(true);
      playSparkleSound();
      setTimeout(() => setIsSavedSuccess(false), 3000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `קפסולת זיכרון: ${capsule.movieTitle}`,
        text: `שחזרתי את הזיכרון הקולנועי שלי לסרט "${capsule.movieTitle}" ב-CinePulse!`,
        url: window.location.href,
      });
    } else {
      alert('קישור לקפסולת הזיכרון הועתק ללוח!');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-3xl overflow-y-auto"
          dir="rtl"
        >
          <motion.div
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 30 }}
            className="relative w-full max-w-3xl bg-neutral-950 border border-white/20 rounded-[36px] p-8 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden my-8 text-right"
          >
            <button
              onClick={onClose}
              className="absolute top-6 left-6 w-11 h-11 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors z-20"
            >
              <X size={22} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-3xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(255,159,10,0.35)]">
                <BrainCircuit className="w-9 h-9 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  קפסולת זיכרון נוירונלית
                </span>
                <h3 className="text-3xl md:text-4xl font-black font-outfit text-white mt-1.5">{capsule.movieTitle}</h3>
              </div>
            </div>

            {/* Quote Card */}
            <div className="relative bg-white/5 border border-white/12 rounded-3xl p-6 mb-6 backdrop-blur-xl shadow-inner">
              <Quote className="w-8 h-8 text-primary/30 absolute top-4 left-4" />
              <p className="text-base md:text-xl font-serif italic text-cyan-100/95 leading-relaxed pl-8 font-medium">
                "{capsule.iconicQuote}"
              </p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-xs md:text-sm text-white/50">
                <span>תאריך: {capsule.date} • {capsule.hall}</span>
                <span className="font-mono text-cyan-300 font-bold">HMAC: {capsule.hmacSignature.slice(0, 16)}</span>
              </div>
            </div>

            {/* Reflection Section */}
            <div className="space-y-5 bg-black/50 border border-white/12 rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between">
                <span className="text-sm md:text-base font-black text-white/90">דירוג החוויה האישית:</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="p-1 hover:scale-125 transition-transform">
                      <Star className={`w-6 h-6 md:w-7 md:h-7 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-white/70 block mb-1.5 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-400" /> עם מי צפית?
                  </label>
                  <input
                    type="text"
                    value={companions}
                    onChange={(e) => setCompanions(e.target.value)}
                    placeholder="למשל: בן/בת זוג, חברים, משפחה"
                    className="w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-primary/60"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/70 block mb-1.5 flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-primary" /> סצנה בלתי נשכחת:
                  </label>
                  <input
                    type="text"
                    value={favoriteScene}
                    onChange={(e) => setFavoriteScene(e.target.value)}
                    placeholder="למשל: סצנת השיא, הטוויסט בסיום"
                    className="w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-primary/60"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-white/70 block mb-1.5">רשמים, תחושות וחוויות אישיות:</label>
                <textarea
                  rows={3}
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder="כתוב כאן מה הרגשת במהלך הסרט, איך הייתה האווירה באולם ומה לקחת איתך..."
                  className="w-full bg-white/5 border border-white/12 rounded-2xl p-4 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-primary/60 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm font-bold transition-all border border-white/12"
                >
                  <Share2 className="w-4 h-4" /> שייר קפסולה
                </button>

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-primary text-black font-black text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(255,159,10,0.35)] disabled:opacity-50"
                >
                  {isSavedSuccess ? (
                    <>
                      <Check className="w-5 h-5 text-black" />
                      <span>הרשמים נשמרו בהצלחה!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-black" />
                      <span>{isSaving ? 'שומר...' : 'שמור רשמים בזיכרון'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

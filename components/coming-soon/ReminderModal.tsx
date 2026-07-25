'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Mail, X, CheckCircle, Trash2 } from 'lucide-react';
import { UpcomingMovie } from '@/lib/validations/movieValidation';
import { registerMovieReminderAction, removeMovieReminderAction } from '@/app/actions/reminder-actions';
import { useSession } from 'next-auth/react';

interface ReminderModalProps {
  isOpen: boolean;
  movie: UpcomingMovie | null;
  savedEmail: string | null;
  onClose: () => void;
  onReminderSaved: (email: string) => void;
  onReminderRemoved: () => void;
}

const playBellChimeSound = () => {
  try {
    if (typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        // Fundamental chime (D5 587Hz) + Octave & Fifth harmonics for realistic metallic bell sound
        [587.33, 1174.66, 1761.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          const volume = 0.35 / (idx + 1);
          gain.gain.setValueAtTime(volume, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 1.6);
        });
      }

      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 150]);
      }
    }
  } catch {
    // Audio unavailable fallback
  }
};

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  movie,
  savedEmail,
  onClose,
  onReminderSaved,
  onReminderRemoved,
}) => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (savedEmail) {
      setEmail(savedEmail);
    } else if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [savedEmail, session]);

  if (!isOpen || !movie) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('אנא הזן כתובת אימייל תקינה');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await registerMovieReminderAction({
      movieId: movie.movieId,
      movieTitle: movie.title,
      email,
      releaseDate: movie.releaseDate,
    });

    setLoading(false);
    if (res.success) {
      playBellChimeSound();
      onReminderSaved(email);
      onClose();
    } else {
      setErrorMsg(res.error || 'שגיאה ברישום התזכורת');
    }
  };

  const handleRemove = async () => {
    if (!savedEmail) return;
    setLoading(true);
    await removeMovieReminderAction(movie.movieId, savedEmail);
    setLoading(false);
    onReminderRemoved();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md p-6 rounded-3xl bg-neutral-950/80 backdrop-blur-[40px] saturate-[250%] border border-white/[0.15] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden font-inter"
        >
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300">
              <Bell className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-outfit">תזכורת לפתיחת מכירת כרטיסים</h3>
              <p className="text-xs text-slate-400">{movie.title}</p>
            </div>
          </div>

          {savedEmail ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>תזכורת נקבעה בהצלחה ותשלח אל <strong>{savedEmail}</strong> ברגע שתפתח המכירה!</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleRemove}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold border border-red-500/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>בטל תזכורת</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                >
                  סגור
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                הכנס את כתובת האימייל שלך ונשלח לך הודעה מיידית ברגע שנפתחת מכירת הכרטיסים לסרט זה:
              </p>

              <div className="relative">
                <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              {errorMsg && (
                <div className="text-xs text-red-400 font-bold bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold font-inter shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Bell className="w-4 h-4" />
                <span>{loading ? 'שומר תזכורת...' : 'הפעל תזכורת באימייל'}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

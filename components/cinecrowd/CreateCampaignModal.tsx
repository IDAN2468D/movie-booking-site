'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Film, MapPin, Users, Calendar } from 'lucide-react';
import { createCrowdCampaignAction } from '@/app/actions/crowdScreeningActions';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateCampaignModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [branchName, setBranchName] = useState('סינפאלס תל אביב (IMAX Laser)');
  const [minThreshold, setMinThreshold] = useState(50);
  const [ticketPrice, setTicketPrice] = useState(48);
  const [genre, setGenre] = useState('קלאסיקה וקאלט');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await createCrowdCampaignAction({
        movieId: "custom-" + Date.now(),
        movieTitle: movieTitle.trim(),
        moviePoster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
        genre,
        durationMinutes: 130,
        branchId: "branch-custom",
        branchName,
        targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
        minThreshold: Number(minThreshold),
        ticketPrice: Number(ticketPrice),
        creatorUserId: "usr_active",
        creatorName: "יוצר קהילה",
      });

      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl text-right"
        >
          <button onClick={onClose} className="absolute top-4 left-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5">
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-black text-white font-outfit mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> השקת קמפיין הקרנה קהילתי
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">שם הסרט המבוקש</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="למשל: מועדון קרב (Fight Club), מטריקס..."
                  value={movieTitle}
                  onChange={(e) => setMovieTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary pr-9"
                />
                <Film className="w-4 h-4 text-zinc-500 absolute right-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">סניף קולנוע מועדף</label>
                <select
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="סינפאלס תל אביב (IMAX Laser)">תל אביב (IMAX)</option>
                  <option value="סינפאלס ירושלים">ירושלים (VIP)</option>
                  <option value="סינפאלס חיפה (גרנד)">חיפה (גרנד)</option>
                  <option value="סינפאלס באר שבע">באר שבע</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">ז'אנר / קטגוריה</label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">יעד תומכים מינימלי</label>
                <input
                  type="number"
                  min="20"
                  max="300"
                  value={minThreshold}
                  onChange={(e) => setMinThreshold(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">מחיר כרטיס מומלץ (₪)</label>
                <input
                  type="number"
                  min="35"
                  max="80"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-white font-black text-sm shadow-[0_0_20px_rgba(255,20,100,0.4)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <LoadingIndicator variant="spinner" size={18} color="#ffffff" label="יוצר קמפיין..." />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> פרסם קמפיין להצבעת הקהילה
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

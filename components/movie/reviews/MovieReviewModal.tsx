'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, AlertTriangle, Loader2 } from 'lucide-react';
import { submitMovieReviewAction } from '@/app/actions/movieReviewActions';

interface MovieReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: string | number;
  movieTitle: string;
  onReviewSubmitted: () => void;
}

export default function MovieReviewModal({
  isOpen,
  onClose,
  movieId,
  movieTitle,
  onReviewSubmitted,
}: MovieReviewModalProps) {
  const [rating, setRating] = useState<number>(8);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [content, setContent] = useState('');
  const [hasSpoilers, setHasSpoilers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 5) {
      setError('הביקורת חייבת להכיל לפחות 5 תווים');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await submitMovieReviewAction({
        movieId: String(movieId),
        rating,
        content: content.trim(),
        hasSpoilers,
      });

      if (!res.success) {
        setError(res.error || 'שגיאה בפרסום הביקורת');
        return;
      }

      onReviewSubmitted();
      onClose();
      setContent('');
      setRating(8);
      setHasSpoilers(false);
    } catch (err) {
      console.error('Submit review error:', err);
      setError('שגיאה בתקשורת עם השרת');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg bg-[#0d0e15] border border-white/20 rounded-3xl p-6 shadow-2xl z-10 text-right"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-xl font-black text-white">כתיבת ביקורת קהילתית</h3>
                <p className="text-xs text-primary font-bold">{movieTitle}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star Rating 1-10 */}
              <div>
                <label className="block text-xs font-black text-white/70 mb-2">
                  דירוג הסרט (1 עד 10 כוכבים):
                </label>
                <div className="flex items-center justify-between gap-1 p-3 rounded-2xl bg-white/[0.02] border border-white/10">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5 transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          size={18}
                          className={`${
                            star <= (hoverRating || rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-white/20'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-base font-black text-amber-400">
                    {hoverRating || rating} / 10
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-black text-white/70 mb-2">
                  תוכן הביקורת:
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder="ספר לנו מה חשבת על העלילה, המשחק, הוויזואליה והפסקול..."
                  className="w-full p-3.5 rounded-2xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-primary transition-all resize-none leading-relaxed"
                />
                <div className="text-left text-[10px] text-white/40 mt-1">
                  {content.length} / 1000
                </div>
              </div>

              {/* Spoiler Shield Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasSpoilers}
                  onChange={(e) => setHasSpoilers(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-black/40 text-primary focus:ring-0"
                />
                <span className="text-xs text-white/70 flex items-center gap-1.5 font-medium">
                  <AlertTriangle size={13} className="text-amber-400" />
                  הביקורת מכילה ספוילרים לעלילת הסרט
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                <span>פרסם ביקורת</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

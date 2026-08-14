'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, AlertTriangle, Loader2, Sparkles, User, Tag } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { submitMovieReviewAction } from '@/app/actions/movieReviewActions';

interface MovieReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: string | number;
  movieTitle: string;
  initialRating?: number;
  onReviewSubmitted: () => void;
}

const RATING_LABELS: Record<number, string> = {
  10: 'יצירת מופת בלתי נשכחת! 🏆',
  9: 'סרט מעולה ביותר! 🔥',
  8: 'טוב מאוד ומספק ⭐',
  7: 'סרט טוב ושווה צפייה 👍',
  6: 'חביב ומהנה 🙂',
  5: 'בינוני, ציפיתי ליותר 😐',
  4: 'מאכזב למדי 😕',
  3: 'חלש מאוד 👎',
  2: 'גרוע ולא מומלץ ❌',
  1: 'נורא ואיום ⚠️',
};

const SUGGESTED_TAGS = [
  'חוויה קולנועית מטורפת 🍿',
  'סאונד ופסקול עוצמתי 🔊',
  'ויזואליה ואפקטים מדהימים ✨',
  'משחק פנומנלי 🎭',
  'טוויסט מפתיע 🌀',
  'חובה על מסך ענק 🎬',
];

export default function MovieReviewModal({
  isOpen,
  onClose,
  movieId,
  movieTitle,
  initialRating = 8,
  onReviewSubmitted,
}: MovieReviewModalProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState<number>(initialRating);
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hasSpoilers, setHasSpoilers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRating) setRating(initialRating);
  }, [initialRating]);

  const toggleTag = (t: string) => {
    setSelectedTags((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

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
        authorName: authorName.trim() || undefined,
        tags: selectedTags,
        hasSpoilers,
      });

      if (!res.success) {
        setError(res.error || 'שגיאה בפרסום הביקורת');
        return;
      }
      onReviewSubmitted();
      onClose();
      setContent('');
      setSelectedTags([]);
      setHasSpoilers(false);
    } catch {
      setError('שגיאה בתקשורת עם השרת');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto" dir="rtl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
          <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }} className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#0d0e15] border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl z-10 text-right">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-xl font-black text-white font-outfit flex items-center gap-2">
                  <Sparkles size={18} className="text-primary" />
                  <span>חוות דעת קהילתית</span>
                </h3>
                <p className="text-xs text-primary font-bold">{movieTitle}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {error && <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating Selector with Number Pills */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-white/80">דירוג הסרט:</label>
                  <span className="text-sm font-black text-amber-400 font-mono">{rating} / 10</span>
                </div>
                <div className="grid grid-cols-10 gap-1 mb-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`h-8 rounded-lg text-xs font-black transition-colors font-mono flex items-center justify-center ${
                        rating === num
                          ? 'bg-amber-400 text-black font-black shadow-md'
                          : num <= rating
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="h-6 flex items-center justify-center text-xs font-bold text-amber-300">
                  {RATING_LABELS[rating]}
                </div>
              </div>

              {/* Tag Chips */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-black text-white/70 mb-2">
                  <Tag size={12} className="text-primary" />
                  <span>תגיות חוויה:</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_TAGS.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors ${active ? 'bg-primary text-black' : 'bg-white/5 text-white/70 border border-white/10'}`}>
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-black text-white/70 mb-1.5">תוכן הביקורת:</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} maxLength={1000} placeholder="מה חשבת על העלילה, המשחק, הוויזואליה והפסקול..." className="w-full p-3 rounded-2xl bg-black/60 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-primary transition-all resize-none leading-relaxed" />
                <div className="text-left text-[10px] text-white/40">{content.length} / 1000</div>
              </div>

              {/* Author / Session */}
              {!session?.user ? (
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="w-full sm:w-auto flex-1">
                    <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="שמך לתצוגה (אופציונלי)" className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-primary" />
                  </div>
                  <button type="button" onClick={() => signIn()} className="text-[11px] text-primary hover:underline font-bold shrink-0">
                    התחבר לקבלת תג מאומת
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-white/60 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <User size={13} className="text-primary" />
                  <span>מפורסם כ: <strong className="text-white">{session.user.name}</strong></span>
                </div>
              )}

              {/* Spoiler Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={hasSpoilers} onChange={(e) => setHasSpoilers(e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-black/40 text-primary focus:ring-0" />
                <span className="text-xs text-white/70 flex items-center gap-1.5 font-medium">
                  <AlertTriangle size={13} className="text-amber-400" />
                  הביקורת מכילה ספוילרים לעלילת הסרט
                </span>
              </label>

              {/* Submit Button */}
              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-rose-500 hover:from-primary/90 hover:to-rose-600 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-primary/25 active:scale-95 transition-all disabled:opacity-50">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                <span>פרסם חוות דעת</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

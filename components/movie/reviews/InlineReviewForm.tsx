'use client';

import React, { useState } from 'react';
import { Star, Send, AlertTriangle, Loader2, Sparkles, User, Tag, X } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { submitMovieReviewAction } from '@/app/actions/movieReviewActions';

interface InlineReviewFormProps {
  movieId: string | number;
  movieTitle: string;
  initialRating?: number;
  onSuccess: () => void;
  onCancel?: () => void;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
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

const TAG_OPTIONS = [
  'חוויה קולנועית מטורפת 🍿',
  'סאונד ופסקול עוצמתי 🔊',
  'ויזואליה ואפקטים מדהימים ✨',
  'משחק פנומנלי 🎭',
  'טוויסט מפתיע 🌀',
  'חובה על מסך ענק 🎬',
];

export default function InlineReviewForm({
  movieId,
  movieTitle,
  initialRating = 8,
  onSuccess,
  onCancel,
}: InlineReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState<number>(initialRating);
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hasSpoilers, setHasSpoilers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
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
      onSuccess();
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
    <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-white/[0.05] via-[#0d0e15] to-amber-500/[0.04] border border-primary/30 backdrop-blur-2xl shadow-2xl mb-8 text-right" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-white font-outfit flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            <span>כתיבת חוות דעת ישירה: {movieTitle}</span>
          </h3>
          <p className="text-xs text-white/50">הציון שלך יחושב מיד ב-CineScore הקהילתי</p>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selector */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black text-white/80">בחר דירוג (1 עד 10):</label>
            <span className="text-base font-black text-amber-400 font-mono">{rating} / 10</span>
          </div>

          {/* Number Pill Buttons */}
          <div className="grid grid-cols-10 gap-1 sm:gap-1.5 mb-2.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setRating(num)}
                className={`h-9 rounded-xl text-xs font-black transition-colors font-mono flex items-center justify-center ${
                  rating === num
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30 ring-2 ring-amber-300'
                    : num <= rating
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="h-6 flex items-center justify-center text-xs font-bold text-amber-300">
            {RATING_DESCRIPTIONS[rating]}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-black text-white/70 mb-2">
            <Tag size={12} className="text-primary" />
            <span>תגיות חוויה (בחר תגיות מתאימות):</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TAG_OPTIONS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    active ? 'bg-primary text-black shadow-md shadow-primary/20' : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-xs font-black text-white/70 mb-1.5">תוכן הביקורת:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="ספר מה חשבת על הסרט, העלילה, הדמויות והפסקול..."
            className="w-full p-3 rounded-2xl bg-black/60 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-primary transition-all resize-none leading-relaxed"
          />
          <div className="text-left text-[10px] text-white/40">{content.length} / 1000</div>
        </div>

        {/* Author / Session */}
        {!session?.user ? (
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="w-full sm:w-auto flex-1">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="שמך לתצוגה (אופציונלי)"
                className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-primary"
              />
            </div>
            <button type="button" onClick={() => signIn()} className="text-[11px] text-primary hover:underline font-bold shrink-0">
              התחבר לקבלת תג מאומת
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-white/60 p-2 rounded-xl bg-white/[0.02]">
            <User size={13} className="text-primary" />
            <span>מפרסם בתור: <strong className="text-white">{session.user.name}</strong></span>
          </div>
        )}

        {/* Spoiler Toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={hasSpoilers} onChange={(e) => setHasSpoilers(e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-black/40 text-primary focus:ring-0" />
          <span className="text-xs text-white/70 flex items-center gap-1.5 font-medium">
            <AlertTriangle size={13} className="text-amber-400" />
            הביקורת מכילה ספוילרים
          </span>
        </label>

        {/* Submit Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary to-rose-500 hover:from-primary/90 hover:to-rose-600 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            <span>פרסם חוות דעת עכשיו</span>
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-bold transition-all">
              ביטול
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

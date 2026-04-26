'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Star, MessageSquare, Send, User, Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { TMDBReview } from '@/lib/tmdb';
import { useCallback } from 'react';

interface Review {
  id: string;
  userName: string;
  userImage: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  isTMDB?: boolean;
}

interface LocalReview {
  id: string;
  userName: string;
  userImage: string | null;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface Props {
  movieId: number;
  movieTitle: string;
  tmdbReviews?: TMDBReview[];
}

export default function ReviewsSection({ movieId, movieTitle, tmdbReviews = [] }: Props) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`/api/reviews?movieId=${movieId}`);
      const data = await response.json();
      
      const localReviews = (data.reviews || []).map((r: LocalReview) => ({ 
        id: r.id,
        userName: r.userName,
        userImage: r.userImage,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt.toString(),
        isTMDB: false 
      }));

      const globalReviews = tmdbReviews.map(r => ({
        id: r.id,
        userName: r.author,
        userImage: r.author_details.avatar_path ? `https://image.tmdb.org/t/p/w185${r.author_details.avatar_path}` : null,
        rating: r.author_details.rating || 0,
        comment: r.content,
        createdAt: r.created_at,
        isTMDB: true
      }));

      // Merge and sort by date
      const merged = [...localReviews, ...globalReviews].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setReviews(merged);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [movieId, tmdbReviews]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    if (comment.length < 5) {
      setError('הביקורת חייבת להכיל לפחות 5 תווים');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: movieId.toString(),
          movieTitle,
          rating,
          comment,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setComment('');
        setRating(5);
        fetchReviews();
      } else {
        setError(data.error || 'נכשל בשליחת הביקורת');
      }
    } catch (err) {
      setError('שגיאת תקשורת');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <section className="mt-16 mb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
            <MessageSquare className="text-primary w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white font-outfit">ביקורות קהילה</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              {reviews.length} חוות דעת של משתמשים
            </p>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl">
            <Star className="text-primary fill-primary w-4 h-4" />
            <span className="text-lg font-black text-white">{averageRating}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Write a Review Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              כתוב ביקורת
            </h3>

            {session ? (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Star Rating Selection */}
                <div className="flex flex-col items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">דרוג הסרט</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform active:scale-90"
                      >
                        <Star
                          size={28}
                          className={`transition-all ${
                            s <= (hoverRating || rating)
                              ? 'text-primary fill-primary drop-shadow-[0_0_8px_rgba(255,159,10,0.5)]'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="ספר לנו מה דעתך על הסרט..."
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all resize-none text-sm font-medium"
                />

                {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-primary hover:bg-[#FF7A00] text-background rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={20} />
                      פרסם ביקורת
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                  <User size={24} className="text-slate-400" />
                </div>
                <p className="text-slate-300 text-sm font-bold">התחבר כדי לכתוב ביקורת</p>
                <Link 
                  href="/auth/signin" 
                  className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white text-xs font-black transition-all border border-white/10"
                >
                  התחברות
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <Loader2 size={40} className="animate-spin text-primary mb-4" />
              <p className="text-slate-400 font-black tracking-widest text-xs uppercase">טוען ביקורות...</p>
            </div>
          ) : reviews.length > 0 ? (
            <AnimatePresence>
              {reviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10 flex items-center justify-center overflow-hidden">
                        {review.userImage ? (
                          <Image src={review.userImage} alt={review.userName} width={48} height={48} className="object-cover" />
                        ) : (
                          <User size={24} className="text-slate-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-white">{review.userName}</h4>
                          {review.isTMDB && (
                            <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20 font-black uppercase tracking-tighter">
                              TMDB
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          {new Date(review.createdAt).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          className={s <= review.rating ? 'text-primary fill-primary' : 'text-white/10'}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 text-slate-300 text-sm leading-relaxed font-medium">
                    {review.comment}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/10 rounded-[40px]">
              <MessageSquare size={48} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 font-bold text-lg">עדיין אין ביקורות לסרט זה</p>
              <p className="text-slate-600 text-sm">תהיו הראשונים לכתוב מה חשבתם!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

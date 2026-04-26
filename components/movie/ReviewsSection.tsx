'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Star, MessageSquare, Send, User, Loader2, Sparkles, Quote } from 'lucide-react';
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
    <section className="mt-32 mb-32" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-primary/20 rounded-[20px] flex items-center justify-center border border-primary/30 text-primary shadow-[0_0_30px_rgba(255,20,100,0.2)]">
            <MessageSquare size={28} />
          </div>
          <div>
            <p className="text-[10px] text-primary font-display uppercase tracking-[0.5em] mb-1">AUDIENCE FEEDBACK</p>
            <h2 className="text-4xl font-display text-off-white tracking-tighter uppercase">ביקורות קהילה</h2>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-2xl">
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <Star key={i} size={14} className="text-yellow fill-yellow shadow-[0_0_10px_rgba(229,255,0,0.5)]" />
              ))}
            </div>
            <span className="text-2xl font-display text-off-white tracking-tighter">{averageRating}</span>
            <span className="text-[9px] font-display text-off-white/40 uppercase tracking-widest">{reviews.length} REVIEWS</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Write a Review Form */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 p-10 rounded-[48px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <h3 className="text-xs font-display text-off-white uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                <Sparkles size={16} className="text-primary" />
                WRITE A REVIEW
              </h3>

              {session ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Star Rating Selection */}
                  <div className="flex flex-col items-center p-6 bg-white/5 rounded-[32px] border border-white/5">
                    <span className="text-[9px] text-off-white/40 font-display uppercase tracking-widest mb-4">RATE THIS MOVIE</span>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-all hover:scale-125 active:scale-90"
                        >
                          <Star
                            size={32}
                            className={`transition-all duration-300 ${
                              s <= (hoverRating || rating)
                                ? 'text-yellow fill-yellow drop-shadow-[0_0_12px_rgba(229,255,0,0.6)]'
                                : 'text-white/10'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="שתף את דעתך עם העולם..."
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-[32px] p-6 text-off-white placeholder:text-off-white/20 focus:outline-none focus:border-primary/50 transition-all resize-none text-sm font-body leading-relaxed"
                    />
                  </div>

                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-primary text-[10px] font-display uppercase tracking-widest text-center"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-5 bg-primary hover:bg-primary/80 text-black rounded-full font-display uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_10px_30px_rgba(255,20,100,0.3)] disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        PUBLISH REVIEW
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12 space-y-8">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                    <User size={32} className="text-off-white/20" />
                  </div>
                  <p className="text-off-white/60 text-sm font-body">התחבר כדי לשתף את דעתך</p>
                  <Link 
                    href="/auth/signin" 
                    className="inline-block px-8 py-4 bg-primary text-black rounded-full text-[10px] font-display uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95"
                  >
                    SIGN IN NOW
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-8 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-30">
              <Loader2 size={48} className="animate-spin text-primary mb-6" />
              <p className="text-off-white font-display tracking-[0.5em] text-[10px] uppercase">LOADING FEEDBACK...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence>
                {reviews.map((review, idx) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 md:p-10 rounded-[48px] bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all relative overflow-hidden group"
                  >
                    <Quote className="absolute top-8 left-8 text-white/[0.03] w-24 h-24 -rotate-12 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-primary/30 to-yellow/20 border border-white/10 flex items-center justify-center overflow-hidden relative shadow-2xl">
                          {review.userImage ? (
                            <Image src={review.userImage} alt={review.userName} width={64} height={64} className="object-cover" />
                          ) : (
                            <User size={32} className="text-off-white/20" />
                          )}
                          {review.isTMDB && (
                             <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <span className="text-[8px] font-display text-white uppercase tracking-tighter">TMDB</span>
                             </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-lg font-display text-off-white uppercase tracking-tight">{review.userName}</h4>
                            {review.isTMDB && (
                              <span className="text-[8px] border border-primary/30 text-primary px-2 py-0.5 rounded-full font-display uppercase tracking-widest bg-primary/5">
                                VERIFIED
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-off-white/30 font-display uppercase tracking-widest">
                            {new Date(review.createdAt).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1.5 bg-black/20 px-4 py-2 rounded-full border border-white/5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            className={s <= review.rating ? 'text-yellow fill-yellow shadow-[0_0_8px_rgba(229,255,0,0.4)]' : 'text-white/5'}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="relative mt-8">
                      <p className="text-off-white/70 text-base md:text-lg leading-relaxed font-body italic">
                        &quot;{review.comment}&quot;
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-32 bg-white/[0.01] border border-dashed border-white/10 rounded-[64px]">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                <MessageSquare size={40} className="text-off-white/10" />
              </div>
              <h4 className="text-2xl font-display text-off-white uppercase tracking-tight mb-2">SILENCE IS GOLDEN</h4>
              <p className="text-off-white/30 font-body text-sm">BE THE FIRST TO BREAK IT AND SHARE YOUR THOUGHTS.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

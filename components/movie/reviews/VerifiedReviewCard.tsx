'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import { Star, ShieldCheck, ThumbsUp, Eye, EyeOff, User, Tag } from 'lucide-react';
import { toggleReviewLikeAction } from '@/app/actions/movieReviewActions';

export interface ReviewItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
  tags?: string[];
  hasSpoilers: boolean;
  isVerifiedBooking: boolean;
  likesCount: number;
  likedBy: string[];
  createdAt: string | Date;
}

interface VerifiedReviewCardProps {
  review: ReviewItem;
  currentUserId?: string;
}

export default function VerifiedReviewCard({
  review,
  currentUserId,
}: VerifiedReviewCardProps) {
  const [revealed, setRevealed] = useState(!review.hasSpoilers);
  const [likes, setLikes] = useState(review.likesCount);
  const [isLiked, setIsLiked] = useState(() => {
    if (currentUserId && review.likedBy?.includes(currentUserId)) return true;
    if (typeof window !== 'undefined') {
      const localLikes = JSON.parse(localStorage.getItem('cinepulse_liked_reviews') || '[]');
      return localLikes.includes(review.id);
    }
    return false;
  });
  const [isPending, setIsPending] = useState(false);

  const handleLike = async () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikes((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    setIsPending(true);

    let guestId = '';
    if (typeof window !== 'undefined') {
      let storedGuestId = localStorage.getItem('cinepulse_guest_id');
      if (!storedGuestId) {
        storedGuestId = `guest_liker_${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem('cinepulse_guest_id', storedGuestId);
      }
      guestId = storedGuestId;

      const localLikes: string[] = JSON.parse(localStorage.getItem('cinepulse_liked_reviews') || '[]');
      if (nextLiked) {
        if (!localLikes.includes(review.id)) localLikes.push(review.id);
      } else {
        const idx = localLikes.indexOf(review.id);
        if (idx > -1) localLikes.splice(idx, 1);
      }
      localStorage.setItem('cinepulse_liked_reviews', JSON.stringify(localLikes));
    }

    try {
      const res = await toggleReviewLikeAction({ reviewId: review.id, guestId });
      if (res.success && res.data) {
        setLikes(res.data.likesCount);
        setIsLiked(res.data.isLiked);
      }
    } catch (err) {
      console.error('Like toggle failed:', err);
    } finally {
      setIsPending(false);
    }
  };

  const formattedDate = new Date(review.createdAt).toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all flex flex-col justify-between text-right" dir="rtl">
      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
              {review.userAvatar ? (
                <NextImage src={review.userAvatar} alt={review.userName} fill className="object-cover" />
              ) : (
                <User size={18} className="text-white/60" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-sm text-white">{review.userName}</span>
                {review.isVerifiedBooking && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-black text-emerald-400">
                    <ShieldCheck size={10} />
                    <span>רוכש מאומת 🎟️</span>
                  </span>
                )}
              </div>
              <span className="text-[10px] text-white/40">{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-xs font-mono shrink-0">
            <Star size={12} className="fill-amber-400" />
            <span>{review.rating} / 10</span>
          </div>
        </div>

        {/* Tags */}
        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {review.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/70">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content with Spoiler Shield */}
        <div className="relative my-2">
          {review.hasSpoilers && !revealed ? (
            <div className="p-4 rounded-2xl bg-rose-500/[0.05] border border-rose-500/20 text-center flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
                <EyeOff size={14} />
                <span>ביקורת זו מכילה ספוילרים לעלילת הסרט</span>
              </div>
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all active:scale-95"
              >
                חשוף ביקורת
              </button>
            </div>
          ) : (
            <p className="text-white/85 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
              {review.content}
            </p>
          )}
        </div>
      </div>

      {/* Footer / Like Action */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5 text-xs text-white/40">
        <button
          type="button"
          onClick={handleLike}
          disabled={isPending}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all active:scale-95 ${
            isLiked
              ? 'bg-primary/20 border-primary text-primary font-bold shadow-md shadow-primary/20'
              : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <ThumbsUp size={12} className={isLiked ? 'fill-primary' : ''} />
          <span>מועיל ({likes})</span>
        </button>
        {review.hasSpoilers && revealed && (
          <button
            type="button"
            onClick={() => setRevealed(false)}
            className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white transition-colors"
          >
            <Eye size={12} />
            <span>הסתר שוב</span>
          </button>
        )}
      </div>
    </div>
  );
}

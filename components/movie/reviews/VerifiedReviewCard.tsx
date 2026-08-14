'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import { Star, ShieldCheck, ThumbsUp, Eye, EyeOff, User } from 'lucide-react';
import { toggleReviewLikeAction } from '@/app/actions/movieReviewActions';

export interface ReviewItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
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
  const [isLiked, setIsLiked] = useState(
    Boolean(currentUserId && review.likedBy?.includes(currentUserId))
  );
  const [isPending, setIsPending] = useState(false);

  const handleLike = async () => {
    if (!currentUserId) {
      alert('יש להתחבר כדי להצביע לביקורת');
      return;
    }

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }

    // Optimistic update
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1));
    setIsPending(true);

    try {
      const res = await toggleReviewLikeAction({ reviewId: review.id });
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
    <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all text-right" dir="rtl">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
            {review.userAvatar ? (
              <NextImage src={review.userAvatar} alt={review.userName} fill className="object-cover" />
            ) : (
              <User size={18} className="text-white/60" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-white">{review.userName}</span>
              {review.isVerifiedBooking && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-black text-emerald-400">
                  <ShieldCheck size={10} />
                  <span>רוכש כרטיס מאומת</span>
                </span>
              )}
            </div>
            <span className="text-[11px] text-white/40">{formattedDate}</span>
          </div>
        </div>

        {/* Rating Star Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-xs">
          <Star size={12} className="fill-amber-400" />
          <span>{review.rating} / 10</span>
        </div>
      </div>

      {/* Content with Spoiler Shield */}
      <div className="relative my-3">
        {review.hasSpoilers && !revealed ? (
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-center flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
              <EyeOff size={14} />
              <span>ביקורת זו מכילה ספוילרים לעלילה</span>
            </div>
            <button
              onClick={() => setRevealed(true)}
              className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all active:scale-95"
            >
              חשוף ביקורת
            </button>
          </div>
        ) : (
          <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line font-medium">
            {review.content}
          </p>
        )}
      </div>

      {/* Footer / Like Counter */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-white/40">
        <button
          onClick={handleLike}
          disabled={isPending}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all active:scale-95 ${
            isLiked
              ? 'bg-primary/20 border-primary text-primary font-bold'
              : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <ThumbsUp size={12} className={isLiked ? 'fill-primary' : ''} />
          <span>מועיל ({likes})</span>
        </button>
        {review.hasSpoilers && revealed && (
          <button
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

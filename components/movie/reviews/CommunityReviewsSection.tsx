'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Plus, ArrowUpDown, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getMovieReviewsAction } from '@/app/actions/movieReviewActions';
import CineScoreBadge from './CineScoreBadge';
import VerifiedReviewCard, { ReviewItem } from './VerifiedReviewCard';
import MovieReviewModal from './MovieReviewModal';

interface CommunityReviewsSectionProps {
  movieId: string | number;
  movieTitle: string;
}

export default function CommunityReviewsSection({
  movieId,
  movieTitle,
}: CommunityReviewsSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [cineScore, setCineScore] = useState<{
    score: number;
    percentage: number;
    totalReviews: number;
    verifiedReviewsCount: number;
  }>({ score: 0, percentage: 0, totalReviews: 0, verifiedReviewsCount: 0 });
  const [sortBy, setSortBy] = useState<'helpful' | 'latest' | 'highest' | 'verified'>('helpful');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMovieReviewsAction({
        movieId: String(movieId),
        sortBy,
      });

      if (res.success && res.data) {
        setReviews(res.data.reviews);
        setCineScore(res.data.cineScore);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [movieId, sortBy]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  return (
    <section className="mt-16 mb-20" dir="rtl">
      {/* Header & CineScore Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shrink-0">
            <MessageSquare className="text-primary w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">ביקורות קהילה ומאומתים</h2>
            <p className="text-xs text-white/50">חוות דעת של צופים מאומתים ב-CinePulse</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <CineScoreBadge
            score={cineScore.score}
            percentage={cineScore.percentage}
            totalReviews={cineScore.totalReviews}
            verifiedCount={cineScore.verifiedReviewsCount}
          />
          <button
            onClick={() => {
              if (!session) {
                alert('יש להתחבר כדי לכתוב ביקורת');
                return;
              }
              setIsModalOpen(true);
            }}
            className="px-4 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all shrink-0"
          >
            <Plus size={16} />
            <span>כתוב ביקורת</span>
          </button>
        </div>
      </div>

      {/* Filter / Sort Tabs */}
      {reviews.length > 0 && (
        <div className="flex items-center justify-between gap-3 mb-6 p-2 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <ArrowUpDown size={12} />
            <span>מיון ביקורות:</span>
          </div>
          <div className="flex items-center gap-1">
            {[
              { id: 'helpful', label: 'הכי מועיל' },
              { id: 'verified', label: 'מאומתים בלבד' },
              { id: 'latest', label: 'הכי חדש' },
              { id: 'highest', label: 'דירוג גבוה' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSortBy(tab.id as typeof sortBy)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  sortBy === tab.id
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Review List */}
      {loading ? (
        <div className="py-16 flex items-center justify-center text-primary">
          <Loader2 size={32} className="animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/5">
          <p className="text-white/40 text-sm mb-4">
            עדיין אין ביקורות קהילתיות לסרט זה. היה הראשון לכתוב ביקורת!
          </p>
          <button
            onClick={() => {
              if (!session) {
                alert('יש להתחבר כדי לכתוב ביקורת');
                return;
              }
              setIsModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black transition-all"
          >
            כתוב את הביקורת הראשונה
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <VerifiedReviewCard
              key={r.id}
              review={r}
              currentUserId={session?.user?.id}
            />
          ))}
        </div>
      )}

      {/* Write Review Modal */}
      <MovieReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movieId={movieId}
        movieTitle={movieTitle}
        onReviewSubmitted={loadReviews}
      />
    </section>
  );
}

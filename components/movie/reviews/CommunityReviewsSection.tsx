'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Plus, ArrowUpDown, Loader2, PenTool } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getMovieReviewsAction, CineScoreData } from '@/app/actions/movieReviewActions';
import CineScoreBadge from './CineScoreBadge';
import VerifiedReviewCard, { ReviewItem } from './VerifiedReviewCard';
import MovieReviewModal from './MovieReviewModal';
import EmptyReviewsState from './EmptyReviewsState';
import ReviewsStatsSummary from './ReviewsStatsSummary';
import InlineReviewForm from './InlineReviewForm';

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
  const [cineScore, setCineScore] = useState<CineScoreData>({
    score: 0,
    percentage: 0,
    totalReviews: 0,
    verifiedReviewsCount: 0,
    distribution: {},
  });
  const [sortBy, setSortBy] = useState<'helpful' | 'latest' | 'highest' | 'verified'>('helpful');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [modalInitialRating, setModalInitialRating] = useState<number>(8);

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

  const handleOpenModal = (prefillScore?: number) => {
    setModalInitialRating(prefillScore || 8);
    setIsModalOpen(true);
  };

  const handleFormSubmitted = () => {
    setShowInlineForm(false);
    loadReviews();
  };

  return (
    <section className="mt-16 mb-20 relative" dir="rtl">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shrink-0 shadow-lg shadow-primary/10">
            <MessageSquare className="text-primary w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white font-outfit">ביקורות קהילה ומאומתים</h2>
            <p className="text-xs text-white/60">חוות דעת ודירוגי צופים ב-CinePulse</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
          <CineScoreBadge
            score={cineScore.score}
            percentage={cineScore.percentage}
            totalReviews={cineScore.totalReviews}
            verifiedCount={cineScore.verifiedReviewsCount}
          />
          <button
            type="button"
            onClick={() => setShowInlineForm(!showInlineForm)}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-primary to-rose-500 hover:from-primary/90 hover:to-rose-600 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <Plus size={16} />
            <span>{showInlineForm ? 'סגור טופס' : 'כתוב ביקורת'}</span>
          </button>
        </div>
      </div>

      {/* Inline Review Form Studio */}
      {showInlineForm && (
        <InlineReviewForm
          movieId={movieId}
          movieTitle={movieTitle}
          initialRating={modalInitialRating}
          onSuccess={handleFormSubmitted}
          onCancel={() => setShowInlineForm(false)}
        />
      )}

      {/* Stats Summary if reviews exist */}
      {reviews.length > 0 && (
        <ReviewsStatsSummary
          score={cineScore.score}
          percentage={cineScore.percentage}
          totalReviews={cineScore.totalReviews}
          verifiedCount={cineScore.verifiedReviewsCount}
          distribution={cineScore.distribution}
        />
      )}

      {/* Filter / Sort Tabs */}
      {reviews.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-2.5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <ArrowUpDown size={13} />
            <span className="font-medium">מיון ביקורות:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'helpful', label: 'הכי מועיל 🔥' },
              { id: 'verified', label: 'מאומתים 🎟️' },
              { id: 'latest', label: 'הכי חדש ⚡' },
              { id: 'highest', label: 'דירוג גבוה ⭐' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSortBy(tab.id as typeof sortBy)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  sortBy === tab.id
                    ? 'bg-primary text-black shadow-md shadow-primary/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Content */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-primary">
          <Loader2 size={32} className="animate-spin" />
          <span className="text-xs text-white/40 font-medium">טוען ביקורות קהילה...</span>
        </div>
      ) : reviews.length === 0 ? (
        <EmptyReviewsState
          movieTitle={movieTitle}
          onOpenModal={handleOpenModal}
          onToggleInline={() => setShowInlineForm(true)}
        />
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
        initialRating={modalInitialRating}
        onReviewSubmitted={loadReviews}
      />
    </section>
  );
}

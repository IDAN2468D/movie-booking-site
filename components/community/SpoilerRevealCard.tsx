'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, ThumbsUp, ShieldAlert } from 'lucide-react';
import { AfterglowComment } from '@/app/actions/afterglowActions';

interface SpoilerRevealCardProps {
  comment: AfterglowComment;
}

export const SpoilerRevealCard: React.FC<SpoilerRevealCardProps> = ({ comment }) => {
  const [isRevealed, setIsRevealed] = useState(!comment.isSpoiler);
  const [likes, setLikes] = useState(comment.likes);
  const [hasLiked, setHasLiked] = useState(false);

  const toggleLike = () => {
    if (hasLiked) {
      setLikes((p) => p - 1);
      setHasLiked(false);
    } else {
      setLikes((p) => p + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 backdrop-blur-xl transition-all shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <img
            src={comment.avatar}
            alt={comment.author}
            className="w-8 h-8 rounded-full object-cover border border-white/20"
          />
          <div>
            <span className="text-xs font-bold text-white block">{comment.author}</span>
            <span className="text-[10px] text-gray-400 block">{comment.timestamp}</span>
          </div>
        </div>

        {comment.isSpoiler && (
          <button
            type="button"
            onClick={() => setIsRevealed((prev) => !prev)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-bold"
          >
            {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span>{isRevealed ? 'הסתר ספוילר' : 'חשוף ספוילר'}</span>
          </button>
        )}
      </div>

      <div className="relative my-2">
        <p
          className={`text-xs text-gray-200 leading-relaxed transition-all duration-300 ${
            !isRevealed ? 'blur-md select-none opacity-40' : 'blur-none opacity-100'
          }`}
        >
          {comment.content}
        </p>
        {!isRevealed && (
          <div
            onClick={() => setIsRevealed(true)}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
          >
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/90 border border-rose-500/40 text-rose-400 text-xs font-bold shadow-lg">
              <ShieldAlert className="w-4 h-4" />
              <span>תוכן זה מכיל ספוילרים - לחץ לחשיפה</span>
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end pt-2 border-t border-white/5">
        <button
          type="button"
          onClick={toggleLike}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            hasLiked
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <ThumbsUp className="w-3 h-3" />
          <span>{likes}</span>
        </button>
      </div>
    </div>
  );
};

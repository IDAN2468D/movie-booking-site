'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Bell, ShieldCheck, Clock, Send, Eye, EyeOff, Sparkles } from 'lucide-react';
import {
  getLiveSpoilerStreamAction,
  postSpoilerCommentAction,
  LiveComment,
} from '@/app/actions/communityLiveAudioActions';

interface SpoilerFilterStreamProps {
  movieTitle?: string;
}

export const SpoilerFilterStream: React.FC<SpoilerFilterStreamProps> = ({
  movieTitle = 'דילמת המד"ב 2026',
}) => {
  const [comments, setComments] = useState<LiveComment[]>([]);
  const [inputText, setInputText] = useState('');
  const [pushEnabled, setPushEnabled] = useState(false);
  const [revealedIds, setRevealedIds] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    getLiveSpoilerStreamAction(movieTitle).then((res) => {
      if (res.success && res.data) {
        setComments(res.data);
      }
    });
  }, [movieTitle]);

  const handlePost = async () => {
    if (!inputText.trim()) return;
    const res = await postSpoilerCommentAction({
      text: inputText,
      movieTitle,
      authorName: 'אני (משתמש מחובר)',
    });
    if (res.success && res.data) {
      setComments((prev) => [res.data as LiveComment, ...prev]);
      setInputText('');
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full bg-neutral-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] my-8 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-outfit text-lg font-bold text-white">זרם הקהילה מוגן הספוילרים בזמן אמת</h4>
            <p className="text-xs text-gray-400">סינון AI אוטומטי &bull; ארכוב 24 שעות &bull; {movieTitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPushEnabled((p) => !p)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
            pushEnabled
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>{pushEnabled ? 'התראות Push פעילות' : 'הפעל התראות Push'}</span>
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="שתף את התגובה שלך לסרט... (AI יסנן ספוילרים)"
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
          onKeyDown={(e) => e.key === 'Enter' && handlePost()}
        />
        <button
          type="button"
          onClick={handlePost}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 transition-all shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
          <span>שלח</span>
        </button>
      </div>

      <div className="space-y-3">
        {comments.map((c) => {
          const isBlurred = c.isSpoiler && !revealedIds[c.id];
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 backdrop-blur-xl relative"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img src={c.avatar} alt={c.author} className="w-7 h-7 rounded-full object-cover border border-white/20" />
                  <span className="text-xs font-bold text-white">{c.author}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-indigo-300 font-mono">
                    {c.sentiment}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> {c.expiresAt}</span>
                  {c.isSpoiler && (
                    <button
                      type="button"
                      onClick={() => toggleReveal(c.id)}
                      className="p-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    >
                      {isBlurred ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              <p className={`text-xs text-gray-200 leading-relaxed transition-all ${isBlurred ? 'blur-md select-none opacity-40' : 'blur-none opacity-100'}`}>
                {c.text}
              </p>

              {isBlurred && (
                <div
                  onClick={() => toggleReveal(c.id)}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 rounded-2xl"
                >
                  <span className="text-[11px] font-bold text-rose-400 bg-black/80 px-3 py-1 rounded-xl border border-rose-500/40">
                    ספוילר מזוהה AI - לחץ לצפייה
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

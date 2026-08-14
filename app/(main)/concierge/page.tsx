'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBookingStore } from '@/lib/store';
import { ChatMessage, processMessage } from '@/lib/chat-engine';
import { Movie } from '@/lib/tmdb';
import { Bot } from 'lucide-react';
import ChatWindow from '@/components/chat/ChatWindow';
import { CinePersonaAvatarContainer } from '@/components/ai/CinePersonaAvatarContainer';
import { BioSensoryMoodPredictor } from '@/components/ai/BioSensoryMoodPredictor';
import { AIMoodRecommendations } from '@/components/ai/AIMoodRecommendations';

export default function ConciergePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'שלום! אני העוזר האישי שלכם לסרטים. במה אוכל לעזור היום?',
      timestamp: 0,
      type: 'text',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botState, setBotState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');

  const { allMovies, setAllMovies, setSelectedMovie } = useBookingStore();

  useEffect(() => {
    requestAnimationFrame(() => {
      setMessages((prev) => prev.map((m) => (m.id === 'welcome' ? { ...m, timestamp: Date.now() } : m)));
    });

    async function initMovies() {
      if (allMovies.length > 0) return;
      try {
        const { getNowPlayingMovies } = await import('@/lib/tmdb');
        const movies = await getNowPlayingMovies();
        setAllMovies(movies);
      } catch (err) {
        console.error('Failed to init movies:', err);
      }
    }
    initMovies();
  }, [allMovies.length, setAllMovies]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (isTyping) {
        setBotState('processing');
      } else if (botState !== 'speaking') {
        setBotState(input.trim().length > 0 ? 'listening' : 'idle');
      }
    });
  }, [isTyping, input, botState]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsgText = input.trim();
    setInput('');
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: userMsgText, timestamp: Date.now(), type: 'text' };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const result = processMessage(userMsgText, allMovies);
      setBotState('speaking');
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: result.response,
        timestamp: Date.now(),
        type: result.movies ? 'movie_suggestion' : 'text',
        metadata: result.movies ? { movies: result.movies } : undefined,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [...prev, { id: `err-${Date.now()}`, role: 'assistant', content: 'סליחה, התרחשה שגיאה בעת עיבוד הבקשה.', timestamp: Date.now(), type: 'text' }]);
    } finally {
      setIsTyping(false);
      setTimeout(() => setBotState('idle'), 3000);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const quickActions = [
    '🔥 סרטים מומלצים עכשיו',
    '🍿 מה כדאי לאכול בקולנוע?',
    '🎟️ הראה לי את הכרטיסים שלי',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative pt-20 pb-16 overflow-x-hidden text-right" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 mb-6 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[10px] text-primary uppercase font-bold tracking-widest bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-3 inline-flex items-center gap-1.5">
            <Bot size={12} /> CinePulse AI Assistant
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 font-outfit">
            העוזר <span className="text-primary drop-shadow-[0_0_20px_rgba(255,159,10,0.4)]">שלי</span>
          </h1>
          <p className="text-sm text-slate-400 font-medium max-w-xl mx-auto">
            העוזר האישי שלך לסרטים, מופעל על ידי מנוע ה-AI של CinePulse.
          </p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto flex flex-col items-center gap-8 relative z-20 w-full px-4">
        <div className="w-full">
          <CinePersonaAvatarContainer />
        </div>
        <div className="w-full">
          <BioSensoryMoodPredictor />
        </div>
        <div className="w-full">
          <AIMoodRecommendations />
        </div>
        <ChatWindow
          onClose={() => {}}
          messages={messages}
          input={input}
          setInput={setInput}
          isTyping={isTyping}
          botState={botState}
          handleSend={handleSend}
          handleMovieSelect={handleMovieSelect}
          quickActions={quickActions}
        />
      </motion.div>
    </div>
  );
}

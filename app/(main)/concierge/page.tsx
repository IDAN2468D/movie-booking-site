'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBookingStore } from '@/lib/store';
import { ChatMessage, processMessage } from '@/lib/chat-engine';
import { usePathname } from 'next/navigation';
import { Movie } from '@/lib/tmdb';
import { Bot } from 'lucide-react';
import ChatWindow from '@/components/chat/ChatWindow';

export default function ConciergePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'שלום! אני העוזר האישי שלכם לסרטים. במה אוכל לעזור היום?',
      timestamp: 0,
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botState, setBotState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');

  const { allMovies, setAllMovies, setSelectedMovie, setFilters } = useBookingStore();
  const pathname = usePathname();

  useEffect(() => {
    // Safe client-side timestamp hydration to prevent SSR mismatch
    requestAnimationFrame(() => {
      setMessages(prev => prev.map(m => m.id === 'welcome' ? { ...m, timestamp: Date.now() } : m));
    });

    // Fetch movies if store is empty (e.g. direct navigation)
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

  // Sync botState based on user activity
  useEffect(() => {
    requestAnimationFrame(() => {
      if (isTyping) {
        setBotState('processing');
      } else if (botState !== 'speaking') {
        if (input.trim().length > 0) {
          setBotState('listening');
        } else {
          setBotState('idle');
        }
      }
    });
  }, [input, isTyping, botState]);

  const handleSend = async (textToProcess?: string) => {
    const messageContent = textToProcess || input;
    if (!messageContent.trim()) return;

    if (!textToProcess) {
      setInput('');
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: Date.now(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        })
      });
      const data = await res.json();

      let finalContent = data.response || '';
      let aiType: 'text' | 'movie_suggestion' = 'text';
      let aiMetadata: any = null;

      // Extract ACTION tags (e.g. [ACTION:RECOMMEND:123,456])
      const actionMatch = finalContent.match(/\[ACTION:(RECOMMEND|BOOK):(.*?)\]/);
      if (actionMatch) {
        finalContent = finalContent.replace(actionMatch[0], '').trim();
        const movieIds = actionMatch[2].split(',').map((id: string) => id.trim());
        // find movies from allMovies
        const suggestedMovies = allMovies.filter(m => movieIds.includes(m.id?.toString() || (m as any)._id?.toString()));
        if (suggestedMovies.length > 0) {
          aiType = 'movie_suggestion';
          aiMetadata = suggestedMovies;
        }
      } else if (data.movies && data.movies.length > 0) {
        // Fallback if the API returns a movies array directly
        aiType = 'movie_suggestion';
        aiMetadata = data.movies;
      }

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: finalContent || "הייתה בעיה קלה בהבנת התשובה, אנא נסו שוב.",
        timestamp: Date.now(),
        type: aiType,
        metadata: aiMetadata
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'מצטער, הייתה שגיאה זמנית. אפשר לנסות שוב?',
        timestamp: Date.now(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    const msg: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `מעולה! בחרתי עבורך את "${movie.title || movie.displayTitle}". תוכל לראות את פרטי הסרט בפאנל הצדדי.`,
      timestamp: Date.now(),
      type: 'text'
    };
    setMessages(prev => [...prev, msg]);
  };

  const quickActions = [
    '🎬 מה מוקרן היום?',
    '🤖 המלץ לי על סרט',
    '🎟️ איך מזמינים כרטיס?',
    '🍿 מה חדש בקולנוע?',
    '🔥 סרטי פעולה מומלצים',
    '🎭 קומדיות שחובה לראות',
    '🥤 מה יש במזנון?',
    '⭐ מועדון ה-VIP',
    '🔮 התאם לי סרט לפי מצב רוח'
  ];

  return (
    <div className="min-h-screen pb-32 px-4 md:px-10 pt-10 text-right overflow-x-hidden bg-background">
      {/* Header Section - Premium Glass */}
      <div className="mb-16 relative flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="flex items-center gap-4 mb-4 justify-center">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(255,159,10,0.2)]">
              <Bot className="text-primary w-6 h-6" />
            </div>
            <p className="text-[10px] md:text-xs text-primary font-black uppercase tracking-[0.4em]">AI Personal Assistant</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 font-outfit">
            העוזר <span className="text-primary drop-shadow-[0_0_20px_rgba(255,159,10,0.4)]">שלי</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-medium max-w-xl mx-auto">
            העוזר האישי שלך לסרטים, מופעל על ידי מנוע ה-AI של MovieBook.
          </p>
        </motion.div>

        {/* Decorative background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl mx-auto flex justify-center relative z-20 w-full px-4"
      >
        <ChatWindow
          onClose={() => { }}
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

'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useBookingStore } from '@/lib/store';
import { ChatMessage, processMessage } from '@/lib/chat-engine';
import { usePathname } from 'next/navigation';
import ChatOrb from './ChatOrb';
import ChatWindow from './ChatWindow';

export default function MovieChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'שלום! אני העוזר האישי שלכם לסרטים. במה אוכל לעזור היום?',
      timestamp: Date.now(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botState, setBotState] = useState<'idle' | 'thinking' | 'speaking'>('idle');
  
  const { allMovies, setSelectedMovie, setFilters, toggleFavorite } = useBookingStore();
  const pathname = usePathname();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-movie-chat', handleOpen);
    return () => window.removeEventListener('open-movie-chat', handleOpen);
  }, []);

  const handleSend = async (messageText?: string) => {
    const userPrompt = (messageText || input).trim();
    if (!userPrompt) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt,
      timestamp: Date.now(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setBotState('thinking');

    try {
      // 1. Try conversational State Control (Local Gemma 2 fallback or Gemini)
      const stateResponse = await fetch('/api/ai/state-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userPrompt })
      });

      const stateResult = await stateResponse.json();

      if (stateResult.success && stateResult.data && stateResult.data.action !== 'NONE') {
        const { action, filters, favoriteMovie, reply } = stateResult.data;

        if (action === 'FILTER' && filters) {
          setFilters({
            genre: filters.genre || 'הכל',
            year: filters.year || 'הכל',
            rating: filters.rating || 0
          });
          // Do NOT return early! Allow it to continue to the conversational chat (/api/ai/chat)
          // so the user receives rich recommendations matching the filtered category.
        } else {
          if (action === 'FAVORITE' && favoriteMovie) {
            const matchedMovie = allMovies.find(m => 
              (m.displayTitle && m.displayTitle.toLowerCase().includes(favoriteMovie.toLowerCase())) ||
              (m.title && m.title.toLowerCase().includes(favoriteMovie.toLowerCase()))
            );
            if (matchedMovie) {
              toggleFavorite(matchedMovie);
            }
          }

          const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: reply,
            timestamp: Date.now(),
            type: 'text'
          };

          setMessages(prev => [...prev, aiMsg]);
          setIsTyping(false);
          setBotState('speaking');
          setTimeout(() => setBotState('idle'), 3000);
          return;
        }
      }

      // 2. Fallback: Full conversational AI Chatbot (Gemini / Gemma hybrid route)
      const chatResponse = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userPrompt,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const chatResult = await chatResponse.json();

      if (chatResult.success && chatResult.response) {
        const actionMatch = chatResult.response.match(/\[ACTION:BOOK:(\w+)\]/);
        let movieData: any = null;

        if (actionMatch && actionMatch[1]) {
          const movieId = actionMatch[1];
          const matched = allMovies.find(m => m.id.toString() === movieId);
          if (matched) {
            movieData = [matched];
          }
        }

        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: chatResult.response.replace(/\[ACTION:BOOK:\w+\]/g, '').trim(),
          timestamp: Date.now(),
          type: movieData ? 'movie_suggestion' : 'text',
          metadata: movieData
        };

        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
        setBotState('speaking');
        setTimeout(() => setBotState('idle'), 3000);
        return;
      }

      throw new Error('API routing failed');

    } catch (error) {
      console.warn('API call failed, falling back to local heuristic engine:', error);
      
      // 3. Absolute Fallback: Static Heuristic Engine
      setTimeout(() => {
        const result = processMessage(userPrompt, allMovies);
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.response,
          timestamp: Date.now(),
          type: result.movies ? 'movie_suggestion' : 'text',
          metadata: result.movies
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
        setBotState('speaking');
        setTimeout(() => setBotState('idle'), 3000);
      }, 800);
    }
  };

  const handleMovieSelect = (movie: any) => {
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

  const getQuickActions = () => {
    if (pathname?.startsWith('/checkout')) {
      return ['הוסף פופקורן להזמנה 🍿', 'שדרג לטרקלין VIP 👑', 'החל אחוז הנחה 🎟️'];
    }
    if (pathname?.startsWith('/rewards')) {
      return ['איך מרוויחים נקודות? 🪙', 'שחק במשחק הטריוויה 🎮', 'מתי פג תוקף הנקודות? ⏳'];
    }
    if (pathname?.startsWith('/tickets')) {
      return ['הצג כרטיס אחרון 🎟️', 'איך להיכנס לאולם? 📲', 'בטל הזמנה ❌'];
    }
    if (pathname?.startsWith('/vip')) {
      return ['שדרג מנוי לזהב 👑', 'פרטים על בופה VIP 🍾', 'צור קשר עם מנהל סניף 📞'];
    }
    return ['מה מוקרן היום? 🎬', 'המלץ לי על סרט AI 🤖', 'איך מזמינים כרטיסים? 🎟️'];
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4 pointer-events-none">
      <AnimatePresence>
        {!isOpen ? (
          <ChatOrb onClick={() => setIsOpen(true)} botState={botState} />
        ) : (
          <ChatWindow
            onClose={() => setIsOpen(false)}
            messages={messages}
            input={input}
            setInput={setInput}
            isTyping={isTyping}
            botState={botState}
            handleSend={handleSend}
            handleMovieSelect={handleMovieSelect}
            quickActions={getQuickActions()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

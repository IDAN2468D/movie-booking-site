'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import { Movie } from '@/lib/tmdb';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  actions?: { label: string; onClick: () => void }[];
}

export default function MovieChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'היי! אני עוזר הקולנוע החכם שלך. איך אוכל לעזור לך היום?',
      sender: 'ai',
      timestamp: new Date(),
      actions: [
        { label: 'מה מוקרן היום?', onClick: () => handleAction('מה מוקרן היום?') },
        { label: 'המלץ לי על סרט', onClick: () => handleAction('המלץ לי על סרט') },
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { setSelectedMovie, location } = useBookingStore();
  const msgIdRef = useRef(0);
  const genMsgId = () => String(++msgIdRef.current);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-movie-chat', handleOpenChat);
    return () => window.removeEventListener('open-movie-chat', handleOpenChat);
  }, []);

  const handleAction = (text: string) => {
    setInputValue(text);
    handleSend(text);
  };

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || inputValue;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: genMsgId(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      processIntent(text);
      setIsTyping(false);
    }, 1500);
  };

  // Mock Movie Database for Chat Matching
  const mockMovies = [
    { id: 1022789, title: 'הקול בראש 2', poster_path: '/vpnVM9B6NMmAnp6p9SstatusX.jpg', backdrop_path: '/stKGOm79fySstatusX.jpg', release_date: '2024-06-14', overview: 'סרט המשך להקול בראש.', vote_average: 8.5, genre_ids: [16, 10751] },
    { id: 533535, title: 'דדפול & וולברין', poster_path: '/865v93jSTP2uO86SstatusX.jpg', backdrop_path: '/yD97cl6sS7unWpGvXwM.jpg', release_date: '2024-07-26', overview: 'דדפול פוגש את וולברין.', vote_average: 7.9, genre_ids: [28, 35] },
    { id: 365177, title: 'בורדרלנדס', poster_path: '/865v93jSTP2uO86SstatusX.jpg', backdrop_path: '/yD97cl6sS7unWpGvXwM.jpg', release_date: '2024-08-09', overview: 'מבוסס על המשחק.', vote_average: 5.8, genre_ids: [28, 878] },
  ];

  const processIntent = (text: string) => {
    let responseText = '';
    let actions: Message['actions'] = [];

    const lowerText = text.toLowerCase();

    if (lowerText.includes('מוקרן') || lowerText.includes('סרטים') || lowerText.includes('מה יש')) {
      responseText = `כרגע ב-${location} יש לנו כמה סרטים מעולים. מה מעניין אותך?`;
      actions = mockMovies.map(movie => ({
        label: movie.title,
        onClick: () => handleAction(`ספר לי על ${movie.title}`)
      }));
    } else if (lowerText.includes('המלץ') || lowerText.includes('המלצה')) {
      responseText = 'אם אתם מחפשים אקשן מצחיק, אני ממליץ על דדפול. אם בא לכם משהו לכל המשפחה, הקול בראש 2 הוא הבחירה המושלמת!';
      actions = [
        { label: 'פרטים על דדפול', onClick: () => handleAction('ספר לי על דדפול') },
        { label: 'פרטים על הקול בראש', onClick: () => handleAction('ספר לי על הקול בראש') },
      ];
    } else {
      // Check for movie title match
      const matchedMovie = mockMovies.find(m => lowerText.includes(m.title.toLowerCase()) || lowerText.includes(m.title.split(' ')[0].toLowerCase()));
      
      if (matchedMovie) {
        if (lowerText.includes('הזמן') || lowerText.includes('להזמין') || lowerText.includes('שריין')) {
          setSelectedMovie(matchedMovie as Movie);
          responseText = `מעולה! בחרת ב'${matchedMovie.title}'. בחרתי עבורך את ההקרנה הקרובה ב-19:30. בוא נבחר מושבים!`;
          actions = [
            { label: 'לעבור לבחירת מושבים', onClick: () => {
                setIsOpen(false);
                // The RightPanel already shows the booking flow when a movie is selected.
            }}
          ];
        } else {
          responseText = `'${matchedMovie.title}' הוא אחד הסרטים המבוקשים ביותר שלנו כרגע. רוצה להזמין כרטיסים?`;
          actions = [
            { label: 'כן, להזמנה', onClick: () => handleAction(`אני רוצה להזמין ל${matchedMovie.title}`) },
            { label: 'לא, משהו אחר', onClick: () => handleAction('מה עוד מוקרן?') },
          ];
        }
      } else {
        responseText = 'אני עדיין לומד, אבל אני יכול לעזור לך למצוא סרטים, לקבל המלצות ולבצע הזמנות. נסה לשאול מה מוקרן היום!';
      }
    }

    const aiMsg: Message = {
      id: genMsgId(),
      text: responseText,
      sender: 'ai',
      timestamp: new Date(),
      actions
    };

    setMessages(prev => [...prev, aiMsg]);
  };

  return (
    <div className="fixed bottom-20 left-6 md:bottom-8 md:right-[280px] z-[100] flex flex-col items-start" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-6 w-[400px] h-[600px] glass rounded-[40px] overflow-hidden border border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-primary/20 to-transparent border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <Bot size={20} className="text-background" />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm">העוזר של MOVIEBOOK</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">מחובר ומוכן</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'} flex-row-reverse`}
                >
                  <div className={`max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                    <div className={`p-4 rounded-3xl text-sm font-medium leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-background rounded-tr-none' 
                        : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    
                    {msg.actions && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.actions.map((action, i) => (
                          <button
                            key={i}
                            onClick={action.onClick}
                            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-background transition-all"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <span className="text-[9px] text-slate-600 font-bold">
                      {msg.timestamp.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-end flex-row-reverse">
                  <div className="bg-white/5 border border-white/5 p-4 rounded-3xl rounded-tl-none flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="כתוב הודעה..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors text-right"
                />
                <button 
                  onClick={() => handleSend()}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-primary rounded-xl text-background hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 ${
          isOpen ? 'bg-white/5 text-primary rotate-90' : 'bg-primary text-background shadow-primary/40'
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-primary text-[10px] font-black rounded-full flex items-center justify-center border-2 border-primary animate-pulse">
            1
          </div>
        )}
      </motion.button>
    </div>
  );
}

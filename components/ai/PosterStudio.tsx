'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Loader2, Sparkles, Send, Download, RefreshCw, Undo } from 'lucide-react';
import { cn } from '@/lib/utils/index';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function PosterStudio() {
  const [prompt, setPrompt] = useState('');
  const [editPrompt, setEditPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [posterTitle, setPosterTitle] = useState('');
  const [cssFilter, setCssFilter] = useState('');
  const [history, setHistory] = useState<Message[]>([]);
  const [description, setDescription] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const generatePoster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setPosterUrl(null);
    setHistory([]);
    setCssFilter('');
    
    try {
      const res = await fetch('/api/ai/poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.success) {
        setPosterUrl(data.imageUrl);
        setPosterTitle(data.title);
        setCssFilter(data.cssFilter);
        setDescription(data.description);
        setHistory([{ role: 'assistant', content: data.description }]);
      }
    } catch (err) {
      console.error('Failed to generate poster:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const editPoster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrompt.trim() || isLoading || !posterUrl) return;

    const userMessage = editPrompt;
    setEditPrompt('');
    setIsLoading(true);

    const updatedHistory = [...history, { role: 'user' as const, content: userMessage }];
    setHistory(updatedHistory);

    // Scroll to bottom
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    try {
      const res = await fetch('/api/ai/poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: prompt, 
          history: updatedHistory 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCssFilter(data.cssFilter);
        setDescription(data.description);
        setHistory([...updatedHistory, { role: 'assistant', content: data.description }]);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (err) {
      console.error('Failed to edit poster:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!posterUrl) return;
    // In a real app we would download the image, we simulate it by opening the URL
    window.open(posterUrl, '_blank');
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8" dir="rtl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-cyan-500/20 rounded-xl">
          <Wand2 className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-white">Generative Poster Studio</h2>
          <p className="text-gray-400">צור פוסטר קולנועי מותאם אישית ושנה אותו בשיחה חופשית עם ה-AI.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input & Editing Column */}
        <div className="space-y-6 flex flex-col justify-between">
          {!posterUrl ? (
            <form onSubmit={generatePoster} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">תאר את הפוסטר שתרצה ליצור:</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder='למשל: "פוסטר לסרט מדע בדיוני בחלל העמוק, בסגנון רטרו-סייברפאנק עם צבעי ניאון עזים וחללית במרכז"'
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all resize-none text-right"
                />
              </div>

              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                {isLoading ? 'יוצר פוסטר...' : 'חולל פוסטר AI'}
              </button>
            </form>
          ) : (
            <div className="flex flex-col h-[450px] justify-between">
              {/* Conversational Editing Logs */}
              <div className="flex-grow overflow-y-auto pr-2 space-y-4 custom-scrollbar max-h-[350px] mb-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-sm text-gray-300">
                  <p className="font-bold text-cyan-400 mb-1">פרומפט מקורי:</p>
                  <p className="italic">&quot;{prompt}&quot;</p>
                </div>

                {history.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex flex-col max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed",
                      msg.role === 'user'
                        ? "bg-cyan-500/20 border border-cyan-500/30 text-white mr-auto rounded-tl-none"
                        : "bg-white/5 border border-white/10 text-gray-300 ml-auto rounded-tr-none"
                    )}
                  >
                    <p className="font-bold text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                      {msg.role === 'user' ? 'אתה' : 'סטודיו AI'}
                    </p>
                    <p>{msg.content}</p>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-center gap-2 text-cyan-400 animate-pulse text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    מעבד שינויים בפוסטר...
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input for modifications */}
              <form onSubmit={editPoster} className="relative flex items-center">
                <input
                  type="text"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  disabled={isLoading}
                  placeholder='מה ברצונך לשנות? (למשל: "הפוך את הרקע לסגול")'
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-5 pl-14 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!editPrompt.trim() || isLoading}
                  className="absolute left-2 w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-black hover:bg-cyan-400 disabled:opacity-50 disabled:bg-white/10 transition-colors"
                >
                  <Send className="w-5 h-5 -ml-0.5 rotate-180" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Poster Rendering Column */}
        <div className="relative aspect-[3/4.5] md:h-[500px] mx-auto rounded-3xl bg-black/50 border border-white/10 flex flex-col items-center justify-center overflow-hidden shadow-2xl group">
          {isLoading && !posterUrl ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/80 backdrop-blur-md">
              <div className="relative mb-6">
                <div className="absolute -inset-2 rounded-full blur-xl bg-cyan-500/30 animate-pulse" />
                <Loader2 className="w-16 h-16 text-cyan-400 animate-spin relative z-10" />
              </div>
              <p className="text-cyan-400 font-bold text-xl animate-pulse">מפיח חיים בפוסטר שלך...</p>
            </div>
          ) : posterUrl ? (
            <div className="w-full h-full relative flex flex-col justify-end p-6">
              {/* Background Poster Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={posterUrl} 
                alt="AI Generated Poster" 
                style={{ filter: cssFilter }}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700" 
              />
              
              {/* Poster Overlay Tint for Dark Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent z-10" />

              {/* Title & Description Overlay */}
              <div className="relative z-10 text-center">
                <h3 className="text-3xl font-black text-white tracking-tighter mb-1 font-display drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] uppercase">
                  {posterTitle}
                </h3>
                <p className="text-xs text-cyan-400 font-bold tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-6">
                  הקרנה בלעדית ב-MovieBook
                </p>
                
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={() => { setPosterUrl(null); setHistory([]); }}
                    className="p-3 bg-white/10 border border-white/10 hover:bg-white/20 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-xs font-bold">חדש</span>
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-xs font-black">הורד פוסטר</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 p-8">
              <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30 animate-pulse text-cyan-400" />
              <p className="text-lg font-bold text-gray-300">הפוסטר שלך יחולל כאן</p>
              <p className="text-xs text-gray-600 mt-2">הזן תיאור בצד ימין כדי להתחיל את היצירה</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

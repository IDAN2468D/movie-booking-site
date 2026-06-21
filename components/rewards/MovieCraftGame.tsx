'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Play, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import { getPopularMoviesAction } from '@/lib/actions/recommendations';
import { Movie } from '@/lib/tmdb';

interface Choice {
  id: string;
  text: string;
}

interface GameState {
  scenario: string;
  choices: Choice[];
  pointsAwarded: number;
  isGameOver: boolean;
}

export const MovieCraftGame = () => {
  const { allMovies } = useBookingStore();
  const [localMovies, setLocalMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState('');
  const [choices, setChoices] = useState<Choice[]>([]);
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (allMovies.length === 0) {
      const loadMovies = async () => {
        const res = await getPopularMoviesAction();
        if (res.success && res.data) {
          setLocalMovies(res.data);
        }
      };
      loadMovies();
    }
  }, [allMovies]);

  const activeMovies = allMovies.length > 0 ? allMovies : localMovies;

  const startGame = async (movie: Movie) => {
    setSelectedMovie(movie);
    setIsPlaying(true);
    setLoading(true);
    setHistory([]);
    setTotalPoints(0);
    setIsGameOver(false);

    try {
      const res = await fetch('/api/ai/rpg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieTitle: movie.displayTitle || movie.title,
          history: []
        })
      });
      const result = await res.json();
      if (result.success && result.data) {
        const data: GameState = result.data;
        setScenario(data.scenario);
        setChoices(data.choices);
        setHistory([{ role: 'assistant', content: data.scenario }]);
      }
    } catch (e) {
      console.error('Failed to start RPG:', e);
    } finally {
      setLoading(false);
    }
  };

  const makeChoice = async (choice: Choice) => {
    if (!selectedMovie) return;
    
    setLoading(true);
    const newHistory = [
      ...history,
      { role: 'user' as const, content: choice.text }
    ];
    setHistory(newHistory);

    try {
      const res = await fetch('/api/ai/rpg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieTitle: selectedMovie.displayTitle || selectedMovie.title,
          history: newHistory
        })
      });
      const result = await res.json();
      if (result.success && result.data) {
        const data: GameState = result.data;
        setScenario(data.scenario);
        setChoices(data.choices);
        setTotalPoints(prev => prev + data.pointsAwarded);
        setIsGameOver(data.isGameOver);
        setHistory(prev => [...prev, { role: 'assistant', content: data.scenario }]);
      }
    } catch (e) {
      console.error('Failed to make choice:', e);
    } finally {
      setLoading(false);
    }
  };

  const resetGame = () => {
    setSelectedMovie(null);
    setIsPlaying(false);
    setHistory([]);
    setTotalPoints(0);
    setIsGameOver(false);
  };

  return (
    <div className="w-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[40px] p-6 md:p-8 relative overflow-hidden shadow-2xl text-right" dir="rtl">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9F0A]/5 via-transparent to-cyan-500/5 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Gamepad2 size={18} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-tight font-display uppercase">AI Movie-Craft</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Interactive Text RPG Engine</p>
          </div>
        </div>
        {isPlaying && (
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
            <Trophy size={14} className="text-amber-400 animate-bounce" />
            <span className="text-xs font-black text-white">{totalPoints} נקודות</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div>
              <h4 className="text-base font-black text-white mb-2">ברוך הבא ליקום האינטראקטיבי!</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                בחר את אחד מהסרטים הבאים כדי להתחיל הרפתקת טקסט ייחודית המנוהלת בזמן אמת על ידי Gemini! קבל החלטות גורליות וצבור נקודות בונוס.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[250px] overflow-y-auto no-scrollbar">
              {activeMovies.slice(0, 6).map(movie => (
                <button
                  key={movie.id}
                  onClick={() => startGame(movie)}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-right hover:bg-white/10 hover:border-primary/50 transition-all flex flex-col justify-between h-[120px] group"
                >
                  <p className="text-xs font-black text-white group-hover:text-primary transition-colors">{movie.displayTitle || movie.title}</p>
                  <div className="flex items-center justify-between w-full pt-4 border-t border-white/5">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">שחק כעת</span>
                    <Play size={10} className="text-primary fill-primary" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Scenario Display */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 relative min-h-[160px] flex flex-col justify-between overflow-hidden">
              {/* Green futuristic scanline */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent shadow-[0_0_15px_rgba(255,159,10,0.2)] animate-pulse" />
              
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-3" />
                  <p className="text-xs font-bold text-slate-400">Gemini כותב כעת את הפרק הבא בעלילה...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {selectedMovie?.displayTitle || selectedMovie?.title}
                  </span>
                  <p className="text-sm md:text-base text-white leading-relaxed-hebrew font-medium">
                    {scenario}
                  </p>
                </div>
              )}
            </div>

            {/* Action Choices */}
            {!loading && !isGameOver && (
              <div className="flex flex-col gap-2">
                {choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => makeChoice(choice)}
                    className="w-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 text-right p-4 rounded-2xl text-xs font-bold text-slate-300 transition-all flex items-center justify-between group active:scale-98"
                  >
                    <span>{choice.text}</span>
                    <ArrowRight size={14} className="text-slate-500 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            )}

            {/* Game Over Screen */}
            {isGameOver && (
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-amber-500/10 border border-amber-500/20 rounded-[32px] p-6 text-center space-y-4"
              >
                <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="text-amber-400 w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white mb-1">המשחק הסתיים בהצלחה!</h4>
                  <p className="text-xs text-slate-400">השלמת את ההרפתקה וצברת {totalPoints} נקודות בונוס!</p>
                </div>
                <button
                  onClick={resetGame}
                  className="bg-primary text-background px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all mx-auto flex items-center gap-2"
                >
                  <RotateCcw size={12} /> שחק שוב
                </button>
              </motion.div>
            )}

            {/* Navigation back */}
            {!loading && (
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={resetGame}
                  className="text-[10px] font-black text-slate-500 hover:text-white transition-colors"
                >
                  לסיום ולחזרה לבחירת סרטים
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

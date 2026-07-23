'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Disc3, Search, Music, Sparkles, Filter } from 'lucide-react';
import HolographicBackground from '@/components/ui/HolographicBackground';
import { SoundtrackPlayerCard } from '@/components/soundtrack/SoundtrackPlayerCard';
import { NeuralSoundtrackSynth } from '@/components/soundtrack/NeuralSoundtrackSynth';
import type { SoundtrackItem } from '@/lib/schemas/soundtrack';

export default function SoundtracksPage() {
  const [soundtracks, setSoundtracks] = useState<SoundtrackItem[]>([]);
  const [activeTrack, setActiveTrack] = useState<SoundtrackItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mouse Drag Scroll state
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseDown(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeftState(e.currentTarget.scrollLeft);
  };

  const handleMouseLeave = () => setIsMouseDown(false);
  const handleMouseUp = () => setIsMouseDown(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 2;
    e.currentTarget.scrollLeft = scrollLeftState - walk;
  };

  useEffect(() => {
    async function fetchSoundtracks() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/movies/soundtracks');
        const data = await res.json();
        if (data.success && data.data?.soundtracks) {
          setSoundtracks(data.data.soundtracks);
          if (data.data.soundtracks.length > 0) {
            setActiveTrack(data.data.soundtracks[0]);
          }
        }
      } catch (err) {
        console.warn('Failed to load soundtracks:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSoundtracks();
  }, []);

  const genres = ['all', ...Array.from(new Set(soundtracks.map(s => s.genre).filter(Boolean))) as string[]];

  const filteredTracks = soundtracks.filter(track => {
    const matchesSearch = 
      track.songTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="relative min-h-screen pb-24 text-white font-['Inter'] overflow-x-hidden text-right" dir="rtl">
      <HolographicBackground />

      <div className="relative z-10 max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold mb-4">
            <Disc3 size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
            TMTB ACOUSTIC JUKEBOX & OST ENGINE
          </div>
          <h1 className="text-4xl sm:text-6xl font-['Outfit'] font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-500 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)] mb-4 uppercase">
            פסקולי סרטים & ג'וקבוקס קולנועי
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto">
            האזן לשירי הסרטים האהובים עליך, חווה את הוויזואלייזר האקוסטי בזמן אמת והפעל תדרי Sub-Bass מיוחדים!
          </p>
        </header>

        {/* Featured Main Player & AI Neural Synthesizer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-start">
          {activeTrack && (
            <div className="w-full flex justify-center">
              <SoundtrackPlayerCard track={activeTrack} />
            </div>
          )}
          <div className="w-full">
            <NeuralSoundtrackSynth
              movieId={activeTrack ? String(activeTrack.movieId) : 'demo-1'}
              title={activeTrack?.movieTitle || 'Dune: Part Two'}
              genres={[activeTrack?.genre || 'Sci-Fi', 'Ambient', 'Cinematic']}
            />
          </div>
        </div>

        {/* Search & Genre Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/[0.02] backdrop-blur-2xl border border-white/10 p-4 rounded-3xl">
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="חפש לפי שם שיר, סרט או אמן..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-11 pl-4 py-2.5 rounded-2xl bg-black/50 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div 
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onWheel={(e) => {
              if (e.deltaY !== 0) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
            className={`flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0 select-none ${isMouseDown ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <Filter size={16} className="text-indigo-400 shrink-0 ml-1" />
            {genres.map(g => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedGenre === g
                    ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                    : 'bg-white/5 text-neutral-400 hover:bg-white/10 border border-white/5'
                }`}
              >
                {g === 'all' ? 'הכל' : g}
              </button>
            ))}
          </div>
        </div>

        {/* Tracks Grid */}
        {isLoading ? (
          <div className="h-48 flex items-center justify-center text-indigo-300 font-bold animate-pulse">
            טוען את ג'וקבוקס הפסקולים...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTracks.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveTrack(item)}
                className={`p-4 rounded-3xl border transition-all duration-300 cursor-pointer flex items-center gap-4 group overflow-hidden ${
                  activeTrack?.id === item.id
                    ? 'bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border-indigo-500/60 shadow-[0_0_25px_rgba(99,102,241,0.3)]'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-white/20'
                }`}
              >
                <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden border border-white/10">
                  <img src={item.coverImage} alt={item.songTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Music size={20} className="text-white drop-shadow-md" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-indigo-300 block truncate">{item.movieTitle}</span>
                  <h4 className="font-bold text-white text-base truncate group-hover:text-indigo-300 transition-colors">{item.songTitle}</h4>
                  <p className="text-xs text-neutral-400 truncate">{item.artist}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

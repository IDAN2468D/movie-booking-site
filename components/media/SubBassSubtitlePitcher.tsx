'use client';

import React, { useState } from 'react';
import { Languages, Volume2, Globe, Film, Sparkles, Music, Mic, Gauge } from 'lucide-react';
import { translateSubtitle } from '@/lib/actions/subtitle-pitcher-actions';

interface MovieSoundtrackItem {
  id: string;
  title: string;
  year: string;
  quoteEn: string;
  quoteHe: string;
  chordFreqs: number[];
  synthType: OscillatorType;
}

const MOVIE_SOUNDTRACKS: MovieSoundtrackItem[] = [
  { id: 'fc', title: 'Fight Club', year: '1999', quoteEn: 'The first rule of Fight Club is: you do not talk about Fight Club.', quoteHe: 'החוק הראשון של מועדון קרב הוא: לא מדברים על מועדון קרב.', chordFreqs: [110, 164.81, 220, 329.63], synthType: 'sawtooth' },
  { id: 'inc', title: 'Inception', year: '2010', quoteEn: 'An idea is like a virus. Resilient. Highly contagious.', quoteHe: 'רעיון הוא כמו וירוס. עמיד. מדבק ביותר.', chordFreqs: [130.81, 196, 261.63, 392], synthType: 'triangle' },
  { id: 'dune', title: 'Dune: Part Two', year: '2024', quoteEn: 'Fear is the mind-killer. I will face my fear.', quoteHe: 'הפחד הוא הורג הבינה. אני אעמוד מול הפחד שלי.', chordFreqs: [98, 146.83, 196, 293.66], synthType: 'square' },
  { id: 'inter', title: 'Interstellar', year: '2014', quoteEn: 'Mankind was born on Earth. It was never meant to die here.', quoteHe: 'האנושות נולדה על כדור הארץ. היא מעולם לא נועדה למות כאן.', chordFreqs: [146.83, 220, 293.66, 440], synthType: 'sine' },
  { id: 'glad', title: 'Gladiator', year: '2000', quoteEn: 'What we do in life echoes in eternity.', quoteHe: 'מה שאנחנו עושים בחיים מהדהד לנצח.', chordFreqs: [174.61, 261.63, 349.23, 523.25], synthType: 'triangle' },
];

const LANGUAGE_ACCENT_CONFIG: Record<string, { langCode: string; pitch: number; rateMultiplier: number; label: string }> = {
  he: { langCode: 'he-IL', pitch: 1.0, rateMultiplier: 1.0, label: 'מבטא עברי מקורי 🇮🇱' },
  en: { langCode: 'en-US', pitch: 0.95, rateMultiplier: 1.05, label: 'מבטא אמריקאי 🇺🇸' },
  es: { langCode: 'es-ES', pitch: 1.08, rateMultiplier: 1.02, label: 'מבטא ספרדי 🇪🇸' },
  ja: { langCode: 'ja-JP', pitch: 1.15, rateMultiplier: 1.1, label: 'מבטא יפני 🇯🇵' },
  fr: { langCode: 'fr-FR', pitch: 0.9, rateMultiplier: 0.95, label: 'מבטא צרפתי 🇫🇷' },
};

export const SubBassSubtitlePitcher: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<MovieSoundtrackItem>(MOVIE_SOUNDTRACKS[0]);
  const [selectedLang, setSelectedLang] = useState<'he' | 'en' | 'es' | 'ja' | 'fr'>('he');
  const [activeSubtitle, setActiveSubtitle] = useState(MOVIE_SOUNDTRACKS[0].quoteHe);
  const [isPlayingSoundtrack, setIsPlayingSoundtrack] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.8);

  const speakTranslationWithAccent = (text: string, langKey: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const config = LANGUAGE_ACCENT_CONFIG[langKey] || LANGUAGE_ACCENT_CONFIG.he;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = config.langCode;
      utterance.pitch = config.pitch;
      utterance.rate = speechRate * config.rateMultiplier;

      const voices = window.speechSynthesis.getVoices();
      const nativeVoice = voices.find((v) => v.lang.toLowerCase().startsWith(langKey) || v.lang.toLowerCase().includes(config.langCode.toLowerCase()));
      if (nativeVoice) utterance.voice = nativeVoice;

      window.speechSynthesis.speak(utterance);
    }
  };

  const playMovieSoundtrackAudio = (movie: MovieSoundtrackItem) => {
    try {
      setIsPlayingSoundtrack(true);
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      movie.chordFreqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = movie.synthType;
        osc.frequency.value = freq;
        const st = ctx.currentTime + i * 0.12;
        gain.gain.setValueAtTime(0.18, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + 0.8);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(st); osc.stop(st + 0.8);
      });

      setTimeout(() => {
        ctx.close();
        setIsPlayingSoundtrack(false);
      }, 1000);
    } catch {
      setIsPlayingSoundtrack(false);
    }
  };

  const handleMovieSelect = async (movie: MovieSoundtrackItem) => {
    setSelectedMovie(movie);
    playMovieSoundtrackAudio(movie);

    const res = await translateSubtitle({
      text: movie.quoteEn,
      targetLang: selectedLang,
    });

    if (res.success && res.data) {
      setActiveSubtitle(res.data.translatedText);
      speakTranslationWithAccent(res.data.translatedText, selectedLang);
    }
  };

  const handleLanguageChange = async (lang: 'he' | 'en' | 'es' | 'ja' | 'fr') => {
    setSelectedLang(lang);
    const res = await translateSubtitle({
      text: selectedMovie.quoteEn,
      targetLang: lang,
    });

    if (res.success && res.data) {
      setActiveSubtitle(res.data.translatedText);
      speakTranslationWithAccent(res.data.translatedText, lang);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto p-6 rounded-3xl border border-white/12 bg-neutral-950/70 backdrop-blur-[40px] saturate-[250%] text-white shadow-2xl overflow-hidden text-right" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400">
            <Music className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h3 className="font-['Outfit'] font-black text-2xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              AI Movie Soundtrack & Accent-Matched Player
            </h3>
            <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              בחירת סרט ➔ ניגון פסקול ➔ תרגום והקראה במבטא אותנטי לכל שפה!
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-mono font-bold text-indigo-300 flex items-center gap-1.5">
          <Volume2 className={`w-4 h-4 ${isPlayingSoundtrack ? 'text-pink-400 animate-bounce' : 'text-indigo-400'}`} />
          {isPlayingSoundtrack ? 'PLAYING SOUNDTRACK' : 'AI AUDIO READY'}
        </div>
      </div>

      {/* Movie Selection Pills */}
      <div className="mb-6">
        <span className="text-xs font-bold text-neutral-300 block mb-2 flex items-center gap-1.5">
          <Film className="w-4 h-4 text-pink-400" /> בחר סרט מתוך המבחר:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {MOVIE_SOUNDTRACKS.map((m) => (
            <button
              key={m.id}
              onClick={() => handleMovieSelect(m)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5 ${
                selectedMovie.id === m.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300'
              }`}
            >
              🎬 {m.title} ({m.year})
            </button>
          ))}
        </div>
      </div>

      {/* Interactive AI Translation & Accent Viewport */}
      <div className="relative w-full p-8 rounded-2xl border border-white/15 bg-gradient-to-br from-indigo-950/40 via-purple-950/40 to-black mb-6 text-center space-y-4 shadow-inner">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-xs font-bold text-indigo-300">
          <Globe className="w-3.5 h-3.5" /> ציטוט מקורי: "{selectedMovie.quoteEn}"
        </div>

        <div className="p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 shadow-2xl">
          <p className="text-sm font-bold text-pink-400 mb-1">
            תרגום AI ({LANGUAGE_ACCENT_CONFIG[selectedLang]?.label}):
          </p>
          <h4 className="font-['Outfit'] text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-pink-200">
            "{activeSubtitle}"
          </h4>
        </div>

        <button
          onClick={() => speakTranslationWithAccent(activeSubtitle, selectedLang)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-white text-xs shadow-lg active:scale-95 flex items-center gap-2 mx-auto"
        >
          <Mic className="w-4 h-4" /> השמע במבטא אותנטי ל{selectedLang.toUpperCase()}
        </button>
      </div>

      {/* Speech Speed Control & Language Selector Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            <Gauge className="w-4 h-4 text-indigo-400" /> מהירות הקראה: {speechRate}x
          </div>
          <div className="flex items-center gap-2">
            {[0.6, 0.75, 0.85, 1.0].map((rate) => (
              <button
                key={rate}
                onClick={() => { setSpeechRate(rate); speakTranslationWithAccent(activeSubtitle, selectedLang); }}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 ${
                  speechRate === rate
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border border-pink-400/40 shadow-md'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <span className="text-xs font-bold text-neutral-300">שפת תרגום ומבטא:</span>
          <div className="flex items-center gap-2">
            {[
              { id: 'he', label: 'עברית 🇮🇱' },
              { id: 'en', label: 'English 🇺🇸' },
              { id: 'es', label: 'Español 🇪🇸' },
              { id: 'ja', label: '日本語 🇯🇵' },
              { id: 'fr', label: 'Français 🇫🇷' },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => handleLanguageChange(l.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  selectedLang === l.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border border-indigo-400/40 shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

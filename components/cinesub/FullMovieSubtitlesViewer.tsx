"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Film, Download, Search, Play, Pause, Volume2, Globe, Sparkles, Check, Clock } from "lucide-react";
import { SubtitleCue } from "@/lib/schemas/subtitleSync";
import { getFullMovieSubtitlesAction } from "@/lib/actions/fullMovieSubtitles";
import { exportToSrt } from "@/lib/utils/exportSubtitles";
import { TargetLang } from "@/lib/store/subtitleStore";

interface Props {
  movieId?: string;
  movieTitle?: string;
}

const SUPPORTED_LANGS: { id: TargetLang; name: string; flag: string }[] = [
  { id: "he", name: "עברית", flag: "🇮🇱" },
  { id: "en", name: "English", flag: "🇺🇸" },
  { id: "es", name: "Español", flag: "🇪🇸" },
  { id: "fr", name: "Français", flag: "🇫🇷" },
  { id: "ar", name: "العربية", flag: "🇸🇦" },
  { id: "ja", name: "日本語", flag: "🇯🇵" },
];

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return `${String(h).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export const FullMovieSubtitlesViewer: React.FC<Props> = ({
  movieId = "550",
  movieTitle = "סרט נבחר",
}) => {
  const [lang, setLang] = useState<TargetLang>("he");
  const [cues, setCues] = useState<SubtitleCue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCueId, setActiveCueId] = useState<string | null>(null);

  const fetchTrack = async (target: TargetLang) => {
    setIsLoading(true);
    try {
      const res = await getFullMovieSubtitlesAction(movieId, movieTitle, target);
      if (res.success && res.cues) {
        setCues(res.cues);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrack(lang);
  }, [movieId, lang]);

  const filteredCues = cues.filter(
    (c) =>
      c.translatedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.speaker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const speakCue = (cue: SubtitleCue) => {
    setActiveCueId(cue.id);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(cue.translatedText);
      u.lang = lang === "he" ? "he-IL" : "en-US";
      u.rate = 0.9;
      u.onend = () => setActiveCueId(null);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Controls Bar */}
      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">תרגום מלא לכל הסרט: {movieTitle}</h2>
          </div>
          <p className="text-xs text-slate-400">ציר זמן קולנועי מלא, סנכרון רב-לשוני וייצוא SRT</p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10 flex-wrap">
          {SUPPORTED_LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                lang === l.id ? "bg-cyan-500 text-black shadow-md" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.name}</span>
            </button>
          ))}
        </div>

        {/* Download SRT Button */}
        <button
          onClick={() => exportToSrt(cues, `${movieTitle}_${lang}`)}
          disabled={isLoading || cues.length === 0}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 text-white font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-40"
        >
          <Download className="w-4 h-4" /> הורד קובץ כתוביות מלא (.SRT)
        </button>
      </div>

      {/* Search and Filters */}
      <div className="relative">
        <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="חפש ציטוט, מילה או דמות בכל הסרט..."
          className="w-full pr-11 pl-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
        />
      </div>

      {/* Full Movie Dialogue Timeline Stream */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
        {isLoading ? (
          <div className="text-center py-16 text-slate-400 font-mono space-y-2">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <p>מתרגם ומסנכרן את כל דיאלוגי הסרט ב-Gemini AI...</p>
          </div>
        ) : filteredCues.length === 0 ? (
          <div className="text-center py-12 text-slate-400">לא נמצאו דיאלוגים תואמים לחיפוש.</div>
        ) : (
          filteredCues.map((cue) => {
            const isPlaying = activeCueId === cue.id;
            return (
              <motion.div
                key={cue.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 md:p-5 rounded-2xl border transition-all ${
                  isPlaying
                    ? "bg-cyan-500/15 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                    : "bg-white/[0.03] border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {cue.speaker}
                    </span>
                    {cue.isMusicOrEffect && (
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        אפקט קולי
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(cue.startTimeMs)} - {formatTime(cue.endTimeMs)}
                    </span>
                    <button
                      onClick={() => speakCue(cue)}
                      title="השמע דיאלוג זה בקול"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-base md:text-lg font-bold text-amber-300 leading-relaxed mb-1">
                  {cue.translatedText}
                </p>
                <p className="text-xs text-slate-400 italic">&ldquo;{cue.originalText}&rdquo;</p>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FullMovieSubtitlesViewer;

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Eye, EyeOff, X, Sparkles, Download, Volume2, VolumeX, Plus, Minus, Film } from "lucide-react";
import { SubtitleFontSize, TargetLang, useSubtitleStore } from "@/lib/store/subtitleStore";
import { useLiveAudioTranscriber } from "@/hooks/useLiveAudioTranscriber";
import { exportToSrt } from "@/lib/utils/exportSubtitles";
import CineSubSpectrumVisualizer from "@/components/cinesub/CineSubSpectrumVisualizer";
import CineSubSpeakerCard from "@/components/cinesub/CineSubSpeakerCard";
import CineSubTelemetryHud from "@/components/cinesub/CineSubTelemetryHud";
import FullMovieSubtitlesViewer from "@/components/cinesub/FullMovieSubtitlesViewer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  movieId?: string;
  movieTitle?: string;
}

export const CineSubTranscriberModal: React.FC<Props> = ({
  isOpen,
  onClose,
  movieId,
  movieTitle = "סרט נבחר",
}) => {
  const [activeTab, setActiveTab] = useState<"live" | "full">("live");
  const {
    isRecording,
    isTranscribing,
    isStealthMode,
    fontSize,
    currentCue,
    audioLevel,
    toggleStealthMode,
    setFontSize,
    startStreaming,
    stopStreaming,
  } = useLiveAudioTranscriber(movieId);

  const {
    activeCues,
    selectedLanguage,
    setSelectedLanguage,
    voiceOverEnabled,
    toggleVoiceOver,
    timeOffsetMs,
    adjustOffset,
  } = useSubtitleStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        dir="rtl"
        className={`fixed inset-0 z-50 flex flex-col justify-between transition-colors duration-500 select-none ${
          isStealthMode ? "bg-black text-neutral-100" : "bg-slate-950/95 backdrop-blur-3xl text-white"
        }`}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between p-3 md:px-8 border-b border-white/10 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black tracking-tight text-base md:text-lg">CineSub AI Live</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  v6.5 Pro
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xs">{movieTitle}</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10 gap-1">
            <button
              onClick={() => setActiveTab("live")}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "live" ? "bg-cyan-500 text-black shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Mic className="w-3.5 h-3.5" /> תמלול חי
            </button>
            <button
              onClick={() => setActiveTab("full")}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "full" ? "bg-cyan-500 text-black shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Film className="w-3.5 h-3.5" /> תרגום מלא לכל הסרט
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleVoiceOver}
              title="הקראת תרגום קולית באוזניה"
              className={`p-2 rounded-xl border transition-all ${
                voiceOverEnabled ? "bg-indigo-500/25 border-indigo-500 text-indigo-300" : "bg-white/5 border-white/10 text-slate-400"
              }`}
            >
              {voiceOverEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => exportToSrt(activeCues, movieTitle)}
              disabled={activeCues.length === 0}
              title="ייצא כתוביות (SRT)"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-300 disabled:opacity-30"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={toggleStealthMode}
              title="מצב OLED שחור טהור"
              className={`p-2 rounded-xl border transition-all ${
                isStealthMode ? "bg-amber-500/20 border-amber-500/50 text-amber-300" : "bg-white/5 border-white/10 text-slate-300"
              }`}
            >
              {isStealthMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            <button
              onClick={() => { stopStreaming(); onClose(); }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-rose-500/20 hover:text-rose-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 max-w-5xl mx-auto w-full">
          {activeTab === "full" ? (
            <FullMovieSubtitlesViewer movieId={movieId} movieTitle={movieTitle} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              {currentCue ? (
                <CineSubSpeakerCard cue={currentCue} fontSize={fontSize} isStealthMode={isStealthMode} />
              ) : (
                <div className="space-y-4 max-w-md mx-auto opacity-70">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                    <Mic className="w-8 h-8 animate-pulse" />
                  </div>
                  <p className="text-lg font-medium text-slate-200">
                    {isRecording ? "מאזין לשמע הסרט ומסנכרן כתוביות..." : "לחץ על כפתור המיקרופון למטה להתחלת סנכרון חי"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Bar for Live Tab */}
        {activeTab === "live" && (
          <div className="p-4 md:px-8 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
            <CineSubSpectrumVisualizer audioLevel={audioLevel} isRecording={isRecording} />

            <button
              onClick={isRecording ? stopStreaming : startStreaming}
              className={`px-7 py-3 rounded-2xl font-bold flex items-center gap-2.5 shadow-2xl transition-all active:scale-95 ${
                isRecording
                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/40 animate-pulse"
                  : "bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              }`}
            >
              {isRecording ? <><MicOff className="w-5 h-5" /> עצור סנכרון</> : <><Mic className="w-5 h-5" /> הפעל CineSub AI</>}
            </button>

            <CineSubTelemetryHud isTranscribing={isTranscribing} isRecording={isRecording} activeCuesCount={activeCues.length} />
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default CineSubTranscriberModal;

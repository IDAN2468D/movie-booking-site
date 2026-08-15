"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Search, Sparkles } from "lucide-react";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import { processVoiceSearchAction } from "@/app/actions/voiceSearch.actions";
import { VoiceSearchOutput } from "@/lib/validations/voiceSearch.schema";

interface VoiceAiCommandShellProps {
  onSearchCompleted?: (result: VoiceSearchOutput) => void;
}

export function VoiceAiCommandShell({ onSearchCompleted }: VoiceAiCommandShellProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VoiceSearchOutput | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = "he-IL";

        rec.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("הדפדפן שלך אינו תומך בחיפוש קולי (Web Speech API). אנא הזיני חיפוש טקסטואלי.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSearchSubmit = async (textToSearch?: string) => {
    const query = textToSearch || transcript;
    if (!query.trim()) return;

    setLoading(true);
    const res = await processVoiceSearchAction({ transcript: query });
    if (res.success && res.data) {
      setResult(res.data);
      if (onSearchCompleted) onSearchCompleted(res.data);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4" dir="rtl">
      <div className="relative rounded-2xl bg-neutral-950/70 backdrop-blur-[40px] saturate-[250%] border border-white/15 p-2 flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <button
          onClick={toggleListening}
          aria-label={isListening ? "עצור הקשבה קולית" : "הפעל חיפוש קולי בעברית"}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            isListening
              ? "bg-rose-500 text-white animate-pulse shadow-[0_0_25px_rgba(244,63,94,0.6)]"
              : "bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
          }`}
          title="חיפוש קולי בעברית"
        >
          <Mic className={`w-5 h-5 ${isListening ? "animate-bounce" : ""}`} aria-hidden="true" />
        </button>

        <input
          type="text"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
          placeholder={isListening ? "מקשיב... דברו חופשי בעברית..." : "חפש סרט קולית או בהקלדה..."}
          aria-label="חיפוש סרטים קולי או טקסטואלי"
          className="flex-1 bg-transparent text-white placeholder-neutral-500 text-sm font-['Inter'] focus:outline-none px-2"
        />

        <button
          onClick={() => handleSearchSubmit()}
          disabled={loading || !transcript.trim()}
          aria-label="בצע חיפוש סרטים"
          className="px-5 py-2.5 rounded-xl bg-primary text-black font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          {loading ? (
            <LoadingIndicator variant="spinner" size={16} color="#000000" label="מעבד פקודה קולית..." />
          ) : (
            <>
              <Search className="w-3.5 h-3.5" />
              <span>חפש</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{result.explanation}</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
              {result.detectedMood}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

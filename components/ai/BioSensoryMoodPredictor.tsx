'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, Flame, Heart, Zap, Disc } from 'lucide-react';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { predictMoodAndFlavorsAction, BioSensoryPrediction } from '@/app/actions/bioSensoryMoodActions';

export function BioSensoryMoodPredictor() {
  const [energy, setEnergy] = useState(75);
  const [valence, setValence] = useState(60);
  const [intensity, setIntensity] = useState(80);
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<BioSensoryPrediction | null>(null);

  const handleAnalyze = async () => {
    if (isPredicting) return;
    setIsPredicting(true);
    const res = await predictMoodAndFlavorsAction({ energy, valence, intensity });
    setIsPredicting(false);
    if (res.success && res.data) {
      setPrediction(res.data as BioSensoryPrediction);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 20, 60]);
      }
    }
  };

  return (
    <div className="w-full bg-neutral-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] my-8 text-right" dir="rtl">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
        <div className="p-2.5 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-outfit text-white">מנבא מצב רוח & טעמים ביומטרי בלייב (Gemini Live)</h3>
          <p className="text-xs text-gray-400">הזז את הסליידרים הביומטריים לקבלת חיזוי סרט ומנות מזנון מותאמות אישית</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="space-y-2 bg-white/[0.03] p-4 rounded-2xl border border-white/10">
          <div className="flex justify-between text-xs">
            <span className="text-white font-bold flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> רמת אדרנלין (Energy)</span>
            <span className="font-mono text-amber-400">{energy}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        <div className="space-y-2 bg-white/[0.03] p-4 rounded-2xl border border-white/10">
          <div className="flex justify-between text-xs">
            <span className="text-white font-bold flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-400" /> טון רגשי (Valence)</span>
            <span className="font-mono text-rose-400">{valence}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={valence}
            onChange={(e) => setValence(Number(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
          />
        </div>

        <div className="space-y-2 bg-white/[0.03] p-4 rounded-2xl border border-white/10">
          <div className="flex justify-between text-xs">
            <span className="text-white font-bold flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-fuchsia-400" /> עוצמת חושים (Intensity)</span>
            <span className="font-mono text-fuchsia-400">{intensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-400"
          />
        </div>
      </div>

      <button
        type="button"
        disabled={isPredicting}
        onClick={handleAnalyze}
        className="w-full py-3.5 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600 hover:brightness-110 text-white font-extrabold text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-40"
      >
        {isPredicting ? <LoadingIndicator size="sm" variant="spinner" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
        <span>{isPredicting ? 'מנבא מצב רוח וטעמים ביומטריים...' : 'פלח פרופיל ביומטרי וקבל המלצת AI'}</span>
      </button>

      <AnimatePresence>
        {prediction && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-5 bg-gradient-to-br from-fuchsia-950/40 via-purple-950/30 to-neutral-900 border border-fuchsia-500/30 rounded-2xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-fuchsia-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> {prediction.predictedMoodName}
              </h4>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                {prediction.sensoryFrequencyHz}Hz Resonance
              </span>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed">{prediction.moodDescription}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-gray-400 block text-[10px]">סרט מומלץ:</span>
                <strong className="text-white font-outfit">{prediction.recommendedMovieTitle}</strong>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-gray-400 block text-[10px]">מנת מזנון מותאמת לחיך:</span>
                <strong className="text-amber-300 font-outfit">{prediction.recommendedSnackName}</strong>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

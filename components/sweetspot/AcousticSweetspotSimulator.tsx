'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Headphones, Sparkles, Volume2 } from 'lucide-react';
import { HallAcousticData, SeatAcousticProfile } from '@/lib/schemas/acousticSweetspot.schema';
import { fetchHallAcousticProfile } from '@/lib/actions/acousticSweetspotActions';
import { useWebAudioSpatializer } from '@/hooks/useWebAudioSpatializer';
import { SpeakerImmersionGauge } from './SpeakerImmersionGauge';
import { AcousticFrequencyCurve } from './AcousticFrequencyCurve';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const SEATS_PER_ROW = 8;

export function AcousticSweetspotSimulator() {
  const [data, setData] = useState<HallAcousticData | null>(null);
  const [selectedSeatId, setSelectedSeatId] = useState<string>('D4');
  const [isLoading, setIsLoading] = useState(true);

  const { isPlaying, activeFrequency, playSpatialTone, stopAudio } = useWebAudioSpatializer();

  useEffect(() => {
    fetchHallAcousticProfile().then((res) => {
      if (res.success && res.data) {
        setData(res.data);
        setSelectedSeatId(res.data.optimalSeatId);
      }
      setIsLoading(false);
    });
  }, []);

  const selectedProfile: SeatAcousticProfile | null =
    data && selectedSeatId ? data.profiles[selectedSeatId] || null : null;

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <LoadingIndicator variant="spinner" size={32} color="#06B6D4" label="מחשב גיאומטריית סאונד והחזרי גלים..." />
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10">
        <div>
          <h2 className="text-2xl font-black text-white font-rubik flex items-center gap-2">
            סימולטור אקוסטיקה 3D: {data?.hallName}
          </h2>
          <p className="text-xs text-off-white/60 mt-1">{data?.soundSystem}</p>
        </div>

        {selectedProfile && (
          <button
            onClick={() => playSpatialTone(selectedProfile)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 text-black font-black text-sm shadow-[0_0_25px_rgba(255,159,10,0.4)] transition-all active:scale-95"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            <span>{isPlaying ? 'עצור הדמיית שמע 3D' : 'השמע דגימת שמע מרחבית'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hall 3D Seat Grid */}
        <div className="lg:col-span-2 p-6 md:p-8 rounded-[36px] bg-black/60 backdrop-blur-3xl border border-white/10 shadow-2xl space-y-6 flex flex-col items-center">
          {/* Cinema Screen Curve */}
          <div className="w-full max-w-lg flex flex-col items-center gap-2">
            <div className="w-full h-3 bg-gradient-to-r from-cyan-500/20 via-white/80 to-cyan-500/20 rounded-full blur-[1px] shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
            <span className="text-[11px] font-black tracking-widest text-off-white/40 uppercase font-mono">מסך הקרנה ראשי (Front Screen)</span>
          </div>

          {/* Seat Grid */}
          <div className="space-y-3 pt-4 select-none">
            {ROWS.map((rowLetter) => (
              <div key={rowLetter} className="flex items-center gap-3">
                <span className="w-6 text-xs font-mono font-bold text-off-white/40 text-center">{rowLetter}</span>
                <div className="flex gap-2.5">
                  {Array.from({ length: SEATS_PER_ROW }, (_, idx) => {
                    const seatNum = idx + 1;
                    const seatId = `${rowLetter}${seatNum}`;
                    const profile = data?.profiles[seatId];
                    const isSelected = selectedSeatId === seatId;
                    const isOptimal = data?.optimalSeatId === seatId;

                    return (
                      <button
                        key={seatId}
                        onClick={() => {
                          setSelectedSeatId(seatId);
                          if (isPlaying && profile) {
                            stopAudio();
                            playSpatialTone(profile);
                          }
                        }}
                        title={`מושב ${seatId} (${profile?.immersionScore}% Immersion)`}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center relative group ${
                          isSelected
                            ? 'bg-primary text-black font-black scale-110 shadow-[0_0_18px_rgba(255,159,10,0.8)] z-10'
                            : isOptimal
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                            : 'bg-white/5 text-off-white/60 hover:bg-white/15 border border-white/10'
                        }`}
                      >
                        {seatNum}
                        {isOptimal && (
                          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <span className="w-6 text-xs font-mono font-bold text-off-white/40 text-center">{rowLetter}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-off-white/60 pt-4 border-t border-white/5 w-full">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-md bg-amber-500/20 border border-amber-400" />
              <span>נקודת Sweet Spot</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-md bg-primary" />
              <span>מושב נבחר</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-md bg-white/5 border border-white/10" />
              <span>מושב סטנדרטי</span>
            </div>
          </div>
        </div>

        {/* Side Immersion Gauges & Frequency Spectrum */}
        <div className="space-y-6">
          <SpeakerImmersionGauge profile={selectedProfile} />
          <AcousticFrequencyCurve isPlaying={isPlaying} frequency={activeFrequency} />
        </div>
      </div>
    </div>
  );
}

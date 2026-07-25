'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FingerprintScannerView } from './FingerprintScannerView';
import { AuraResonanceResultView } from './AuraResonanceResultView';
import { analyzeBiometricAuraAction } from '@/app/actions/aura-chamber-actions';
import { AuraProfileResult } from '@/lib/validations/aura-chamber';
import { Shield } from 'lucide-react';

export const BiometricAuraChamberContainer: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [auraResult, setAuraResult] = useState<AuraProfileResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scanTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playHeartbeatPulse = () => {
    try {
      if (typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioCtx();
          }
          const ctx = audioCtxRef.current;
          if (ctx.state === 'suspended') ctx.resume();

          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(55, now);
          osc.frequency.exponentialRampToValueAtTime(35, now + 0.3);

          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.35);
        }

        if ('vibrate' in navigator) {
          navigator.vibrate([60, 40, 60]);
        }
      }
    } catch {
      // Audio fallback
    }
  };

  const completeScan = useCallback(async () => {
    setIsScanning(false);
    const res = await analyzeBiometricAuraAction({
      holdDurationMs: 3000,
      pulseRate: 74,
    });

    if (res.success && res.data) {
      setAuraResult(res.data);
    } else {
      setErrorMessage(res.error || 'שגיאה בניתוח סריקת האורה');
    }
  }, []);

  const handlePressStart = () => {
    if (auraResult) return;
    setIsScanning(true);
    setScanProgress(0);
    setErrorMessage(null);
  };

  const handlePressEnd = () => {
    if (!auraResult) {
      setIsScanning(false);
      setScanProgress(0);
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
    }
  };

  useEffect(() => {
    if (isScanning) {
      playHeartbeatPulse();
      const intervalMs = 50;
      const totalMs = 3000;
      const step = (intervalMs / totalMs) * 100;
      let currentProgress = 0;

      scanTimerRef.current = setInterval(() => {
        currentProgress += step;
        if (Math.floor(currentProgress) % 25 < step) playHeartbeatPulse();

        if (currentProgress >= 100) {
          if (scanTimerRef.current) clearInterval(scanTimerRef.current);
          setScanProgress(100);
          completeScan();
        } else {
          setScanProgress(currentProgress);
        }
      }, intervalMs);
    } else {
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
    }

    return () => {
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
    };
  }, [isScanning, completeScan]);

  const handleReset = () => {
    setAuraResult(null);
    setScanProgress(0);
    setIsScanning(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30">
            Phase 31 • Sprint 82
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-outfit mt-2">
            תא האורה והביומטריה הקולנועית
          </h1>
          <p className="text-sm text-slate-300 font-inter mt-1">
            כיול האנרגיה והדופק האקוסטי שלך להתאמת חוויות צפייה קולנועיות מותאמות אישית
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
          <Shield className="w-6 h-6 animate-pulse" />
          <span className="text-xs font-bold font-mono">Biometric Vault 120Hz</span>
        </div>
      </div>

      {/* Main View */}
      {auraResult ? (
        <AuraResonanceResultView result={auraResult} onReset={handleReset} />
      ) : (
        <FingerprintScannerView
          isScanning={isScanning}
          scanProgress={scanProgress}
          onPressStart={handlePressStart}
          onPressEnd={handlePressEnd}
        />
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

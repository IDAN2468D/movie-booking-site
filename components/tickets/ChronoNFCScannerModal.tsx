'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, ShieldCheck, QrCode, Lock, CheckCircle2 } from 'lucide-react';
import { generateChronoPassbookShard } from '@/app/actions/chronoPassbookActions';

export function ChronoNFCScannerModal() {
  const [scanned, setScanned] = useState(false);
  const [passData, setPassData] = useState<{ signature: string; payload: string } | null>(null);
  const [statusMsg, setStatusMsg] = useState('קארד NFC מוכן לסריקה בשער הקולנוע');

  const playChimeSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // Audio fallback
    }
  };

  const handleScanNFC = async () => {
    setStatusMsg('מבצע הצפנת HMAC-SHA256 ושידור NFC...');
    const res = await generateChronoPassbookShard({ bookingId: 'BK-NFC-99', userRef: 'USR-PASS' });

    if (res.success && res.data) {
      setPassData({
        signature: res.data.signature,
        payload: res.data.encryptedNfcPayload,
      });
      setScanned(true);
      playChimeSound();
      setStatusMsg('כניסת NFC אושרה! שער הקולנוע שנפתח: Hall 1 VIP');
    } else {
      setStatusMsg(res.error || 'שגיאה באישור NFC');
    }
  };

  return (
    <div dir="rtl" className="w-full max-w-xl p-6 rounded-2xl bg-neutral-900/90 border border-blue-500/30 backdrop-blur-xl shadow-2xl text-right">
      <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Wifi className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              Chrono-Refractive Passbook & NFC Scanner
            </h3>
            <p className="text-xs text-neutral-400">
              כרטיס כניסה ביומטרי מוצפן HMAC-SHA256
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
          NFC Pass
        </span>
      </div>

      <motion.div
        whileHover={{ rotateX: 5, rotateY: 5 }}
        className="p-5 rounded-xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-blue-950/40 border border-blue-500/40 shadow-inner mb-4 relative overflow-hidden"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-blue-300 font-mono flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            CinePulse Encrypted Passbook
          </span>
          <QrCode className="w-5 h-5 text-blue-400" />
        </div>

        <div className="space-y-1 mb-3">
          <span className="text-xs text-neutral-400 block">קוד הזמנה: BK-NFC-99</span>
          <span className="text-sm font-bold text-white block">סרט: Dune Part Two (VIP Lounge)</span>
        </div>

        {passData && (
          <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-xs font-mono text-blue-200">
            <span>חתימה: {passData.signature}</span>
            <span className="block truncate text-[10px] text-blue-400">{passData.payload}</span>
          </div>
        )}
      </motion.div>

      <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
        <span className="text-xs text-neutral-300 flex items-center gap-1.5">
          {scanned ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          )}
          {statusMsg}
        </span>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleScanNFC}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-950/50"
        >
          סרוק כרטיס NFC בשער
        </motion.button>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { executeDataPurgeAction } from '@/app/actions/settingsActions';
import SecuritySettings from './SecuritySettings';
import NotificationSettings from './NotificationSettings';

export default function SettingsMatrix({ userEmail }: { userEmail: string }) {
  const [blurDepth, setBlurDepth] = useState(40);
  const [refractionOpacity, setRefractionOpacity] = useState(12);
  const [motionProfile120Hz, setMotionProfile120Hz] = useState(true);
  
  const [purgeInput, setPurgeInput] = useState('');
  const [purgeType, setPurgeType] = useState<'cache' | 'history' | 'all'>('cache');
  const [isPending, startTransition] = useTransition();
  const [purgeMessage, setPurgeMessage] = useState<string | null>(null);

  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioCtx.current?.state !== 'closed') {
        audioCtx.current?.close();
      }
    };
  }, []);

  const triggerPulse = useCallback(() => {
    if (!audioCtx.current) return;
    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume();
    }
    
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    const filter = audioCtx.current.createBiquadFilter();
    const panner = audioCtx.current.createPanner();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(40, audioCtx.current.currentTime);
    
    filter.type = 'lowpass';
    filter.frequency.value = 80;

    panner.panningModel = 'HRTF';
    panner.positionX.value = 0;
    panner.positionY.value = 0;
    panner.positionZ.value = -1;

    gain.gain.setValueAtTime(0, audioCtx.current.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, audioCtx.current.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.4);

    osc.connect(filter);
    filter.connect(panner);
    panner.connect(gain);
    gain.connect(audioCtx.current.destination);

    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.5);
  }, []);

  const handleBlurChange = (val: number) => { setBlurDepth(val); triggerPulse(); };
  const handleRefractionChange = (val: number) => { setRefractionOpacity(val); triggerPulse(); };
  const handleMotionToggle = () => { setMotionProfile120Hz(prev => !prev); triggerPulse(); };

  const handlePurge = () => {
    startTransition(async () => {
      const res = await executeDataPurgeAction(userEmail, {
        purgeType,
        confirmationText: purgeInput
      });
      triggerPulse();
      if (res.success) {
        setPurgeMessage(res.data.message);
        setPurgeInput('');
      } else {
        setPurgeMessage(res.error || 'שגיאה במחיקת הנתונים');
      }
      setTimeout(() => setPurgeMessage(null), 3000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
      dir="rtl"
    >
      {/* Liquid Glass 4.0 Optics Controller */}
      <div 
        className="saturate-[250%] brightness-105 contrast-110 border rounded-[32px] p-10 font-body relative overflow-hidden"
        style={{
          backgroundColor: `rgba(10, 10, 10, 0.4)`,
          backdropFilter: `blur(${blurDepth}px)`,
          borderColor: `rgba(255, 255, 255, ${refractionOpacity / 100})`,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.4)"
        }}
      >
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 font-['Outfit']">
          בקרת אופטיקה - Liquid Glass 4.0
        </h3>

        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-white font-bold">
              <span>עומק טשטוש רקע (Blur Depth)</span>
              <span className="text-[#FF9F0A]">{blurDepth}px</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={blurDepth} 
              onChange={(e) => handleBlurChange(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-white font-bold">
              <span>שקיפות שבירת אור (Refraction Opacity)</span>
              <span className="text-[#FF9F0A]">{refractionOpacity}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={refractionOpacity} 
              onChange={(e) => handleRefractionChange(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-6 rounded-3xl bg-neutral-900/40 border border-white/[0.08] hover:border-white/[0.2] transition-colors shadow-inner group">
            <div>
              <p className="text-white font-bold">פרופיל תנועה מואץ חומרה (120Hz)</p>
              <p className="text-xs text-slate-500">אפשר מעברי אנימציה חלקים ללא Reflow</p>
            </div>
            <button 
              onClick={handleMotionToggle} 
              className="relative transition-transform duration-300 active:scale-95 transform-gpu"
            >
              <div className={`w-12 h-6 rounded-full transition-colors ${motionProfile120Hz ? 'bg-primary' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${motionProfile120Hz ? 'left-1' : 'right-1'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <SecuritySettings userEmail={userEmail} triggerPulse={triggerPulse} />
        <NotificationSettings userEmail={userEmail} triggerPulse={triggerPulse} />
      </div>

      {/* Cloud Sync & Data Purge Engine */}
      <div 
        className="saturate-[250%] brightness-105 contrast-110 border rounded-[32px] p-10 font-body relative overflow-hidden"
        style={{
          backgroundColor: `rgba(30, 10, 10, 0.4)`,
          backdropFilter: `blur(${blurDepth}px)`,
          borderColor: `rgba(255, 0, 0, 0.15)`,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 0, 0, 0.15), inset 0 1px 1px rgba(255, 0, 0, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.4)"
        }}
      >
        <h3 className="text-2xl font-bold text-red-400 mb-8 flex items-center gap-3 font-['Outfit']">
          מנוע טיהור נתונים (Data Purge Engine)
        </h3>

        <div className="space-y-6">
          <p className="text-slate-400 text-sm">
            פעולה זו הינה בלתי הפיכה ותמחק את הנתונים שלך בשרתים באופן אטומי (Atomic Cache Clearing).
          </p>

          <div className="flex gap-4">
            {(['cache', 'history', 'all'] as const).map(type => (
              <button 
                key={type}
                onClick={() => setPurgeType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all transform-gpu border ${
                  purgeType === type ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-neutral-900/40 text-slate-500 border-white/[0.08]'
                }`}
              >
                {type === 'cache' ? 'ניקוי מטמון' : type === 'history' ? 'היסטוריה' : 'הכל'}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">
              הקלד PURGE לאישור
            </label>
            <input
              type="text"
              value={purgeInput}
              onChange={e => setPurgeInput(e.target.value)}
              placeholder="PURGE"
              className="w-full bg-neutral-900/60 border border-white/[0.08] focus:border-red-500/50 focus:bg-neutral-950/80 text-white placeholder-neutral-600 rounded-xl transition-all duration-300 focus:ring-1 focus:ring-red-500/20 outline-none p-4 text-left font-body transform-gpu uppercase"
              dir="ltr"
            />
          </div>

          <button 
            onClick={handlePurge}
            disabled={isPending || purgeInput !== 'PURGE'}
            className="w-full py-4 bg-red-500/80 hover:bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] active:scale-95 transition-all transform-gpu disabled:opacity-50 disabled:active:scale-100 font-display"
          >
            {isPending ? 'מוחק נתונים...' : 'הפעל טיהור נתונים אטומי'}
          </button>

          <AnimatePresence>
            {purgeMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-center text-red-400 font-bold mt-4"
              >
                {purgeMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

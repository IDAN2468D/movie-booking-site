'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Wind, Volume2, Sun } from 'lucide-react';
import { saveUserHaptics } from '@/lib/actions/haptics';
import { useSession } from 'next-auth/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MovieHaptics = ({ initialHaptics }: { initialHaptics: any }) => {
  const { data: session } = useSession();
  const [haptics, setHaptics] = useState(initialHaptics || { vibration: 50, scent: false, air: 30, light: 70 });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!session?.user) return alert('יש להתחבר כדי לשמור');
    
    setSaving(true);
    const res = await saveUserHaptics(session.user.id || 'guest', haptics);
    if (res.success) {
      alert('ההגדרות נשמרו ויחולו במושב ה-VIP שלך!');
    } else {
      alert('שגיאה בשמירה');
    }
    setSaving(false);
  };

  return (
    <div className="w-full space-y-6 relative mt-8">
      <div className="flex items-center gap-3 mb-6">
        <Wind className="w-6 h-6 text-emerald-400" />
        <h2 className="text-2xl font-bold text-white tracking-tight font-outfit">חוויה חושית (4DX Haptics)</h2>
      </div>
      
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2 text-sm text-white/80">
                <span>עוצמת רטט (Vibration)</span>
                <span>{haptics.vibration}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={haptics.vibration} 
                onChange={(e) => setHaptics({...haptics, vibration: parseInt(e.target.value)})}
                className="w-full accent-emerald-500" 
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2 text-sm text-white/80">
                <span>זרימת אוויר (Air Flow)</span>
                <span>{haptics.air}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={haptics.air} 
                onChange={(e) => setHaptics({...haptics, air: parseInt(e.target.value)})}
                className="w-full accent-emerald-500" 
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2 text-sm text-white/80">
                <span>תאורת סביבה (Ambient Light)</span>
                <span>{haptics.light}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={haptics.light} 
                onChange={(e) => setHaptics({...haptics, light: parseInt(e.target.value)})}
                className="w-full accent-emerald-500" 
              />
            </div>
          </div>
          
          <div className="flex flex-col justify-center items-center bg-black/40 rounded-xl p-6 border border-white/5 space-y-4">
            <div className="w-32 h-32 rounded-full border-4 border-emerald-500/30 flex items-center justify-center relative">
              <motion.div 
                animate={{ scale: [1, 1 + (haptics.vibration/200), 1] }} 
                transition={{ repeat: Infinity, duration: 100/Math.max(haptics.vibration, 1) }}
                className="absolute inset-0 rounded-full bg-emerald-500/10"
              />
              <Volume2 className={`w-10 h-10 text-emerald-400 opacity-${Math.max(20, haptics.vibration)}`} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={haptics.scent} 
                onChange={(e) => setHaptics({...haptics, scent: e.target.checked})}
                className="w-5 h-5 accent-emerald-500"
              />
              <span className="text-white">אפשר פיזור ריחות בקולנוע (Scent)</span>
            </label>
          </div>
          
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50"
          >
            {saving ? 'שומר...' : 'שמור העדפות למושב'}
          </button>
        </div>
      </div>
    </div>
  );
};

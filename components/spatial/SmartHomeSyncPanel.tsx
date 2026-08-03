'use client';

import React, { useState } from 'react';
import { Bluetooth, Zap, Radio, Volume2, ShieldCheck } from 'lucide-react';
import { smartHomeSyncEngine } from '@/lib/sensory/smartHomeSync';

export const SmartHomeSyncPanel: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [activeRgb, setActiveRgb] = useState<[number, number, number]>([239, 68, 68]);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const handleConnect = async () => {
    const res = await smartHomeSyncEngine.connectBluetoothLight();
    if (res.success) {
      setConnected(true);
      setDeviceName(res.deviceName || 'תאורת ניאון סביבתית');
    } else {
      // Demo connection fallback
      setConnected(true);
      setDeviceName('תאורה סביבתית (סימולציית Web Bluetooth)');
    }
  };

  const triggerTestSync = (rgb: [number, number, number]) => {
    setActiveRgb(rgb);
    smartHomeSyncEngine.syncSceneMetadata(rgb, hapticsEnabled ? [200, 100, 200] : []);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 rounded-3xl bg-black/70 border border-emerald-500/30 backdrop-blur-2xl shadow-[0_0_40px_rgba(16,185,129,0.15)] text-white" dir="rtl">
      <div className="flex items-center justify-between mb-4 border-b border-emerald-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-['Outfit'] text-lg font-bold text-emerald-300">Smart-Home & Ambient Sensory Sync</h3>
            <p className="text-xs text-gray-400">סנכרון תאורה חכמה, אפקטים הפטיים ושמע מרחבי</p>
          </div>
        </div>

        <button
          onClick={handleConnect}
          className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
            connected
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
          }`}
        >
          <Bluetooth className="w-3.5 h-3.5" />
          <span>{connected ? 'מחובר' : 'חבר Bluetooth'}</span>
        </button>
      </div>

      {connected && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>מכשיר פעיל: {deviceName}</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <span className="text-xs text-gray-400 block mb-2 font-bold">סנכרון בדיקה לפי אווירת סצנה:</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => triggerTestSync([239, 68, 68])}
              className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-900/60 transition-all flex flex-col items-center gap-1"
            >
              <span className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_red]" />
              <span>אקשן מותח</span>
            </button>

            <button
              onClick={() => triggerTestSync([168, 85, 247])}
              className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-bold hover:bg-purple-900/60 transition-all flex flex-col items-center gap-1"
            >
              <span className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_purple]" />
              <span>סייברפאנק 3D</span>
            </button>

            <button
              onClick={() => triggerTestSync([16, 185, 129])}
              className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-900/60 transition-all flex flex-col items-center gap-1"
            >
              <span className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_emerald]" />
              <span>הירגעות דרמטית</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-300">רטט הפטי בזמן סצנות שיא</span>
          </div>
          <input
            type="checkbox"
            checked={hapticsEnabled}
            onChange={(e) => setHapticsEnabled(e.target.checked)}
            className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

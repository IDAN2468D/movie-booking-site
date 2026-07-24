'use client';

import React from 'react';
import { FlavorProfile } from '@/lib/types/concession';

interface KineticFlavorRadarProps {
  flavor: FlavorProfile;
  onChange: (newFlavor: FlavorProfile) => void;
  targetFlavor?: FlavorProfile;
  onAudioFeedback?: () => void;
}

export const KineticFlavorRadar: React.FC<KineticFlavorRadarProps> = ({
  flavor,
  onChange,
  targetFlavor,
  onAudioFeedback
}) => {
  const flavorKeys: Array<{ key: keyof FlavorProfile; label: string; icon: string; color: string }> = [
    { key: 'sweet', label: 'מתיקות נאון', icon: '🍬', color: 'accent-pink-500' },
    { key: 'salty', label: 'מליחות ים', icon: '🧂', color: 'accent-amber-400' },
    { key: 'umami', label: 'אומאמי קואנטי', icon: '🍄', color: 'accent-orange-500' },
    { key: 'cyberSpice', label: 'סייבר ספייס', icon: '🌶️', color: 'accent-red-500' },
    { key: 'subZero', label: 'סאב-זירו צינה', icon: '❄️', color: 'accent-cyan-400' }
  ];

  // Calculate synergy match percentage against target item flavor if provided
  const calculateSynergy = (): number => {
    if (!targetFlavor) return 100;
    const diffs = flavorKeys.map((item) => Math.abs(flavor[item.key] - targetFlavor[item.key]));
    const avgDiff = diffs.reduce((acc, v) => acc + v, 0) / diffs.length;
    return Math.max(0, Math.round(100 - avgDiff));
  };

  const handleSliderChange = (key: keyof FlavorProfile, value: number) => {
    onChange({ ...flavor, [key]: value });
    if (onAudioFeedback) onAudioFeedback();
  };

  const synergyScore = calculateSynergy();

  return (
    <div className="w-full rounded-3xl backdrop-blur-[40px] saturate-[250%] bg-neutral-950/40 border border-white/10 p-5 space-y-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transform-gpu">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h3 className="text-sm font-bold font-outfit text-white flex items-center gap-2">
          <span>⚡</span> רדאר טעמים קינטי
        </h3>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <span className="text-xs text-neutral-400">סינרגיה:</span>
          <span className="text-xs font-bold font-outfit text-cyan-400">
            {synergyScore}%
          </span>
        </div>
      </div>

      {/* Dynamic Sliders List */}
      <div className="space-y-3">
        {flavorKeys.map((item) => {
          const val = flavor[item.key];
          return (
            <div key={item.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-inter">
                <span className="text-neutral-300 flex items-center gap-1.5">
                  <span>{item.icon}</span> {item.label}
                </span>
                <span className="text-neutral-400 font-mono">{val}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={val}
                onChange={(e) => handleSliderChange(item.key, parseInt(e.target.value, 10))}
                className={`w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer ${item.color}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

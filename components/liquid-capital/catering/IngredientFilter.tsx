'use client';

import React from 'react';
import { ShieldAlert, Heart } from 'lucide-react';

interface IngredientFilterProps {
  selectedAllergies: string[];
  onChange: (allergy: string) => void;
  biometricActive: boolean;
  onBiometricToggle: () => void;
}

const ALLERGEN_OPTIONS = [
  { id: 'nuts', label: 'ללא אגוזים' },
  { id: 'gluten', label: 'ללא גלוטן' },
  { id: 'dairy', label: 'ללא לקטוז' },
  { id: 'sugar', label: 'ללא סוכר' },
  { id: 'vegan', label: 'טבעוני' },
];

export const IngredientFilter: React.FC<IngredientFilterProps> = ({
  selectedAllergies,
  onChange,
  biometricActive,
  onBiometricToggle
}) => {
  return (
    <div className="w-full flex flex-col gap-4 text-right">
      <div className="flex justify-between items-center flex-row-reverse">
        <h3 className="text-lg font-bold font-outfit text-white">סינון רכיבים ביומטרי</h3>
        <button
          onClick={onBiometricToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            biometricActive 
              ? 'bg-[#00f2fe]/20 border-[#00f2fe]/50 text-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.25)]' 
              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span>{biometricActive ? 'סנכרון ביומטרי פעיל' : 'סנכרן פרופיל ביומטרי'}</span>
          <Heart className={`w-3.5 h-3.5 ${biometricActive ? 'fill-[#00f2fe] animate-pulse' : ''}`} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 justify-end">
        {ALLERGEN_OPTIONS.map((allergy) => {
          const isSelected = selectedAllergies.includes(allergy.id);
          return (
            <button
              key={allergy.id}
              onClick={() => onChange(allergy.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                isSelected 
                  ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              <span>{allergy.label}</span>
              {isSelected && <ShieldAlert className="w-3 h-3" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

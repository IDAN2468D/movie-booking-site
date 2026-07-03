'use client';

import React from 'react';
import { ShoppingBasket } from 'lucide-react';

interface FoodHeaderProps {
  cartTotal: number;
}

export const FoodHeader: React.FC<FoodHeaderProps> = ({ cartTotal }) => {
  return (
    <div className="flex items-center justify-between mb-12">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2 font-outfit">
          נשנושי <span className="text-primary">קולנוע</span>
        </h1>
        <p className="text-slate-400 font-medium text-sm">הזמינו מראש את הממתקים האהובים עליכם ודלגו על התור</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-start ml-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">סה&quot;כ בסל</p>
          <p className="text-xl font-black text-primary">₪{cartTotal.toFixed(2)}</p>
        </div>
        <button className="p-4 bg-primary rounded-2xl text-background shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer">
          <ShoppingBasket size={24} />
        </button>
      </div>
    </div>
  );
};

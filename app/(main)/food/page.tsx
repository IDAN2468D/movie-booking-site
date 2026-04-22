'use client';

import React from 'react';
import NextImage from 'next/image';
import { ShoppingBasket, Plus, Minus, Star, Flame } from 'lucide-react';

import { useBookingStore } from '@/lib/store';
import { FOOD_ITEMS } from '@/lib/constants';

const foodItems = FOOD_ITEMS;

export default function FoodPage() {
  const [activeFoodCategory, setActiveFoodCategory] = React.useState('כל הפריטים');
  const { selectedFood, updateFoodQuantity } = useBookingStore();

  const getQuantity = (id: number) => {
    return selectedFood.find((f) => f.id === id)?.quantity || 0;
  };

  const cartTotal = selectedFood.reduce((acc, current) => {
    const item = foodItems.find((f) => f.id === current.id);
    return acc + (item?.price || 0) * current.quantity;
  }, 0);

  const filteredItems = activeFoodCategory === 'כל הפריטים' 
    ? foodItems 
    : foodItems.filter(item => item.category === activeFoodCategory);

  return (
    <div className="p-10 pb-20 text-right">
      <div className="flex items-center justify-between mb-12 flex-row-reverse">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">נשנושי <span className="text-primary">קולנוע</span></h1>
          <p className="text-slate-400 font-medium">הזמינו מראש את הממתקים האהובים עליכם ודלגו על התור</p>
        </div>
        <div className="flex items-center gap-4 flex-row-reverse">
          <div className="flex flex-col items-start ml-4">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">סה&quot;כ בסל</p>
             <p className="text-xl font-black text-primary">₪{cartTotal.toFixed(2)}</p>
          </div>
          <button className="p-4 bg-primary rounded-2xl text-background shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            <ShoppingBasket size={24} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-12 overflow-x-auto no-scrollbar pb-2 flex-row-reverse">
        {['כל הפריטים', 'חטיפים', 'משקאות', 'קינוחים', 'קומבואים'].map((cat) => (
          <button 
            key={cat} 
            onClick={() => setActiveFoodCategory(cat)}
            className={`px-8 py-3 rounded-2xl whitespace-nowrap font-bold text-sm transition-all ${
              cat === activeFoodCategory ? 'bg-primary text-background' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => updateFoodQuantity(item.id, 1)}
            className="group relative glass rounded-[32px] overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 text-right cursor-pointer"
          >
            {item.tag && (
              <div className="absolute top-4 right-4 z-10 bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-1 rounded-full flex items-center gap-1.5 flex-row-reverse">
                <Flame size={12} className="text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-tighter">{item.tag}</span>
              </div>
            )}
            
            <div className="h-48 relative overflow-hidden">
              <NextImage 
                src={item.image} 
                alt={item.name} 
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2 flex-row-reverse">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.category}</span>
                <div className="flex items-center gap-1 flex-row-reverse">
                  <Star size={12} className="text-primary fill-primary" />
                  <span className="text-xs font-bold text-white">{item.rating}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-black text-white mb-6 group-hover:text-primary transition-colors">{item.name}</h3>
              
              <div className="flex items-center justify-between flex-row-reverse">
                <p className="text-xl font-black text-white">₪{item.price.toFixed(2)}</p>
                <div className="flex items-center bg-background rounded-2xl p-1 border border-white/5 flex-row-reverse">
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      updateFoodQuantity(item.id, -1);
                    }}
                    className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors"
                   >
                      <Minus size={16} />
                   </button>
                   <span className="px-4 font-black text-white text-sm">{getQuantity(item.id)}</span>
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      updateFoodQuantity(item.id, 1);
                    }}
                    className="p-2 bg-primary rounded-xl text-background hover:bg-[#FF7A00] transition-colors shadow-lg shadow-primary/20"
                   >
                      <Plus size={16} />
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

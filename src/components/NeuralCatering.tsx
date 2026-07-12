"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCateringCart, useAddToCart, useClearCart } from '@/lib/store/cateringStore';
import { useUserMood } from '@/lib/store/conciergeStore';
import { checkoutCateringCartAction } from '@/lib/actions/catering';
import { ShoppingBag, Coffee, Star, Flame, Sparkles } from 'lucide-react';

const MENU_ITEMS = [
  { id: 'item_popcorn', name: 'Premium Truffle Popcorn', category: 'snack', price: 25, moodRecommend: 'Curious' },
  { id: 'item_cola', name: 'Liquid Glass Elixir (Soda)', category: 'beverage', price: 15, moodRecommend: 'relaxed' },
  { id: 'item_combo', name: 'Acoustic Fusion Combo', category: 'combo', price: 45, moodRecommend: 'hyped' },
  { id: 'item_caviar', name: 'Imperial Seat Caviar', category: 'premium', price: 95, moodRecommend: 'focused' },
];

export default function NeuralCatering({ showtimeId }: { showtimeId: string }) {
  const cart = useCateringCart();
  const addToCart = useAddToCart();
  const clearCart = useClearCart();
  const userMood = useUserMood();
  const [activeCategory, setActiveCategory] = useState<'snack' | 'beverage' | 'combo' | 'premium'>('snack');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const res = await checkoutCateringCartAction({
      showtimeId,
      items: cart.map((i) => ({ itemId: i.itemId, quantity: i.quantity })),
    });

    if (res.success) {
      setStatusMsg('Catering Order Placed Successfully!');
      clearCart();
    } else {
      setStatusMsg(res.error || 'Failed to place order');
    }
  };

  return (
    <div className="p-6 rounded-3xl backdrop-blur-[40px] saturate-[250%] bg-neutral-950/40 border border-white/[0.12] shadow-2xl flex flex-col gap-4 w-full max-w-[400px] mx-auto transform-gpu text-right" dir="rtl">
      <div className="flex justify-between items-center border-b border-white/10 pb-3 transform-gpu">
        <div className="flex items-center gap-2 transform-gpu">
          <ShoppingBag className="w-5 h-5 text-cyan-400" />
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded transform-gpu">
            {cartCount} פריטים
          </span>
        </div>
        <h3 className="text-base font-bold font-outfit text-white tracking-wider uppercase">
          מזנון נוירוני פרימיום
        </h3>
      </div>

      {/* Mood recommendation indicator */}
      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between gap-2 transform-gpu">
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        <p className="text-xs text-white/80 font-sans">
          מצב רוח מנותח: <span className="text-amber-400 font-bold">{userMood.mood}</span> (התאמנו את המלצות המזנון בשבילך!)
        </p>
      </div>

      {/* Menu Categories */}
      <div className="flex gap-2 justify-center py-2 transform-gpu overflow-x-auto">
        {(['snack', 'beverage', 'combo', 'premium'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-outfit font-semibold transition-transform transform-gpu capitalize ${
              activeCategory === cat ? 'bg-cyan-500 text-black scale-105' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommended Items list */}
      <div className="flex flex-col gap-2 transform-gpu">
        {MENU_ITEMS.filter((i) => i.category === activeCategory).map((item) => {
          const isMoodMatched = item.moodRecommend.toLowerCase() === userMood.mood.toLowerCase();
          return (
            <div key={item.id} className={`p-3 rounded-xl border flex justify-between items-center transform-gpu transition-all ${
              isMoodMatched ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-white/5 border-white/5'
            }`}>
              <button onClick={() => addToCart(item.id)} className="px-3 py-1 rounded-full bg-cyan-500 text-black text-xs font-bold hover:scale-105 active:scale-95 transition-transform transform-gpu">
                הוסף +
              </button>
              <div className="text-right">
                <span className="text-xs text-white font-semibold block">{item.name}</span>
                <span className="text-[10px] text-white/50">{item.price} ₪</span>
                {isMoodMatched && (
                  <span className="text-[8px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded font-mono mr-1.5 align-middle">
                    מומלץ למוד שלך!
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {cartCount > 0 && (
        <button onClick={handleCheckout} className="w-full mt-2 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-outfit text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 transition-transform duration-200 transform-gpu">
          בצע הזמנה אטומית במזנון
        </button>
      )}

      {statusMsg && (
        <p className="text-xs text-center text-cyan-400 font-mono mt-2 animate-pulse transform-gpu">
          {statusMsg}
        </p>
      )}
    </div>
  );
}

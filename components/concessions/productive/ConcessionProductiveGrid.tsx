'use client';

import React, { useMemo } from 'react';
import NextImage from 'next/image';
import { motion } from 'framer-motion';
import { Search, Plus, Minus, SlidersHorizontal, Star, Clock } from 'lucide-react';
import { DietaryTag, ProductiveConcessionItem } from '@/lib/types/concession-productive';
import { PRODUCTIVE_CONCESSION_ITEMS } from '@/lib/data/productiveConcessionCatalog';
import { useProductiveConcessionStore } from '@/lib/store/productiveConcessionStore';

const DIETARY_FILTERS: { tag: DietaryTag; label: string; icon: string }[] = [
  { tag: 'ALL', label: 'הכל', icon: '🍿' },
  { tag: 'KOSHER_MEHADRIN', label: 'כשר למהדרין', icon: '✡️' },
  { tag: 'VEGAN', label: 'טבעוני', icon: '🌱' },
  { tag: 'GLUTEN_FREE', label: 'ללא גלוטן', icon: '🌾' },
  { tag: 'LOW_CALORIE', label: 'דל קלוריות', icon: '🥗' },
];

export const ConcessionProductiveGrid: React.FC = () => {
  const activeTag = useProductiveConcessionStore((state) => state.activeDietaryTag);
  const setDietaryTag = useProductiveConcessionStore((state) => state.setDietaryTag);
  const searchQuery = useProductiveConcessionStore((state) => state.searchQuery);
  const setSearchQuery = useProductiveConcessionStore((state) => state.setSearchQuery);
  const cart = useProductiveConcessionStore((state) => state.cart);
  const addItem = useProductiveConcessionStore((state) => state.addItem);
  const updateQuantity = useProductiveConcessionStore((state) => state.updateQuantity);
  const openCustomizer = useProductiveConcessionStore((state) => state.openCustomizer);

  const filteredItems = useMemo(() => {
    return PRODUCTIVE_CONCESSION_ITEMS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDietary =
        activeTag === 'ALL' || item.dietaryTags.includes(activeTag);
      return matchesSearch && matchesDietary;
    });
  }, [searchQuery, activeTag]);

  const getItemCartQuantity = (itemId: number) => {
    return cart
      .filter((i) => i.itemId === itemId)
      .reduce((acc, curr) => acc + curr.quantity, 0);
  };

  return (
    <section className="w-full space-y-4" dir="rtl" aria-label="תפריט מזנון פרודוקטיבי">
      {/* Controls Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Dietary Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {DIETARY_FILTERS.map((f) => {
            const isActive = activeTag === f.tag;
            return (
              <button
                key={f.tag}
                type="button"
                onClick={() => setDietaryTag(f.tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-outfit font-medium shrink-0 transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="חיפוש מהיר במזנון..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/60"
          />
        </div>
      </div>

      {/* Productive Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const qty = getItemCartQuantity(item.id);
          const firstMatchingCartItem = cart.find((i) => i.itemId === item.id);

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              className="rounded-2xl bg-neutral-900/60 border border-white/10 hover:border-amber-500/40 transition-all p-3.5 flex flex-col justify-between backdrop-blur-md shadow-md"
            >
              <div className="space-y-2.5">
                {/* Image & Badges */}
                <div className="relative h-32 w-full rounded-xl overflow-hidden bg-neutral-950">
                  <NextImage
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.tag && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500/90 text-neutral-950 font-bold text-[10px] shadow">
                      {item.tag}
                    </span>
                  )}
                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-white flex items-center gap-1 font-mono">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    {item.rating}
                  </span>
                </div>

                {/* Details */}
                <div>
                  <h4 className="text-sm font-bold text-white font-outfit truncate">{item.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                    <span>{item.calories} קל׳</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock size={10} />
                      {item.prepTimeMinutes} דק׳ הכנה
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Cart Actions */}
              <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-base font-bold text-amber-400 font-outfit">₪{item.price}</span>

                <div className="flex items-center gap-1.5">
                  {item.allowsSpiceCustomization && (
                    <button
                      type="button"
                      onClick={() => openCustomizer(item)}
                      title="התאמת תבלינים ושדרוגים"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-amber-400 border border-white/10 transition-colors"
                    >
                      <SlidersHorizontal size={14} />
                    </button>
                  )}

                  {qty > 0 ? (
                    <div className="flex items-center gap-1 bg-white/10 rounded-xl p-0.5 border border-white/10">
                      <button
                        type="button"
                        onClick={() =>
                          firstMatchingCartItem && updateQuantity(firstMatchingCartItem.cartId, -1)
                        }
                        className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-white font-mono">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => addItem(item)}
                        className="w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center font-bold"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addItem(item)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-amber-500 hover:text-neutral-950 text-white text-xs font-bold font-outfit border border-white/10 transition-all flex items-center gap-1"
                    >
                      <Plus size={13} />
                      <span>הוסף</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

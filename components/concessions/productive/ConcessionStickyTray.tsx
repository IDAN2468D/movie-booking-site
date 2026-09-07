'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronUp, ChevronDown, CheckCircle2, QrCode, X, Trash2 } from 'lucide-react';
import { DeliveryMode } from '@/lib/types/concession-productive';
import { useProductiveConcessionStore } from '@/lib/store/productiveConcessionStore';

export const ConcessionStickyTray: React.FC = () => {
  const cart = useProductiveConcessionStore((state) => state.cart);
  const deliveryMode = useProductiveConcessionStore((state) => state.deliveryMode);
  const setDeliveryMode = useProductiveConcessionStore((state) => state.setDeliveryMode);
  const updateQuantity = useProductiveConcessionStore((state) => state.updateQuantity);
  const clearCart = useProductiveConcessionStore((state) => state.clearCart);

  const [isExpanded, setIsExpanded] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<{ id: string } | null>(null);

  const totalItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalPrice = cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const totalCalories = cart.reduce((acc, curr) => acc + curr.calories * curr.quantity, 0);
  const vatAmount = Math.round(totalPrice * 0.18);

  if (totalItemsCount === 0 && !orderConfirmed) return null;

  const handleCheckout = () => {
    const randomId = `CINE-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderConfirmed({ id: randomId });
    clearCart();
    setIsExpanded(false);
  };

  return (
    <>
      {/* Sticky Bottom Floating Bar */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 sm:w-96 z-40" dir="rtl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-3xl bg-neutral-950/90 border border-amber-500/40 p-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-3"
        >
          {/* Main Top Header Line */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2.5 text-right"
            >
              <div className="relative w-9 h-9 rounded-2xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                <ShoppingBag size={18} />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cyan-400 text-neutral-950 text-[10px] font-black flex items-center justify-center font-mono">
                  {totalItemsCount}
                </span>
              </div>
              <div>
                <div className="text-sm font-bold text-white font-outfit flex items-center gap-1.5">
                  <span>המגש הסינמטי שלך</span>
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </div>
                <div className="text-[11px] text-neutral-400 font-inter">
                  סה״כ ₪{totalPrice} • {totalCalories} קל׳ (מע״מ 18% כלול)
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleCheckout}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold text-xs font-outfit shadow-md flex items-center gap-1.5 transition-all"
            >
              <span>סיום והזמנה ⚡</span>
            </button>
          </div>

          {/* Delivery Mode Toggle Pill */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setDeliveryMode('COUNTER_EXPRESS')}
              className={`py-1 rounded-lg font-outfit transition-all ${
                deliveryMode === 'COUNTER_EXPRESS'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ⚡ איסוף אקספרס בדלפק
            </button>
            <button
              type="button"
              onClick={() => setDeliveryMode('IN_SEAT')}
              className={`py-1 rounded-lg font-outfit transition-all ${
                deliveryMode === 'IN_SEAT'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              💺 משלוח ישיר למושב
            </button>
          </div>

          {/* Expanded Drawer List */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-2 border-t border-white/10 space-y-2 max-h-56 overflow-y-auto"
              >
                {cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex items-center justify-between text-xs p-1.5 rounded-xl bg-white/5"
                  >
                    <div>
                      <div className="font-bold text-white truncate max-w-[170px]">{item.name}</div>
                      {item.selectedSpice && (
                        <span className="text-[10px] text-amber-300">תבלין: {item.selectedSpice}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-400 font-bold">₪{item.price * item.quantity}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartId, -1)}
                          className="w-5 h-5 rounded bg-white/10 text-white flex items-center justify-center font-mono"
                        >
                          -
                        </button>
                        <span className="w-4 text-center font-mono font-bold text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartId, 1)}
                          className="w-5 h-5 rounded bg-amber-500 text-neutral-950 flex items-center justify-center font-mono font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full text-center text-[11px] text-neutral-400 hover:text-red-400 py-1 flex items-center justify-center gap-1"
                >
                  <Trash2 size={12} />
                  <span>רוקן מגש</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {orderConfirmed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-950 border border-amber-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-white font-outfit">ההזמנה נקלטה במטבח הסינמטי!</h3>
              <p className="text-xs text-neutral-400 font-inter">
                {deliveryMode === 'COUNTER_EXPRESS'
                  ? 'ההזמנה מוכנה לאיסוף בדלפק אקספרס בתוך 3 דקות'
                  : 'שליח סינמטי מיוחד יגיע ישירות למושבך באולם 04'}
              </p>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 font-mono text-amber-300 font-bold text-sm tracking-wider flex items-center justify-center gap-2">
                <QrCode size={18} />
                <span>{orderConfirmed.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setOrderConfirmed(null)}
                className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                סגור אישור
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoloCartItem } from '@/lib/types/concession';
import { submitHoloConcessionOrder } from '@/lib/actions/concession-actions';

interface ConcessionCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: HoloCartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onClearCart: () => void;
}

export const ConcessionCartDrawer: React.FC<ConcessionCartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onClearCart
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ orderId: string } | null>(null);

  const totalPrice = cart.reduce((acc, item) => acc + item.item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);

    const payload = {
      items: cart.map((i) => ({ itemId: i.item.id, quantity: i.quantity, price: i.item.price })),
      totalPrice
    };

    const res = await submitHoloConcessionOrder(payload);
    setSubmitting(false);

    if (res.success && res.data) {
      setOrderResult({ orderId: res.data.orderId });
      onClearCart();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-neutral-950/90 backdrop-blur-[40px] border-l border-white/10 z-50 p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            dir="rtl"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <h2 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
                  <span>🛒</span> המגש ההולוגרפי שלי
                </h2>
                <button onClick={onClose} className="text-neutral-400 hover:text-white p-2 text-lg">
                  ✕
                </button>
              </div>

              {orderResult ? (
                <div className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-3">
                  <span className="text-5xl">✨</span>
                  <h3 className="text-lg font-bold font-outfit text-cyan-300">ההזמנה נקלטה בהצלחה!</h3>
                  <p className="text-xs text-neutral-300 font-inter">
                    מספר הזמנה הולוגרפי: <span className="font-mono text-amber-400 font-bold">{orderResult.orderId}</span>
                  </p>
                  <p className="text-[11px] text-neutral-400">המשקאות והמזנון יוכנו למקומך באולם.</p>
                  <button
                    onClick={() => setOrderResult(null)}
                    className="mt-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-outfit border border-cyan-500/30"
                  >
                    סגור אישור
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-16 text-neutral-500 font-inter text-sm space-y-2">
                  <div className="text-4xl">🍿</div>
                  <p>המגש ההולוגרפי שלך עדיין ריק.</p>
                  <p className="text-xs text-neutral-600">בחר מוצר והוסף אותו לתצוגה.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.map((cartItem) => (
                    <div
                      key={cartItem.item.id}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{cartItem.item.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-white font-outfit">{cartItem.item.name}</div>
                          <div className="text-xs text-amber-400 font-mono">₪{cartItem.item.price}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-white/10 rounded-xl px-2 py-1">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.item.id, -1)}
                          className="text-neutral-300 hover:text-white px-1 font-bold"
                        >
                          -
                        </button>
                        <span className="text-xs text-white font-mono font-bold w-4 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.item.id, 1)}
                          className="text-neutral-300 hover:text-white px-1 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!orderResult && cart.length > 0 && (
              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400 font-inter">סה"כ לתשלום במזנון:</span>
                  <span className="text-2xl font-bold font-outfit text-amber-400">₪{totalPrice}</span>
                </div>

                <button
                  disabled={submitting}
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-2xl font-outfit font-semibold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] disabled:opacity-50"
                >
                  {submitting ? 'שולח הזמנה קוואנטית...' : '⚡ אשר והזמן למקום באולם'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

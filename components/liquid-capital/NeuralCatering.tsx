'use client';

import React, { useState, useOptimistic, startTransition } from 'react';
import { Brain, Sparkles, ShoppingBag, Send } from 'lucide-react';
import { updateDeliveryPhaseAction, placeCateringOrder } from '@/lib/actions/catering';
import { useBookingStore } from '@/lib/store';
import {
  useCateringCart,
  useCateringAllergies,
  useCateringActions,
  CateringCartItem
} from '@/lib/store/catering-store';
import { PhaseSelector } from './catering/PhaseSelector';
import { IngredientFilter } from './catering/IngredientFilter';
import { CateringGrid, CateringMenuItem } from './catering/CateringGrid';
import { GroupComboSync } from './catering/GroupComboSync';

const MENU_ITEMS: CateringMenuItem[] = [
  { id: '1', name: 'אספרסו כפול', price: 15, description: 'פולי קפה מובחרים לריכוז מקסימלי', category: 'משקאות', allergens: [] },
  { id: '2', name: 'טראפל שוקולד מריר', price: 25, description: 'שוקולד בלגי 70% עם שברי אגוזי לוז', category: 'קינוחים', allergens: ['nuts', 'dairy'] },
  { id: '3', name: 'נקטר אנרגיה ביומטרי', price: 28, description: 'מיץ פירות טבעי מועשר בויטמינים', category: 'משקאות', allergens: ['sugar'] },
  { id: '4', name: 'נאצ׳וס חריף אש', price: 35, description: 'טורטיות תירס עם רוטב גבינה מותכת', category: 'חטיפים', allergens: ['gluten', 'dairy'] },
  { id: '5', name: 'פופקורן ניאון', price: 22, description: 'פופקורן פרימיום בחמאה כחולה זוהרת', category: 'חטיפים', allergens: [] }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NeuralCatering = ({ initialCatering = [] }: { initialCatering?: any[] }) => {
  const cart = useCateringCart();
  const selectedAllergies = useCateringAllergies();
  const { addToCart, removeFromCart, updateCartItemPhase, setAllergyTokens } = useCateringActions();
  const { selectedSeats } = useBookingStore();

  const [biometricActive, setBiometricActive] = useState(false);

  // React 19 useOptimistic for immediate phase updates
  const [optimisticCart, setOptimisticCart] = useOptimistic(
    cart,
    (state: CateringCartItem[], update: { itemId: string; phase: 'Trailers' | 'Act 1' | 'Climax' }) =>
      state.map((item) => (item.id === update.itemId ? { ...item, phase: update.phase } : item))
  );

  const handlePhaseChange = async (itemId: string, phase: 'Trailers' | 'Act 1' | 'Climax') => {
    // Optimistic transition
    startTransition(() => {
      setOptimisticCart({ itemId, phase });
    });
    
    // Server action persistence
    await updateDeliveryPhaseAction({
      orderId: initialCatering[0]?._id || 'mock-order-id',
      itemIdx: MENU_ITEMS.findIndex((m) => m.id === itemId) || 0,
      phase
    });

    // Update Zustand state
    updateCartItemPhase(itemId, phase);
  };

  const handleAllergyToggle = (allergy: string) => {
    const updated = selectedAllergies.includes(allergy)
      ? selectedAllergies.filter((a) => a !== allergy)
      : [...selectedAllergies, allergy];
    setAllergyTokens(updated);
  };

  const toggleBiometricSync = () => {
    setBiometricActive(!biometricActive);
    if (!biometricActive) {
      setAllergyTokens(['nuts']); // default profile allergy
    } else {
      setAllergyTokens([]);
    }
  };

  // Filter items matching selected allergies (allergen free menu)
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    if (selectedAllergies.length === 0) return true;
    return !item.allergens.some((a) => selectedAllergies.includes(a));
  });

  const cartTotal = optimisticCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="w-full space-y-8 text-right">
      <div className="flex items-center gap-5 justify-end relative group">
        <div>
          <h2 className="text-3xl font-black tracking-tighter font-outfit text-white">
            Specular <span className="text-[#00f2fe]">Catering</span> Pipeline
          </h2>
          <p className="text-white/50 text-xs tracking-wider uppercase mt-1">
            חווית הסעדה ביומטרית מתוזמנת
          </p>
        </div>
        <div className="relative flex items-center justify-center p-2">
          <Brain className="w-8 h-8 text-[#00f2fe]" />
          <Sparkles className="w-4 h-4 text-white absolute -top-1 -right-1 z-20 animate-pulse" />
        </div>
      </div>

      <GroupComboSync activeSeats={selectedSeats} />

      <IngredientFilter
        selectedAllergies={selectedAllergies}
        onChange={handleAllergyToggle}
        biometricActive={biometricActive}
        onBiometricToggle={toggleBiometricSync}
      />

      <CateringGrid
        items={filteredMenuItems}
        cart={optimisticCart}
        onAdd={(item) => addToCart({ id: item.id, name: item.name, price: item.price, allergens: item.allergens })}
      />

      {optimisticCart.length > 0 && (
        <div className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-3xl p-6" style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 justify-end">
            <span>סל הזמנות למושב</span>
            <ShoppingBag className="w-5 h-5 text-[#00f2fe]" />
          </h3>
          <div className="space-y-4">
            {optimisticCart.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-4 justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5">
                <PhaseSelector
                  itemId={item.id}
                  currentPhase={item.phase}
                  onChange={(phase) => handlePhaseChange(item.id, phase)}
                />
                <div className="flex justify-between items-center w-full md:w-auto gap-6 flex-row-reverse">
                  <div>
                    <span className="font-bold text-white text-sm block">{item.name}</span>
                    <span className="text-xs text-white/50 block">כמות: {item.quantity}</span>
                  </div>
                  <span className="text-[#00f2fe] font-bold">₪{(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 text-xs font-bold cursor-pointer">הסר</button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center border-t border-white/10 pt-4 flex-row-reverse">
              <span className="text-xl font-bold text-white">סה״כ לתשלום: ₪{cartTotal.toFixed(2)}</span>
              <button 
                onClick={async () => {
                  const orderId = initialCatering[0]?._id;
                  if (orderId) {
                    const res = await placeCateringOrder(orderId);
                    if (res.success) {
                      alert("ההזמנה שוגרה למקרן והיא בדרך למושב!");
                    } else {
                      alert(res.error || "שגיאה בשיגור ההזמנה");
                    }
                  } else {
                    alert("לא נמצא מזהה הזמנה פעילה לסנכרון");
                  }
                }}
                className="bg-[#00f2fe] text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#4facfe] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,242,254,0.4)]"
              >
                <span>שגר הזמנה למקרן</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

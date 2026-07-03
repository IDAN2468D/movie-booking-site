'use client';

import React, { useActionState } from 'react';
import { Users, Loader2 } from 'lucide-react';
import { parseGroupComboAction } from '@/lib/actions/catering';
import { useCateringGroupSeats, useCateringActions } from '@/lib/store/catering-store';

const COMBOS = [
  { id: 'duo-quantum', name: 'קומבו קוונטום זוגי', price: 120, desc: 'פופקורן ענק, 2 שתייה גדולים ונאצוס' },
  { id: 'quad-multiverse', name: 'קומבו מולטיוורס מרובע', price: 240, desc: '2 פופקורן ענק, 4 שתייה וקינוח צורוס' }
];

export const GroupComboSync: React.FC<{ activeSeats: string[] }> = ({ activeSeats }) => {
  const groupSeats = useCateringGroupSeats();
  const { setGroupSeats, addToCart } = useCateringActions();

  // React 19 useActionState for group combo parsing
  const [result, formAction, isPending] = useActionState(
    async (_state: any, formData: FormData) => {
      const comboId = formData.get('comboId') as string;
      
      const payload = {
        comboId,
        seatCount: activeSeats.length || 1,
        seats: activeSeats.length > 0 ? activeSeats : ['A-12']
      };

      const res = await parseGroupComboAction(payload);
      if (res.success && res.data) {
        // Add split items to cart
        addToCart({
          id: comboId,
          name: res.data.comboName,
          price: res.data.pricePerSeat,
          allergens: []
        });
        return { success: true, message: `פוצל בהצלחה! סה"כ למושב: ₪${res.data.pricePerSeat.toFixed(2)}` };
      } else {
        return { success: false, error: res.error || 'Failed to split combo' };
      }
    },
    null
  );

  React.useEffect(() => {
    if (activeSeats.length > 0) {
      setGroupSeats(activeSeats);
    }
  }, [activeSeats, setGroupSeats]);

  return (
    <div className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-3xl p-6 text-right" style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}>
      <div className="flex items-center justify-between mb-4 flex-row-reverse">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>פיצול קומבו קבוצתי</span>
          <Users className="w-5 h-5 text-[#00f2fe]" />
        </h3>
        <span className="text-xs text-white/50">{activeSeats.length} מושבים מסונכרנים</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COMBOS.map((combo) => (
          <form key={combo.id} action={formAction} className="bg-black/20 p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
            <input type="hidden" name="comboId" value={combo.id} />
            <div className="mb-4">
              <h4 className="font-bold text-white text-sm">{combo.name}</h4>
              <p className="text-xs text-white/50 mt-1">{combo.desc}</p>
            </div>
            
            <div className="flex justify-between items-center mt-auto flex-row-reverse">
              <span className="text-lg font-extrabold text-[#00f2fe]">₪{combo.price}</span>
              <button
                type="submit"
                disabled={isPending}
                className="bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 hover:bg-[#00f2fe] hover:text-black px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'פצל למושבים'}
              </button>
            </div>
          </form>
        ))}
      </div>

      {result && (
        <div className={`mt-4 p-3 rounded-xl text-xs font-bold text-center ${result.success ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {result.success ? result.message : result.error}
        </div>
      )}
    </div>
  );
};

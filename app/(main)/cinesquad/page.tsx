'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, Film, Clock, Sparkles } from 'lucide-react';
import { createSquadRoom } from '@/lib/actions/cinesquadActions';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

export default function CineSquadLandingPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    const res = await createSquadRoom({
      hostUserId: 'user-me',
      hostName: 'עידן (אתה)',
      movieId: '693134',
      movieTitle: 'חולית: חלק 2',
      showtimeId: 'st-dune-1',
      showtimeLabel: 'היום בשעה 21:00',
      hallName: 'אולם VIP אקוסטי 1',
    });

    if (res.success && res.data) {
      router.push(`/cinesquad/${res.data.roomId}`);
    } else {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-12 py-8 space-y-8 text-right" dir="rtl">
      {/* Hero */}
      <div className="p-6 md:p-12 rounded-[40px] bg-black/60 backdrop-blur-3xl border border-primary/25 shadow-[0_25px_80px_rgba(255,159,10,0.2)] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary text-xs font-black">
            <Users size={16} />
            <span>CineSquad Smart Split & Sync</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white font-rubik">
            הזמנה קבוצתית ופיצול תשלומים חכם
          </h1>
          <p className="text-sm text-off-white/70 max-w-2xl">
            פותחים חדר סקוואד, מזמינים חברים עם קישור מהיר, בוחרים מושבים סמוכים ומפצלים את התשלום ומוצרי המזנון באופן שקוף ומדויק.
          </p>
        </div>

        <button
          disabled={isCreating}
          onClick={handleCreateRoom}
          className="px-8 py-5 rounded-2xl bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 text-black font-black text-base shadow-[0_0_30px_rgba(255,159,10,0.5)] transition-all active:scale-95 flex items-center gap-3 shrink-0"
        >
          {isCreating ? (
            <LoadingIndicator variant="spinner" size={24} color="#000000" label="פותח חדר סקוואד..." />
          ) : (
            <>
              <Plus size={22} />
              <span>צור חדר סקוואד חדש</span>
            </>
          )}
        </button>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Users size={24} />
          </div>
          <h3 className="text-lg font-black text-white font-rubik">נעילת מושבים בסנכרון חי</h3>
          <p className="text-xs text-off-white/60 leading-relaxed">
            רואים מי יושב איפה בזמן אמת ותופסים מושבים רציפים בקלות בלי סרבול.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock size={24} />
          </div>
          <h3 className="text-lg font-black text-white font-rubik">פיצול חשבון אישי ומזנון</h3>
          <p className="text-xs text-off-white/60 leading-relaxed">
            כל חבר משלם על הכרטיס שלו והנשנושים שהוא הזמין בלחיצה אחת.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles size={24} />
          </div>
          <h3 className="text-lg font-black text-white font-rubik">קישור הצטרפות מיידי ו-QR</h3>
          <p className="text-xs text-off-white/60 leading-relaxed">
            משתפים את הקישור בוואטסאפ או סורקים QR והחברים כבר בפנים.
          </p>
        </div>
      </div>
    </div>
  );
}

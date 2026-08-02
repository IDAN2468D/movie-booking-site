import { Metadata } from 'next';
import { SeatingGameContainer } from '@/components/booking/seating-game/SeatingGameContainer';
import Link from 'next/link';
import { ArrowRight, Film } from 'lucide-react';

export const metadata: Metadata = {
  title: 'משחק סידור מושבים - CinePulse',
  description: 'סדרו את החברים במושבי הקולנוע והגיעו להרמוניה קבוצתית מרבית',
};

export default function SeatingGamePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500 selection:text-slate-950">
      {/* Container constraint */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation / Breadcrumb */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4" dir="rtl">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <Film className="w-4 h-4 text-cyan-400" />
              <span>CinePulse</span>
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-xs font-medium text-slate-300">משחק סידור מושבים</span>
          </div>

          <Link
            href="/booking"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-all border border-slate-800 hover:border-slate-700 shadow-md"
          >
            <ArrowRight className="w-4 h-4" />
            <span>חזרה להזמנת כרטיסים</span>
          </Link>
        </div>

        {/* Game Container */}
        <SeatingGameContainer />
      </div>
    </main>
  );
}

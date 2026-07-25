import React from 'react';
import { Metadata } from 'next';
import { TactileResonanceContainer } from '@/src/components/haptic/TactileResonanceContainer';

export const metadata: Metadata = {
  title: 'מרכז התהודה ההפטי | קולנוע עתידני',
  description: 'כיול תהודה אקוסטית בתדרים נמוכים ופעימות מגע הפטיות לצפייה בקולנוע',
};

export default function HapticPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-neutral-950 text-slate-100 flex flex-col justify-center">
      <TactileResonanceContainer />
    </main>
  );
}

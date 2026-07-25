import React from 'react';
import { Metadata } from 'next';
import { BiometricAuraChamberContainer } from '@/src/components/aura/BiometricAuraChamberContainer';

export const metadata: Metadata = {
  title: 'תא האורה הביומטרי | קולנוע עתידני',
  description: 'סריקת אורה ביומטרית ודופק אקוסטי להתאמת חוויות צפייה קולנועיות מותאמות אישית',
};

export default function AuraChamberPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-neutral-950 text-slate-100 flex flex-col justify-center">
      <BiometricAuraChamberContainer />
    </main>
  );
}

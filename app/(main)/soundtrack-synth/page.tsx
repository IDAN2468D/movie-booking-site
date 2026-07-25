import React from 'react';
import { Metadata } from 'next';
import { QuantumPersonaSoundtrackSynthContainer } from '@/src/components/synth/QuantumPersonaSoundtrackSynthContainer';

export const metadata: Metadata = {
  title: 'סנתזטור פסקול קוונטי | קולנוע עתידני',
  description: 'סנתזטור פסקול נוירונים קוונטי בזמן אמת לחוויית מוזיקה קולנועית מותאמת אישית',
};

export default function SoundtrackSynthPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-neutral-950 text-slate-100 flex flex-col justify-center">
      <QuantumPersonaSoundtrackSynthContainer />
    </main>
  );
}

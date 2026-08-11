import React from 'react';
import ElectricBorderShowcaseView from '@/components/showcase/ElectricBorderShowcaseView';

export const metadata = {
  title: 'סטודיו גבול חשמלי & אינדיקטורים | CinePulse',
  description: 'הדגמה אינטראקטיבית של אפקט הגבול החשמלי ואינדיקטורי טעינה מואצי GPU',
};

export default function ElectricBorderPage() {
  return (
    <main className="min-h-screen pt-12 pb-24 px-4 md:px-10 bg-[#05070B]" dir="rtl">
      <ElectricBorderShowcaseView />
    </main>
  );
}

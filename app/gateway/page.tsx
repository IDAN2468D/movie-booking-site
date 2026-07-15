import React from 'react';
import { getGatewayFeaturesAction } from '@/app/actions/gatewayActions';
import GatewayHero from '@/components/gateway/GatewayHero';
import FeaturesGrid from '@/components/gateway/FeaturesGrid';

export const metadata = {
  title: 'Cinema AI Gateway | שער הקולנוע החכם',
  description: 'חווית הזמנת סרטים מבוססת בינה מלאכותית, גילוי נוירוני וכרטיסים קינטיים.',
};

export default async function GatewayPage() {
  const featuresRes = await getGatewayFeaturesAction();
  const features = featuresRes.success && featuresRes.data ? featuresRes.data : [];

  return (
    <main className="min-h-screen bg-[#020203] text-white overflow-x-hidden">
      <GatewayHero 
        title="Cinema AI Gateway" 
        subtitle="שער הכניסה לחוויית הקולנוע העתידנית שלך. חפש סרטים, נהל כרטיסים וגלה תוכן מותאם אישית באמצעות בינה מלאכותית." 
      />
      <FeaturesGrid features={features} />
    </main>
  );
}

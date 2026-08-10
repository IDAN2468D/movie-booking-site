'use client';

import React from 'react';
import { GradientBorderContainer } from './GradientBorderContainer';
import { GradientBorderCard } from './GradientBorderCard';
import { Sparkles, Volume2, Users, Cpu } from 'lucide-react';

export const GradientBorderShowcase: React.FC = () => {
  const cards = [
    {
      id: 'spatial-audio',
      title: 'סאונד מרחבי Dolby Atmos',
      description: 'חוויית אודיו תלת-ממדית בתדר 35Hz-50Hz המתכווננת דינמית לפי מיקום הישיבה באולם.',
      badge: 'Spatial 3D',
      icon: <Volume2 className="w-5 h-5 text-blue-400" />,
      buttonText: 'הפעל תדר ניסיון',
      glowColor1: 'rgba(59, 130, 246, 0.95)',
      glowColor2: 'rgba(147, 51, 234, 0.8)',
    },
    {
      id: 'cinematch-ar',
      title: 'CineMatch AR Group',
      description: 'סריקת Vibe קבוצתית ובינה מלאכותית הממליצה על הסרט האופטימלי לכל החבורה.',
      badge: 'AI Matchmaker',
      icon: <Users className="w-5 h-5 text-purple-400" />,
      buttonText: 'צור קבוצה חדשה',
      glowColor1: 'rgba(168, 85, 247, 0.95)',
      glowColor2: 'rgba(236, 72, 153, 0.8)',
    },
    {
      id: 'bio-sync',
      title: 'Bio-Sync Haptic Seat',
      description: 'סנכרון תדר דופק ביומטרי למושב VIP רוטט בזמן אמת לפי סצינות האקשן בסרט.',
      badge: 'Biometric VIP',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      buttonText: 'חיבור חיישן ביומטרי',
      glowColor1: 'rgba(6, 182, 212, 0.95)',
      glowColor2: 'rgba(59, 130, 246, 0.8)',
    },
    {
      id: 'screenplay-ai',
      title: 'סימולטור תסריט What-If',
      description: 'השפעה בזמן אמת על קווי העלילה בסרט בעזרת מודל Gemini 3.5 Flash-Lite.',
      badge: 'Gemini AI',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      buttonText: 'התחל סימולציה',
      glowColor1: 'rgba(245, 158, 11, 0.95)',
      glowColor2: 'rgba(239, 68, 68, 0.8)',
    },
  ];

  return (
    <section className="w-full py-12 px-4 dir-rtl bg-slate-950/60 rounded-3xl border border-slate-800/80 my-8 shadow-2xl">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          CINEPULSE LABS
        </span>
        <h2 className="text-2xl font-black text-white mt-3 mb-2 tracking-tight">
          חוויית קולנוע עתידנית עם גבולות זוהרים
        </h2>
        <p className="text-sm text-slate-400">
          הזז את העכבר מעל הכרטיסים לצפייה באפקט ה-Gradient Border העוקב אחר הסמן בזמן אמת
        </p>
      </div>

      <GradientBorderContainer>
        {cards.map((card) => (
          <GradientBorderCard
            key={card.id}
            title={card.title}
            description={card.description}
            badge={card.badge}
            icon={card.icon}
            buttonText={card.buttonText}
            glowColor1={card.glowColor1}
            glowColor2={card.glowColor2}
            onAction={() => console.log(`Card action clicked: ${card.id}`)}
          />
        ))}
      </GradientBorderContainer>
    </section>
  );
};

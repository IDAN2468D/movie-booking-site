import React from 'react';
import { Zap, Heart, Compass, Smile, Eye, Clapperboard } from 'lucide-react';

export interface MoodOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  desc: string;
  recommended: string[];
}

export const MOODS: MoodOption[] = [
  {
    id: 'israeli',
    label: 'קולנוע ישראלי וקלאסיקות',
    icon: Clapperboard,
    accent: 'from-blue-600/20 to-sky-500/30 text-sky-400 border-sky-500/40',
    desc: 'יצירות מופת ישראליות, קומדיות בורקס ודרמות זוכות פרסים',
    recommended: ['לשחרר את שולי', 'גבעת חלפון אינה עונה', 'אפס ביחסי אנוש', 'הערת שוליים'],
  },
  {
    id: 'action',
    label: 'אקשן ואדרנלין',
    icon: Zap,
    accent: 'from-amber-500/20 to-rose-500/30 text-amber-400 border-amber-500/40',
    desc: 'קצב דופק מהיר, פיצוצים וסאונד היקפי ב-4K',
    recommended: ['חולית: חלק 2', 'דדפול & וולברין'],
  },
  {
    id: 'romance',
    label: 'דייט ורומנטיקה',
    icon: Heart,
    accent: 'from-pink-500/20 to-rose-500/30 text-pink-400 border-pink-500/40',
    desc: 'חוויה זוגית עוטפת, מושבי VIP ואווירה אינטימית',
    recommended: ['רק לא אתה', 'לה לה לנד'],
  },
  {
    id: 'scifi',
    label: 'מד"ב וחלל עמוק',
    icon: Compass,
    accent: 'from-cyan-500/20 to-blue-500/30 text-cyan-400 border-cyan-500/40',
    desc: 'מסע בין ממדים, ויזואליה עוצרת נשימה והרמוניות סאב-באס',
    recommended: ['בין כוכבים', 'מטריקס: התחייה'],
  },
  {
    id: 'thriller',
    label: 'מתח ומסתורין',
    icon: Eye,
    accent: 'from-purple-500/20 to-indigo-500/30 text-purple-400 border-purple-500/40',
    desc: 'תעלומות מפותלות, סצנות חשוכות ועצירת נשימה',
    recommended: ['אופנהיימר', 'שאטר איילנד'],
  },
  {
    id: 'comedy',
    label: 'צחוק וקלילות',
    icon: Smile,
    accent: 'from-emerald-500/20 to-teal-500/30 text-emerald-400 border-emerald-500/40',
    desc: 'הומור משחרר, פופקורן ענק ומצב רוח מרומם',
    recommended: ['הקול בראש 2', 'קונג פו פנדה 4'],
  },
];

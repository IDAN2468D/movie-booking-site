'use server';

import { TrophyVaultState, TrophyItem } from '../validations/trophy-vault-schema';

const DEMO_TROPHIES: TrophyItem[] = [
  {
    id: 't-1',
    title: 'סינפיל ונגארד',
    description: 'השלמת 10 הזמנות IMAX ברצף במערכת ה-Liquid Glass 4.0',
    rarity: 'אגדי',
    iconName: 'Crown',
    unlockedAt: '2026-07-20',
    glowColor: '#F59E0B',
  },
  {
    id: 't-2',
    title: 'מאסטר קואופ זוגי',
    description: 'הגעת ל-100% Vibe Match במצב ה-Co-op Swipe Deck',
    rarity: 'אפי',
    iconName: 'Users',
    unlockedAt: '2026-07-22',
    glowColor: '#EC4899',
  },
  {
    id: 't-3',
    title: 'מאסטרו אקוסטיקה',
    description: 'חקרת את ערוצי ה-Web Audio Resonance והסאונדטרק הנוירוני',
    rarity: 'נדיר',
    iconName: 'Disc3',
    unlockedAt: '2026-07-23',
    glowColor: '#6366F1',
  },
  {
    id: 't-4',
    title: 'נווט קולי AI',
    description: 'ביצעת ניווט חופשי ללא מגע ידים בעזרת המעטפת הקולית',
    rarity: 'אפי',
    iconName: 'Mic',
    unlockedAt: '2026-07-23',
    glowColor: '#06B6D4',
  },
];

export async function getUserTrophyVault(): Promise<{
  success: boolean;
  data?: TrophyVaultState;
  error?: string;
}> {
  try {
    const vaultState: TrophyVaultState = {
      totalUnlocked: DEMO_TROPHIES.length,
      totalTrophies: 6,
      trophies: DEMO_TROPHIES,
    };
    return { success: true, data: vaultState };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'שגיאה שטעינת כספת הגביעים';
    return { success: false, error: msg };
  }
}

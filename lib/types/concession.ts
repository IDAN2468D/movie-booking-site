export interface FlavorProfile {
  sweet: number;
  salty: number;
  umami: number;
  cyberSpice: number;
  subZero: number;
}

export interface HoloConcessionItem {
  id: string;
  name: string;
  nameEn: string;
  category: "popcorn" | "drink" | "snack" | "combo";
  price: number;
  description: string;
  holoColor: string;
  glowHex: string;
  energyKcal: number;
  flavor: FlavorProfile;
  recommendedGenres: string[];
  icon: string;
}

export interface HoloCartItem {
  item: HoloConcessionItem;
  quantity: number;
  selectedFlavorNotes?: string[];
}

export const MOCK_HOLO_CONCESSIONS: HoloConcessionItem[] = [
  {
    id: "holo-popcorn-neon",
    name: "פופקורן נאון קרמל-מלח ים",
    nameEn: "Neon Caramel & Sea Salt Popcorn",
    category: "popcorn",
    price: 38,
    description: "גרגיר זהב מוקרם בשילוב תמצית מלח ים אטלנטי וגבישי נאון מתוקים.",
    holoColor: "from-amber-400 via-yellow-300 to-amber-500",
    glowHex: "#f59e0b",
    energyKcal: 420,
    flavor: { sweet: 85, salty: 60, umami: 20, cyberSpice: 15, subZero: 0 },
    recommendedGenres: ["Sci-Fi", "Action", "Animation"],
    icon: "🍿"
  },
  {
    id: "holo-nitro-cola",
    name: "ניטרו קולה סאב-זירו 4D",
    nameEn: "Sub-Zero Nitro Cola 4D",
    category: "drink",
    price: 26,
    description: "משקה קולה קואנטי מועשר בחנקן נוזלי, בועות פוספור וקיובי קריסטל מוזהב.",
    holoColor: "from-cyan-400 via-blue-500 to-indigo-600",
    glowHex: "#06b6d4",
    energyKcal: 180,
    flavor: { sweet: 70, salty: 0, umami: 0, cyberSpice: 40, subZero: 95 },
    recommendedGenres: ["Action", "Thriller", "Horror"],
    icon: "🥤"
  },
  {
    id: "holo-truffle-nachos",
    name: "נאצ'וס קוונטום טראפל & גבינת לייזר",
    nameEn: "Quantum Truffle & Laser Cheese Nachos",
    category: "snack",
    price: 44,
    description: "משולשי תירס פריכים מותזים בשמן כמהין שחור ורוטב גבינת חלקיקים חריפה.",
    holoColor: "from-amber-500 via-orange-500 to-red-600",
    glowHex: "#f97316",
    energyKcal: 560,
    flavor: { sweet: 10, salty: 90, umami: 95, cyberSpice: 75, subZero: 0 },
    recommendedGenres: ["Crime", "Drama", "Mystery"],
    icon: "🧀"
  },
  {
    id: "holo-cyber-combo-vip",
    name: "קומבו סייבר-וואן VIP הולוגרפי",
    nameEn: "Cyber-One Holographic VIP Combo",
    category: "combo",
    price: 88,
    description: "פופקורן נאון ענק + 2 משקאות ניטרו סאב-זירו + נאצ'וס טראפל + סוכריות קריסטל אורה.",
    holoColor: "from-purple-500 via-pink-500 to-cyan-400",
    glowHex: "#a855f7",
    energyKcal: 1100,
    flavor: { sweet: 80, salty: 85, umami: 70, cyberSpice: 50, subZero: 60 },
    recommendedGenres: ["Sci-Fi", "Adventure", "Blockbuster"],
    icon: "✨"
  }
];

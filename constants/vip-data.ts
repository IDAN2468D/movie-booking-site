export interface LoyaltyStep {
  id: number;
  badge: string;
  title: string;
  desc: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  color: string;
  borderColor: string;
  glowColor: string;
  badge: string;
  popular?: boolean;
}

export const LOYALTY_STEPS: LoyaltyStep[] = [
  {
    id: 0,
    badge: 'הטבה 1: נשנושים ישירות לכיסא',
    title: 'קומבו גורמה בחינם',
    desc: 'הזמן ישירות באפליקציה וקבל פופקורן גורמה חם ושתייה לבחירתך ללא תור. המלצרים שלנו יגישו לכם את הכיבוד החם ישירות למושב עם הגעתכם לאולם.',
  },
  {
    id: 1,
    badge: 'הטבה 2: הקרנות בכורה',
    title: 'כרטיס IMAX שני בחינם',
    desc: 'בכל הזמנת כרטיס לסרטי IMAX, תקבלו כרטיס שני במתנה לחבר או משפחה. אל תפספסו אף סרט ענק על המסכים הגדולים והמתקדמים ביותר.',
  },
  {
    id: 2,
    badge: 'הטבה 3: שדרוג VIP קבוע',
    title: 'גישה בלעדית לטרקליני VIP',
    desc: 'כחברי מועדון, אתם נהנים מאירוח VIP מלא: כניסה ללא תור לטרקליני הזהב, מושבי מסאז\' מתכווננים, בופה חופשי עשיר, וברים איכותיים לפני תחילת ההקרנה.',
  }
];

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'classic',
    name: 'CLASSIC VIP',
    price: '₪49',
    period: 'חודשי',
    features: ['2 כרטיסי קולנוע בחודש', 'שדרוג פופקורן גדול בכל ביקור', 'צבירת 1.5x נקודות נאמנות', 'הנחה של 10% על כיבוד נוסף'],
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-cyan-500/30',
    glowColor: 'rgba(10,239,255,0.4)',
    badge: 'לחובבי קולנוע'
  },
  {
    id: 'imax',
    name: 'IMAX PRO',
    price: '₪79',
    period: 'חודשי',
    features: ['3 כרטיסי IMAX או תלת-ממד בחודש', 'קומבו פרימיום (פופקורן + קולדה) חינם', 'צבירת 2x נקודות נאמנות', 'שירות משלוח VIP למושב ללא עלות'],
    color: 'from-primary/20 to-purple-500/20',
    borderColor: 'border-primary/50',
    glowColor: 'rgba(255,20,100,0.5)',
    badge: 'בחירת הקהל',
    popular: true
  },
  {
    id: 'neural-elite',
    name: 'NEURAL ELITE',
    price: '₪149',
    period: 'חודשי',
    features: ['גישה בלתי מוגבלת למנוע תגליות נוירוני', 'כניסה חופשית לטרקלין ה-VIP והבופה', 'צבירת 3x נקודות נאמנות', 'הזמנת מושבים מוקדמת מראש (שבוע לפני כולם)'],
    color: 'from-[#00F0FF]/20 to-blue-600/20',
    borderColor: 'border-[#00F0FF]/40',
    glowColor: 'rgba(0,240,255,0.5)',
    badge: 'תודעה קולנועית מושלמת'
  }
];

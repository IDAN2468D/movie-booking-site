import { NormalizedTransaction, OrderStatus, RawOrderInput } from './types';

export const ISRAELI_VAT_RATE = 0.18;

export function cleanCurrencyAmount(val: number | string | undefined | null): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : Math.max(0, val);
  if (!val) return 0;
  const cleaned = String(val)
    .replace(/[₪$€£]/g, '')
    .replace(/ש"ח|שח|NIS|ILS|USD/gi, '')
    .replace(/,/g, '')
    .trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.max(0, num);
}

export function normalizeHebrewTitle(title: string | undefined | null): string {
  if (!title) return 'ללא כותרת';
  // Trim outer spaces and condense multiple spaces without replacing sofit letters (ך ם ן ף ץ)
  return title.trim().replace(/\s+/g, ' ');
}

export function parseDateToIso(dateVal: string | Date | undefined | null): { iso: string; dateObj: Date } {
  const fallback = new Date();
  if (!dateVal) return { iso: fallback.toISOString().split('T')[0], dateObj: fallback };

  if (dateVal instanceof Date) {
    const valid = !isNaN(dateVal.getTime()) ? dateVal : fallback;
    return { iso: valid.toISOString().split('T')[0], dateObj: valid };
  }

  const str = String(dateVal).trim();

  // Handle DD/MM/YYYY or DD.MM.YYYY or DD-MM-YYYY (Israeli Standard)
  const dmyMatch = str.match(/^(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{2,4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    let year = parseInt(dmyMatch[3], 10);
    if (year < 100) year += 2000;
    const d = new Date(year, month, day, 12, 0, 0);
    if (!isNaN(d.getTime())) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return { iso, dateObj: d };
    }
  }

  // Handle GA4 format: YYYYMMDD
  const ga4Match = str.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (ga4Match) {
    const year = parseInt(ga4Match[1], 10);
    const month = parseInt(ga4Match[2], 10) - 1;
    const day = parseInt(ga4Match[3], 10);
    const d = new Date(year, month, day, 12, 0, 0);
    if (!isNaN(d.getTime())) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return { iso, dateObj: d };
    }
  }

  // Standard ISO / native Date string
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return { iso: parsed.toISOString().split('T')[0], dateObj: parsed };
  }

  return { iso: fallback.toISOString().split('T')[0], dateObj: fallback };
}

export function normalizeOrderStatus(rawStatus: string | undefined | null): OrderStatus {
  if (!rawStatus) return 'completed';
  const clean = rawStatus.toLowerCase().trim();
  if (['cancelled', 'canceled', 'refunded', 'בוטל', 'זוכה', 'מבוטל'].includes(clean)) {
    return 'cancelled';
  }
  if (['validated', 'מומש'].includes(clean)) {
    return 'validated';
  }
  return 'completed';
}

export function normalizeRawOrder(raw: RawOrderInput, index: number, vatRate = ISRAELI_VAT_RATE): NormalizedTransaction {
  const { iso, dateObj } = parseDateToIso(raw.date);
  const status = normalizeOrderStatus(raw.status);
  const isCompleted = status === 'completed' || status === 'validated' || status === 'confirmed';
  const grossAmount = cleanCurrencyAmount(raw.amount);
  const netAmount = Math.round((grossAmount / (1 + vatRate)) * 100) / 100;
  const title = normalizeHebrewTitle(raw.movieTitle);
  const user = raw.customerEmail || raw.userId || `guest_${index + 1}`;

  return {
    id: raw.orderId || `order_${index + 1}_${Date.now()}`,
    date: iso,
    rawDate: dateObj,
    movieTitle: title,
    grossAmount,
    netAmount,
    customerIdentifier: user.toLowerCase().trim(),
    status,
    isCompleted,
    quantity: raw.quantity && raw.quantity > 0 ? raw.quantity : 1,
  };
}

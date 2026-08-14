import { StatsAnomaly, TimeSeriesPoint } from './types';

interface HolidaySeason {
  name: string;
  monthRange: number[]; // 1-12
  description: string;
}

const ISRAELI_HOLIDAYS: HolidaySeason[] = [
  { name: 'עונת חגי תשרי (ראש השנה וסוכות)', monthRange: [9, 10], description: 'עלייה בביקוש לצפייה משפחתית בחופשות החג' },
  { name: 'חופשת חנוכה', monthRange: [12], description: 'זינוק בהזמנות סרטי ילדים ונוער במהלך חופשת החג' },
  { name: 'פורים', monthRange: [3], description: 'תקופת אירועים והקרנות מיוחדות בסופי שבוע' },
  { name: 'חופשת פסח', monthRange: [4], description: 'ביקוש שיא שנתי לקולנוע ובידור משפחתי' },
  { name: 'עונת שוברי הקופות של הקיץ', monthRange: [7, 8], description: 'חופשת קיץ עם תפוסה גבוהה לאורך כל ימות השבוע' },
];

export function detectAnomalies(dailySeries: TimeSeriesPoint[]): StatsAnomaly[] {
  if (!dailySeries || dailySeries.length < 3) return [];

  const anomalies: StatsAnomaly[] = [];
  const totalOrders = dailySeries.reduce((s, p) => s + p.completedOrders, 0);
  const avgDailyOrders = totalOrders / dailySeries.length;

  // 1. Spikes & Drop-offs
  dailySeries.forEach((point) => {
    // Spike: > 2.5x average (with minimum volume threshold of 5 orders)
    if (avgDailyOrders >= 2 && point.completedOrders >= 5 && point.completedOrders >= avgDailyOrders * 2.3) {
      anomalies.push({
        id: `spike_${point.period}`,
        type: 'spike',
        date: point.period,
        title: `זינוק חד בהזמנות (${point.completedOrders} הזמנות)`,
        description: `ביום ${point.displayDate} נרשם היקף מכירות הגבוה פי ${(point.completedOrders / avgDailyOrders).toFixed(1)} מהממוצע היומי (${avgDailyOrders.toFixed(1)}).`,
        severity: 'alert',
        metricValue: point.completedOrders,
        expectedValue: Math.round(avgDailyOrders),
      });
    }

    // Cancellation Surge: > 35% cancellations
    const totalDayTrans = point.completedOrders + point.cancelledOrders;
    if (totalDayTrans >= 4 && point.cancelledOrders / totalDayTrans >= 0.35) {
      const rate = Math.round((point.cancelledOrders / totalDayTrans) * 100);
      anomalies.push({
        id: `canc_${point.period}`,
        type: 'cancellation_spike',
        date: point.period,
        title: `שיעור ביטולים חריג (${rate}%)`,
        description: `ביום ${point.displayDate} בוטלו ${point.cancelledOrders} מתוך ${totalDayTrans} עסקאות. מומלץ לבדוק תקינות סליקה.`,
        severity: 'warning',
        metricValue: rate,
      });
    }

    // Drop-off
    if (avgDailyOrders >= 10 && point.completedOrders === 0) {
      anomalies.push({
        id: `drop_${point.period}`,
        type: 'dropoff',
        date: point.period,
        title: `צניחה לאפס הזמנות`,
        description: `ביום ${point.displayDate} לא נקלטו הזמנות כלל למרות ממוצע יומי של ${avgDailyOrders.toFixed(0)} הזמנות.`,
        severity: 'warning',
        metricValue: 0,
        expectedValue: Math.round(avgDailyOrders),
      });
    }
  });

  // 2. Israeli Holiday context check
  const activeMonths = new Set(dailySeries.map((p) => parseInt(p.period.split('-')[1], 10)));
  ISRAELI_HOLIDAYS.forEach((hol) => {
    const overlaps = hol.monthRange.some((m) => activeMonths.has(m));
    if (overlaps && anomalies.length < 6) {
      anomalies.push({
        id: `holiday_${hol.name}`,
        type: 'holiday',
        date: dailySeries[0]?.period || '',
        title: `השפעה עונתית: ${hol.name}`,
        description: hol.description,
        severity: 'info',
      });
    }
  });

  return anomalies.slice(0, 6);
}

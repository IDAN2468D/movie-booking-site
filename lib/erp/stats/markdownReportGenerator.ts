import { ComputedSiteStats } from './types';

export function generateHebrewMarkdownReport(stats: ComputedSiteStats): string {
  const { dateRange, totalCompletedOrders, totalGrossRevenue, totalNetRevenue, averageOrderValue, cancellationRate, topMoviesByOrders, topMoviesByRevenue, retention, anomalies } = stats;

  const header = `דוח ביצועי אתר הסרטים
תקופה: ${dateRange.startDate} עד ${dateRange.endDate}
סה"כ הזמנות: ${totalCompletedOrders.toLocaleString()}
הכנסה ברוטו: ${totalGrossRevenue.toLocaleString()} ש"ח
הכנסה נטו (לפני מע"מ 18%): ${totalNetRevenue.toLocaleString()} ש"ח
ממוצע הזמנה (AOV): ${averageOrderValue.toLocaleString()} ש"ח
שיעור ביטולים: ${cancellationRate}%`;

  const topOrdersRows = topMoviesByOrders
    .map((m, idx) => `| ${idx + 1} | ${m.movieTitle} | ${m.orderCount} | ${m.percentageOfOrders}% | ₪${m.grossRevenue.toLocaleString()} |`)
    .join('\n');

  const topRevRows = topMoviesByRevenue
    .map((m, idx) => `| ${idx + 1} | ${m.movieTitle} | ₪${m.grossRevenue.toLocaleString()} | ${m.percentageOfRevenue}% | ${m.orderCount} |`)
    .join('\n');

  const anomaliesList = anomalies.length > 0
    ? anomalies.map((a) => `- **${a.title}**: ${a.description}`).join('\n')
    : '- לא זוהו חריגות משמעותיות בנתוני התקופה.';

  const retentionSection = retention.totalUniqueCustomers > 0
    ? `### 👥 מדדי שימור לקוחות (Retention)
- סה"כ לקוחות ייחודיים: **${retention.totalUniqueCustomers.toLocaleString()}**
- לקוחות שביצעו יותר מהזמנה אחת: **${retention.customersWithMultipleOrders.toLocaleString()}**
- שיעור לקוחות חוזרים: **${retention.returningCustomerRate}%**
- ממוצע הזמנות ללקוח: **${retention.averageOrdersPerCustomer}**`
    : `### 👥 מדדי שימור לקוחות (Retention)\n- נתוני זיהוי משתמשים אינם זמינים בדוח הנוכחי.`;

  return `# דוח ביצועים וניתוח סטטיסטי - CinePulse

${header}

---

## 🎬 10 הסרטים המובילים לפי כמות הזמנות
| # | שם הסרט | כמות הזמנות | נתח הזמנות | סך הכנסה |
|---|---------|-------------|------------|----------|
${topOrdersRows || '| - | אין נתונים | 0 | 0% | ₪0 |'}

---

## 💰 10 הסרטים המובילים לפי הכנסה כספית
| # | שם הסרט | הכנסה ברוטו | נתח הכנסות | כמות כרטיסים |
|---|---------|-------------|------------|--------------|
${topRevRows || '| - | אין נתונים | ₪0 | 0% | 0 |'}

---

${retentionSection}

---

## ⚡ חריגות, מגמות ואירועים בולטים
${anomaliesList}

---

## 🎯 המלצות לפעולה עסקית
1. **קידום שובר הקופות**: המשך קמפיינים ממוקדים לסרט המוביל (${topMoviesByRevenue[0]?.movieTitle || 'המוביל בקופות'}).
2. **הגברת שימור לקוחות**: הצעת הטבות VIP ומבצעי קומבו פופקורן ללקוחות חדשים לעידוד רכישה חוזרת.
3. **אופטימיזציית שעות שפל**: הפעלת מבצעי Yield / כרטיסים מוזלים בימי שפל שזוהו באנליטיקה.
`;
}

export function generateEnglishMarkdownReport(stats: ComputedSiteStats): string {
  const { dateRange, totalCompletedOrders, totalGrossRevenue, totalNetRevenue, averageOrderValue, cancellationRate, topMoviesByOrders, topMoviesByRevenue, retention } = stats;

  return `# CinePulse Movie Site Performance Report
Period: ${dateRange.startDate} to ${dateRange.endDate}
Total Completed Orders: ${totalCompletedOrders}
Gross Revenue: ₪${totalGrossRevenue.toLocaleString()}
Net Revenue (Excl. 18% VAT): ₪${totalNetRevenue.toLocaleString()}
Average Order Value (AOV): ₪${averageOrderValue.toLocaleString()}
Cancellation Rate: ${cancellationRate}%

## Top Movies by Revenue
${topMoviesByRevenue.map((m, i) => `${i + 1}. ${m.movieTitle} - ₪${m.grossRevenue.toLocaleString()} (${m.percentageOfRevenue}%)`).join('\n')}

## Top Movies by Orders
${topMoviesByOrders.map((m, i) => `${i + 1}. ${m.movieTitle} - ${m.orderCount} orders (${m.percentageOfOrders}%)`).join('\n')}

## Customer Retention Snapshot
- Unique Customers: ${retention.totalUniqueCustomers}
- Returning Customer Rate: ${retention.returningCustomerRate}%
- Average Orders per Customer: ${retention.averageOrdersPerCustomer}
`;
}

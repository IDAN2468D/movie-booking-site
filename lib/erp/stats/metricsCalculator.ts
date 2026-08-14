import { ISRAELI_VAT_RATE } from './normalizer';
import {
  ComputedSiteStats,
  MoviePerformance,
  NormalizedTransaction,
  RetentionMetrics,
  TimeSeriesPoint,
} from './types';

export function calculateSiteStats(
  transactions: NormalizedTransaction[],
  vatRate = ISRAELI_VAT_RATE
): ComputedSiteStats {
  if (!transactions || transactions.length === 0) return createEmptyStats(vatRate);

  const completed = transactions.filter((t) => t.isCompleted);
  const cancelled = transactions.filter((t) => !t.isCompleted);
  const totalCompletedOrders = completed.length;
  const totalCancelledOrders = cancelled.length;
  const totalTransactions = transactions.length;

  const totalGrossRevenue = Math.round(completed.reduce((sum, t) => sum + t.grossAmount, 0) * 100) / 100;
  const totalNetRevenue = Math.round((totalGrossRevenue / (1 + vatRate)) * 100) / 100;
  const averageOrderValue = totalCompletedOrders > 0 ? Math.round((totalGrossRevenue / totalCompletedOrders) * 100) / 100 : 0;
  const cancellationRate = totalTransactions > 0 ? Math.round((totalCancelledOrders / totalTransactions) * 1000) / 10 : 0;

  // Movie aggregation (from completed orders)
  const movieMap = new Map<string, { orders: number; gross: number }>();
  for (const t of completed) {
    const prev = movieMap.get(t.movieTitle) || { orders: 0, gross: 0 };
    movieMap.set(t.movieTitle, { orders: prev.orders + t.quantity, gross: prev.gross + t.grossAmount });
  }

  const allMovies: MoviePerformance[] = Array.from(movieMap.entries()).map(([title, stats]) => ({
    movieTitle: title,
    orderCount: stats.orders,
    grossRevenue: Math.round(stats.gross),
    netRevenue: Math.round((stats.gross / (1 + vatRate)) * 100) / 100,
    percentageOfRevenue: totalGrossRevenue > 0 ? Math.round((stats.gross / totalGrossRevenue) * 1000) / 10 : 0,
    percentageOfOrders: totalCompletedOrders > 0 ? Math.round((stats.orders / totalCompletedOrders) * 1000) / 10 : 0,
  }));

  const topMoviesByOrders = [...allMovies].sort((a, b) => b.orderCount - a.orderCount).slice(0, 10);
  const topMoviesByRevenue = [...allMovies].sort((a, b) => b.grossRevenue - a.grossRevenue).slice(0, 10);

  const { daily, monthly } = groupTimeSeries(transactions, vatRate);
  const retention = computeCustomerRetention(transactions);

  const sortedDates = transactions.map((t) => t.date).sort();
  const startDate = sortedDates[0] || new Date().toISOString().split('T')[0];
  const endDate = sortedDates[sortedDates.length - 1] || new Date().toISOString().split('T')[0];

  return {
    dateRange: { startDate, endDate },
    totalCompletedOrders,
    totalCancelledOrders,
    totalTransactions,
    totalGrossRevenue,
    totalNetRevenue,
    averageOrderValue,
    cancellationRate,
    vatRate,
    topMoviesByOrders,
    topMoviesByRevenue,
    timeSeriesDaily: daily,
    timeSeriesMonthly: monthly,
    retention,
    anomalies: [],
  };
}

function groupTimeSeries(transactions: NormalizedTransaction[], vatRate: number) {
  const dailyMap = new Map<string, { comp: number; canc: number; gross: number }>();
  const monthlyMap = new Map<string, { comp: number; canc: number; gross: number }>();

  for (const t of transactions) {
    const day = t.date;
    const month = t.date.slice(0, 7);

    const dPrev = dailyMap.get(day) || { comp: 0, canc: 0, gross: 0 };
    if (t.isCompleted) { dPrev.comp += 1; dPrev.gross += t.grossAmount; } else { dPrev.canc += 1; }
    dailyMap.set(day, dPrev);

    const mPrev = monthlyMap.get(month) || { comp: 0, canc: 0, gross: 0 };
    if (t.isCompleted) { mPrev.comp += 1; mPrev.gross += t.grossAmount; } else { mPrev.canc += 1; }
    monthlyMap.set(month, mPrev);
  }

  const daily: TimeSeriesPoint[] = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, data]) => ({
      period,
      displayDate: formatDisplayDate(period),
      completedOrders: data.comp,
      cancelledOrders: data.canc,
      grossRevenue: Math.round(data.gross),
      netRevenue: Math.round((data.gross / (1 + vatRate)) * 100) / 100,
    }));

  const monthly: TimeSeriesPoint[] = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, data]) => ({
      period,
      displayDate: period,
      completedOrders: data.comp,
      cancelledOrders: data.canc,
      grossRevenue: Math.round(data.gross),
      netRevenue: Math.round((data.gross / (1 + vatRate)) * 100) / 100,
    }));

  return { daily, monthly };
}

function computeCustomerRetention(transactions: NormalizedTransaction[]): RetentionMetrics {
  const customerOrders = new Map<string, number>();
  for (const t of transactions.filter((t) => t.isCompleted)) {
    const id = t.customerIdentifier;
    if (id && !id.startsWith('guest_')) customerOrders.set(id, (customerOrders.get(id) || 0) + 1);
  }

  const totalUniqueCustomers = customerOrders.size;
  let customersWithMultipleOrders = 0;
  let totalCustOrders = 0;

  customerOrders.forEach((count) => {
    totalCustOrders += count;
    if (count > 1) customersWithMultipleOrders++;
  });

  const singleOrderCustomers = totalUniqueCustomers - customersWithMultipleOrders;
  const returningCustomerRate = totalUniqueCustomers > 0 ? Math.round((customersWithMultipleOrders / totalUniqueCustomers) * 1000) / 10 : 0;
  const averageOrdersPerCustomer = totalUniqueCustomers > 0 ? Math.round((totalCustOrders / totalUniqueCustomers) * 10) / 10 : 1;

  return {
    totalUniqueCustomers,
    customersWithMultipleOrders,
    singleOrderCustomers,
    returningCustomerRate,
    averageOrdersPerCustomer,
  };
}

function formatDisplayDate(iso: string): string {
  const parts = iso.split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}` : iso;
}

function createEmptyStats(vatRate: number): ComputedSiteStats {
  const today = new Date().toISOString().split('T')[0];
  return {
    dateRange: { startDate: today, endDate: today },
    totalCompletedOrders: 0,
    totalCancelledOrders: 0,
    totalTransactions: 0,
    totalGrossRevenue: 0,
    totalNetRevenue: 0,
    averageOrderValue: 0,
    cancellationRate: 0,
    vatRate,
    topMoviesByOrders: [],
    topMoviesByRevenue: [],
    timeSeriesDaily: [],
    timeSeriesMonthly: [],
    retention: { totalUniqueCustomers: 0, customersWithMultipleOrders: 0, singleOrderCustomers: 0, returningCustomerRate: 0, averageOrdersPerCustomer: 0 },
    anomalies: [],
  };
}

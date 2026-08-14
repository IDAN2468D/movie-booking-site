export type OrderStatus = 'completed' | 'confirmed' | 'validated' | 'cancelled' | 'refunded';

export interface RawOrderInput {
  orderId?: string;
  date: string | Date;
  movieTitle: string;
  amount: number | string;
  customerEmail?: string;
  userId?: string;
  status?: string;
  quantity?: number;
}

export interface NormalizedTransaction {
  id: string;
  date: string; // ISO format YYYY-MM-DD
  rawDate: Date;
  movieTitle: string;
  grossAmount: number;
  netAmount: number;
  customerIdentifier: string;
  status: OrderStatus;
  isCompleted: boolean;
  quantity: number;
}

export interface MoviePerformance {
  movieTitle: string;
  orderCount: number;
  grossRevenue: number;
  netRevenue: number;
  percentageOfRevenue: number;
  percentageOfOrders: number;
}

export interface TimeSeriesPoint {
  period: string; // e.g. "2025-08-01" or "2025-W32" or "2025-08"
  displayDate: string;
  completedOrders: number;
  cancelledOrders: number;
  grossRevenue: number;
  netRevenue: number;
}

export interface RetentionMetrics {
  totalUniqueCustomers: number;
  customersWithMultipleOrders: number;
  singleOrderCustomers: number;
  returningCustomerRate: number; // 0-100%
  averageOrdersPerCustomer: number;
}

export interface StatsAnomaly {
  id: string;
  type: 'spike' | 'dropoff' | 'holiday' | 'cancellation_spike';
  date: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'alert';
  metricValue?: number;
  expectedValue?: number;
}

export interface ComputedSiteStats {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  totalCompletedOrders: number;
  totalCancelledOrders: number;
  totalTransactions: number;
  totalGrossRevenue: number;
  totalNetRevenue: number; // gross / 1.18 (18% Israeli VAT)
  averageOrderValue: number; // AOV
  cancellationRate: number; // 0-100%
  vatRate: number; // 0.18 default
  topMoviesByOrders: MoviePerformance[];
  topMoviesByRevenue: MoviePerformance[];
  timeSeriesDaily: TimeSeriesPoint[];
  timeSeriesMonthly: TimeSeriesPoint[];
  retention: RetentionMetrics;
  anomalies: StatsAnomaly[];
}

export interface AiSiteInsight {
  headline: string;
  executiveSummary: string;
  keyStrengths: string[];
  immediateActions: string[];
  holidayOpportunities: string[];
}

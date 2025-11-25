import { Money } from '../value-objects';

export interface TimeSeriesMetric {
  date: Date;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: Money;
}

export interface AggregatedMetrics {
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalCost: Money;
  averageCtr: number;
  averageCpc: Money;
  averageConversionRate: number;
  averageCostPerConversion: Money;
  impressionShare: number;
}
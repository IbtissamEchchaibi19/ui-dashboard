import {
  DashboardKPI,
  DateRange,
  AcquisitionOverview,
  TrafficOverview,
  PagePerformance,
  EventData,
  ConversionGoal,
  RealtimeData,
//   ChannelData,
  SourceMediumData,
} from '../entities/Analytics';

export interface IAnalyticsRepository {
  getDashboardKPIs(dateRange: DateRange): Promise<DashboardKPI[]>;
  getAcquisitionOverview(dateRange: DateRange): Promise<AcquisitionOverview>;
  getTrafficOverview(dateRange: DateRange): Promise<TrafficOverview>;
  getPagePerformance(dateRange: DateRange): Promise<PagePerformance[]>;
  getEventData(dateRange: DateRange): Promise<EventData[]>;
  getConversionGoals(dateRange: DateRange): Promise<ConversionGoal[]>;
  getRealtimeData(): Promise<RealtimeData>;
  getSourceMediumData(dateRange: DateRange): Promise<SourceMediumData[]>;
}


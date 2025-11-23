// src/domain/entities/Analytics.ts

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface ComparisonDateRange {
  current: DateRange;
  previous: DateRange;
}

export enum MetricType {
  USERS = 'USERS',
  NEW_USERS = 'NEW_USERS',
  SESSIONS = 'SESSIONS',
  PAGEVIEWS = 'PAGEVIEWS',
  BOUNCE_RATE = 'BOUNCE_RATE',
  AVG_SESSION_DURATION = 'AVG_SESSION_DURATION',
  GOAL_COMPLETIONS = 'GOAL_COMPLETIONS',
  GOAL_VALUE = 'GOAL_VALUE',
  CONVERSION_RATE = 'CONVERSION_RATE',
  REVENUE = 'REVENUE',
  TRANSACTIONS = 'TRANSACTIONS',
}

export enum DimensionType {
  DATE = 'DATE',
  HOUR = 'HOUR',
  SOURCE = 'SOURCE',
  MEDIUM = 'MEDIUM',
  CAMPAIGN = 'CAMPAIGN',
  COUNTRY = 'COUNTRY',
  CITY = 'CITY',
  PAGE = 'PAGE',
  EVENT = 'EVENT',
  DEVICE = 'DEVICE',
  BROWSER = 'BROWSER',
  OS = 'OS',
}

export interface AnalyticsReport {
  id: string;
  name: string;
  dateRange: DateRange;
  metrics: MetricData[];
  dimensions: DimensionData[];
  filters?: ReportFilter[];
  segments?: Segment[];
}

export interface MetricData {
  type: MetricType;
  value: number;
  change?: number;
  changePercentage?: number;
}

export interface DimensionData {
  type: DimensionType;
  values: DimensionValue[];
}

export interface DimensionValue {
  name: string;
  metrics: Record<MetricType, number>;
}

export interface ReportFilter {
  dimension: DimensionType;
  operator: 'EQUALS' | 'CONTAINS' | 'STARTS_WITH' | 'ENDS_WITH' | 'REGEX';
  value: string;
}

export interface Segment {
  id: string;
  name: string;
  type: 'BUILT_IN' | 'CUSTOM';
  conditions: SegmentCondition[];
}

export interface SegmentCondition {
  dimension: DimensionType;
  operator: string;
  value: string;
}

// Acquisition Reports
export interface AcquisitionOverview {
  dateRange: DateRange;
  channels: ChannelData[];
  totalUsers: number;
  totalNewUsers: number;
  totalSessions: number;
}

export interface ChannelData {
  channel: string;
  users: number;
  newUsers: number;
  sessions: number;
  bounceRate: number;
  pagesPerSession: number;
  avgSessionDuration: number;
  goalCompletions: number;
  goalValue: number;
}

export interface SourceMediumData {
  source: string;
  medium: string;
  users: number;
  newUsers: number;
  sessions: number;
  bounceRate: number;
  pagesPerSession: number;
  avgSessionDuration: number;
}

export interface CampaignPerformance {
  campaign: string;
  source: string;
  medium: string;
  users: number;
  newUsers: number;
  sessions: number;
  bounceRate: number;
  pagesPerSession: number;
  avgSessionDuration: number;
  goalCompletions: number;
  goalValue: number;
}

// Traffic Reports
export interface TrafficOverview {
  dateRange: DateRange;
  totalSessions: number;
  totalPageviews: number;
  avgSessionDuration: number;
  bounceRate: number;
  byDevice: DeviceData[];
  byLocation: LocationData[];
}

export interface DeviceData {
  category: 'desktop' | 'mobile' | 'tablet';
  users: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface LocationData {
  country: string;
  city?: string;
  users: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
}

// Page Reports
export interface PagePerformance {
  pageUrl: string;
  pageTitle: string;
  pageviews: number;
  uniquePageviews: number;
  avgTimeOnPage: number;
  entrances: number;
  bounceRate: number;
  exitRate: number;
  pageValue: number;
}

export interface PageTiming {
  pageUrl: string;
  avgPageLoadTime: number;
  avgDomainLookupTime: number;
  avgServerResponseTime: number;
  avgPageDownloadTime: number;
  avgDomInteractiveTime: number;
  avgContentLoadTime: number;
}

// Event Reports
export interface EventData {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  totalEvents: number;
  uniqueEvents: number;
  eventValue: number;
  avgValue: number;
  sessionsWithEvent: number;
}

export interface EventFlow {
  events: EventFlowNode[];
  connections: EventFlowConnection[];
}

export interface EventFlowNode {
  id: string;
  eventCategory: string;
  eventAction: string;
  count: number;
}

export interface EventFlowConnection {
  from: string;
  to: string;
  count: number;
}

// Conversion Reports
export interface ConversionGoal {
  id: string;
  name: string;
  type: 'DESTINATION' | 'DURATION' | 'PAGES_PER_SESSION' | 'EVENT';
  value: number;
  completions: number;
  conversionRate: number;
  goalValue: number;
}

export interface FunnelData {
  steps: FunnelStep[];
  totalEntered: number;
  totalCompleted: number;
  overallConversionRate: number;
}

export interface FunnelStep {
  id: string;
  name: string;
  url?: string;
  entered: number;
  completed: number;
  abandonmentRate: number;
}

export interface EcommerceData {
  revenue: number;
  transactions: number;
  avgOrderValue: number;
  conversionRate: number;
  productsPerPurchase: number;
  topProducts: ProductData[];
}

export interface ProductData {
  productName: string;
  productSku: string;
  itemRevenue: number;
  itemQuantity: number;
  uniquePurchases: number;
  avgPrice: number;
}

// Realtime Data
export interface RealtimeData {
  activeUsers: number;
  activeUsersNow: number;
  pageviewsPerMinute: MetricTimeSeries[];
  topActivePages: ActivePageData[];
  topReferrers: ReferrerData[];
  topKeywords: KeywordData[];
  geoData: RealtimeLocationData[];
}

export interface MetricTimeSeries {
  timestamp: Date;
  value: number;
}

export interface ActivePageData {
  pageUrl: string;
  pageTitle: string;
  activeUsers: number;
}

export interface ReferrerData {
  referrer: string;
  activeUsers: number;
}

export interface KeywordData {
  keyword: string;
  activeUsers: number;
}

export interface RealtimeLocationData {
  country: string;
  city?: string;
  activeUsers: number;
  latitude: number;
  longitude: number;
}

// Dashboard KPIs
export interface DashboardKPI {
  id: string;
  name: string;
  metric: MetricType;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercentage: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  sparklineData: number[];
  target?: number;
  format: 'NUMBER' | 'CURRENCY' | 'PERCENTAGE' | 'DURATION';
}

export interface DashboardWidget {
  id: string;
  type: 'KPI' | 'CHART' | 'TABLE' | 'GEO_MAP';
  title: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config: WidgetConfig;
  data: unknown;
}

export interface WidgetConfig {
  metrics: MetricType[];
  dimensions?: DimensionType[];
  chartType?: 'LINE' | 'BAR' | 'PIE' | 'AREA' | 'SCATTER';
  dateRange: DateRange;
  filters?: ReportFilter[];
}
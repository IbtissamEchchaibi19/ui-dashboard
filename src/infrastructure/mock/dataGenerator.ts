import {
  Campaign,
  CampaignStatus,
  CampaignType,
  BiddingStrategy,
  AdGroup,
  Ad,
  Keyword,
  Experiment,
  ChangeHistoryEntry,
  CampaignMetrics,
} from '../../domain/entities/Campaign';

import {
  DashboardKPI,
  MetricType,
//   AcquisitionOverview,
//   TrafficOverview,
//   PagePerformance,
//   EventData,
//   ConversionGoal,
//   RealtimeData,
} from '../../domain/entities/Analytics';

// Utility functions
const randomInt = (min: number, max: number): number => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min: number, max: number, decimals: number = 2): number =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const randomElement = <T>(array: T[]): T =>
  array[randomInt(0, array.length - 1)];

const randomDate = (start: Date, end: Date): Date =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// Generate metrics
export const generateMetrics = (): CampaignMetrics => {
  const impressions = randomInt(1000, 100000);
  const clicks = randomInt(10, impressions / 10);
  const cost = randomFloat(10, 10000);
  const conversions = randomInt(0, clicks / 10);
  const conversionValue = conversions * randomFloat(20, 200);

  return {
    impressions,
    clicks,
    cost,
    conversions,
    conversionValue,
    ctr: parseFloat(((clicks / impressions) * 100).toFixed(2)),
    averageCpc: parseFloat((cost / clicks).toFixed(2)),
    costPerConversion: conversions > 0 ? parseFloat((cost / conversions).toFixed(2)) : 0,
    roas: cost > 0 ? parseFloat((conversionValue / cost).toFixed(2)) : 0,
    impressionShare: randomFloat(10, 95),
  };
};

// Generate campaigns
export const generateCampaigns = (count: number): Campaign[] => {
  const campaigns: Campaign[] = [];
  const campaignNames = [
    'Summer Sale 2024',
    'Brand Awareness',
    'Product Launch',
    'Retargeting Campaign',
    'Holiday Special',
    'New Customer Acquisition',
    'Mobile App Promotion',
    'Local Services',
    'Competitive Targeting',
    'Performance Max Campaign',
  ];

  for (let i = 0; i < count; i++) {
    const startDate = randomDate(new Date(2024, 0, 1), new Date(2024, 6, 1));
    const campaign: Campaign = {
      id: `camp_${i + 1}`,
      name: `${campaignNames[i % campaignNames.length]} ${i + 1}`,
      status: randomElement([
        CampaignStatus.ENABLED,
        CampaignStatus.PAUSED,
        CampaignStatus.ENABLED,
        CampaignStatus.ENABLED,
      ]),
      type: randomElement(Object.values(CampaignType)),
      budget: {
        id: `budget_${i + 1}`,
        amount: randomInt(10, 1000),
        currency: 'USD',
        deliveryMethod: randomElement(['STANDARD', 'ACCELERATED'] as const),
      },
      biddingStrategy: {
        type: randomElement(Object.values(BiddingStrategy)),
        targetCpa: randomFloat(5, 50),
        targetRoas: randomFloat(2, 10),
      },
      startDate,
      endDate: Math.random() > 0.5 ? randomDate(startDate, new Date(2025, 11, 31)) : undefined,
      settings: {
        networks: {
          googleSearch: true,
          searchPartners: Math.random() > 0.5,
          displayNetwork: Math.random() > 0.5,
        },
        locations: ['United States', 'Canada', 'United Kingdom'],
        languages: ['English'],
        deviceTargeting: {
          mobile: true,
          desktop: true,
          tablet: true,
        },
      },
      metrics: generateMetrics(),
      createdAt: startDate,
      updatedAt: new Date(),
    };
    campaigns.push(campaign);
  }

  return campaigns;
};

// Generate ad groups
export const generateAdGroups = (campaignId: string, count: number): AdGroup[] => {
  const adGroups: AdGroup[] = [];
  const adGroupNames = [
    'Core Keywords',
    'Brand Terms',
    'Competitor Terms',
    'Long Tail',
    'Mobile Specific',
    'High Intent',
    'Broad Match',
    'Exact Match',
  ];

  for (let i = 0; i < count; i++) {
    adGroups.push({
      id: `ag_${campaignId}_${i + 1}`,
      campaignId,
      name: `${adGroupNames[i % adGroupNames.length]} ${i + 1}`,
      status: randomElement([
        CampaignStatus.ENABLED,
        CampaignStatus.PAUSED,
        CampaignStatus.ENABLED,
      ]),
      defaultMaxCpc: randomFloat(0.5, 5),
      ads: [],
      keywords: [],
      metrics: generateMetrics(),
      createdAt: randomDate(new Date(2024, 0, 1), new Date()),
      updatedAt: new Date(),
    });
  }

  return adGroups;
};

// Generate ads
export const generateAds = (adGroupId: string, count: number): Ad[] => {
  const ads: Ad[] = [];
  const headlines = [
    'Best Quality Products',
    'Shop Now & Save',
    'Limited Time Offer',
    'Free Shipping Today',
    'Exclusive Deals',
    'Premium Service',
    'Trusted by Millions',
    'Fast Delivery',
  ];

  const descriptions = [
    'Get the best deals on quality products',
    'Fast shipping and easy returns',
    'Join thousands of satisfied customers',
    'Premium quality guaranteed',
  ];

  for (let i = 0; i < count; i++) {
    ads.push({
      id: `ad_${adGroupId}_${i + 1}`,
      adGroupId,
      type: randomElement(['TEXT', 'RESPONSIVE_SEARCH'] as const),
      status: randomElement([CampaignStatus.ENABLED, CampaignStatus.PAUSED]),
      headlines: [
        randomElement(headlines),
        randomElement(headlines),
        randomElement(headlines),
      ],
      descriptions: [randomElement(descriptions), randomElement(descriptions)],
      finalUrls: ['https://example.com/landing'],
      path1: 'products',
      path2: 'sale',
      metrics: generateMetrics(),
      createdAt: randomDate(new Date(2024, 0, 1), new Date()),
    });
  }

  return ads;
};

// Generate keywords
export const generateKeywords = (adGroupId: string, count: number): Keyword[] => {
  const keywords: Keyword[] = [];
  const keywordTexts = [
    'buy shoes online',
    'best running shoes',
    'cheap sneakers',
    'athletic footwear',
    'sports shoes sale',
    'comfortable shoes',
    'designer shoes',
    'shoe store near me',
  ];

  for (let i = 0; i < count; i++) {
    keywords.push({
      id: `kw_${adGroupId}_${i + 1}`,
      adGroupId,
      text: randomElement(keywordTexts),
      matchType: randomElement(['EXACT', 'PHRASE', 'BROAD'] as const),
      status: randomElement([CampaignStatus.ENABLED, CampaignStatus.PAUSED]),
      maxCpc: randomFloat(0.5, 5),
      qualityScore: randomInt(1, 10),
      metrics: generateMetrics(),
      createdAt: randomDate(new Date(2024, 0, 1), new Date()),
    });
  }

  return keywords;
};

// Generate experiments
export const generateExperiments = (count: number): Experiment[] => {
  const experiments: Experiment[] = [];

  for (let i = 0; i < count; i++) {
    const startDate = randomDate(new Date(2024, 0, 1), new Date());
    experiments.push({
      id: `exp_${i + 1}`,
      campaignId: `camp_${randomInt(1, 10)}`,
      name: `Experiment ${i + 1} - Bidding Test`,
      description: 'Testing different bidding strategies',
      status: randomElement(['DRAFT', 'RUNNING', 'COMPLETED', 'PAUSED'] as const),
      startDate,
      endDate: randomDate(startDate, new Date(2025, 11, 31)),
      trafficSplit: 50,
      control: {
        name: 'Control',
        metrics: generateMetrics(),
      },
      treatment: {
        name: 'Treatment',
        metrics: generateMetrics(),
      },
      createdAt: startDate,
    });
  }

  return experiments;
};

// Generate change history
export const generateChangeHistory = (count: number): ChangeHistoryEntry[] => {
  const history: ChangeHistoryEntry[] = [];
  const changes = [
    { type: 'STATUS_CHANGE' as const, field: 'status', oldValue: 'PAUSED', newValue: 'ENABLED' },
    { type: 'UPDATE' as const, field: 'budget', oldValue: '50', newValue: '100' },
    { type: 'UPDATE' as const, field: 'bidding', oldValue: 'Manual CPC', newValue: 'Target CPA' },
    { type: 'CREATE' as const, field: undefined, oldValue: undefined, newValue: undefined },
  ];

  for (let i = 0; i < count; i++) {
    const change = randomElement(changes);
    history.push({
      id: `ch_${i + 1}`,
      entityType: randomElement(['CAMPAIGN', 'AD_GROUP', 'AD', 'KEYWORD'] as const),
      entityId: `entity_${randomInt(1, 100)}`,
      entityName: `Entity ${randomInt(1, 100)}`,
      changeType: change.type,
      field: change.field,
      oldValue: change.oldValue,
      newValue: change.newValue,
      changedBy: randomElement(['john.doe@example.com', 'jane.smith@example.com']),
      timestamp: randomDate(new Date(2024, 0, 1), new Date()),
    });
  }

  return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Generate dashboard KPIs
export const generateDashboardKPIs = (): DashboardKPI[] => {
  const metrics = [
    { name: 'Total Users', metric: MetricType.USERS, format: 'NUMBER' as const },
    { name: 'New Users', metric: MetricType.NEW_USERS, format: 'NUMBER' as const },
    { name: 'Sessions', metric: MetricType.SESSIONS, format: 'NUMBER' as const },
    { name: 'Bounce Rate', metric: MetricType.BOUNCE_RATE, format: 'PERCENTAGE' as const },
    { name: 'Avg Session Duration', metric: MetricType.AVG_SESSION_DURATION, format: 'DURATION' as const },
    { name: 'Conversion Rate', metric: MetricType.CONVERSION_RATE, format: 'PERCENTAGE' as const },
    { name: 'Revenue', metric: MetricType.REVENUE, format: 'CURRENCY' as const },
    { name: 'Transactions', metric: MetricType.TRANSACTIONS, format: 'NUMBER' as const },
  ];

  return metrics.map((m, i) => {
    const currentValue = randomInt(1000, 50000);
    const previousValue = randomInt(1000, 50000);
    const change = currentValue - previousValue;
    const changePercentage = parseFloat(((change / previousValue) * 100).toFixed(2));

    return {
      id: `kpi_${i + 1}`,
      name: m.name,
      metric: m.metric,
      currentValue,
      previousValue,
      change,
      changePercentage,
      trend: change > 0 ? 'UP' : change < 0 ? 'DOWN' : 'STABLE',
      sparklineData: Array.from({ length: 30 }, () => randomInt(800, 1200)),
      format: m.format,
    };
  });
};

// Generate time series data
export const generateTimeSeriesData = (days: number): Array<{ date: Date; value: number }> => {
  const data = [];
  const endDate = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    data.push({
      date,
      value: randomInt(100, 10000),
    });
  }
  
  return data;
};
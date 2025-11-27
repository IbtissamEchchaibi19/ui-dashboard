// infrastructure/mock-data/adGroupData.ts
import {
  AdGroup,
  AdGroupStatus,
  AdGroupType,
  AdRotationMode
} from '@domain/entities';
import { Money } from '@domain/value-objects';

/**
 * Mock Ad Group Data
 * Based on Google Ads actual data structure
 */

export const mockAdGroups: AdGroup[] = [
  // Ad Group 1 - AI Course Main
  new AdGroup(
    'adgroup_001',
    'campaign_001',
    'customer_001',
    'AI Course - Main Keywords',
    AdGroupStatus.ENABLED,
    AdGroupType.SEARCH_STANDARD,
    Money.create(50, 'INR'),      // CPC bid
    null,                          // CPM bid
    Money.create(500, 'INR'),     // Target CPA
    null,                          // CPV bid
    null,                          // Target ROAS
    null,                          // Percent CPC bid
    AdRotationMode.OPTIMIZE,
    undefined,
    '?utm_source=google&utm_medium=cpc',
    '{lpurl}?adgroup={adgroupid}',
    {
      targetRestrictions: [
        { targetingDimension: 'KEYWORD', bidOnly: false },
        { targetingDimension: 'AUDIENCE', bidOnly: true }
      ]
    }
  ),

  // Ad Group 2 - AI Course Brand
  new AdGroup(
    'adgroup_002',
    'campaign_001',
    'customer_001',
    'AI Course - Brand Terms',
    AdGroupStatus.ENABLED,
    AdGroupType.SEARCH_STANDARD,
    Money.create(35, 'INR'),
    null,
    Money.create(400, 'INR'),
    null,
    null,
    null,
    AdRotationMode.OPTIMIZE,
    undefined,
    '?utm_source=google&utm_medium=cpc&utm_campaign=brand',
    undefined,
    undefined
  ),

  // Ad Group 3 - Data Science
  new AdGroup(
    'adgroup_003',
    'campaign_001',
    'customer_001',
    'Data Science Program',
    AdGroupStatus.ENABLED,
    AdGroupType.SEARCH_STANDARD,
    Money.create(45, 'INR'),
    null,
    Money.create(450, 'INR'),
    null,
    null,
    null,
    AdRotationMode.OPTIMIZE,
    undefined,
    undefined,
    undefined,
    undefined
  ),

  // Ad Group 4 - Python Training
  new AdGroup(
    'adgroup_004',
    'campaign_001',
    'customer_001',
    'Python Training Keywords',
    AdGroupStatus.PAUSED,
    AdGroupType.SEARCH_STANDARD,
    Money.create(40, 'INR'),
    null,
    Money.create(380, 'INR'),
    null,
    null,
    null,
    AdRotationMode.ROTATE_INDEFINITELY,
    undefined,
    undefined,
    undefined,
    undefined
  ),

  // Ad Group 5 - Cloud Computing
  new AdGroup(
    'adgroup_005',
    'campaign_002',
    'customer_001',
    'Cloud Computing - AWS',
    AdGroupStatus.ENABLED,
    AdGroupType.SEARCH_STANDARD,
    Money.create(55, 'INR'),
    null,
    Money.create(520, 'INR'),
    null,
    null,
    null,
    AdRotationMode.OPTIMIZE,
    undefined,
    undefined,
    undefined,
    undefined
  ),

  // Ad Group 6 - Cloud Computing Azure
  new AdGroup(
    'adgroup_006',
    'campaign_002',
    'customer_001',
    'Cloud Computing - Azure',
    AdGroupStatus.ENABLED,
    AdGroupType.SEARCH_STANDARD,
    Money.create(52, 'INR'),
    null,
    Money.create(500, 'INR'),
    null,
    null,
    null,
    AdRotationMode.OPTIMIZE,
    undefined,
    undefined,
    undefined,
    undefined
  ),

  // Ad Group 7 - Full Stack Development
  new AdGroup(
    'adgroup_007',
    'campaign_003',
    'customer_001',
    'Full Stack - MERN',
    AdGroupStatus.ENABLED,
    AdGroupType.SEARCH_STANDARD,
    Money.create(48, 'INR'),
    null,
    Money.create(460, 'INR'),
    null,
    null,
    null,
    AdRotationMode.OPTIMIZE,
    undefined,
    undefined,
    undefined,
    undefined
  ),

  // Ad Group 8 - Full Stack Java
  new AdGroup(
    'adgroup_008',
    'campaign_003',
    'customer_001',
    'Full Stack - Java',
    AdGroupStatus.PAUSED,
    AdGroupType.SEARCH_STANDARD,
    Money.create(42, 'INR'),
    null,
    Money.create(420, 'INR'),
    null,
    null,
    null,
    AdRotationMode.OPTIMIZE,
    undefined,
    undefined,
    undefined,
    undefined
  ),

  // Ad Group 9 - Cybersecurity
  new AdGroup(
    'adgroup_009',
    'campaign_003',
    'customer_001',
    'Cybersecurity Training',
    AdGroupStatus.ENABLED,
    AdGroupType.SEARCH_STANDARD,
    Money.create(60, 'INR'),
    null,
    Money.create(580, 'INR'),
    null,
    null,
    null,
    AdRotationMode.OPTIMIZE,
    undefined,
    undefined,
    undefined,
    undefined
  ),

  // Ad Group 10 - Digital Marketing
  new AdGroup(
    'adgroup_010',
    'campaign_004',
    'customer_001',
    'Digital Marketing Course',
    AdGroupStatus.ENABLED,
    AdGroupType.SEARCH_STANDARD,
    Money.create(38, 'INR'),
    null,
    Money.create(350, 'INR'),
    null,
    null,
    null,
    AdRotationMode.OPTIMIZE,
    undefined,
    undefined,
    undefined,
    undefined
  ),

  // Ad Group 11 - Display Ads
  new AdGroup(
    'adgroup_011',
    'campaign_004',
    'customer_001',
    'Display - Remarketing',
    AdGroupStatus.ENABLED,
    AdGroupType.DISPLAY_STANDARD,
    null,
    Money.create(15, 'INR'),  // CPM bid for display
    null,
    null,
    null,
    null,
    AdRotationMode.OPTIMIZE,
    'KEYWORD',
    undefined,
    undefined,
    undefined
  ),

  // Ad Group 12 - Video Ads
  new AdGroup(
    'adgroup_012',
    'campaign_004',
    'customer_001',
    'Video - YouTube In-Stream',
    AdGroupStatus.ENABLED,
    AdGroupType.VIDEO_TRUE_VIEW_IN_STREAM,
    null,
    null,
    null,
    Money.create(5, 'INR'),   // CPV bid for video
    null,
    null,
    AdRotationMode.OPTIMIZE,
    undefined,
    undefined,
    undefined,
    undefined
  ),

  // Ad Group 13 - Shopping Ads
  new AdGroup(
    'adgroup_013',
    'campaign_005',
    'customer_001',
    'Shopping - Course Materials',
    AdGroupStatus.ENABLED,
    AdGroupType.SHOPPING_PRODUCT_ADS,
    Money.create(25, 'INR'),
    null,
    null,
    null,
    2.5,  // Target ROAS
    null,
    AdRotationMode.OPTIMIZE,
    undefined,
    undefined,
    undefined,
    undefined
  ),

  // Ad Group 14 - Dynamic Search
  new AdGroup(
    'adgroup_014',
    'campaign_001',
    'customer_001',
    'Dynamic Search - All Pages',
    AdGroupStatus.ENABLED,
    AdGroupType.SEARCH_DYNAMIC_ADS,
    Money.create(30, 'INR'),
    null,
    Money.create(350, 'INR'),
    null,
    null,
    null,
    AdRotationMode.OPTIMIZE,
    undefined,
    undefined,
    undefined,
    undefined
  ),

  // Ad Group 15 - Removed Ad Group
  new AdGroup(
    'adgroup_015',
    'campaign_001',
    'customer_001',
    'Old Campaign - Deprecated',
    AdGroupStatus.REMOVED,
    AdGroupType.SEARCH_STANDARD,
    Money.create(20, 'INR'),
    null,
    null,
    null,
    null,
    null,
    AdRotationMode.UNSPECIFIED,
    undefined,
    undefined,
    undefined,
    undefined
  )
];

/**
 * Mock time series data generator for ad groups
 */
export const generateMockAdGroupTimeSeries = (adGroupId: string, days: number = 30) => {
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate realistic-looking metrics with variation
    const baseImpressions = Math.floor(Math.random() * 500) + 100;
    const clicks = Math.floor(baseImpressions * (Math.random() * 0.08 + 0.02)); // 2-10% CTR
    const interactions = clicks + Math.floor(Math.random() * 10);
    const conversions = Math.floor(clicks * (Math.random() * 0.12 + 0.03)); // 3-15% conversion rate
    const cost = clicks * (Math.random() * 60 + 15); // ₹15-75 per click

    data.push({
      date,
      impressions: baseImpressions,
      clicks,
      interactions,
      cost,
      conversions,
      videoViews: Math.floor(Math.random() * 50)
    });
  }

  return data;
};

/**
 * Mock ad group metrics generator
 */
export const generateMockAdGroupMetrics = () => {
  const impressions = Math.floor(Math.random() * 10000) + 1000;
  const clicks = Math.floor(impressions * (Math.random() * 0.08 + 0.02));
  const interactions = clicks + Math.floor(Math.random() * 20);
  const cost = clicks * (Math.random() * 60 + 15);
  const conversions = Math.floor(clicks * (Math.random() * 0.12 + 0.03));

  return {
    impressions,
    clicks,
    interactions,
    interactionRate: ((interactions / impressions) * 100).toFixed(2),
    averageCpc: cost / clicks || 0,
    cost,
    conversions,
    conversionRate: ((conversions / clicks) * 100 || 0).toFixed(2),
    ctr: ((clicks / impressions) * 100).toFixed(2),
    averageCpm: (cost / impressions) * 1000,
    costPerConversion: conversions > 0 ? cost / conversions : 0
  };
};

/**
 * Campaign name mapping for display
 */
export const campaignNameMap: Record<string, string> = {
  'campaign_001': 'AI & Tech Training',
  'campaign_002': 'Cloud Computing Courses',
  'campaign_003': 'Development Programs',
  'campaign_004': 'Digital Marketing & Media',
  'campaign_005': 'Shopping Campaigns'
};
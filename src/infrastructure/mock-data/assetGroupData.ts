// infrastructure/mock-data/assetGroupData.ts
import {
  AssetGroup,
  AssetGroupStatus,
  AssetGroupPrimaryStatus,
  AssetGroupPrimaryStatusReason,
  AdStrengthAsset,
  AssetPerformanceLabel,
  CallToActionType,
  HeadlineAsset,
  DescriptionAsset,
  ImageAsset,
  VideoAsset,
  AudienceSignal,
  ListingGroup
} from '@domain/entities';

/**
 * Helper to generate headlines
 */
const generateHeadlines = (baseName: string, count: number): HeadlineAsset[] => {
  const headlines = [
    'Learn AI & Machine Learning',
    'Master Data Science Today',
    'Expert-Led Training Programs',
    'Get Certified in 30 Days',
    'Industry-Recognized Courses',
    'Start Your Tech Career',
    'Free Course Preview Available',
    'Join 50,000+ Students',
    'Flexible Learning Options',
    'Career Support Included',
    'Hands-On Projects',
    'Live Mentorship Sessions',
    'Job Placement Assistance',
    'Affordable Payment Plans',
    'World-Class Curriculum'
  ];
  
  return headlines.slice(0, count).map((text, idx) => ({
    id: `headline_${baseName}_${idx}`,
    text,
    performanceLabel: idx < 3 ? AssetPerformanceLabel.BEST : 
                      idx < 6 ? AssetPerformanceLabel.GOOD : 
                      AssetPerformanceLabel.LEARNING
  }));
};

/**
 * Helper to generate descriptions
 */
const generateDescriptions = (baseName: string, count: number): DescriptionAsset[] => {
  const descriptions = [
    'Transform your career with our comprehensive AI and Machine Learning courses. Industry experts, hands-on projects, and job support.',
    'Learn from the best instructors in tech. Get practical skills that employers want. Start your journey today with our proven curriculum.',
    'Join thousands of successful graduates. Our courses offer flexible schedules, real-world projects, and career placement assistance.',
    'Master the latest technologies with our cutting-edge curriculum. Expert mentorship and personalized learning paths available.',
    'Affordable, high-quality tech education. Flexible payment options and scholarship programs available for eligible students.'
  ];
  
  return descriptions.slice(0, count).map((text, idx) => ({
    id: `desc_${baseName}_${idx}`,
    text,
    performanceLabel: idx === 0 ? AssetPerformanceLabel.BEST : 
                      idx === 1 ? AssetPerformanceLabel.GOOD : 
                      AssetPerformanceLabel.LEARNING
  }));
};

/**
 * Helper to generate images
 */
const generateImages = (baseName: string, count: number, width: number, height: number): ImageAsset[] => {
  return Array.from({ length: count }, (_, idx) => ({
    id: `img_${baseName}_${idx}`,
    url: `https://example.com/images/${baseName}_${idx}.jpg`,
    fullSizeUrl: `https://example.com/images/${baseName}_${idx}_full.jpg`,
    width,
    height,
    mimeType: 'IMAGE_JPEG' as const,
    performanceLabel: idx === 0 ? AssetPerformanceLabel.BEST : 
                      idx < 3 ? AssetPerformanceLabel.GOOD : 
                      AssetPerformanceLabel.LEARNING,
    fileSize: Math.floor(Math.random() * 500000) + 100000
  }));
};

/**
 * Helper to generate videos
 */
const generateVideos = (baseName: string, count: number): VideoAsset[] => {
  const videoTitles = [
    'Course Overview - Learn AI Today',
    'Student Success Stories',
    'Meet Our Expert Instructors',
    'Campus Tour & Facilities',
    'Career Outcomes Report'
  ];
  
  return videoTitles.slice(0, count).map((title, idx) => ({
    id: `video_${baseName}_${idx}`,
    youtubeVideoId: `YT_${baseName}_${idx}`,
    youtubeVideoTitle: title,
    videoDurationMillis: (30 + Math.floor(Math.random() * 90)) * 1000,
    performanceLabel: idx === 0 ? AssetPerformanceLabel.BEST : AssetPerformanceLabel.GOOD
  }));
};

/**
 * Mock Asset Groups Data
 */
export const mockAssetGroups: AssetGroup[] = [
  // Asset Group 1 - AI & ML Courses (Excellent)
  new AssetGroup(
    'assetgroup_001',
    'pmax_campaign_001',
    'customer_001',
    'AI & Machine Learning Courses',
    AssetGroupStatus.ENABLED,
    AssetGroupPrimaryStatus.ELIGIBLE,
    [],
    AdStrengthAsset.EXCELLENT,
    ['https://example.com/courses/ai-ml'],
    ['https://m.example.com/courses/ai-ml'],
    'courses',
    'ai-ml',
    generateHeadlines('ag1', 10),
    [
      { id: 'lh_1', text: 'Master AI & Machine Learning with Expert-Led Training Programs', performanceLabel: AssetPerformanceLabel.BEST },
      { id: 'lh_2', text: 'Transform Your Career - Comprehensive AI Courses with Job Support', performanceLabel: AssetPerformanceLabel.GOOD }
    ],
    generateDescriptions('ag1', 4),
    generateImages('ag1_landscape', 5, 1200, 628),
    generateImages('ag1_square', 3, 1200, 1200),
    generateImages('ag1_portrait', 2, 960, 1200),
    generateImages('ag1_logo', 2, 1200, 1200),
    generateImages('ag1_landscape_logo', 1, 1200, 300),
    generateVideos('ag1', 3),
    'TechEd Academy',
    CallToActionType.LEARN_MORE,
    [
      { id: 'aud_1', name: 'Tech Enthusiasts', type: 'CUSTOM_SEGMENT', description: 'Users searching for AI courses' },
      { id: 'aud_2', name: 'Career Changers', type: 'AUDIENCE', description: 'In-market for education' }
    ],
    [
      { id: 'lg_1', type: 'SUBDIVISION', caseValue: 'All Products' }
    ],
    {
      adStrengthActionItems: [],
      missingAssetTypes: [],
      suggestedImprovements: ['Consider adding more video content for better reach']
    },
    new Date('2024-01-15'),
    new Date('2024-11-20')
  ),

  // Asset Group 2 - Data Science (Good)
  new AssetGroup(
    'assetgroup_002',
    'pmax_campaign_001',
    'customer_001',
    'Data Science Bootcamp',
    AssetGroupStatus.ENABLED,
    AssetGroupPrimaryStatus.ELIGIBLE,
    [],
    AdStrengthAsset.GOOD,
    ['https://example.com/courses/data-science'],
    ['https://m.example.com/courses/data-science'],
    'courses',
    'data-science',
    generateHeadlines('ag2', 8),
    [
      { id: 'lh_3', text: 'Become a Data Scientist - Complete Bootcamp with Career Support', performanceLabel: AssetPerformanceLabel.GOOD }
    ],
    generateDescriptions('ag2', 3),
    generateImages('ag2_landscape', 4, 1200, 628),
    generateImages('ag2_square', 2, 1200, 1200),
    [],
    generateImages('ag2_logo', 1, 1200, 1200),
    [],
    generateVideos('ag2', 2),
    'TechEd Academy',
    CallToActionType.SIGN_UP,
    [
      { id: 'aud_3', name: 'Analytics Professionals', type: 'CUSTOM_SEGMENT' }
    ],
    [],
    {
      adStrengthActionItems: ['Add more portrait images', 'Add landscape logo'],
      missingAssetTypes: [],
      suggestedImprovements: ['Add portrait images to improve ad variety']
    },
    new Date('2024-02-01'),
    new Date('2024-11-18')
  ),

  // Asset Group 3 - Web Development (Average)
  new AssetGroup(
    'assetgroup_003',
    'pmax_campaign_001',
    'customer_001',
    'Full Stack Web Development',
    AssetGroupStatus.ENABLED,
    AssetGroupPrimaryStatus.LIMITED,
    [AssetGroupPrimaryStatusReason.ASSET_GROUP_LIMITED],
    AdStrengthAsset.AVERAGE,
    ['https://example.com/courses/web-dev'],
    [],
    'courses',
    'web-dev',
    generateHeadlines('ag3', 5),
    [
      { id: 'lh_4', text: 'Learn Full Stack Development - React, Node.js & More', performanceLabel: AssetPerformanceLabel.LEARNING }
    ],
    generateDescriptions('ag3', 2),
    generateImages('ag3_landscape', 2, 1200, 628),
    generateImages('ag3_square', 1, 1200, 1200),
    [],
    generateImages('ag3_logo', 1, 1200, 1200),
    [],
    [],
    'TechEd Academy',
    CallToActionType.GET_QUOTE,
    [],
    [],
    {
      adStrengthActionItems: ['Add more headlines (recommended: 10+)', 'Add video assets', 'Add portrait images'],
      missingAssetTypes: [],
      suggestedImprovements: ['Add videos to expand reach to YouTube', 'Improve headline variety']
    },
    new Date('2024-03-10'),
    new Date('2024-11-15')
  ),

  // Asset Group 4 - Cloud Computing (Poor - needs improvement)
  new AssetGroup(
    'assetgroup_004',
    'pmax_campaign_002',
    'customer_001',
    'Cloud Computing Certification',
    AssetGroupStatus.ENABLED,
    AssetGroupPrimaryStatus.LIMITED,
    [AssetGroupPrimaryStatusReason.ASSET_GROUP_LIMITED],
    AdStrengthAsset.POOR,
    ['https://example.com/courses/cloud'],
    [],
    'courses',
    'cloud',
    generateHeadlines('ag4', 3),
    [],
    generateDescriptions('ag4', 2),
    generateImages('ag4_landscape', 1, 1200, 628),
    generateImages('ag4_square', 1, 1200, 1200),
    [],
    [],
    [],
    [],
    'TechEd Academy',
    CallToActionType.LEARN_MORE,
    [],
    [],
    {
      adStrengthActionItems: [
        'Add more headlines (minimum 5 required for good strength)',
        'Add long headline',
        'Add logo images',
        'Add video assets for better engagement'
      ],
      missingAssetTypes: [],
      suggestedImprovements: [
        'Your asset group needs more creative variety',
        'Consider adding audience signals for better targeting'
      ]
    },
    new Date('2024-04-05'),
    new Date('2024-11-10')
  ),

  // Asset Group 5 - Cybersecurity (Paused)
  new AssetGroup(
    'assetgroup_005',
    'pmax_campaign_002',
    'customer_001',
    'Cybersecurity Training',
    AssetGroupStatus.PAUSED,
    AssetGroupPrimaryStatus.PAUSED,
    [AssetGroupPrimaryStatusReason.ASSET_GROUP_PAUSED],
    AdStrengthAsset.GOOD,
    ['https://example.com/courses/cybersecurity'],
    ['https://m.example.com/courses/cybersecurity'],
    'courses',
    'security',
    generateHeadlines('ag5', 7),
    [
      { id: 'lh_5', text: 'Cybersecurity Certification - Protect Your Future Career', performanceLabel: AssetPerformanceLabel.GOOD }
    ],
    generateDescriptions('ag5', 3),
    generateImages('ag5_landscape', 3, 1200, 628),
    generateImages('ag5_square', 2, 1200, 1200),
    generateImages('ag5_portrait', 1, 960, 1200),
    generateImages('ag5_logo', 1, 1200, 1200),
    [],
    generateVideos('ag5', 1),
    'TechEd Academy',
    CallToActionType.APPLY_NOW,
    [
      { id: 'aud_4', name: 'IT Professionals', type: 'AUDIENCE' }
    ],
    [],
    {
      adStrengthActionItems: [],
      missingAssetTypes: [],
      suggestedImprovements: []
    },
    new Date('2024-02-20'),
    new Date('2024-10-01')
  ),

  // Asset Group 6 - Digital Marketing (Excellent with Shopping)
  new AssetGroup(
    'assetgroup_006',
    'pmax_campaign_003',
    'customer_001',
    'Digital Marketing Masterclass',
    AssetGroupStatus.ENABLED,
    AssetGroupPrimaryStatus.ELIGIBLE,
    [],
    AdStrengthAsset.EXCELLENT,
    ['https://example.com/courses/digital-marketing'],
    ['https://m.example.com/courses/digital-marketing'],
    'courses',
    'marketing',
    generateHeadlines('ag6', 12),
    [
      { id: 'lh_6', text: 'Digital Marketing Mastery - SEO, PPC, Social Media & Analytics', performanceLabel: AssetPerformanceLabel.BEST },
      { id: 'lh_7', text: 'Become a Marketing Expert - Hands-On Training with Real Campaigns', performanceLabel: AssetPerformanceLabel.GOOD }
    ],
    generateDescriptions('ag6', 5),
    generateImages('ag6_landscape', 6, 1200, 628),
    generateImages('ag6_square', 4, 1200, 1200),
    generateImages('ag6_portrait', 2, 960, 1200),
    generateImages('ag6_logo', 2, 1200, 1200),
    generateImages('ag6_landscape_logo', 1, 1200, 300),
    generateVideos('ag6', 4),
    'TechEd Academy',
    CallToActionType.SIGN_UP,
    [
      { id: 'aud_5', name: 'Marketing Professionals', type: 'CUSTOM_SEGMENT' },
      { id: 'aud_6', name: 'Business Owners', type: 'AUDIENCE' },
      { id: 'aud_7', name: 'Career Changers', type: 'LIFE_EVENT' }
    ],
    [
      { id: 'lg_2', type: 'SUBDIVISION', caseValue: 'All Products', productCount: 15 },
      { id: 'lg_3', type: 'UNIT', caseValue: 'Marketing Courses', parentId: 'lg_2', productCount: 8 },
      { id: 'lg_4', type: 'UNIT', caseValue: 'SEO Tools', parentId: 'lg_2', productCount: 7 }
    ],
    {
      adStrengthActionItems: [],
      missingAssetTypes: [],
      suggestedImprovements: []
    },
    new Date('2024-01-01'),
    new Date('2024-11-25')
  ),

  // Asset Group 7 - Under Review
  new AssetGroup(
    'assetgroup_007',
    'pmax_campaign_003',
    'customer_001',
    'Business Analytics Program',
    AssetGroupStatus.ENABLED,
    AssetGroupPrimaryStatus.PENDING,
    [AssetGroupPrimaryStatusReason.ASSET_GROUP_UNDER_REVIEW],
    AdStrengthAsset.PENDING,
    ['https://example.com/courses/business-analytics'],
    [],
    'courses',
    'analytics',
    generateHeadlines('ag7', 6),
    [
      { id: 'lh_8', text: 'Business Analytics - Data-Driven Decision Making Skills', performanceLabel: AssetPerformanceLabel.PENDING }
    ],
    generateDescriptions('ag7', 3),
    generateImages('ag7_landscape', 3, 1200, 628),
    generateImages('ag7_square', 2, 1200, 1200),
    [],
    generateImages('ag7_logo', 1, 1200, 1200),
    [],
    generateVideos('ag7', 1),
    'TechEd Academy',
    CallToActionType.LEARN_MORE,
    [],
    [],
    {
      adStrengthActionItems: [],
      missingAssetTypes: [],
      suggestedImprovements: ['Asset group is under review - metrics will update once approved']
    },
    new Date('2024-11-20'),
    new Date('2024-11-20')
  ),

  // Asset Group 8 - Disapproved
  new AssetGroup(
    'assetgroup_008',
    'pmax_campaign_003',
    'customer_001',
    'Financial Trading Course',
    AssetGroupStatus.ENABLED,
    AssetGroupPrimaryStatus.NOT_ELIGIBLE,
    [AssetGroupPrimaryStatusReason.ASSET_GROUP_DISAPPROVED],
    AdStrengthAsset.POOR,
    ['https://example.com/courses/trading'],
    [],
    'courses',
    'trading',
    generateHeadlines('ag8', 4),
    [],
    generateDescriptions('ag8', 2),
    generateImages('ag8_landscape', 2, 1200, 628),
    generateImages('ag8_square', 1, 1200, 1200),
    [],
    [],
    [],
    [],
    'TechEd Academy',
    CallToActionType.GET_QUOTE,
    [],
    [],
    {
      adStrengthActionItems: ['Fix policy violations to enable serving'],
      missingAssetTypes: [],
      suggestedImprovements: ['Review and address policy issues before adding more assets']
    },
    new Date('2024-05-15'),
    new Date('2024-09-01')
  ),

  // Asset Group 9 - Mobile App Development
  new AssetGroup(
    'assetgroup_009',
    'pmax_campaign_001',
    'customer_001',
    'Mobile App Development',
    AssetGroupStatus.ENABLED,
    AssetGroupPrimaryStatus.ELIGIBLE,
    [],
    AdStrengthAsset.GOOD,
    ['https://example.com/courses/mobile-dev'],
    ['https://m.example.com/courses/mobile-dev'],
    'courses',
    'mobile',
    generateHeadlines('ag9', 8),
    [
      { id: 'lh_9', text: 'Build iOS & Android Apps - Complete Mobile Development Course', performanceLabel: AssetPerformanceLabel.GOOD }
    ],
    generateDescriptions('ag9', 4),
    generateImages('ag9_landscape', 4, 1200, 628),
    generateImages('ag9_square', 3, 1200, 1200),
    generateImages('ag9_portrait', 1, 960, 1200),
    generateImages('ag9_logo', 1, 1200, 1200),
    [],
    generateVideos('ag9', 2),
    'TechEd Academy',
    CallToActionType.DOWNLOAD,
    [
      { id: 'aud_8', name: 'App Developers', type: 'CUSTOM_SEGMENT' }
    ],
    [],
    {
      adStrengthActionItems: ['Add landscape logo for better brand visibility'],
      missingAssetTypes: [],
      suggestedImprovements: ['Consider adding more videos']
    },
    new Date('2024-03-01'),
    new Date('2024-11-22')
  ),

  // Asset Group 10 - Removed
  new AssetGroup(
    'assetgroup_010',
    'pmax_campaign_002',
    'customer_001',
    'Legacy Java Course',
    AssetGroupStatus.REMOVED,
    AssetGroupPrimaryStatus.REMOVED,
    [AssetGroupPrimaryStatusReason.ASSET_GROUP_REMOVED],
    AdStrengthAsset.UNKNOWN,
    ['https://example.com/courses/java-legacy'],
    [],
    'courses',
    'java',
    generateHeadlines('ag10', 3),
    [],
    generateDescriptions('ag10', 2),
    generateImages('ag10_landscape', 1, 1200, 628),
    [],
    [],
    [],
    [],
    [],
    'TechEd Academy',
    CallToActionType.LEARN_MORE,
    [],
    [],
    {
      adStrengthActionItems: [],
      missingAssetTypes: [],
      suggestedImprovements: []
    },
    new Date('2023-06-01'),
    new Date('2024-08-15')
  )
];

/**
 * Campaign name mapping
 */
export const pMaxCampaignNameMap: Record<string, string> = {
  'pmax_campaign_001': 'Performance Max - Tech Courses',
  'pmax_campaign_002': 'Performance Max - Enterprise Training',
  'pmax_campaign_003': 'Performance Max - Business Skills'
};

/**
 * Generate mock time series data
 */
export const generateMockAssetGroupTimeSeries = (assetGroupId: string, days: number = 30) => {
  const data = [];
  const now = new Date();
  
  // Base metrics vary by asset group strength
  const strengthMultiplier = assetGroupId.includes('001') || assetGroupId.includes('006') ? 1.5 :
                             assetGroupId.includes('002') || assetGroupId.includes('009') ? 1.2 :
                             assetGroupId.includes('003') ? 0.8 : 0.5;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const baseImpressions = Math.floor((Math.random() * 1000 + 500) * strengthMultiplier);
    const ctr = Math.random() * 0.05 + 0.02; // 2-7% CTR
    const clicks = Math.floor(baseImpressions * ctr);
    const interactions = clicks + Math.floor(Math.random() * 20);
    const conversionRate = Math.random() * 0.08 + 0.03; // 3-11% conversion rate
    const conversions = Math.floor(clicks * conversionRate);
    const avgCpc = Math.random() * 40 + 15; // ₹15-55 CPC
    const cost = clicks * avgCpc;
    const avgConversionValue = Math.random() * 500 + 200; // ₹200-700 per conversion
    const conversionsValue = conversions * avgConversionValue;

    data.push({
      date,
      impressions: baseImpressions,
      clicks,
      interactions,
      cost,
      conversions,
      conversionsValue,
      ctr: ctr * 100,
      averageCpc: avgCpc
    });
  }

  return data;
};

/**
 * Generate mock asset performance data
 */
export const generateMockAssetPerformance = (assetGroupId: string) => {
  const assetTypes = ['HEADLINE', 'DESCRIPTION', 'MARKETING_IMAGE', 'SQUARE_MARKETING_IMAGE', 'YOUTUBE_VIDEO'];
  const performances = [];

  for (const type of assetTypes) {
    const count = type === 'HEADLINE' ? 5 : type === 'DESCRIPTION' ? 3 : 2;
    for (let i = 0; i < count; i++) {
      const impressions = Math.floor(Math.random() * 5000) + 500;
      const clicks = Math.floor(impressions * (Math.random() * 0.05 + 0.01));
      
      performances.push({
        assetId: `${assetGroupId}_${type.toLowerCase()}_${i}`,
        assetType: type,
        performanceLabel: i === 0 ? 'BEST' : i === 1 ? 'GOOD' : 'LEARNING',
        impressions,
        clicks
      });
    }
  }

  return performances;
};

/**
 * Generate metrics summary for an asset group
 */
export const generateMockAssetGroupMetrics = () => {
  const impressions = Math.floor(Math.random() * 50000) + 10000;
  const ctr = Math.random() * 0.05 + 0.02;
  const clicks = Math.floor(impressions * ctr);
  const interactions = clicks + Math.floor(Math.random() * 100);
  const conversionRate = Math.random() * 0.08 + 0.03;
  const conversions = Math.floor(clicks * conversionRate);
  const avgCpc = Math.random() * 40 + 15;
  const cost = clicks * avgCpc;
  const avgConversionValue = Math.random() * 500 + 200;
  const conversionsValue = conversions * avgConversionValue;

  return {
    impressions,
    clicks,
    interactions,
    interactionRate: ((interactions / impressions) * 100).toFixed(2),
    ctr: (ctr * 100).toFixed(2),
    conversions,
    conversionRate: (conversionRate * 100).toFixed(2),
    cost,
    averageCpc: avgCpc,
    conversionsValue,
    costPerConversion: conversions > 0 ? cost / conversions : 0,
    roas: cost > 0 ? conversionsValue / cost : 0
  };
};
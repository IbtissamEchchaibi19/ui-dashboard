// infrastructure/mock-data/adData.ts 
import {
  Ad,
  AdStatus,
  AdType,
  AdStrength,
  PolicyApprovalStatus,
  AssetPinning,
  AdAsset,
  ResponsiveSearchAdInfo,
  ExpandedTextAdInfo,
  AdUrls,
  PolicySummary
} from '@domain/entities';
import { Money } from '@domain/value-objects';

/**
 * Mock Ad Data
 * Based on Google Ads actual data structure
 */

const createPolicySummary = (approvalStatus: PolicyApprovalStatus): PolicySummary => ({
  approvalStatus,
  reviewStatus: 'REVIEWED',
  policyTopicEntries: approvalStatus === PolicyApprovalStatus.DISAPPROVED
    ? [{ topic: 'Capitalization', type: 'PROHIBITED', evidences: ['ALL CAPS IN HEADLINE'] }]
    : []
});

export const mockAds: Ad[] = [
  // Responsive Search Ad 1 - AI/Tech Course
  new Ad(
    'ad_001',
    'adgroup_001',
    'campaign_001',
    'customer_001',
    'AI Course RSA - Main',
    AdStatus.ENABLED,
    AdType.RESPONSIVE_SEARCH_AD,
    AdStrength.EXCELLENT,
    {
      finalUrls: ['https://www.aiinfoxtech.com/ai-course'],
      finalMobileUrls: ['https://www.aiinfoxtech.com/ai-course'],
      trackingUrlTemplate: '{lpurl}?utm_source=google&utm_medium=cpc',
      urlCustomParameters: [
        { key: 'campaign', value: 'ai_search' },
        { key: 'adgroup', value: 'ai_courses' }
      ]
    },
    {
      headlines: [
        { text: 'AI & Machine Learning Course', pinning: AssetPinning.HEADLINE_1 },
        { text: 'Learn Artificial Intelligence', pinning: undefined },
        { text: 'Expert-Led Online Training', pinning: undefined },
        { text: 'Get Certified in 12 Weeks', pinning: undefined },
        { text: 'Build Your AI Career Today', pinning: undefined },
        { text: 'Free Demo Class Available', pinning: undefined },
        { text: 'Industry-Recognized Certificate', pinning: undefined },
        { text: '100% Job Assistance', pinning: undefined }
      ],
      descriptions: [
        { text: 'Master AI, ML & Deep Learning from industry experts. Hands-on projects. Lifetime access. Enroll now!' },
        { text: 'Comprehensive AI curriculum. Real-world applications. Career support included. Start your journey today!' },
        { text: 'Learn Python, TensorFlow, PyTorch & more. Build AI models. Get job-ready in 12 weeks!' }
      ],
      path1: 'AI-Course',
      path2: 'Certification'
    },
    null,
    null,
    null,
    createPolicySummary(PolicyApprovalStatus.APPROVED),
    undefined,
    'www.aiinfoxtech.com'
  ),

  // Responsive Search Ad 2 - Data Science
  new Ad(
    'ad_002',
    'adgroup_002',
    'campaign_001',
    'customer_001',
    'Data Science Program RSA',
    AdStatus.ENABLED,
    AdType.RESPONSIVE_SEARCH_AD,
    AdStrength.GOOD,
    {
      finalUrls: ['https://www.aiinfoxtech.com/data-science'],
      finalMobileUrls: ['https://www.aiinfoxtech.com/data-science']
    },
    {
      headlines: [
        { text: 'Data Science Masterclass' },
        { text: 'Become a Data Scientist' },
        { text: 'Python & R Programming' },
        { text: 'Machine Learning Included' },
        { text: 'Live Online Classes' },
        { text: 'Placement Support Included' },
        { text: 'Affordable Fees & EMI' },
        { text: 'Weekend Batches Available' }
      ],
      descriptions: [
        { text: 'Complete Data Science program covering Python, R, ML, statistics. Project-based learning. Expert mentorship.' },
        { text: 'Transform your career with our comprehensive Data Science course. Real industry projects. Job guarantee.' }
      ],
      path1: 'DataScience',
      path2: 'Training'
    },
    null,
    null,
    null,
    createPolicySummary(PolicyApprovalStatus.APPROVED),
    undefined,
    'www.aiinfoxtech.com'
  ),

  // Expanded Text Ad 1
  new Ad(
    'ad_003',
    'adgroup_003',
    'campaign_001',
    'customer_001',
    'Python Programming ETA',
    AdStatus.PAUSED,
    AdType.EXPANDED_TEXT_AD,
    AdStrength.AVERAGE,
    {
      finalUrls: ['https://www.aiinfoxtech.com/python-training']
    },
    null,
    {
      headlinePart1: 'Python Programming Course',
      headlinePart2: 'Beginner to Advanced Level',
      headlinePart3: 'Online & Offline Training',
      description1: 'Learn Python from scratch. Build real-world projects. Expert instructors. Flexible schedules.',
      description2: 'Join 10,000+ students. Get certified. Career support included. Enroll today!',
      path1: 'Python',
      path2: 'Course'
    },
    null,
    null,
    createPolicySummary(PolicyApprovalStatus.APPROVED),
    undefined,
    'www.aiinfoxtech.com'
  ),

  // Responsive Search Ad 3 - Cloud Computing
  new Ad(
    'ad_004',
    'adgroup_004',
    'campaign_002',
    'customer_001',
    'Cloud Computing Training RSA',
    AdStatus.ENABLED,
    AdType.RESPONSIVE_SEARCH_AD,
    AdStrength.GOOD,
    {
      finalUrls: ['https://www.aiinfoxtech.com/cloud-computing']
    },
    {
      headlines: [
        { text: 'AWS, Azure & GCP Training' },
        { text: 'Cloud Computing Course' },
        { text: 'Master Cloud Technologies' },
        { text: 'Get Cloud Certified' },
        { text: 'DevOps Included' },
        { text: 'Industry Expert Faculty' }
      ],
      descriptions: [
        { text: 'Complete Cloud Computing training. AWS, Azure, GCP covered. Hands-on labs. Certification prep.' },
        { text: 'Become a Cloud Engineer. Learn infrastructure, security, deployment. Job-ready in 10 weeks.' }
      ],
      path1: 'Cloud',
      path2: 'Training'
    },
    null,
    null,
    null,
    createPolicySummary(PolicyApprovalStatus.APPROVED),
    undefined,
    'www.aiinfoxtech.com'
  ),

  // Responsive Search Ad 4 - Under Review
  new Ad(
    'ad_005',
    'adgroup_005',
    'campaign_002',
    'customer_001',
    'Best AI Course - Under Review',
    AdStatus.UNDER_REVIEW,
    AdType.RESPONSIVE_SEARCH_AD,
    AdStrength.POOR,
    {
      finalUrls: ['https://www.aiinfoxtech.com/best-ai-course']
    },
    {
      headlines: [
        { text: 'BEST AI COURSE EVER!!!' },
        { text: 'Guaranteed Job in 30 Days' },
        { text: 'Make $100K Immediately' }
      ],
      descriptions: [
        { text: 'The absolute best AI course you will ever find! Guaranteed results or money back!!!' }
      ],
      path1: 'Best',
      path2: 'Course'
    },
    null,
    null,
    null,
    createPolicySummary(PolicyApprovalStatus.UNDER_REVIEW),
    undefined,
    'www.aiinfoxtech.com'
  ),

  // Responsive Search Ad 5 - Disapproved
  new Ad(
    'ad_006',
    'adgroup_005',
    'campaign_002',
    'customer_001',
    'Cheap AI Training - Disapproved',
    AdStatus.DISAPPROVED,
    AdType.RESPONSIVE_SEARCH_AD,
    AdStrength.POOR,
    {
      finalUrls: ['https://www.aiinfoxtech.com/cheap-training']
    },
    {
      headlines: [
        { text: 'CHEAPEST AI COURSE!!!' },
        { text: '100% FREE TRAINING NOW' },
        { text: 'CLICK HERE NOW!!!' }
      ],
      descriptions: [
        { text: 'FREE FREE FREE!!! Get everything for FREE!!! CLICK NOW to claim your FREE course!!!' }
      ]
    },
    null,
    null,
    null,
    createPolicySummary(PolicyApprovalStatus.DISAPPROVED),
    undefined,
    'www.aiinfoxtech.com'
  ),

  // Responsive Search Ad 6 - Full Stack Development
  new Ad(
    'ad_007',
    'adgroup_006',
    'campaign_003',
    'customer_001',
    'Full Stack Development',
    AdStatus.ENABLED,
    AdType.RESPONSIVE_SEARCH_AD,
    AdStrength.EXCELLENT,
    {
      finalUrls: ['https://www.aiinfoxtech.com/full-stack']
    },
    {
      headlines: [
        { text: 'Full Stack Developer Course' },
        { text: 'MERN Stack Training' },
        { text: 'React, Node, MongoDB' },
        { text: 'Build Complete Web Apps' },
        { text: 'Portfolio Projects Included' },
        { text: 'Job-Ready in 16 Weeks' },
        { text: 'Live Instructor-Led Classes' },
        { text: 'Industry-Standard Tools' }
      ],
      descriptions: [
        { text: 'Master MERN stack development. Build real applications. Get hired as a Full Stack Developer.' },
        { text: 'Learn React, Node.js, Express, MongoDB. Create portfolio projects. 100% placement assistance.' },
        { text: 'Comprehensive Full Stack program. Frontend & Backend covered. Capstone project included.' }
      ],
      path1: 'FullStack',
      path2: 'Development'
    },
    null,
    null,
    null,
    createPolicySummary(PolicyApprovalStatus.APPROVED),
    undefined,
    'www.aiinfoxtech.com'
  ),

  // Responsive Search Ad 7 - Cybersecurity
  new Ad(
    'ad_008',
    'adgroup_007',
    'campaign_003',
    'customer_001',
    'Cybersecurity Training',
    AdStatus.ENABLED,
    AdType.RESPONSIVE_SEARCH_AD,
    AdStrength.GOOD,
    {
      finalUrls: ['https://www.aiinfoxtech.com/cybersecurity']
    },
    {
      headlines: [
        { text: 'Ethical Hacking Course' },
        { text: 'Cybersecurity Training' },
        { text: 'CEH Certification Prep' },
        { text: 'Network Security Expert' },
        { text: 'Penetration Testing' },
        { text: 'Real-World Lab Access' }
      ],
      descriptions: [
        { text: 'Become a Cybersecurity Expert. Ethical Hacking, Network Security, Penetration Testing. CEH certified instructors.' },
        { text: 'Protect against cyber threats. Learn security tools and techniques. Hands-on training. Job placement support.' }
      ],
      path1: 'Cybersecurity',
      path2: 'Training'
    },
    null,
    null,
    null,
    createPolicySummary(PolicyApprovalStatus.APPROVED),
    undefined,
    'www.aiinfoxtech.com'
  ),

  // Expanded Text Ad 2 - Digital Marketing
  new Ad(
    'ad_009',
    'adgroup_008',
    'campaign_004',
    'customer_001',
    'Digital Marketing Course ETA',
    AdStatus.ENABLED,
    AdType.EXPANDED_TEXT_AD,
    AdStrength.AVERAGE,
    {
      finalUrls: ['https://www.aiinfoxtech.com/digital-marketing']
    },
    null,
    {
      headlinePart1: 'Digital Marketing Course',
      headlinePart2: 'SEO, Social Media, PPC',
      headlinePart3: 'Google & Facebook Certified',
      description1: 'Master Digital Marketing. Learn SEO, SEM, Social Media, Content Marketing. Industry-recognized certifications.',
      description2: 'Practical training with live campaigns. Build your portfolio. Career guidance included.',
      path1: 'DigitalMarketing',
      path2: 'Course'
    },
    null,
    null,
    createPolicySummary(PolicyApprovalStatus.APPROVED),
    undefined,
    'www.aiinfoxtech.com'
  ),

  // Responsive Search Ad 8 - Blockchain
  new Ad(
    'ad_010',
    'adgroup_009',
    'campaign_004',
    'customer_001',
    'Blockchain Development',
    AdStatus.PAUSED,
    AdType.RESPONSIVE_SEARCH_AD,
    AdStrength.AVERAGE,
    {
      finalUrls: ['https://www.aiinfoxtech.com/blockchain']
    },
    {
      headlines: [
        { text: 'Blockchain Developer Course' },
        { text: 'Web3 & Cryptocurrency' },
        { text: 'Smart Contract Development' },
        { text: 'Ethereum & Solidity' },
        { text: 'NFT Development' },
        { text: 'DeFi Applications' }
      ],
      descriptions: [
        { text: 'Learn Blockchain development from scratch. Build DApps, Smart Contracts, NFTs. High-demand skills.' },
        { text: 'Master Web3 technologies. Solidity, Ethereum, Hyperledger. Create your own crypto projects.' }
      ],
      path1: 'Blockchain',
      path2: 'Development'
    },
    null,
    null,
    null,
    createPolicySummary(PolicyApprovalStatus.APPROVED),
    undefined,
    'www.aiinfoxtech.com'
  )
];

/**
 * Mock time series data generator
 */
export const generateMockAdTimeSeries = (adId: string, days: number = 114) => {
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate realistic-looking metrics with variation
    const baseImpressions = Math.floor(Math.random() * 200) + 50;
    const clicks = Math.floor(baseImpressions * (Math.random() * 0.05 + 0.02)); // 2-7% CTR
    const interactions = clicks + Math.floor(Math.random() * 5);
    const conversions = Math.floor(clicks * (Math.random() * 0.1 + 0.05)); // 5-15% conversion rate
    const cost = clicks * (Math.random() * 50 + 10); // ₹10-60 per click

    data.push({
      date,
      impressions: baseImpressions,
      clicks,
      interactions,
      cost,
      conversions,
      videoViews: Math.floor(Math.random() * 20)
    });
  }

  return data;
};

/**
 * Mock ad metrics
 * FIXED: Using Money.create() instead of new Money()
 */
export const generateMockAdMetrics = () => {
  const impressions = Math.floor(Math.random() * 5000) + 500;
  const clicks = Math.floor(impressions * (Math.random() * 0.05 + 0.02));
  const interactions = clicks + Math.floor(Math.random() * 10);
  const cost = clicks * (Math.random() * 50 + 10);
  const conversions = Math.floor(clicks * (Math.random() * 0.1 + 0.05));

  return {
    impressions,
    clicks,
    interactions,
    interactionRate: ((interactions / impressions) * 100).toFixed(2),
    averageCost: Money.create(cost / clicks, 'INR'),
    cost: Money.create(cost, 'INR'),
    conversions,
    conversionRate: ((conversions / clicks) * 100).toFixed(2),
    ctr: ((clicks / impressions) * 100).toFixed(2),
    averageCpc: Money.create(cost / clicks, 'INR'),
    averageCpm: Money.create((cost / impressions) * 1000, 'INR'),
    videoViews: Math.floor(Math.random() * 100),
    videoViewRate: (Math.random() * 20).toFixed(2),
    engagements: Math.floor(Math.random() * 50),
    engagementRate: (Math.random() * 5).toFixed(2)
  };
};
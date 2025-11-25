import { Audience, AudienceType, AudienceMetrics } from '@domain/entities';

const audienceNames = [
  'Youtube Analytics Audience',
  'Youtube Remarketing Audience',
  'Google Analytics Audience',
  'Broad audience',
  'Mixed audience',
  'Remarketing audience',
  'In-market shoppers',
  'Tech enthusiasts',
  'Business professionals',
  'Digital marketers',
];

export function generateAudiences(count: number = 10): Audience[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `audience-${i + 1}`,
    name: audienceNames[i % audienceNames.length],
    type: Object.values(AudienceType)[Math.floor(Math.random() * Object.values(AudienceType).length)] as AudienceType,
    size: Math.floor(Math.random() * 500000) + 10000,
    description: `${audienceNames[i % audienceNames.length]} - Auto-generated audience`,
    status: Math.random() > 0.2 ? 'ACTIVE' : 'INACTIVE',
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }));
}

export function generateAudienceMetrics(audienceId: string): AudienceMetrics {
  const impressions = Math.floor(Math.random() * 50000) + 1000;
  const ctr = Math.random() * 0.08 + 0.01;
  const clicks = Math.floor(impressions * ctr);
  const conversionRate = Math.random() * 0.12 + 0.01;
  const conversions = Math.floor(clicks * conversionRate);

  return {
    audienceId,
    impressions,
    clicks,
    conversions,
    ctr,
    conversionRate,
  };
}

export function generateAudiencePerformanceData(audienceId: string, segments: number = 15): Array<{
  segment: string;
  clicks: number;
}> {
  const segments_list = [
    'Youtube Analytics',
    'Youtube Remarketing',
    'Remarketing Audience',
    'Broad Audience',
    'Google ads Remarketing Audience',
    'Mixed audience',
    'Broad audience',
    'Interest category',
    'Affinity category',
    'Youtube ads',
    'Similar Audiences',
    'Life Events',
    'Custom Intent',
    'In-Market',
    'Demographics',
  ];

  return segments_list.slice(0, segments).map((segment, i) => ({
    segment,
    clicks: Math.floor(Math.random() * 1000) + 100 - (i * 30),
  }));
}
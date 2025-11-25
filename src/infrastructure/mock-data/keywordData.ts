import { Keyword, KeywordMetrics } from '@domain/entities';
import { KeywordStatus, MatchType } from '@domain/enums';
import { Money } from '@domain/value-objects';

const keywordTexts = [
  'google ads course',
  'adwords training',
  'google ads skills',
  'ppc training',
  'digital marketing course',
  'google ads certification',
  'google ads tutorial',
  'google ads for beginners',
  'google ads advanced',
  'google ads strategy',
  'google ads optimization',
  'google ads management',
  'ppc management',
  'sem training',
  'google ads consultant',
];

export function generateKeywords(campaignId: string, adGroupId: string, count: number = 20): Keyword[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `keyword-${campaignId}-${adGroupId}-${i + 1}`,
    adGroupId,
    campaignId,
    text: keywordTexts[i % keywordTexts.length],
    matchType: Object.values(MatchType)[Math.floor(Math.random() * 3)] as MatchType,
    status: Object.values(KeywordStatus)[Math.floor(Math.random() * 3)] as KeywordStatus,
    bid: Money.create(Math.random() * 5 + 0.5),
    qualityScore: Math.floor(Math.random() * 6) + 4, // 4-10
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }));
}

export function generateKeywordMetrics(keywordId: string): KeywordMetrics {
  const impressions = Math.floor(Math.random() * 5000) + 100;
  const ctr = Math.random() * 0.1 + 0.01;
  const clicks = Math.floor(impressions * ctr);
  const conversionRate = Math.random() * 0.15 + 0.01;
  const conversions = Math.floor(clicks * conversionRate);
  const cpc = Math.random() * 3 + 0.3;
  const cost = Money.create(clicks * cpc);

  return {
    keywordId,
    impressions,
    clicks,
    conversions,
    cost,
    ctr,
    averageCpc: Money.create(cpc),
    conversionRate,
    impressionShare: Math.random() * 0.5 + 0.3,
  };
}
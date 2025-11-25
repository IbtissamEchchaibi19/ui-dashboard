import { Money } from '@domain/value-objects';

export interface OverviewMetrics {
  clicks: number;
  conversions: number;
  cost: Money;
  impressions: number;
  ctr: number;
  averageCpc: Money;
  conversionRate: number;
}

export function generateOverviewMetrics(): OverviewMetrics {
  const clicks = Math.floor(Math.random() * 50000) + 10000;
  const impressions = clicks * (Math.random() * 20 + 10);
  const conversions = Math.floor(clicks * (Math.random() * 0.1 + 0.02));
  const cost = Money.create(clicks * (Math.random() * 2 + 0.5));

  return {
    clicks,
    conversions,
    cost,
    impressions,
    ctr: clicks / impressions,
    averageCpc: Money.create(cost.amount / clicks),
    conversionRate: conversions / clicks,
  };
}

export interface RecommendationItem {
  id: string;
  type: 'info' | 'warning' | 'success';
  title: string;
  description: string;
  action?: string;
  dismissible: boolean;
}

export function generateRecommendations(): RecommendationItem[] {
  return [
    {
      id: 'rec-1',
      type: 'info',
      title: 'Universal Analytics audiences are moving to Google Analytics 4',
      description: 'Universal Analytics (UA) properties will stop processing data starting on July 1, 2023. Going forward, UA audiences will no longer add new users to your audience sizes will decrease over time. Your GA4 audiences will be automatically configured for you. They will be used in your current campaigns and ad groups, in place of your UA audiences.',
      action: 'Learn more about the change',
      dismissible: true,
    },
    {
      id: 'rec-2',
      type: 'info',
      title: 'Similar segments are removed',
      description: 'Similar segments are no fully removed from Google Ads starting August 1, 2023. If your Display, Video & Discovery ad groups are opted into optimized targeting and audience expansion, there\'s no action required. If your ad groups used similar segments, some of them might be paused in your account.',
      action: 'Learn more about the change',
      dismissible: true,
    },
    {
      id: 'rec-3',
      type: 'success',
      title: 'Try the new Google Ads mobile app',
      description: 'Monitor performance and improve your account on the go',
      dismissible: false,
    },
  ];
}
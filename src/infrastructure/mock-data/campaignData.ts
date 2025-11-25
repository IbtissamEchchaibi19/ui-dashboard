import { Campaign, CampaignMetrics } from '@domain/entities';
import { CampaignStatus, CampaignType } from '@domain/enums';
import { Money } from '@domain/value-objects';

const campaignNames = [
  '[100 Leads] Profitable PPC Search Campaign Example',
  '[100 leads workshop v2] Youtube ad 2023 custom and remarketing',
  '[100 leads workshop] Youtube ad 2023 custom and remarketing',
  '[100 Leads] - Gmail and Discovery ad',
  'Display ad campaign usa',
  'Display ads sample new ui',
  'Display data campaign data',
  'Free Workshop Test',
  'Google ads master Manual CPC test',
  'Hosting Ads 2021',
  'Location Targeting - Presence and interest',
  'Course direct experiment',
  'Demand Gen - (Manual Settings)',
  'Demand Gen - 2023-10-30 - irene 1',
  'Demand Gen - Onboarding Flow - ad group level targeting',
];

const biddingStrategies = [
  'Manual CPC',
  'Maximize Clicks',
  'Maximize Conversions',
  'Target CPA',
  'Target ROAS',
  'Maximize Conversion Value',
];

const locations = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
];

export function generateCampaigns(count: number = 15): Campaign[] {
  return Array.from({ length: count }, (_, i) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 365));
    
    const hasEndDate = Math.random() > 0.7;
    const endDate = hasEndDate ? new Date(startDate.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000) : null;

    return {
      id: `campaign-${i + 1}`,
      name: campaignNames[i % campaignNames.length],
      status: Object.values(CampaignStatus)[Math.floor(Math.random() * 3)] as CampaignStatus,
      type: Object.values(CampaignType)[Math.floor(Math.random() * Object.values(CampaignType).length)] as CampaignType,
      budget: Money.create(Math.floor(Math.random() * 500) + 50),
      budgetType: Math.random() > 0.5 ? 'DAILY' : 'TOTAL',
      startDate,
      endDate,
      targetLocations: [locations[Math.floor(Math.random() * locations.length)]],
      biddingStrategy: biddingStrategies[Math.floor(Math.random() * biddingStrategies.length)],
      createdAt: startDate,
      updatedAt: new Date(),
    };
  });
}

export function generateCampaignMetrics(campaignId: string, days: number = 30): CampaignMetrics[] {
  const baseImpressions = Math.floor(Math.random() * 10000) + 1000;
  const baseCtr = Math.random() * 0.05 + 0.01; // 1-6%
  const baseConversionRate = Math.random() * 0.1 + 0.01; // 1-11%
  const baseCpc = Math.random() * 2 + 0.5; // $0.5-$2.5

  return Array.from({ length: days }, (_, i) => {
    const impressions = Math.floor(baseImpressions * (0.8 + Math.random() * 0.4));
    const clicks = Math.floor(impressions * baseCtr * (0.8 + Math.random() * 0.4));
    const conversions = Math.floor(clicks * baseConversionRate * (0.8 + Math.random() * 0.4));
    const cost = Money.create(clicks * baseCpc * (0.9 + Math.random() * 0.2));
    const ctr = clicks / impressions;
    const averageCpc = Money.create(cost.amount / clicks || 0);
    const conversionRate = conversions / clicks || 0;
    const costPerConversion = Money.create(cost.amount / conversions || 0);

    return {
      campaignId,
      impressions,
      clicks,
      conversions,
      cost,
      ctr,
      averageCpc,
      conversionRate,
      costPerConversion,
    };
  });
}

export function generateTimeSeriesData(days: number = 90): Array<{
  date: Date;
  clicks: number;
  conversions: number;
  cost: number;
}> {
  const data: Array<{ date: Date; clicks: number; conversions: number; cost: number }> = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const baseClicks = 50 + Math.random() * 100;
    const seasonality = Math.sin((i / days) * Math.PI * 2) * 20;
    const trend = (i / days) * 30;
    
    data.push({
      date,
      clicks: Math.floor(baseClicks + seasonality + trend + (Math.random() - 0.5) * 30),
      conversions: Math.floor((baseClicks + seasonality + trend) * 0.03 + Math.random() * 5),
      cost: Math.floor((baseClicks + seasonality + trend) * 1.5 + Math.random() * 50),
    });
  }

  return data;
}
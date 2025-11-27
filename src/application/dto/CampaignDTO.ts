export { CampaignStatus as CampaignStatusUI } from '@domain/enums';

// Re-export Campaign Type enum for UI (same values as domain)
export { CampaignType as CampaignTypeUI } from '@domain/enums';


// Re-export Campaign entity for UI (same as domain)
export type { Campaign as CampaignUI } from '@domain/entities';


// Metric columns type
export type MetricColumn = 
  | 'impressions' 
  | 'clicks' 
  | 'conversions' 
  | 'cost' 
  | 'ctr' 
  | 'conversionRate' 
  | 'avgCost';
  
  export interface AdGroupRow {
  name: string;
  impressions: number;
  clicks: number;
  interactionRate: string;
  avgCost: string;
  cost: string;
  conversions?: number;
  conversionRate?: string;
}
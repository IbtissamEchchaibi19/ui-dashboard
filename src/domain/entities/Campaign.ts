import { CampaignStatus, CampaignType } from '../enums';
import { Money } from '../value-objects';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  type: CampaignType;
  budget: Money;
  budgetType: 'DAILY' | 'TOTAL';
  startDate: Date;
  endDate: Date | null;
  targetLocations: string[];
  biddingStrategy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignMetrics {
  campaignId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: Money;
  ctr: number;
  averageCpc: Money;
  conversionRate: number;
  costPerConversion: Money;
}

export class CampaignEntity implements Campaign {
  constructor(
    public id: string,
    public name: string,
    public status: CampaignStatus,
    public type: CampaignType,
    public budget: Money,
    public budgetType: 'DAILY' | 'TOTAL',
    public startDate: Date,
    public endDate: Date | null,
    public targetLocations: string[],
    public biddingStrategy: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  isActive(): boolean {
    return this.status === CampaignStatus.ENABLED;
  }

  isPaused(): boolean {
    return this.status === CampaignStatus.PAUSED;
  }

  isExpired(): boolean {
    if (!this.endDate) return false;
    return new Date() > this.endDate;
  }

  canBeEdited(): boolean {
    return this.status !== CampaignStatus.REMOVED;
  }
}
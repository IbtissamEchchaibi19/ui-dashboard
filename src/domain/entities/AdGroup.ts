import { AdGroupStatus } from '../enums';
import { Money } from '../value-objects';

export interface AdGroup {
  id: string;
  campaignId: string;
  name: string;
  status: AdGroupStatus;
  defaultBid: Money;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdGroupMetrics {
  adGroupId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: Money;
  ctr: number;
  averageCpc: Money;
}

export class AdGroupEntity implements AdGroup {
  constructor(
    public id: string,
    public campaignId: string,
    public name: string,
    public status: AdGroupStatus,
    public defaultBid: Money,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  isActive(): boolean {
    return this.status === AdGroupStatus.ENABLED;
  }
}
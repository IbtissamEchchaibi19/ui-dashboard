import { KeywordStatus, MatchType } from '../enums';
import { Money } from '../value-objects';

export interface Keyword {
  id: string;
  adGroupId: string;
  campaignId: string;
  text: string;
  matchType: MatchType;
  status: KeywordStatus;
  bid: Money;
  qualityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface KeywordMetrics {
  keywordId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: Money;
  ctr: number;
  averageCpc: Money;
  conversionRate: number;
  impressionShare: number;
}

export class KeywordEntity implements Keyword {
  constructor(
    public id: string,
    public adGroupId: string,
    public campaignId: string,
    public text: string,
    public matchType: MatchType,
    public status: KeywordStatus,
    public bid: Money,
    public qualityScore: number,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  isActive(): boolean {
    return this.status === KeywordStatus.ENABLED;
  }

  hasGoodQualityScore(): boolean {
    return this.qualityScore >= 7;
  }
}
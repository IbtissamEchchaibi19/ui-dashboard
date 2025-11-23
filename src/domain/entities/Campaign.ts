// src/domain/entities/Campaign.ts

export enum CampaignStatus {
  ENABLED = 'ENABLED',
  PAUSED = 'PAUSED',
  REMOVED = 'REMOVED',
  PENDING = 'PENDING',
}

export enum CampaignType {
  SEARCH = 'SEARCH',
  DISPLAY = 'DISPLAY',
  SHOPPING = 'SHOPPING',
  VIDEO = 'VIDEO',
  SMART = 'SMART',
  PERFORMANCE_MAX = 'PERFORMANCE_MAX',
}

export enum BiddingStrategy {
  MANUAL_CPC = 'MANUAL_CPC',
  MAXIMIZE_CLICKS = 'MAXIMIZE_CLICKS',
  MAXIMIZE_CONVERSIONS = 'MAXIMIZE_CONVERSIONS',
  TARGET_CPA = 'TARGET_CPA',
  TARGET_ROAS = 'TARGET_ROAS',
  MAXIMIZE_CONVERSION_VALUE = 'MAXIMIZE_CONVERSION_VALUE',
}

export interface Budget {
  id: string;
  amount: number;
  currency: string;
  deliveryMethod: 'STANDARD' | 'ACCELERATED';
}

export interface BiddingStrategyConfig {
  type: BiddingStrategy;
  targetCpa?: number;
  targetRoas?: number;
  maxCpcBid?: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  type: CampaignType;
  budget: Budget;
  biddingStrategy: BiddingStrategyConfig;
  startDate: Date;
  endDate?: Date;
  adGroups?: AdGroup[];
  settings: CampaignSettings;
  metrics: CampaignMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignSettings {
  networks: {
    googleSearch: boolean;
    searchPartners: boolean;
    displayNetwork: boolean;
  };
  locations: string[];
  languages: string[];
  deviceTargeting: {
    mobile: boolean;
    desktop: boolean;
    tablet: boolean;
  };
  adSchedule?: AdSchedule[];
  audienceTargeting?: AudienceTargeting;
}

export interface AdSchedule {
  dayOfWeek: number;
  startHour: number;
  endHour: number;
  bidModifier: number;
}

export interface AudienceTargeting {
  demographics?: Demographics;
  interests?: string[];
  customAudiences?: string[];
  remarketingLists?: string[];
}

export interface Demographics {
  age?: string[];
  gender?: string[];
  parentalStatus?: string[];
  householdIncome?: string[];
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  conversionValue: number;
  ctr: number;
  averageCpc: number;
  costPerConversion: number;
  roas: number;
  impressionShare: number;
}

export interface AdGroup {
  id: string;
  campaignId: string;
  name: string;
  status: CampaignStatus;
  defaultMaxCpc: number;
  ads: Ad[];
  keywords: Keyword[];
  metrics: CampaignMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ad {
  id: string;
  adGroupId: string;
  type: 'TEXT' | 'RESPONSIVE_SEARCH' | 'DISPLAY' | 'VIDEO';
  status: CampaignStatus;
  headlines: string[];
  descriptions: string[];
  finalUrls: string[];
  path1?: string;
  path2?: string;
  metrics: CampaignMetrics;
  createdAt: Date;
}

export interface Keyword {
  id: string;
  adGroupId: string;
  text: string;
  matchType: 'EXACT' | 'PHRASE' | 'BROAD';
  status: CampaignStatus;
  maxCpc?: number;
  qualityScore: number;
  metrics: CampaignMetrics;
  createdAt: Date;
}

export interface AssetGroup {
  id: string;
  campaignId: string;
  name: string;
  status: CampaignStatus;
  headlines: string[];
  longHeadlines: string[];
  descriptions: string[];
  images: Asset[];
  logos: Asset[];
  videos: Asset[];
  finalUrls: string[];
  metrics: CampaignMetrics;
}

export interface Asset {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'LOGO';
  url: string;
  name: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface Experiment {
  id: string;
  campaignId: string;
  name: string;
  description: string;
  status: 'DRAFT' | 'RUNNING' | 'COMPLETED' | 'PAUSED';
  startDate: Date;
  endDate?: Date;
  trafficSplit: number;
  control: ExperimentArm;
  treatment: ExperimentArm;
  results?: ExperimentResults;
  createdAt: Date;
}

export interface ExperimentArm {
  name: string;
  metrics: CampaignMetrics;
}

export interface ExperimentResults {
  winner?: 'CONTROL' | 'TREATMENT' | 'INCONCLUSIVE';
  confidence: number;
  improvement: number;
}

export interface ChangeHistoryEntry {
  id: string;
  entityType: 'CAMPAIGN' | 'AD_GROUP' | 'AD' | 'KEYWORD';
  entityId: string;
  entityName: string;
  changeType: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE';
  field?: string;
  oldValue?: string;
  newValue?: string;
  changedBy: string;
  timestamp: Date;
}
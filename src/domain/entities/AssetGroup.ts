// domain/entities/AssetGroup.ts

export enum AssetGroupStatus {
  ENABLED = 'ENABLED',
  PAUSED = 'PAUSED',
  REMOVED = 'REMOVED'
}

export enum AssetGroupPrimaryStatus {
  ELIGIBLE = 'ELIGIBLE',
  LIMITED = 'LIMITED',
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  PAUSED = 'PAUSED',
  PENDING = 'PENDING',
  REMOVED = 'REMOVED',
  UNKNOWN = 'UNKNOWN'
}

export enum AssetGroupPrimaryStatusReason {
  ASSET_GROUP_DISAPPROVED = 'ASSET_GROUP_DISAPPROVED',
  ASSET_GROUP_LIMITED = 'ASSET_GROUP_LIMITED',
  ASSET_GROUP_PAUSED = 'ASSET_GROUP_PAUSED',
  ASSET_GROUP_REMOVED = 'ASSET_GROUP_REMOVED',
  ASSET_GROUP_UNDER_REVIEW = 'ASSET_GROUP_UNDER_REVIEW',
  CAMPAIGN_ENDED = 'CAMPAIGN_ENDED',
  CAMPAIGN_PAUSED = 'CAMPAIGN_PAUSED',
  CAMPAIGN_PENDING = 'CAMPAIGN_PENDING',
  CAMPAIGN_REMOVED = 'CAMPAIGN_REMOVED',
  UNKNOWN = 'UNKNOWN'
}

export enum AdStrengthAsset {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  AVERAGE = 'AVERAGE',
  POOR = 'POOR',
  PENDING = 'PENDING',
  NO_ADS = 'NO_ADS',
  UNKNOWN = 'UNKNOWN'
}

export enum AssetFieldType {
  HEADLINE = 'HEADLINE',
  LONG_HEADLINE = 'LONG_HEADLINE',
  DESCRIPTION = 'DESCRIPTION',
  BUSINESS_NAME = 'BUSINESS_NAME',
  MARKETING_IMAGE = 'MARKETING_IMAGE',
  SQUARE_MARKETING_IMAGE = 'SQUARE_MARKETING_IMAGE',
  PORTRAIT_MARKETING_IMAGE = 'PORTRAIT_MARKETING_IMAGE',
  LOGO = 'LOGO',
  LANDSCAPE_LOGO = 'LANDSCAPE_LOGO',
  YOUTUBE_VIDEO = 'YOUTUBE_VIDEO',
  CALL_TO_ACTION = 'CALL_TO_ACTION',
  SITELINK = 'SITELINK',
  STRUCTURED_SNIPPET = 'STRUCTURED_SNIPPET',
  CALLOUT = 'CALLOUT',
  CALL = 'CALL',
  PRICE = 'PRICE',
  PROMOTION = 'PROMOTION'
}

export enum AssetPerformanceLabel {
  BEST = 'BEST',
  GOOD = 'GOOD',
  LOW = 'LOW',
  LEARNING = 'LEARNING',
  PENDING = 'PENDING',
  UNKNOWN = 'UNKNOWN'
}

export enum CallToActionType {
  LEARN_MORE = 'LEARN_MORE',
  GET_QUOTE = 'GET_QUOTE',
  APPLY_NOW = 'APPLY_NOW',
  SIGN_UP = 'SIGN_UP',
  CONTACT_US = 'CONTACT_US',
  SUBSCRIBE = 'SUBSCRIBE',
  DOWNLOAD = 'DOWNLOAD',
  BOOK_NOW = 'BOOK_NOW',
  SHOP_NOW = 'SHOP_NOW',
  BUY_NOW = 'BUY_NOW',
  DONATE_NOW = 'DONATE_NOW',
  ORDER_NOW = 'ORDER_NOW',
  PLAY_NOW = 'PLAY_NOW',
  SEE_MORE = 'SEE_MORE',
  START_NOW = 'START_NOW',
  VISIT_SITE = 'VISIT_SITE',
  WATCH_NOW = 'WATCH_NOW'
}

// Asset interfaces
export interface AssetGroupAsset {
  id: string;
  assetId: string;
  fieldType: AssetFieldType;
  performanceLabel: AssetPerformanceLabel;
  status: 'ENABLED' | 'PAUSED' | 'REMOVED';
  textContent?: string;
  imageUrl?: string;
  videoId?: string;
  videoUrl?: string;
  policyApprovalStatus?: 'APPROVED' | 'DISAPPROVED' | 'AREA_OF_INTEREST_ONLY' | 'APPROVED_LIMITED' | 'UNDER_REVIEW';
  source: 'ADVERTISER' | 'AUTOMATICALLY_CREATED';
}

export interface HeadlineAsset {
  id: string;
  text: string;
  performanceLabel: AssetPerformanceLabel;
  pinnedField?: 'HEADLINE_1' | 'HEADLINE_2' | 'HEADLINE_3';
}

export interface DescriptionAsset {
  id: string;
  text: string;
  performanceLabel: AssetPerformanceLabel;
  pinnedField?: 'DESCRIPTION_1' | 'DESCRIPTION_2';
}

export interface ImageAsset {
  id: string;
  url: string;
  fullSizeUrl?: string;
  width: number;
  height: number;
  mimeType: 'IMAGE_JPEG' | 'IMAGE_PNG' | 'IMAGE_GIF';
  performanceLabel: AssetPerformanceLabel;
  fileSize?: number;
}

export interface VideoAsset {
  id: string;
  youtubeVideoId: string;
  youtubeVideoTitle?: string;
  videoDurationMillis?: number;
  performanceLabel: AssetPerformanceLabel;
}

export interface AudienceSignal {
  id: string;
  name: string;
  type: 'CUSTOM_SEGMENT' | 'AUDIENCE' | 'DETAILED_DEMOGRAPHIC' | 'LIFE_EVENT';
  description?: string;
}

export interface ListingGroup {
  id: string;
  type: 'SUBDIVISION' | 'UNIT';
  caseValue?: string;
  parentId?: string;
  productCount?: number;
}

export interface AssetCoverage {
  adStrengthActionItems: string[];
  missingAssetTypes: AssetFieldType[];
  suggestedImprovements: string[];
}

// Main Entity
export class AssetGroup {
  constructor(
    public readonly id: string,
    public readonly campaignId: string,
    public readonly customerId: string,
    public name: string,
    public status: AssetGroupStatus,
    public primaryStatus: AssetGroupPrimaryStatus,
    public primaryStatusReasons: AssetGroupPrimaryStatusReason[],
    public adStrength: AdStrengthAsset,
    public finalUrls: string[],
    public finalMobileUrls: string[],
    public path1: string,
    public path2: string,
    public headlines: HeadlineAsset[],
    public longHeadlines: HeadlineAsset[],
    public descriptions: DescriptionAsset[],
    public marketingImages: ImageAsset[],
    public squareMarketingImages: ImageAsset[],
    public portraitMarketingImages: ImageAsset[],
    public logos: ImageAsset[],
    public landscapeLogos: ImageAsset[],
    public videos: VideoAsset[],
    public businessName: string,
    public callToAction: CallToActionType,
    public audienceSignals: AudienceSignal[],
    public listingGroups: ListingGroup[],
    public assetCoverage: AssetCoverage,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  // Utility getters
  get allAssets(): (HeadlineAsset | DescriptionAsset | ImageAsset | VideoAsset)[] {
    return [
      ...this.headlines,
      ...this.longHeadlines,
      ...this.descriptions,
      ...this.marketingImages,
      ...this.squareMarketingImages,
      ...this.portraitMarketingImages,
      ...this.logos,
      ...this.landscapeLogos,
      ...this.videos
    ];
  }

  isActive(): boolean {
    return this.status === AssetGroupStatus.ENABLED &&
           this.primaryStatus === AssetGroupPrimaryStatus.ELIGIBLE;
  }

  isEligible(): boolean {
    return [AssetGroupPrimaryStatus.ELIGIBLE, AssetGroupPrimaryStatus.LIMITED].includes(this.primaryStatus);
  }

  hasIssues(): boolean {
    return this.primaryStatusReasons.some(reason => reason !== AssetGroupPrimaryStatusReason.UNKNOWN);
  }

  getTotalAssetCount(): number {
    return this.allAssets.length;
  }

  meetsMinimumRequirements(): boolean {
    return (
      this.headlines.length >= 3 &&
      this.longHeadlines.length >= 1 &&
      this.descriptions.length >= 2 &&
      this.marketingImages.length >= 1 &&
      this.squareMarketingImages.length >= 1 &&
      this.logos.length >= 1
    );
  }

  getDisplayUrl(): string {
    if (!this.finalUrls?.[0]) return '';
    try {
      const url = new URL(this.finalUrls[0]);
      let display = url.hostname;
      if (this.path1) display += `/${this.path1}`;
      if (this.path2) display += `/${this.path2}`;
      return display;
    } catch {
      return this.finalUrls[0];
    }
  }

  pause(): void {
    this.status = AssetGroupStatus.PAUSED;
  }

  enable(): void {
    this.status = AssetGroupStatus.ENABLED;
  }

  remove(): void {
    this.status = AssetGroupStatus.REMOVED;
  }

  toJSON() {
    return {
      ...this,
      allAssets: this.allAssets
    };
  }
}

// import { Money } from '../value-objects/Money';

// /**
//  * Ad Status enumeration
//  */
export enum AdStatus {
  ENABLED = 'ENABLED',
  PAUSED = 'PAUSED',
  REMOVED = 'REMOVED',
  ELIGIBLE = 'ELIGIBLE',
  LIMITED = 'LIMITED',
  DISAPPROVED = 'DISAPPROVED',
  UNDER_REVIEW = 'UNDER_REVIEW'
}

/**
 * Ad Type enumeration
 */
export enum AdType {
  TEXT_AD = 'TEXT_AD',
  EXPANDED_TEXT_AD = 'EXPANDED_TEXT_AD',
  RESPONSIVE_SEARCH_AD = 'RESPONSIVE_SEARCH_AD',
  DISPLAY_AD = 'DISPLAY_AD',
  RESPONSIVE_DISPLAY_AD = 'RESPONSIVE_DISPLAY_AD',
  VIDEO_AD = 'VIDEO_AD',
  SHOPPING_AD = 'SHOPPING_AD',
  CALL_AD = 'CALL_AD',
  APP_AD = 'APP_AD',
  IMAGE_AD = 'IMAGE_AD',
  LOCAL_AD = 'LOCAL_AD',
  DYNAMIC_SEARCH_AD = 'DYNAMIC_SEARCH_AD'
}

/**
 * Ad Strength enumeration
 */
export enum AdStrength {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  PENDING = 'PENDING',
  NO_ADS = 'NO_ADS',
  POOR = 'POOR',
  AVERAGE = 'AVERAGE',
  GOOD = 'GOOD',
  EXCELLENT = 'EXCELLENT'
}

/**
 * Policy Approval Status
 */
export enum PolicyApprovalStatus {
  APPROVED = 'APPROVED',
  APPROVED_LIMITED = 'APPROVED_LIMITED',
  DISAPPROVED = 'DISAPPROVED',
  ELIGIBLE = 'ELIGIBLE',
  UNDER_REVIEW = 'UNDER_REVIEW',
  REVIEWED = 'REVIEWED',
  AREA_OF_INTEREST_ONLY = 'AREA_OF_INTEREST_ONLY'
}

/**
 * Asset Pinning Position
 */
export enum AssetPinning {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  HEADLINE_1 = 'HEADLINE_1',
  HEADLINE_2 = 'HEADLINE_2',
  HEADLINE_3 = 'HEADLINE_3',
  DESCRIPTION_1 = 'DESCRIPTION_1',
  DESCRIPTION_2 = 'DESCRIPTION_2'
}

/**
 * Ad Asset (Headlines and Descriptions)
 */
export interface AdAsset {
  text: string;
  pinning?: AssetPinning;
}

/**
 * Responsive Search Ad specific fields
 */
export interface ResponsiveSearchAdInfo {
  headlines: AdAsset[];
  descriptions: AdAsset[];
  path1?: string;
  path2?: string;
}

/**
 * Expanded Text Ad specific fields
 */
export interface ExpandedTextAdInfo {
  headlinePart1: string;
  headlinePart2: string;
  headlinePart3?: string;
  description1: string;
  description2?: string;
  path1?: string;
  path2?: string;
}

/**
 * Text Ad specific fields (legacy)
 */
export interface TextAdInfo {
  headline: string;
  description1: string;
  description2?: string;
}

/**
 * Display Ad specific fields
 */
export interface DisplayAdInfo {
  displayUrl: string;
  marketingImage?: string;
  squareMarketingImage?: string;
  logoImage?: string;
  squareLogoImage?: string;
  headline: string;
  longHeadline?: string;
  description: string;
  businessName: string;
  callToActionText?: string;
}

/**
 * Policy Topic Entry
 */
export interface PolicyTopicEntry {
  topic: string;
  type: string;
  evidences: string[];
}

/**
 * Policy Summary
 */
export interface PolicySummary {
  approvalStatus: PolicyApprovalStatus;
  reviewStatus: string;
  policyTopicEntries: PolicyTopicEntry[];
}

/**
 * URL Custom Parameters
 */
export interface UrlCustomParameter {
  key: string;
  value: string;
}

/**
 * Ad URLs
 */
export interface AdUrls {
  finalUrls: string[];
  finalMobileUrls?: string[];
  trackingUrlTemplate?: string;
  urlCustomParameters?: UrlCustomParameter[];
  finalUrlSuffix?: string;
}

/**
 * Ad Domain Entity
 */
export class Ad {
  constructor(
    public readonly id: string,
    public readonly adGroupId: string,
    public readonly campaignId: string,
    public readonly customerId: string,
    public name: string,
    public status: AdStatus,
    public readonly type: AdType,
    public adStrength: AdStrength,
    public urls: AdUrls,
    public responsiveSearchAd: ResponsiveSearchAdInfo | null,
    public expandedTextAd: ExpandedTextAdInfo | null,
    public textAd: TextAdInfo | null,
    public displayAd: DisplayAdInfo | null,
    public policySummary: PolicySummary,
    public devicePreference?: string,
    public displayUrl?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  isActive(): boolean {
    return this.status === AdStatus.ENABLED || this.status === AdStatus.ELIGIBLE;
  }

  isApproved(): boolean {
    return this.policySummary.approvalStatus === PolicyApprovalStatus.APPROVED ||
           this.policySummary.approvalStatus === PolicyApprovalStatus.APPROVED_LIMITED;
  }

  isDisapproved(): boolean {
    return this.policySummary.approvalStatus === PolicyApprovalStatus.DISAPPROVED;
  }

  isUnderReview(): boolean {
    return this.policySummary.approvalStatus === PolicyApprovalStatus.UNDER_REVIEW;
  }

  getPrimaryHeadline(): string {
    if (this.responsiveSearchAd && this.responsiveSearchAd.headlines.length > 0) {
      return this.responsiveSearchAd.headlines[0].text;
    }
    if (this.expandedTextAd) {
      return this.expandedTextAd.headlinePart1;
    }
    if (this.textAd) {
      return this.textAd.headline;
    }
    if (this.displayAd) {
      return this.displayAd.headline;
    }
    return this.name;
  }

  getPrimaryDescription(): string {
    if (this.responsiveSearchAd && this.responsiveSearchAd.descriptions.length > 0) {
      return this.responsiveSearchAd.descriptions[0].text;
    }
    if (this.expandedTextAd) {
      return this.expandedTextAd.description1;
    }
    if (this.textAd) {
      return this.textAd.description1;
    }
    if (this.displayAd) {
      return this.displayAd.description;
    }
    return '';
  }

  getPrimaryFinalUrl(): string {
    return this.urls.finalUrls.length > 0 ? this.urls.finalUrls[0] : '';
  }

  getDisplayPath(): string {
    if (this.responsiveSearchAd) {
      const parts = [
        this.responsiveSearchAd.path1,
        this.responsiveSearchAd.path2
      ].filter(Boolean);
      return parts.length > 0 ? '/' + parts.join('/') : '';
    }
    if (this.expandedTextAd) {
      const parts = [
        this.expandedTextAd.path1,
        this.expandedTextAd.path2
      ].filter(Boolean);
      return parts.length > 0 ? '/' + parts.join('/') : '';
    }
    return '';
  }

  pause(): void {
    this.status = AdStatus.PAUSED;
  }

  enable(): void {
    this.status = AdStatus.ENABLED;
  }

  remove(): void {
    this.status = AdStatus.REMOVED;
  }

  toJSON() {
    return {
      id: this.id,
      adGroupId: this.adGroupId,
      campaignId: this.campaignId,
      customerId: this.customerId,
      name: this.name,
      status: this.status,
      type: this.type,
      adStrength: this.adStrength,
      urls: this.urls,
      responsiveSearchAd: this.responsiveSearchAd,
      expandedTextAd: this.expandedTextAd,
      textAd: this.textAd,
      displayAd: this.displayAd,
      policySummary: this.policySummary,
      devicePreference: this.devicePreference,
      displayUrl: this.displayUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
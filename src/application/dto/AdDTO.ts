//application/dto/AdDTO.ts 
import { Money } from '@domain/value-objects';
import {
  AdStatus,
  AdType,
  AdStrength,
  PolicyApprovalStatus,
  AssetPinning,
  AdAsset,
  ResponsiveSearchAdInfo,
  ExpandedTextAdInfo,
  TextAdInfo,
  DisplayAdInfo,
  PolicySummary,
  AdUrls,
  Ad
} from '@domain/entities';

/**
 * Ad Status UI representation
 */
export enum AdStatusUI {
  ENABLED = 'Enabled',
  PAUSED = 'Paused',
  REMOVED = 'Removed',
  ELIGIBLE = 'Eligible',
  LIMITED = 'Limited',
  DISAPPROVED = 'Disapproved',
  UNDER_REVIEW = 'Under review'
}

/**
 * Ad Type UI representation
 */
export enum AdTypeUI {
  TEXT_AD = 'Text ad',
  EXPANDED_TEXT_AD = 'Expanded text ad',
  RESPONSIVE_SEARCH_AD = 'Responsive search ad',
  DISPLAY_AD = 'Display ad',
  RESPONSIVE_DISPLAY_AD = 'Responsive display ad',
  VIDEO_AD = 'Video ad',
  SHOPPING_AD = 'Shopping ad',
  CALL_AD = 'Call ad',
  APP_AD = 'App ad',
  IMAGE_AD = 'Image ad',
  LOCAL_AD = 'Local ad',
  DYNAMIC_SEARCH_AD = 'Dynamic search ad'
}

/**
 * Ad Strength UI representation
 */
export enum AdStrengthUI {
  UNSPECIFIED = 'Unspecified',
  UNKNOWN = 'Unknown',
  PENDING = 'Pending',
  NO_ADS = 'No ads',
  POOR = 'Poor',
  AVERAGE = 'Average',
  GOOD = 'Good',
  EXCELLENT = 'Excellent'
}

/**
 * Metric columns available for the ads table
 */
export type AdMetricColumn =
  | 'impressions'
  | 'clicks'
  | 'interactions'
  | 'interactionRate'
  | 'averageCost'
  | 'cost'
  | 'conversions'
  | 'conversionRate'
  | 'ctr'
  | 'averageCpc'
  | 'averageCpm'
  | 'videoViews'
  | 'engagements';

/**
 * Ad Performance Metrics (UI)
 */
export interface AdMetricsUI {
  impressions: number;
  clicks: number;
  interactions: number;
  interactionRate: string; // formatted percentage
  averageCost: Money;
  cost: Money;
  conversions: number;
  conversionRate: string; // formatted percentage
  ctr: string; // formatted percentage
  averageCpc: Money;
  averageCpm: Money;
  videoViews?: number;
  videoViewRate?: string;
  engagements?: number;
  engagementRate?: string;
}

/**
 * Asset Row (for expandable view showing individual headlines/descriptions)
 */
export interface AssetRow {
  name: string; // e.g., "Headline 1", "Description 1"
  text: string;
  pinning?: string;
  impressions: number;
  clicks: number;
  interactionRate: string;
  avgCost: string;
  cost: string;
  conversions: number;
  conversionRate: string;
}

/**
 * Ad DTO for UI layer
 */
export class AdUI {
  constructor(
    public readonly id: string,
    public readonly adGroupId: string,
    public readonly adGroupName: string,
    public readonly campaignId: string,
    public readonly campaignName: string,
    public readonly customerId: string,
    public name: string,
    public status: AdStatusUI,
    public type: AdTypeUI,
    public adStrength: AdStrengthUI,
    public primaryHeadline: string,
    public primaryDescription: string,
    public finalUrl: string,
    public displayUrl: string,
    public displayPath: string,
    public approvalStatus: string,
    public policyIssues: string[],
    public responsiveSearchAd: ResponsiveSearchAdInfo | null,
    public expandedTextAd: ExpandedTextAdInfo | null,
    public textAd: TextAdInfo | null,
    public displayAd: DisplayAdInfo | null,
    public urls: AdUrls,
    public metrics: AdMetricsUI,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Create AdUI from domain Ad entity
   */
  static fromDomain(
    ad: Ad,
    adGroupName: string,
    campaignName: string,
    metrics: AdMetricsUI
  ): AdUI {
    return new AdUI(
      ad.id,
      ad.adGroupId,
      adGroupName,
      ad.campaignId,
      campaignName,
      ad.customerId,
      ad.name,
      AdUI.mapStatus(ad.status),
      AdUI.mapType(ad.type),
      AdUI.mapAdStrength(ad.adStrength),
      ad.getPrimaryHeadline(),
      ad.getPrimaryDescription(),
      ad.getPrimaryFinalUrl(),
      ad.displayUrl || '',
      ad.getDisplayPath(),
      AdUI.mapApprovalStatus(ad.policySummary.approvalStatus),
      ad.policySummary.policyTopicEntries.map(e => e.topic),
      ad.responsiveSearchAd,
      ad.expandedTextAd,
      ad.textAd,
      ad.displayAd,
      ad.urls,
      metrics,
      ad.createdAt,
      ad.updatedAt
    );
  }

  /**
   * Map domain status to UI status
   */
  static mapStatus(status: AdStatus): AdStatusUI {
    const mapping: Record<AdStatus, AdStatusUI> = {
      [AdStatus.ENABLED]: AdStatusUI.ENABLED,
      [AdStatus.PAUSED]: AdStatusUI.PAUSED,
      [AdStatus.REMOVED]: AdStatusUI.REMOVED,
      [AdStatus.ELIGIBLE]: AdStatusUI.ELIGIBLE,
      [AdStatus.LIMITED]: AdStatusUI.LIMITED,
      [AdStatus.DISAPPROVED]: AdStatusUI.DISAPPROVED,
      [AdStatus.UNDER_REVIEW]: AdStatusUI.UNDER_REVIEW
    };
    return mapping[status];
  }

  /**
   * Map domain type to UI type
   */
  static mapType(type: AdType): AdTypeUI {
    const mapping: Record<AdType, AdTypeUI> = {
      [AdType.TEXT_AD]: AdTypeUI.TEXT_AD,
      [AdType.EXPANDED_TEXT_AD]: AdTypeUI.EXPANDED_TEXT_AD,
      [AdType.RESPONSIVE_SEARCH_AD]: AdTypeUI.RESPONSIVE_SEARCH_AD,
      [AdType.DISPLAY_AD]: AdTypeUI.DISPLAY_AD,
      [AdType.RESPONSIVE_DISPLAY_AD]: AdTypeUI.RESPONSIVE_DISPLAY_AD,
      [AdType.VIDEO_AD]: AdTypeUI.VIDEO_AD,
      [AdType.SHOPPING_AD]: AdTypeUI.SHOPPING_AD,
      [AdType.CALL_AD]: AdTypeUI.CALL_AD,
      [AdType.APP_AD]: AdTypeUI.APP_AD,
      [AdType.IMAGE_AD]: AdTypeUI.IMAGE_AD,
      [AdType.LOCAL_AD]: AdTypeUI.LOCAL_AD,
      [AdType.DYNAMIC_SEARCH_AD]: AdTypeUI.DYNAMIC_SEARCH_AD
    };
    return mapping[type];
  }

  /**
   * Map domain ad strength to UI ad strength
   */
  static mapAdStrength(strength: AdStrength): AdStrengthUI {
    const mapping: Record<AdStrength, AdStrengthUI> = {
      [AdStrength.UNSPECIFIED]: AdStrengthUI.UNSPECIFIED,
      [AdStrength.UNKNOWN]: AdStrengthUI.UNKNOWN,
      [AdStrength.PENDING]: AdStrengthUI.PENDING,
      [AdStrength.NO_ADS]: AdStrengthUI.NO_ADS,
      [AdStrength.POOR]: AdStrengthUI.POOR,
      [AdStrength.AVERAGE]: AdStrengthUI.AVERAGE,
      [AdStrength.GOOD]: AdStrengthUI.GOOD,
      [AdStrength.EXCELLENT]: AdStrengthUI.EXCELLENT
    };
    return mapping[strength];
  }

  /**
   * Map policy approval status to UI string
   */
  static mapApprovalStatus(status: PolicyApprovalStatus): string {
    const mapping: Record<PolicyApprovalStatus, string> = {
      [PolicyApprovalStatus.APPROVED]: 'Approved',
      [PolicyApprovalStatus.APPROVED_LIMITED]: 'Approved (limited)',
      [PolicyApprovalStatus.DISAPPROVED]: 'Disapproved',
      [PolicyApprovalStatus.ELIGIBLE]: 'Eligible',
      [PolicyApprovalStatus.UNDER_REVIEW]: 'Under review',
      [PolicyApprovalStatus.REVIEWED]: 'Reviewed',
      [PolicyApprovalStatus.AREA_OF_INTEREST_ONLY]: 'Area of interest only'
    };
    return mapping[status];
  }

  /**
   * Get asset rows for expandable table view
   */
  getAssetRows(): AssetRow[] {
    const rows: AssetRow[] = [];

    if (this.responsiveSearchAd) {
      // Add headline rows
      this.responsiveSearchAd.headlines.forEach((headline, index) => {
        rows.push({
          name: `Headline ${index + 1}`,
          text: headline.text,
          pinning: headline.pinning || undefined,
          impressions: Math.floor(Math.random() * 1000) + 100,
          clicks: Math.floor(Math.random() * 50) + 5,
          interactionRate: (Math.random() * 5).toFixed(2),
          avgCost: (Math.random() * 10 + 1).toFixed(2),
          cost: (Math.random() * 100 + 10).toFixed(2),
          conversions: Math.floor(Math.random() * 10),
          conversionRate: (Math.random() * 3).toFixed(2)
        });
      });

      // Add description rows
      this.responsiveSearchAd.descriptions.forEach((description, index) => {
        rows.push({
          name: `Description ${index + 1}`,
          text: description.text,
          pinning: description.pinning || undefined,
          impressions: Math.floor(Math.random() * 1000) + 100,
          clicks: Math.floor(Math.random() * 50) + 5,
          interactionRate: (Math.random() * 5).toFixed(2),
          avgCost: (Math.random() * 10 + 1).toFixed(2),
          cost: (Math.random() * 100 + 10).toFixed(2),
          conversions: Math.floor(Math.random() * 10),
          conversionRate: (Math.random() * 3).toFixed(2)
        });
      });
    }

    return rows;
  }

  /**
   * Check if ad has policy issues
   */
  hasPolicyIssues(): boolean {
    return this.policyIssues.length > 0;
  }

  /**
   * Check if ad is active
   */
  isActive(): boolean {
    return this.status === AdStatusUI.ENABLED || this.status === AdStatusUI.ELIGIBLE;
  }
}
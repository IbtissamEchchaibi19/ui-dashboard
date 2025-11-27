// application/dto/AssetGroupDTO.ts
import { Money } from '@domain/value-objects';
import {
  AssetGroup,
  AssetGroupStatus,
  AssetGroupPrimaryStatus,
  AssetGroupPrimaryStatusReason,
  AdStrengthAsset,
  AssetPerformanceLabel,
  CallToActionType,
  HeadlineAsset,
  DescriptionAsset,
  ImageAsset,
  VideoAsset
} from '@domain/entities';

/**
 * Asset Group Status UI representation
 */
export enum AssetGroupStatusUI {
  ENABLED = 'Enabled',
  PAUSED = 'Paused',
  REMOVED = 'Removed'
}

/**
 * Asset Group Primary Status UI representation
 */
export enum AssetGroupPrimaryStatusUI {
  ELIGIBLE = 'Eligible',
  LIMITED = 'Limited',
  NOT_ELIGIBLE = 'Not eligible',
  PAUSED = 'Paused',
  PENDING = 'Pending',
  REMOVED = 'Removed',
  UNKNOWN = 'Unknown'
}

/**
 * Ad Strength UI representation
 */
export enum AdStrengthUI {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  AVERAGE = 'Average',
  POOR = 'Poor',
  PENDING = 'Pending',
  NO_ADS = 'No ads',
  UNKNOWN = 'Unknown'
}

/**
 * Asset Performance Label UI
 */
export enum AssetPerformanceLabelUI {
  BEST = 'Best',
  GOOD = 'Good',
  LOW = 'Low',
  LEARNING = 'Learning',
  PENDING = 'Pending',
  UNKNOWN = '--'
}

/**
 * Metric columns available for the asset groups table
 */
export type AssetGroupMetricColumn =
  | 'impressions'
  | 'clicks'
  | 'interactions'
  | 'interactionRate'
  | 'ctr'
  | 'conversions'
  | 'conversionRate'
  | 'conversionsValue'
  | 'cost'
  | 'averageCpc'
  | 'costPerConversion'
  | 'roas';

/**
 * Asset Group Metrics UI
 */
export interface AssetGroupMetricsUI {
  impressions: number;
  clicks: number;
  interactions: number;
  interactionRate: string;
  ctr: string;
  conversions: number;
  conversionRate: string;
  conversionsValue: Money;
  cost: Money;
  averageCpc: Money;
  costPerConversion: Money;
  roas: string;
}

/**
 * Asset Summary for display
 */
export interface AssetSummaryUI {
  headlines: number;
  longHeadlines: number;
  descriptions: number;
  images: number;
  logos: number;
  videos: number;
  total: number;
}

/**
 * Asset Row for expandable view
 */
export interface AssetRowUI {
  id: string;
  type: string;
  content: string;
  performanceLabel: AssetPerformanceLabelUI;
  impressions: number;
  clicks: number;
  ctr: string;
}

/**
 * Audience Signal UI
 */
export interface AudienceSignalUI {
  id: string;
  name: string;
  type: string;
}

/**
 * Listing Group Summary UI
 */
export interface ListingGroupSummaryUI {
  count: number;
  productCount: number;
}

/**
 * Asset Coverage UI
 */
export interface AssetCoverageUI {
  actionItems: string[];
  missingTypes: string[];
  suggestions: string[];
}

/**
 * Asset Group DTO for UI layer
 */
export class AssetGroupUI {
  constructor(
    public readonly id: string,
    public readonly campaignId: string,
    public readonly campaignName: string,
    public readonly customerId: string,
    public name: string,
    public status: AssetGroupStatusUI,
    public primaryStatus: AssetGroupPrimaryStatusUI,
    public primaryStatusReasons: string[],
    public adStrength: AdStrengthUI,
    public finalUrl: string,
    public displayUrl: string,
    public assetSummary: AssetSummaryUI,
    public metrics: AssetGroupMetricsUI,
    public audienceSignals: AudienceSignalUI[],
    public listingGroupSummary: ListingGroupSummaryUI,
    public assetCoverage: AssetCoverageUI,
    public businessName: string,
    public callToAction: string,
    public hasVideos: boolean,
    public meetsRequirements: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    // Store original assets for expandable view
    private _headlines: HeadlineAsset[],
    private _longHeadlines: HeadlineAsset[],
    private _descriptions: DescriptionAsset[],
    private _images: ImageAsset[],
    private _videos: VideoAsset[]
  ) {}

  /**
   * Create AssetGroupUI from domain AssetGroup entity
   */
  static fromDomain(
    assetGroup: AssetGroup,
    campaignName: string,
    metrics: AssetGroupMetricsUI
  ): AssetGroupUI {
    const assetSummary: AssetSummaryUI = {
      headlines: assetGroup.headlines.length,
      longHeadlines: assetGroup.longHeadlines.length,
      descriptions: assetGroup.descriptions.length,
      images: assetGroup.marketingImages.length + 
              assetGroup.squareMarketingImages.length + 
              assetGroup.portraitMarketingImages.length,
      logos: assetGroup.logos.length + assetGroup.landscapeLogos.length,
      videos: assetGroup.videos.length,
      total: assetGroup.getTotalAssetCount()
    };

    const audienceSignals: AudienceSignalUI[] = assetGroup.audienceSignals.map(as => ({
      id: as.id,
      name: as.name,
      type: as.type.replace(/_/g, ' ').toLowerCase()
    }));

    const listingGroupSummary: ListingGroupSummaryUI = {
      count: assetGroup.listingGroups.length,
      productCount: assetGroup.listingGroups.reduce((sum, lg) => sum + (lg.productCount || 0), 0)
    };

    const assetCoverage: AssetCoverageUI = {
      actionItems: assetGroup.assetCoverage.adStrengthActionItems,
      missingTypes: assetGroup.assetCoverage.missingAssetTypes.map(t => t.replace(/_/g, ' ')),
      suggestions: assetGroup.assetCoverage.suggestedImprovements
    };

    return new AssetGroupUI(
      assetGroup.id,
      assetGroup.campaignId,
      campaignName,
      assetGroup.customerId,
      assetGroup.name,
      AssetGroupUI.mapStatus(assetGroup.status),
      AssetGroupUI.mapPrimaryStatus(assetGroup.primaryStatus),
      assetGroup.primaryStatusReasons.map(r => AssetGroupUI.mapStatusReason(r)),
      AssetGroupUI.mapAdStrength(assetGroup.adStrength),
      assetGroup.finalUrls[0] || '',
      assetGroup.getDisplayUrl(),
      assetSummary,
      metrics,
      audienceSignals,
      listingGroupSummary,
      assetCoverage,
      assetGroup.businessName,
      AssetGroupUI.mapCallToAction(assetGroup.callToAction),
      assetGroup.videos.length > 0,
      assetGroup.meetsMinimumRequirements(),
      assetGroup.createdAt,
      assetGroup.updatedAt,
      assetGroup.headlines,
      assetGroup.longHeadlines,
      assetGroup.descriptions,
      [...assetGroup.marketingImages, ...assetGroup.squareMarketingImages, ...assetGroup.portraitMarketingImages],
      assetGroup.videos
    );
  }

  /**
   * Map domain status to UI status
   */
  static mapStatus(status: AssetGroupStatus): AssetGroupStatusUI {
    const mapping: Record<AssetGroupStatus, AssetGroupStatusUI> = {
      [AssetGroupStatus.ENABLED]: AssetGroupStatusUI.ENABLED,
      [AssetGroupStatus.PAUSED]: AssetGroupStatusUI.PAUSED,
      [AssetGroupStatus.REMOVED]: AssetGroupStatusUI.REMOVED
    };
    return mapping[status];
  }

  /**
   * Map domain primary status to UI
   */
  static mapPrimaryStatus(status: AssetGroupPrimaryStatus): AssetGroupPrimaryStatusUI {
    const mapping: Record<AssetGroupPrimaryStatus, AssetGroupPrimaryStatusUI> = {
      [AssetGroupPrimaryStatus.ELIGIBLE]: AssetGroupPrimaryStatusUI.ELIGIBLE,
      [AssetGroupPrimaryStatus.LIMITED]: AssetGroupPrimaryStatusUI.LIMITED,
      [AssetGroupPrimaryStatus.NOT_ELIGIBLE]: AssetGroupPrimaryStatusUI.NOT_ELIGIBLE,
      [AssetGroupPrimaryStatus.PAUSED]: AssetGroupPrimaryStatusUI.PAUSED,
      [AssetGroupPrimaryStatus.PENDING]: AssetGroupPrimaryStatusUI.PENDING,
      [AssetGroupPrimaryStatus.REMOVED]: AssetGroupPrimaryStatusUI.REMOVED,
      [AssetGroupPrimaryStatus.UNKNOWN]: AssetGroupPrimaryStatusUI.UNKNOWN
    };
    return mapping[status];
  }

  /**
   * Map status reason to readable string
   */
  static mapStatusReason(reason: AssetGroupPrimaryStatusReason): string {
    const mapping: Record<AssetGroupPrimaryStatusReason, string> = {
      [AssetGroupPrimaryStatusReason.ASSET_GROUP_DISAPPROVED]: 'Asset group disapproved',
      [AssetGroupPrimaryStatusReason.ASSET_GROUP_LIMITED]: 'Asset group limited',
      [AssetGroupPrimaryStatusReason.ASSET_GROUP_PAUSED]: 'Asset group paused',
      [AssetGroupPrimaryStatusReason.ASSET_GROUP_REMOVED]: 'Asset group removed',
      [AssetGroupPrimaryStatusReason.ASSET_GROUP_UNDER_REVIEW]: 'Under review',
      [AssetGroupPrimaryStatusReason.CAMPAIGN_ENDED]: 'Campaign ended',
      [AssetGroupPrimaryStatusReason.CAMPAIGN_PAUSED]: 'Campaign paused',
      [AssetGroupPrimaryStatusReason.CAMPAIGN_PENDING]: 'Campaign pending',
      [AssetGroupPrimaryStatusReason.CAMPAIGN_REMOVED]: 'Campaign removed',
      [AssetGroupPrimaryStatusReason.UNKNOWN]: 'Unknown'
    };
    return mapping[reason];
  }

  /**
   * Map ad strength to UI
   */
  static mapAdStrength(strength: AdStrengthAsset): AdStrengthUI {
    const mapping: Record<AdStrengthAsset, AdStrengthUI> = {
      [AdStrengthAsset.EXCELLENT]: AdStrengthUI.EXCELLENT,
      [AdStrengthAsset.GOOD]: AdStrengthUI.GOOD,
      [AdStrengthAsset.AVERAGE]: AdStrengthUI.AVERAGE,
      [AdStrengthAsset.POOR]: AdStrengthUI.POOR,
      [AdStrengthAsset.PENDING]: AdStrengthUI.PENDING,
      [AdStrengthAsset.NO_ADS]: AdStrengthUI.NO_ADS,
      [AdStrengthAsset.UNKNOWN]: AdStrengthUI.UNKNOWN
    };
    return mapping[strength];
  }

  /**
   * Map performance label to UI
   */
  static mapPerformanceLabel(label: AssetPerformanceLabel): AssetPerformanceLabelUI {
    const mapping: Record<AssetPerformanceLabel, AssetPerformanceLabelUI> = {
      [AssetPerformanceLabel.BEST]: AssetPerformanceLabelUI.BEST,
      [AssetPerformanceLabel.GOOD]: AssetPerformanceLabelUI.GOOD,
      [AssetPerformanceLabel.LOW]: AssetPerformanceLabelUI.LOW,
      [AssetPerformanceLabel.LEARNING]: AssetPerformanceLabelUI.LEARNING,
      [AssetPerformanceLabel.PENDING]: AssetPerformanceLabelUI.PENDING,
      [AssetPerformanceLabel.UNKNOWN]: AssetPerformanceLabelUI.UNKNOWN
    };
    return mapping[label];
  }

  /**
   * Map call to action to readable string
   */
  static mapCallToAction(cta: CallToActionType): string {
    const mapping: Record<CallToActionType, string> = {
      [CallToActionType.LEARN_MORE]: 'Learn more',
      [CallToActionType.GET_QUOTE]: 'Get quote',
      [CallToActionType.APPLY_NOW]: 'Apply now',
      [CallToActionType.SIGN_UP]: 'Sign up',
      [CallToActionType.CONTACT_US]: 'Contact us',
      [CallToActionType.SUBSCRIBE]: 'Subscribe',
      [CallToActionType.DOWNLOAD]: 'Download',
      [CallToActionType.BOOK_NOW]: 'Book now',
      [CallToActionType.SHOP_NOW]: 'Shop now',
      [CallToActionType.BUY_NOW]: 'Buy now',
      [CallToActionType.DONATE_NOW]: 'Donate now',
      [CallToActionType.ORDER_NOW]: 'Order now',
      [CallToActionType.PLAY_NOW]: 'Play now',
      [CallToActionType.SEE_MORE]: 'See more',
      [CallToActionType.START_NOW]: 'Start now',
      [CallToActionType.VISIT_SITE]: 'Visit site',
      [CallToActionType.WATCH_NOW]: 'Watch now'
    };
    return mapping[cta];
  }

  /**
   * Get asset rows for expandable view
   */
  getAssetRows(): AssetRowUI[] {
    const rows: AssetRowUI[] = [];

    // Headlines
    this._headlines.forEach((h) => {
      rows.push({
        id: h.id,
        type: 'Headline',
        content: h.text,
        performanceLabel: AssetGroupUI.mapPerformanceLabel(h.performanceLabel),
        impressions: Math.floor(Math.random() * 5000) + 500,
        clicks: Math.floor(Math.random() * 200) + 20,
        ctr: (Math.random() * 5 + 1).toFixed(2)
      });
    });

    // Long Headlines
    this._longHeadlines.forEach((h) => {
      rows.push({
        id: h.id,
        type: 'Long headline',
        content: h.text,
        performanceLabel: AssetGroupUI.mapPerformanceLabel(h.performanceLabel),
        impressions: Math.floor(Math.random() * 3000) + 300,
        clicks: Math.floor(Math.random() * 150) + 15,
        ctr: (Math.random() * 4 + 1).toFixed(2)
      });
    });

    // Descriptions
    this._descriptions.forEach((d) => {
      rows.push({
        id: d.id,
        type: 'Description',
        content: d.text.substring(0, 60) + '...',
        performanceLabel: AssetGroupUI.mapPerformanceLabel(d.performanceLabel),
        impressions: Math.floor(Math.random() * 4000) + 400,
        clicks: Math.floor(Math.random() * 180) + 18,
        ctr: (Math.random() * 4.5 + 1).toFixed(2)
      });
    });

    // Images
    this._images.forEach((img) => {
      const type = img.width === img.height ? 'Square image' : 
                   img.width > img.height ? 'Landscape image' : 'Portrait image';
      rows.push({
        id: img.id,
        type,
        content: `${img.width}x${img.height}`,
        performanceLabel: AssetGroupUI.mapPerformanceLabel(img.performanceLabel),
        impressions: Math.floor(Math.random() * 6000) + 600,
        clicks: Math.floor(Math.random() * 250) + 25,
        ctr: (Math.random() * 5 + 1.5).toFixed(2)
      });
    });

    // Videos
    this._videos.forEach((v) => {
      rows.push({
        id: v.id,
        type: 'YouTube video',
        content: v.youtubeVideoTitle || v.youtubeVideoId,
        performanceLabel: AssetGroupUI.mapPerformanceLabel(v.performanceLabel),
        impressions: Math.floor(Math.random() * 8000) + 800,
        clicks: Math.floor(Math.random() * 300) + 30,
        ctr: (Math.random() * 4 + 2).toFixed(2)
      });
    });

    return rows;
  }

  /**
   * Check if asset group is active
   */
  isActive(): boolean {
    return this.status === AssetGroupStatusUI.ENABLED && 
           this.primaryStatus === AssetGroupPrimaryStatusUI.ELIGIBLE;
  }

  /**
   * Check if asset group has issues
   */
  hasIssues(): boolean {
    return this.primaryStatusReasons.length > 0 || 
           this.assetCoverage.actionItems.length > 0;
  }

  /**
   * Get status badge color class
   */
  getStatusColor(): string {
    switch (this.primaryStatus) {
      case AssetGroupPrimaryStatusUI.ELIGIBLE:
        return 'bg-green-50 text-green-700 border-green-200';
      case AssetGroupPrimaryStatusUI.LIMITED:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case AssetGroupPrimaryStatusUI.NOT_ELIGIBLE:
        return 'bg-red-50 text-red-700 border-red-200';
      case AssetGroupPrimaryStatusUI.PAUSED:
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case AssetGroupPrimaryStatusUI.PENDING:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  }

  /**
   * Get ad strength color class
   */
  getAdStrengthColor(): string {
    switch (this.adStrength) {
      case AdStrengthUI.EXCELLENT:
        return 'text-green-600';
      case AdStrengthUI.GOOD:
        return 'text-blue-600';
      case AdStrengthUI.AVERAGE:
        return 'text-yellow-600';
      case AdStrengthUI.POOR:
        return 'text-red-600';
      case AdStrengthUI.PENDING:
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  }

  /**
   * Get ad strength progress value (0-100)
   */
  getAdStrengthProgress(): number {
    switch (this.adStrength) {
      case AdStrengthUI.EXCELLENT: return 100;
      case AdStrengthUI.GOOD: return 75;
      case AdStrengthUI.AVERAGE: return 50;
      case AdStrengthUI.POOR: return 25;
      default: return 0;
    }
  }
}
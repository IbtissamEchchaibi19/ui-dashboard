// application/dto/AdGroupDTO.ts
import { Money } from '@domain/value-objects';
import {
  AdGroup,
  AdGroupStatus,
  AdGroupType,
  AdRotationMode
} from '@domain/entities';

/**
 * Ad Group Status UI representation
 */
export enum AdGroupStatusUI {
  ENABLED = 'Enabled',
  PAUSED = 'Paused',
  REMOVED = 'Removed'
}

/**
 * Ad Group Type UI representation
 */
export enum AdGroupTypeUI {
  SEARCH_STANDARD = 'Search',
  DISPLAY_STANDARD = 'Display',
  SHOPPING_PRODUCT_ADS = 'Shopping',
  VIDEO_TRUE_VIEW_IN_DISPLAY = 'Video (Discovery)',
  VIDEO_TRUE_VIEW_IN_STREAM = 'Video (In-stream)',
  VIDEO_BUMPER = 'Video (Bumper)',
  VIDEO_OUTSTREAM = 'Video (Outstream)',
  VIDEO_NON_SKIPPABLE_IN_STREAM = 'Video (Non-skippable)',
  SHOPPING_SMART_ADS = 'Smart Shopping',
  SEARCH_DYNAMIC_ADS = 'Dynamic Search',
  HOTEL_ADS = 'Hotel',
  SHOPPING_COMPARISON_LISTING_ADS = 'Comparison Shopping',
  PROMOTED_HOTEL_ADS = 'Promoted Hotel',
  TRAVEL_ADS = 'Travel',
  LOCAL_ADS = 'Local',
  DISCOVERY_MULTI_ASSET = 'Discovery',
  DISCOVERY_CAROUSEL = 'Discovery Carousel',
  DISCOVERY_VIDEO = 'Discovery Video'
}

/**
 * Ad Rotation Mode UI representation
 */
export enum AdRotationModeUI {
  UNSPECIFIED = 'Unspecified',
  UNKNOWN = 'Unknown',
  OPTIMIZE = 'Optimize',
  ROTATE_INDEFINITELY = 'Rotate indefinitely'
}

/**
 * Metric columns available for the ad groups table
 */
export type AdGroupMetricColumn =
  | 'impressions'
  | 'clicks'
  | 'interactions'
  | 'interactionRate'
  | 'averageCpc'
  | 'cost'
  | 'conversions'
  | 'conversionRate'
  | 'ctr'
  | 'averageCpm'
  | 'costPerConversion'
  | 'videoViews';

/**
 * Ad Group Performance Metrics (UI)
 */
export interface AdGroupMetricsUI {
  impressions: number;
  clicks: number;
  interactions: number;
  interactionRate: string;
  averageCpc: Money;
  cost: Money;
  conversions: number;
  conversionRate: string;
  ctr: string;
  averageCpm: Money;
  costPerConversion: Money;
  videoViews?: number;
  videoViewRate?: string;
}

/**
 * Ad Row (for expandable view showing ads within ad group)
 */
export interface AdRow {
  id: string;
  name: string;
  status: string;
  headline: string;
  impressions: number;
  clicks: number;
  ctr: string;
  cost: string;
  conversions: number;
  conversionRate: string;
}

/**
 * Keyword Row (for expandable view showing keywords within ad group)
 */
export interface KeywordRow {
  id: string;
  keyword: string;
  matchType: string;
  status: string;
  maxCpc: string;
  impressions: number;
  clicks: number;
  ctr: string;
  cost: string;
  conversions: number;
  qualityScore?: number;
}

/**
 * Ad Group DTO for UI layer
 */
export class AdGroupUI {
  constructor(
    public readonly id: string,
    public readonly campaignId: string,
    public readonly campaignName: string,
    public readonly customerId: string,
    public name: string,
    public status: AdGroupStatusUI,
    public type: AdGroupTypeUI,
    public defaultBid: Money | null,
    public targetCpa: Money | null,
    public targetRoas: number | null,
    public adRotationMode: AdRotationModeUI,
    public adCount: number,
    public keywordCount: number,
    public metrics: AdGroupMetricsUI,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Create AdGroupUI from domain AdGroup entity
   */
  static fromDomain(
    adGroup: AdGroup,
    campaignName: string,
    metrics: AdGroupMetricsUI,
    adCount: number = 0,
    keywordCount: number = 0
  ): AdGroupUI {
    // Determine the default bid based on ad group type
    let defaultBid: Money | null = null;
    if (adGroup.cpcBidMicros) {
      defaultBid = adGroup.cpcBidMicros;
    } else if (adGroup.cpmBidMicros) {
      defaultBid = adGroup.cpmBidMicros;
    } else if (adGroup.cpvBidMicros) {
      defaultBid = adGroup.cpvBidMicros;
    }

    return new AdGroupUI(
      adGroup.id,
      adGroup.campaignId,
      campaignName,
      adGroup.customerId,
      adGroup.name,
      AdGroupUI.mapStatus(adGroup.status),
      AdGroupUI.mapType(adGroup.type),
      defaultBid,
      adGroup.targetCpaMicros,
      adGroup.targetRoas,
      AdGroupUI.mapAdRotationMode(adGroup.adRotationMode),
      adCount,
      keywordCount,
      metrics,
      adGroup.createdAt,
      adGroup.updatedAt
    );
  }

  /**
   * Map domain status to UI status
   */
  static mapStatus(status: AdGroupStatus): AdGroupStatusUI {
    const mapping: Record<AdGroupStatus, AdGroupStatusUI> = {
      [AdGroupStatus.ENABLED]: AdGroupStatusUI.ENABLED,
      [AdGroupStatus.PAUSED]: AdGroupStatusUI.PAUSED,
      [AdGroupStatus.REMOVED]: AdGroupStatusUI.REMOVED
    };
    return mapping[status];
  }

  /**
   * Map domain type to UI type
   */
  static mapType(type: AdGroupType): AdGroupTypeUI {
    const mapping: Record<AdGroupType, AdGroupTypeUI> = {
      [AdGroupType.SEARCH_STANDARD]: AdGroupTypeUI.SEARCH_STANDARD,
      [AdGroupType.DISPLAY_STANDARD]: AdGroupTypeUI.DISPLAY_STANDARD,
      [AdGroupType.SHOPPING_PRODUCT_ADS]: AdGroupTypeUI.SHOPPING_PRODUCT_ADS,
      [AdGroupType.VIDEO_TRUE_VIEW_IN_DISPLAY]: AdGroupTypeUI.VIDEO_TRUE_VIEW_IN_DISPLAY,
      [AdGroupType.VIDEO_TRUE_VIEW_IN_STREAM]: AdGroupTypeUI.VIDEO_TRUE_VIEW_IN_STREAM,
      [AdGroupType.VIDEO_BUMPER]: AdGroupTypeUI.VIDEO_BUMPER,
      [AdGroupType.VIDEO_OUTSTREAM]: AdGroupTypeUI.VIDEO_OUTSTREAM,
      [AdGroupType.VIDEO_NON_SKIPPABLE_IN_STREAM]: AdGroupTypeUI.VIDEO_NON_SKIPPABLE_IN_STREAM,
      [AdGroupType.SHOPPING_SMART_ADS]: AdGroupTypeUI.SHOPPING_SMART_ADS,
      [AdGroupType.SEARCH_DYNAMIC_ADS]: AdGroupTypeUI.SEARCH_DYNAMIC_ADS,
      [AdGroupType.HOTEL_ADS]: AdGroupTypeUI.HOTEL_ADS,
      [AdGroupType.SHOPPING_COMPARISON_LISTING_ADS]: AdGroupTypeUI.SHOPPING_COMPARISON_LISTING_ADS,
      [AdGroupType.PROMOTED_HOTEL_ADS]: AdGroupTypeUI.PROMOTED_HOTEL_ADS,
      [AdGroupType.TRAVEL_ADS]: AdGroupTypeUI.TRAVEL_ADS,
      [AdGroupType.LOCAL_ADS]: AdGroupTypeUI.LOCAL_ADS,
      [AdGroupType.DISCOVERY_MULTI_ASSET]: AdGroupTypeUI.DISCOVERY_MULTI_ASSET,
      [AdGroupType.DISCOVERY_CAROUSEL]: AdGroupTypeUI.DISCOVERY_CAROUSEL,
      [AdGroupType.DISCOVERY_VIDEO]: AdGroupTypeUI.DISCOVERY_VIDEO
    };
    return mapping[type];
  }

  /**
   * Map domain ad rotation mode to UI
   */
  static mapAdRotationMode(mode: AdRotationMode): AdRotationModeUI {
    const mapping: Record<AdRotationMode, AdRotationModeUI> = {
      [AdRotationMode.UNSPECIFIED]: AdRotationModeUI.UNSPECIFIED,
      [AdRotationMode.UNKNOWN]: AdRotationModeUI.UNKNOWN,
      [AdRotationMode.OPTIMIZE]: AdRotationModeUI.OPTIMIZE,
      [AdRotationMode.ROTATE_INDEFINITELY]: AdRotationModeUI.ROTATE_INDEFINITELY
    };
    return mapping[mode];
  }

  /**
   * Get mock ad rows for expandable view
   */
  getAdRows(): AdRow[] {
    const count = this.adCount || Math.floor(Math.random() * 5) + 1;
    const rows: AdRow[] = [];
    
    for (let i = 0; i < count; i++) {
      const impressions = Math.floor(Math.random() * 2000) + 200;
      const clicks = Math.floor(impressions * (Math.random() * 0.08 + 0.02));
      const cost = clicks * (Math.random() * 50 + 10);
      const conversions = Math.floor(clicks * (Math.random() * 0.1 + 0.02));

      rows.push({
        id: `${this.id}_ad_${i + 1}`,
        name: `Ad ${i + 1}`,
        status: Math.random() > 0.3 ? 'Enabled' : 'Paused',
        headline: `Ad Headline ${i + 1} - ${this.name}`,
        impressions,
        clicks,
        ctr: ((clicks / impressions) * 100).toFixed(2),
        cost: cost.toFixed(2),
        conversions,
        conversionRate: ((conversions / clicks) * 100 || 0).toFixed(2)
      });
    }

    return rows;
  }

  /**
   * Get mock keyword rows for expandable view
   */
  getKeywordRows(): KeywordRow[] {
    const count = this.keywordCount || Math.floor(Math.random() * 10) + 3;
    const rows: KeywordRow[] = [];
    const matchTypes = ['Broad', 'Phrase', 'Exact'];
    const keywords = [
      'ai course', 'machine learning', 'data science', 'python training',
      'deep learning', 'tensorflow course', 'ai certification', 'ml training',
      'artificial intelligence', 'neural networks'
    ];

    for (let i = 0; i < Math.min(count, keywords.length); i++) {
      const impressions = Math.floor(Math.random() * 3000) + 100;
      const clicks = Math.floor(impressions * (Math.random() * 0.1 + 0.01));
      const cost = clicks * (Math.random() * 60 + 10);
      const conversions = Math.floor(clicks * (Math.random() * 0.15 + 0.01));

      rows.push({
        id: `${this.id}_kw_${i + 1}`,
        keyword: keywords[i],
        matchType: matchTypes[Math.floor(Math.random() * matchTypes.length)],
        status: Math.random() > 0.2 ? 'Enabled' : 'Paused',
        maxCpc: (Math.random() * 50 + 10).toFixed(2),
        impressions,
        clicks,
        ctr: ((clicks / impressions) * 100).toFixed(2),
        cost: cost.toFixed(2),
        conversions,
        qualityScore: Math.floor(Math.random() * 4) + 6 // 6-10
      });
    }

    return rows;
  }

  /**
   * Check if ad group is active
   */
  isActive(): boolean {
    return this.status === AdGroupStatusUI.ENABLED;
  }

  /**
   * Get bid type label
   */
  getBidTypeLabel(): string {
    if (this.type.includes('Video')) {
      return 'CPV';
    } else if (this.type === AdGroupTypeUI.DISPLAY_STANDARD) {
      return 'CPM';
    }
    return 'CPC';
  }

  /**
   * Get formatted default bid
   */
  getFormattedBid(): string {
    if (!this.defaultBid) return '--';
    return `${this.defaultBid.format()} ${this.getBidTypeLabel()}`;
  }
}
import { Money } from '../value-objects/Money';

/**
 * Ad Group Status
 */
export enum AdGroupStatus {
  ENABLED = 'ENABLED',
  PAUSED = 'PAUSED',
  REMOVED = 'REMOVED'
}

/**
 * Ad Group Type
 */
export enum AdGroupType {
  SEARCH_STANDARD = 'SEARCH_STANDARD',
  DISPLAY_STANDARD = 'DISPLAY_STANDARD',
  SHOPPING_PRODUCT_ADS = 'SHOPPING_PRODUCT_ADS',
  VIDEO_TRUE_VIEW_IN_DISPLAY = 'VIDEO_TRUE_VIEW_IN_DISPLAY',
  VIDEO_TRUE_VIEW_IN_STREAM = 'VIDEO_TRUE_VIEW_IN_STREAM',
  VIDEO_BUMPER = 'VIDEO_BUMPER',
  VIDEO_OUTSTREAM = 'VIDEO_OUTSTREAM',
  VIDEO_NON_SKIPPABLE_IN_STREAM = 'VIDEO_NON_SKIPPABLE_IN_STREAM',
  SHOPPING_SMART_ADS = 'SHOPPING_SMART_ADS',
  SEARCH_DYNAMIC_ADS = 'SEARCH_DYNAMIC_ADS',
  HOTEL_ADS = 'HOTEL_ADS',
  SHOPPING_COMPARISON_LISTING_ADS = 'SHOPPING_COMPARISON_LISTING_ADS',
  PROMOTED_HOTEL_ADS = 'PROMOTED_HOTEL_ADS',
  TRAVEL_ADS = 'TRAVEL_ADS',
  LOCAL_ADS = 'LOCAL_ADS',
  DISCOVERY_MULTI_ASSET = 'DISCOVERY_MULTI_ASSET',
  DISCOVERY_CAROUSEL = 'DISCOVERY_CAROUSEL',
  DISCOVERY_VIDEO = 'DISCOVERY_VIDEO'
}

/**
 * Ad Rotation Mode
 */
export enum AdRotationMode {
  UNSPECIFIED = 'UNSPECIFIED',
  UNKNOWN = 'UNKNOWN',
  OPTIMIZE = 'OPTIMIZE',
  ROTATE_INDEFINITELY = 'ROTATE_INDEFINITELY'
}

/**
 * Targeting Setting
 */
export interface TargetingSetting {
  targetRestrictions: {
    targetingDimension: string;
    bidOnly: boolean;
  }[];
}

/**
 * Ad Group Domain Entity
 */
export class AdGroup {
  constructor(
    public readonly id: string,
    public readonly campaignId: string,
    public readonly customerId: string,
    public name: string,
    public status: AdGroupStatus,
    public readonly type: AdGroupType,
    public cpcBidMicros: Money | null,
    public cpmBidMicros: Money | null,
    public targetCpaMicros: Money | null,
    public cpvBidMicros: Money | null,
    public targetRoas: number | null,
    public percentCpcBidMicros: Money | null,
    public adRotationMode: AdRotationMode,
    public displayCustomBidDimension?: string,
    public finalUrlSuffix?: string,
    public trackingUrlTemplate?: string,
    public targetingSetting?: TargetingSetting,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  isActive(): boolean {
    return this.status === AdGroupStatus.ENABLED;
  }

  pause(): void {
    this.status = AdGroupStatus.PAUSED;
  }

  enable(): void {
    this.status = AdGroupStatus.ENABLED;
  }

  remove(): void {
    this.status = AdGroupStatus.REMOVED;
  }

  toJSON() {
    return {
      id: this.id,
      campaignId: this.campaignId,
      customerId: this.customerId,
      name: this.name,
      status: this.status,
      type: this.type,
      cpcBidMicros: this.cpcBidMicros,
      cpmBidMicros: this.cpmBidMicros,
      targetCpaMicros: this.targetCpaMicros,
      cpvBidMicros: this.cpvBidMicros,
      targetRoas: this.targetRoas,
      percentCpcBidMicros: this.percentCpcBidMicros,
      adRotationMode: this.adRotationMode,
      displayCustomBidDimension: this.displayCustomBidDimension,
      finalUrlSuffix: this.finalUrlSuffix,
      trackingUrlTemplate: this.trackingUrlTemplate,
      targetingSetting: this.targetingSetting,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
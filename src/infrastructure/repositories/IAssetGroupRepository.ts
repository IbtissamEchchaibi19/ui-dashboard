// infrastructure/repositories/IAssetGroupRepository.ts
import { AssetGroup, AssetGroupStatus, AssetGroupPrimaryStatus, AdStrengthAsset } from '@domain/entities';
import { DateRange } from '@domain/value-objects';

/**
 * Filters for querying asset groups
 */
export interface AssetGroupFilters {
  status?: AssetGroupStatus[];
  primaryStatus?: AssetGroupPrimaryStatus[];
  adStrength?: AdStrengthAsset[];
  campaignId?: string[];
  searchTerm?: string;
  hasVideos?: boolean;
  meetsRequirements?: boolean;
}

/**
 * Time series data point for asset group metrics
 */
export interface AssetGroupTimeSeriesDataPoint {
  date: Date;
  impressions: number;
  clicks: number;
  interactions: number;
  cost: number;
  conversions: number;
  conversionsValue: number;
  ctr: number;
  averageCpc: number;
}

/**
 * Asset performance summary
 */
export interface AssetPerformanceSummary {
  assetId: string;
  assetType: string;
  performanceLabel: string;
  impressions: number;
  clicks: number;
}

/**
 * Repository interface for AssetGroup operations
 */
export interface IAssetGroupRepository {
  /**
   * Find all asset groups with optional filtering
   */
  findAll(filters?: AssetGroupFilters): Promise<AssetGroup[]>;

  /**
   * Find asset group by ID
   */
  findById(id: string): Promise<AssetGroup | null>;

  /**
   * Find asset groups by campaign ID
   */
  findByCampaignId(campaignId: string): Promise<AssetGroup[]>;

  /**
   * Find asset groups by customer ID
   */
  findByCustomerId(customerId: string): Promise<AssetGroup[]>;

  /**
   * Create a new asset group
   */
  create(assetGroup: AssetGroup): Promise<AssetGroup>;

  /**
   * Update an existing asset group
   */
  update(assetGroup: AssetGroup): Promise<AssetGroup>;

  /**
   * Delete an asset group by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Pause an asset group by ID
   */
  pause(id: string): Promise<void>;

  /**
   * Enable an asset group by ID
   */
  enable(id: string): Promise<void>;

  /**
   * Get time series data for an asset group
   */
  getTimeSeries(id: string, dateRange: DateRange): Promise<AssetGroupTimeSeriesDataPoint[]>;

  /**
   * Bulk pause multiple asset groups
   */
  bulkPause(ids: string[]): Promise<void>;

  /**
   * Bulk enable multiple asset groups
   */
  bulkEnable(ids: string[]): Promise<void>;

  /**
   * Bulk delete multiple asset groups
   */
  bulkDelete(ids: string[]): Promise<void>;

  /**
   * Get asset performance data for an asset group
   */
  getAssetPerformance(assetGroupId: string): Promise<AssetPerformanceSummary[]>;

  /**
   * Get listing group count for an asset group
   */
  getListingGroupCount(assetGroupId: string): Promise<number>;

  /**
   * Get product count for an asset group
   */
  getProductCount(assetGroupId: string): Promise<number>;
}
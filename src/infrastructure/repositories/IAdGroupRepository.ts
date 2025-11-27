// infrastructure/repositories/IAdGroupRepository.ts
import { AdGroup } from '@domain/entities';
import { DateRange } from '@domain/value-objects';

/**
 * Ad Group filters for querying
 */
export interface AdGroupFilters {
  status?: string[];
  type?: string[];
  campaignId?: string[];
  searchTerm?: string;
  minCpcBid?: number;
  maxCpcBid?: number;
}

/**
 * Time series data point for ad groups
 */
export interface AdGroupTimeSeriesDataPoint {
  date: Date;
  impressions: number;
  clicks: number;
  interactions: number;
  cost: number;
  conversions: number;
  videoViews?: number;
}

/**
 * Ad Group Repository Interface
 * Defines contract for ad group data access
 */
export interface IAdGroupRepository {
  /**
   * Find all ad groups with optional filters
   */
  findAll(filters?: AdGroupFilters): Promise<AdGroup[]>;

  /**
   * Find ad group by ID
   */
  findById(id: string): Promise<AdGroup | null>;

  /**
   * Find ad groups by campaign ID
   */
  findByCampaignId(campaignId: string): Promise<AdGroup[]>;

  /**
   * Find ad groups by customer ID
   */
  findByCustomerId(customerId: string): Promise<AdGroup[]>;

  /**
   * Create a new ad group
   */
  create(adGroup: AdGroup): Promise<AdGroup>;

  /**
   * Update an existing ad group
   */
  update(adGroup: AdGroup): Promise<AdGroup>;

  /**
   * Delete an ad group
   */
  delete(id: string): Promise<void>;

  /**
   * Pause an ad group
   */
  pause(id: string): Promise<void>;

  /**
   * Enable an ad group
   */
  enable(id: string): Promise<void>;

  /**
   * Get time series data for an ad group
   */
  getTimeSeries(id: string, dateRange: DateRange): Promise<AdGroupTimeSeriesDataPoint[]>;

  /**
   * Bulk pause ad groups
   */
  bulkPause(ids: string[]): Promise<void>;

  /**
   * Bulk enable ad groups
   */
  bulkEnable(ids: string[]): Promise<void>;

  /**
   * Bulk delete ad groups
   */
  bulkDelete(ids: string[]): Promise<void>;

  /**
   * Get ad count for an ad group
   */
  getAdCount(adGroupId: string): Promise<number>;

  /**
   * Get keyword count for an ad group
   */
  getKeywordCount(adGroupId: string): Promise<number>;
}
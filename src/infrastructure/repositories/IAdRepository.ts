import { Ad } from '@domain/entities';
import { DateRange } from '@domain/value-objects';

/**
 * Ad filters for querying
 */
export interface AdFilters {
  status?: string[];
  type?: string[];
  adGroupId?: string[];
  campaignId?: string[];
  adStrength?: string[];
  approvalStatus?: string[];
  searchTerm?: string;
}

/**
 * Time series data point for ads
 */
export interface AdTimeSeriesDataPoint {
  date: Date;
  impressions: number;
  clicks: number;
  interactions: number;
  cost: number;
  conversions: number;
  videoViews?: number;
}

/**
 * Ad Repository Interface
 * Defines contract for ad data access
 */
export interface IAdRepository {
  /**
   * Find all ads with optional filters
   */
  findAll(filters?: AdFilters): Promise<Ad[]>;

  /**
   * Find ad by ID
   */
  findById(id: string): Promise<Ad | null>;

  /**
   * Find ads by ad group ID
   */
  findByAdGroupId(adGroupId: string): Promise<Ad[]>;

  /**
   * Find ads by campaign ID
   */
  findByCampaignId(campaignId: string): Promise<Ad[]>;

  /**
   * Create a new ad
   */
  create(ad: Ad): Promise<Ad>;

  /**
   * Update an existing ad
   */
  update(ad: Ad): Promise<Ad>;

  /**
   * Delete an ad
   */
  delete(id: string): Promise<void>;

  /**
   * Pause an ad
   */
  pause(id: string): Promise<void>;

  /**
   * Enable an ad
   */
  enable(id: string): Promise<void>;

  /**
   * Get time series data for an ad
   */
  getTimeSeries(id: string, dateRange: DateRange): Promise<AdTimeSeriesDataPoint[]>;

  /**
   * Bulk pause ads
   */
  bulkPause(ids: string[]): Promise<void>;

  /**
   * Bulk enable ads
   */
  bulkEnable(ids: string[]): Promise<void>;

  /**
   * Bulk delete ads
   */
  bulkDelete(ids: string[]): Promise<void>;
}
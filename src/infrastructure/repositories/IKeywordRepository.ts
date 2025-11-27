// infrastructure/repositories/IKeywordRepository.ts

import { Keyword, KeywordStatus } from '../../domain/entities/Keyword';
import { DateRange } from '../../domain/value-objects/DateRange';
import { KeywordTimeSeriesDataPoint } from '../../application/services/KeywordService';

/**
 * Keyword Repository Interface
 * Defines contract for data access operations
 */
export interface IKeywordRepository {
  /**
   * Find all keywords
   */
  findAll(): Promise<Keyword[]>;

  /**
   * Find keyword by ID
   */
  findById(id: string): Promise<Keyword | null>;

  /**
   * Find keywords by Ad Group
   */
  findByAdGroup(adGroupId: string): Promise<Keyword[]>;

  /**
   * Find keywords by Campaign
   */
  findByCampaign(campaignId: string): Promise<Keyword[]>;

  /**
   * Create a new keyword
   */
  create(keyword: Keyword): Promise<Keyword>;

  /**
   * Update an existing keyword
   */
  update(keyword: Keyword): Promise<Keyword>;

  /**
   * Delete a keyword
   */
  delete(id: string): Promise<boolean>;

  /**
   * Bulk update status for multiple keywords
   */
  bulkUpdateStatus(keywordIds: string[], status: KeywordStatus): Promise<Keyword[]>;

  /**
   * Bulk update bids for multiple keywords
   */
  bulkUpdateBids(keywordIds: string[], bidAmount: number): Promise<Keyword[]>;

  /**
   * Get time series data for a keyword
   */
  getTimeSeries(keywordId: string, dateRange: DateRange): Promise<KeywordTimeSeriesDataPoint[]>;
}
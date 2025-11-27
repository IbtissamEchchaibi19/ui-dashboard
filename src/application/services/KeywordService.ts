// application/services/KeywordService.ts

import { Keyword, KeywordStatus, KeywordMatchType } from '@domain/entities';
import { KeywordRepository } from '@infrastructure/repositories';
import { KeywordFilters, KeywordSortBy, SortDirection } from '../dto/KeywordDTO';
import { DateRangeVO } from '@domain/value-objects';

/**
 * Keyword Time Series Data Point
 */
export interface KeywordTimeSeriesDataPoint {
  date: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgCpc: number;
  cost: number;
  conversions: number;
  conversionRate: number;
}

/**
 * Keyword Service - Business Logic Layer
 * Handles all keyword-related operations
 */
export class KeywordService {
  constructor(private repository: IKeywordRepository) {}

  /**
   * Get all keywords with optional filters
   */
  async getKeywords(filters?: KeywordFilters): Promise<Keyword[]> {
    const allKeywords = await this.repository.findAll();
    
    if (!filters) {
      return allKeywords;
    }

    return allKeywords.filter(keyword => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!keyword.text.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(keyword.status)) {
          return false;
        }
      }

      // Match type filter
      if (filters.matchType && filters.matchType.length > 0) {
        if (!filters.matchType.includes(keyword.matchType)) {
          return false;
        }
      }

      // Competition level filter
      if (filters.competitionLevel && filters.competitionLevel.length > 0 && keyword.historicalMetrics) {
        if (!filters.competitionLevel.includes(keyword.historicalMetrics.competitionLevel)) {
          return false;
        }
      }

      // Quality score filters
      if (filters.minQualityScore !== undefined && keyword.qualityScore !== null) {
        if (keyword.qualityScore < filters.minQualityScore) {
          return false;
        }
      }

      if (filters.maxQualityScore !== undefined && keyword.qualityScore !== null) {
        if (keyword.qualityScore > filters.maxQualityScore) {
          return false;
        }
      }

      // CTR filters
      if (filters.minCtr !== undefined && keyword.performanceMetrics) {
        if (keyword.performanceMetrics.ctr < filters.minCtr) {
          return false;
        }
      }

      if (filters.maxCtr !== undefined && keyword.performanceMetrics) {
        if (keyword.performanceMetrics.ctr > filters.maxCtr) {
          return false;
        }
      }

      // Conversion rate filter
      if (filters.minConversionRate !== undefined && keyword.performanceMetrics) {
        if (keyword.performanceMetrics.conversionRate < filters.minConversionRate) {
          return false;
        }
      }

      // Ad Group filter
      if (filters.adGroupId) {
        if (keyword.adGroupId !== filters.adGroupId) {
          return false;
        }
      }

      // Campaign filter
      if (filters.campaignId) {
        if (keyword.campaignId !== filters.campaignId) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Get a single keyword by ID
   */
  async getKeywordById(id: string): Promise<Keyword | null> {
    return this.repository.findById(id);
  }

  /**
   * Get keywords by Ad Group
   */
  async getKeywordsByAdGroup(adGroupId: string): Promise<Keyword[]> {
    return this.repository.findByAdGroup(adGroupId);
  }

  /**
   * Get keywords by Campaign
   */
  async getKeywordsByCampaign(campaignId: string): Promise<Keyword[]> {
    return this.repository.findByCampaign(campaignId);
  }

  /**
   * Create a new keyword
   */
  async createKeyword(keyword: Keyword): Promise<Keyword> {
    return this.repository.create(keyword);
  }

  /**
   * Update an existing keyword
   */
  async updateKeyword(keyword: Keyword): Promise<Keyword> {
    return this.repository.update(keyword);
  }

  /**
   * Delete a keyword
   */
  async deleteKeyword(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  /**
   * Bulk update keywords
   */
  async bulkUpdateStatus(keywordIds: string[], status: KeywordStatus): Promise<Keyword[]> {
    return this.repository.bulkUpdateStatus(keywordIds, status);
  }

  /**
   * Bulk update bids
   */
  async bulkUpdateBids(keywordIds: string[], bidAmount: number): Promise<Keyword[]> {
    return this.repository.bulkUpdateBids(keywordIds, bidAmount);
  }

  /**
   * Sort keywords
   */
  sortKeywords(
    keywords: Keyword[],
    sortBy: KeywordSortBy,
    direction: SortDirection
  ): Keyword[] {
    const sorted = [...keywords].sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case KeywordSortBy.TEXT:
          compareValue = a.text.localeCompare(b.text);
          break;

        case KeywordSortBy.IMPRESSIONS:
          compareValue = (a.performanceMetrics?.impressions ?? 0) - (b.performanceMetrics?.impressions ?? 0);
          break;

        case KeywordSortBy.CLICKS:
          compareValue = (a.performanceMetrics?.clicks ?? 0) - (b.performanceMetrics?.clicks ?? 0);
          break;

        case KeywordSortBy.CTR:
          compareValue = (a.performanceMetrics?.ctr ?? 0) - (b.performanceMetrics?.ctr ?? 0);
          break;

        case KeywordSortBy.CPC:
          compareValue = (a.performanceMetrics?.avgCpc.amount ?? 0) - (b.performanceMetrics?.avgCpc.amount ?? 0);
          break;

        case KeywordSortBy.COST:
          compareValue = (a.performanceMetrics?.cost.amount ?? 0) - (b.performanceMetrics?.cost.amount ?? 0);
          break;

        case KeywordSortBy.CONVERSIONS:
          compareValue = (a.performanceMetrics?.conversions ?? 0) - (b.performanceMetrics?.conversions ?? 0);
          break;

        case KeywordSortBy.CONVERSION_RATE:
          compareValue = (a.performanceMetrics?.conversionRate ?? 0) - (b.performanceMetrics?.conversionRate ?? 0);
          break;

        case KeywordSortBy.QUALITY_SCORE:
          compareValue = (a.qualityScore ?? 0) - (b.qualityScore ?? 0);
          break;

        case KeywordSortBy.COMPETITION:
          compareValue = (a.historicalMetrics?.competitionIndex ?? 0) - (b.historicalMetrics?.competitionIndex ?? 0);
          break;

        default:
          compareValue = 0;
      }

      return direction === SortDirection.ASC ? compareValue : -compareValue;
    });

    return sorted;
  }

  /**
   * Get keyword time series data
   */
  async getKeywordTimeSeries(
    keywordId: string,
    dateRange: DateRangeVO
  ): Promise<KeywordTimeSeriesDataPoint[]> {
    return this.repository.getTimeSeries(keywordId, dateRange);
  }

  /**
   * Get top performing keywords
   */
  async getTopPerformingKeywords(limit: number = 10): Promise<Keyword[]> {
    const allKeywords = await this.repository.findAll();
    
    return allKeywords
      .filter(k => k.performanceMetrics && k.performanceMetrics.conversions > 0)
      .sort((a, b) => {
        const aScore = a.getEffectivenessScore();
        const bScore = b.getEffectivenessScore();
        return bScore - aScore;
      })
      .slice(0, limit);
  }

  /**
   * Get keywords that need optimization
   */
  async getKeywordsNeedingOptimization(): Promise<Keyword[]> {
    const allKeywords = await this.repository.findAll();
    
    return allKeywords.filter(k => k.needsOptimization());
  }

  /**
   * Get keyword suggestions based on performance
   */
  async getKeywordSuggestions(campaignId: string): Promise<{
    pause: Keyword[];
    increaseBid: Keyword[];
    decreaseBid: Keyword[];
  }> {
    const keywords = await this.repository.findByCampaign(campaignId);

    const pause = keywords.filter(k => 
      k.performanceMetrics &&
      k.performanceMetrics.impressions > 1000 &&
      k.performanceMetrics.ctr < 0.5 &&
      k.performanceMetrics.conversions === 0
    );

    const increaseBid = keywords.filter(k =>
      k.performanceMetrics &&
      k.impressionShareMetrics &&
      k.performanceMetrics.conversionRate > 3.0 &&
      k.impressionShareMetrics.searchImpressionShareLostRank > 20
    );

    const decreaseBid = keywords.filter(k =>
      k.performanceMetrics &&
      k.performanceMetrics.avgCpc.amount > k.bid.bidAmount.amount * 0.8 &&
      k.performanceMetrics.conversionRate < 1.0
    );

    return { pause, increaseBid, decreaseBid };
  }

  /**
   * Calculate aggregate statistics
   */
  async getAggregateStats(keywords: Keyword[]): Promise<{
    totalImpressions: number;
    totalClicks: number;
    avgCtr: number;
    avgCpc: number;
    totalCost: number;
    totalConversions: number;
    avgConversionRate: number;
    avgQualityScore: number;
  }> {
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalCost = 0;
    let totalConversions = 0;
    let totalQualityScore = 0;
    let qualityScoreCount = 0;

    keywords.forEach(keyword => {
      if (keyword.performanceMetrics) {
        totalImpressions += keyword.performanceMetrics.impressions;
        totalClicks += keyword.performanceMetrics.clicks;
        totalCost += keyword.performanceMetrics.cost.amount;
        totalConversions += keyword.performanceMetrics.conversions;
      }
      
      if (keyword.qualityScore) {
        totalQualityScore += keyword.qualityScore;
        qualityScoreCount++;
      }
    });

    const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const avgCpc = totalClicks > 0 ? totalCost / totalClicks : 0;
    const avgConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const avgQualityScore = qualityScoreCount > 0 ? totalQualityScore / qualityScoreCount : 0;

    return {
      totalImpressions,
      totalClicks,
      avgCtr,
      avgCpc,
      totalCost,
      totalConversions,
      avgConversionRate,
      avgQualityScore,
    };
  }
}
// application/dto/KeywordDTO.ts
import {
  Keyword,
  KeywordMatchType,
  KeywordStatus,
  CompetitionLevel,
  QualityScoreStatus,
} from '../../domain/entities/Keyword';

/**
 * UI-friendly representation of Keyword Match Type
 */
export enum KeywordMatchTypeUI {
  BROAD = 'Broad Match',
  PHRASE = 'Phrase Match',
  EXACT = 'Exact Match',
  BROAD_MODIFIER = 'Broad Match Modifier',
}

/**
 * UI-friendly representation of Keyword Status
 */
export enum KeywordStatusUI {
  ENABLED = 'Active',
  PAUSED = 'Paused',
  REMOVED = 'Removed',
}

/**
 * UI-friendly representation of Competition Level
 */
export enum CompetitionLevelUI {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  UNSPECIFIED = 'Unknown',
}

/**
 * UI-friendly representation of Quality Score Status
 */
export enum QualityScoreStatusUI {
  BELOW_AVERAGE = 'Below Average',
  AVERAGE = 'Average',
  ABOVE_AVERAGE = 'Above Average',
  UNSPECIFIED = 'Unknown',
}

/**
 * Keyword UI Class - For displaying keywords in the UI
 */
export class KeywordUI {
  constructor(
    public readonly id: string,
    public readonly adGroupId: string,
    public readonly campaignId: string,
    public readonly text: string,
    public readonly displayText: string,
    public readonly matchType: KeywordMatchTypeUI,
    public readonly status: KeywordStatusUI,
    public readonly finalUrl: string,

    // Bid Information
    public readonly currentBid: string,
    public readonly firstPageBid: string,
    public readonly topOfPageBid: string,

    // Quality Score
    public readonly qualityScore: number | null,
    public readonly qualityScoreLabel: string,
    public readonly expectedCtr: QualityScoreStatusUI,
    public readonly adRelevance: QualityScoreStatusUI,
    public readonly landingPageExp: QualityScoreStatusUI,

    // Historical Metrics
    public readonly avgMonthlySearches: string,
    public readonly competitionLevel: CompetitionLevelUI,
    public readonly competitionIndex: number,
    public readonly competitionAssessment: string,
    public readonly lowTopOfPageBid: string,
    public readonly highTopOfPageBid: string,

    // Performance Metrics
    public readonly impressions: string,
    public readonly clicks: string,
    public readonly ctr: string,
    public readonly avgCpc: string,
    public readonly cost: string,
    public readonly conversions: string,
    public readonly conversionRate: string,
    public readonly costPerConversion: string,
    public readonly conversionValue: string,

    // Impression Share
    public readonly impressionShare: string,
    public readonly topImpressionShare: string,
    public readonly absTopImpressionShare: string,
    public readonly lostISBudget: string,
    public readonly lostISRank: string,

    // Forecast
    public readonly estimatedClicks: string,
    public readonly estimatedImpressions: string,
    public readonly estimatedCost: string,
    public readonly estimatedConversions: string,

    // Calculated Fields
    public readonly roi: string,
    public readonly effectivenessScore: number,
    public readonly isPerforming: boolean,
    public readonly needsOptimization: boolean,
    public readonly optimizationSuggestions: string[],

    // Metadata
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  /**
   * Convert domain Keyword to UI representation
   */
  public static fromDomain(keyword: Keyword): KeywordUI {
    return new KeywordUI(
      keyword.id,
      keyword.adGroupId,
      keyword.campaignId,
      keyword.text,
      keyword.getDisplayText(),
      KeywordUI.convertMatchType(keyword.matchType),
      KeywordUI.convertStatus(keyword.status),
      keyword.finalUrl,

      // Bid Information
      keyword.bid.bidAmount.format(),
      keyword.bid.firstPageBid.format(),
      keyword.bid.topOfPageBid.format(),

      // Quality Score
      keyword.qualityScore,
      keyword.getQualityScoreAssessment(),
      keyword.qualityScoreComponents
        ? KeywordUI.convertQualityScoreStatus(keyword.qualityScoreComponents.expectedCtr)
        : QualityScoreStatusUI.UNSPECIFIED,
      keyword.qualityScoreComponents
        ? KeywordUI.convertQualityScoreStatus(keyword.qualityScoreComponents.adRelevance)
        : QualityScoreStatusUI.UNSPECIFIED,
      keyword.qualityScoreComponents
        ? KeywordUI.convertQualityScoreStatus(keyword.qualityScoreComponents.landingPageExperience)
        : QualityScoreStatusUI.UNSPECIFIED,

      // Historical Metrics
      keyword.historicalMetrics?.avgMonthlySearches.toLocaleString() ?? 'N/A',
      keyword.historicalMetrics
        ? KeywordUI.convertCompetitionLevel(keyword.historicalMetrics.competitionLevel)
        : CompetitionLevelUI.UNSPECIFIED,
      keyword.historicalMetrics?.competitionIndex ?? 0,
      keyword.getCompetitionAssessment(),
      keyword.historicalMetrics?.lowTopOfPageBid.format() ?? 'N/A',
      keyword.historicalMetrics?.highTopOfPageBid.format() ?? 'N/A',

      // Performance Metrics
      keyword.performanceMetrics?.impressions.toLocaleString() ?? '0',
      keyword.performanceMetrics?.clicks.toLocaleString() ?? '0',
      keyword.performanceMetrics ? keyword.performanceMetrics.ctr.toFixed(2) + '%' : '0.00%',
      keyword.performanceMetrics?.avgCpc.format() ?? '$0.00',
      keyword.performanceMetrics?.cost.format() ?? '$0.00',
      keyword.performanceMetrics ? keyword.performanceMetrics.conversions.toFixed(1) : '0.0',
      keyword.performanceMetrics ? keyword.performanceMetrics.conversionRate.toFixed(2) + '%' : '0.00%',
      keyword.performanceMetrics?.costPerConversion.format() ?? '$0.00',
      keyword.performanceMetrics?.conversionValue.format() ?? '$0.00',

      // Impression Share
      keyword.impressionShareMetrics ? keyword.impressionShareMetrics.searchImpressionShare.toFixed(1) + '%' : 'N/A',
      keyword.impressionShareMetrics ? keyword.impressionShareMetrics.searchTopImpressionShare.toFixed(1) + '%' : 'N/A',
      keyword.impressionShareMetrics ? keyword.impressionShareMetrics.searchAbsoluteTopImpressionShare.toFixed(1) + '%' : 'N/A',
      keyword.impressionShareMetrics ? keyword.impressionShareMetrics.searchImpressionShareLostBudget.toFixed(1) + '%' : 'N/A',
      keyword.impressionShareMetrics ? keyword.impressionShareMetrics.searchImpressionShareLostRank.toFixed(1) + '%' : 'N/A',

      // Forecast
      keyword.forecastMetrics?.estimatedClicks.toLocaleString() ?? 'N/A',
      keyword.forecastMetrics?.estimatedImpressions.toLocaleString() ?? 'N/A',
      keyword.forecastMetrics?.estimatedCost.format() ?? 'N/A',
      keyword.forecastMetrics ? keyword.forecastMetrics.estimatedConversions.toFixed(1) : 'N/A',

      // Calculated Fields
      keyword.getEstimatedROI() !== null && keyword.getEstimatedROI() !== undefined
        ? keyword.getEstimatedROI()!.toFixed(1) + '%'
        : 'N/A',
      keyword.getEffectivenessScore(),
      keyword.isPerformingWell(),
      keyword.needsOptimization(),
      keyword.getOptimizationSuggestions(),

      // Metadata
      keyword.createdAt.toLocaleDateString(),
      keyword.updatedAt.toLocaleDateString()
    );
  }

  /**
   * Convert match type enum to UI-friendly string
   */
  private static convertMatchType(matchType: KeywordMatchType): KeywordMatchTypeUI {
    const mapping: Record<KeywordMatchType, KeywordMatchTypeUI> = {
      [KeywordMatchType.BROAD_MATCH]: KeywordMatchTypeUI.BROAD,
      [KeywordMatchType.PHRASE_MATCH]: KeywordMatchTypeUI.PHRASE,
      [KeywordMatchType.EXACT_MATCH]: KeywordMatchTypeUI.EXACT,
      [KeywordMatchType.BROAD_MATCH_MODIFIER]: KeywordMatchTypeUI.BROAD_MODIFIER,
    };
    return mapping[matchType];
  }

  /**
   * Convert status enum to UI-friendly string
   */
  private static convertStatus(status: KeywordStatus): KeywordStatusUI {
    const mapping: Record<KeywordStatus, KeywordStatusUI> = {
      [KeywordStatus.ENABLED]: KeywordStatusUI.ENABLED,
      [KeywordStatus.PAUSED]: KeywordStatusUI.PAUSED,
      [KeywordStatus.REMOVED]: KeywordStatusUI.REMOVED,
    };
    return mapping[status];
  }

  /**
   * Convert competition level to UI-friendly string
   */
  private static convertCompetitionLevel(level: CompetitionLevel): CompetitionLevelUI {
    const mapping: Record<CompetitionLevel, CompetitionLevelUI> = {
      [CompetitionLevel.LOW]: CompetitionLevelUI.LOW,
      [CompetitionLevel.MEDIUM]: CompetitionLevelUI.MEDIUM,
      [CompetitionLevel.HIGH]: CompetitionLevelUI.HIGH,
      [CompetitionLevel.UNSPECIFIED]: CompetitionLevelUI.UNSPECIFIED,
    };
    return mapping[level];
  }

  /**
   * Convert quality score status to UI-friendly string
   */
  private static convertQualityScoreStatus(status: QualityScoreStatus): QualityScoreStatusUI {
    const mapping: Record<QualityScoreStatus, QualityScoreStatusUI> = {
      [QualityScoreStatus.BELOW_AVERAGE]: QualityScoreStatusUI.BELOW_AVERAGE,
      [QualityScoreStatus.AVERAGE]: QualityScoreStatusUI.AVERAGE,
      [QualityScoreStatus.ABOVE_AVERAGE]: QualityScoreStatusUI.ABOVE_AVERAGE,
      [QualityScoreStatus.UNSPECIFIED]: QualityScoreStatusUI.UNSPECIFIED,
    };
    return mapping[status];
  }

  /**
   * Get status badge color
   */
  public getStatusColor(): string {
    switch (this.status) {
      case KeywordStatusUI.ENABLED:
        return 'green';
      case KeywordStatusUI.PAUSED:
        return 'yellow';
      case KeywordStatusUI.REMOVED:
        return 'red';
      default:
        return 'gray';
    }
  }

  /**
   * Get competition level color
   */
  public getCompetitionColor(): string {
    switch (this.competitionLevel) {
      case CompetitionLevelUI.LOW:
        return 'green';
      case CompetitionLevelUI.MEDIUM:
        return 'yellow';
      case CompetitionLevelUI.HIGH:
        return 'red';
      default:
        return 'gray';
    }
  }

  /**
   * Get quality score color
   */
  public getQualityScoreColor(): string {
    if (!this.qualityScore) return 'gray';
    if (this.qualityScore >= 8) return 'green';
    if (this.qualityScore >= 6) return 'blue';
    if (this.qualityScore >= 4) return 'yellow';
    return 'red';
  }

  /**
   * Get performance badge
   */
  public getPerformanceBadge(): { text: string; color: string } {
    if (this.isPerforming) {
      return { text: 'High Performer', color: 'green' };
    }
    if (this.needsOptimization) {
      return { text: 'Needs Work', color: 'red' };
    }
    return { text: 'Average', color: 'yellow' };
  }
}

/**
 * Keyword Filters for querying
 */
export interface KeywordFilters {
  search?: string;
  status?: KeywordStatus[];
  matchType?: KeywordMatchType[];
  competitionLevel?: CompetitionLevel[];
  minQualityScore?: number;
  maxQualityScore?: number;
  minCtr?: number;
  maxCtr?: number;
  minConversionRate?: number;
  adGroupId?: string;
  campaignId?: string;
}

/**
 * Keyword Sort Options
 */
export enum KeywordSortBy {
  TEXT = 'text',
  IMPRESSIONS = 'impressions',
  CLICKS = 'clicks',
  CTR = 'ctr',
  CPC = 'cpc',
  COST = 'cost',
  CONVERSIONS = 'conversions',
  CONVERSION_RATE = 'conversionRate',
  QUALITY_SCORE = 'qualityScore',
  COMPETITION = 'competition',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}
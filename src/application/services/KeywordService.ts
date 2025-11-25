import { Keyword, KeywordMetrics } from '@domain/entities';
import { keywordRepository, KeywordFilters } from '@infrastructure/repositories';

export class KeywordService {
  async getKeywords(filters?: KeywordFilters): Promise<Keyword[]> {
    return keywordRepository.findAll(filters);
  }

  async getKeywordById(id: string): Promise<Keyword | null> {
    return keywordRepository.findById(id);
  }

  async getKeywordMetrics(keywordId: string): Promise<KeywordMetrics> {
    return keywordRepository.getMetrics(keywordId);
  }

  async getKeywordsWithMetrics(filters?: KeywordFilters): Promise<Array<{ keyword: Keyword; metrics: KeywordMetrics }>> {
    const keywords = await this.getKeywords(filters);
    const metricsMap = await keywordRepository.getAllMetrics(keywords.map(k => k.id));
    
    return keywords.map(keyword => ({
      keyword,
      metrics: metricsMap.get(keyword.id)!,
    }));
  }

  async getTopPerformingKeywords(limit: number = 10): Promise<Array<{ keyword: Keyword; metrics: KeywordMetrics }>> {
    const keywordsWithMetrics = await this.getKeywordsWithMetrics();
    
    return keywordsWithMetrics
      .sort((a, b) => b.metrics.conversions - a.metrics.conversions)
      .slice(0, limit);
  }

  async getLowQualityScoreKeywords(threshold: number = 5): Promise<Keyword[]> {
    const keywords = await this.getKeywords();
    return keywords.filter(k => k.qualityScore < threshold);
  }
}

export const keywordService = new KeywordService();
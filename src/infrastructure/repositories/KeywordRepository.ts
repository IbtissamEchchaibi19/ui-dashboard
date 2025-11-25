import { Keyword, KeywordMetrics } from '@domain/entities';
import { KeywordStatus } from '@domain/enums';
import { generateKeywords, generateKeywordMetrics } from '../mock-data';

export interface KeywordFilters {
  campaignId?: string;
  adGroupId?: string;
  status?: KeywordStatus[];
  search?: string;
}

export class KeywordRepository {
  private keywords: Keyword[] = [];

  constructor() {
    // Generate keywords for demo campaigns
    this.keywords = generateKeywords('campaign-1', 'adgroup-1', 15);
  }

  async findAll(filters?: KeywordFilters): Promise<Keyword[]> {
    await this.simulateDelay();
    
    let filtered = [...this.keywords];
    
    if (filters?.campaignId) {
      filtered = filtered.filter(k => k.campaignId === filters.campaignId);
    }
    
    if (filters?.adGroupId) {
      filtered = filtered.filter(k => k.adGroupId === filters.adGroupId);
    }
    
    if (filters?.status && filters.status.length > 0) {
      filtered = filtered.filter(k => filters.status!.includes(k.status));
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(k => 
        k.text.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  }

  async findById(id: string): Promise<Keyword | null> {
    await this.simulateDelay();
    return this.keywords.find(k => k.id === id) || null;
  }

  async getMetrics(keywordId: string): Promise<KeywordMetrics> {
    await this.simulateDelay();
    return generateKeywordMetrics(keywordId);
  }

  async getAllMetrics(keywordIds: string[]): Promise<Map<string, KeywordMetrics>> {
    await this.simulateDelay();
    
    const metricsMap = new Map<string, KeywordMetrics>();
    keywordIds.forEach(id => {
      metricsMap.set(id, generateKeywordMetrics(id));
    });
    
    return metricsMap;
  }

  private async simulateDelay(): Promise<void> {
    const delay = 200 + Math.random() * 300;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

export const keywordRepository = new KeywordRepository();


// infrastructure/repositories/KeywordRepository.ts

import { Keyword } from '@domain/entities';
import { KeywordStatus } from '@domain/entities/Keyword';
import { DateRangeVO } from '@domain/value-objects';
import { Money } from '@domain/value-objects/Money';
import { KeywordTimeSeriesDataPoint } from '../../application/services/KeywordService';
import { mockKeywords } from '../mock-data/keywordData.ts';


export interface KeywordFilters {
  campaignId?: string;
  adGroupId?: string;
  status?: KeywordStatus[];
  search?: string;
}

export class KeywordRepository {
  private keywords: Keyword[] = [];

  constructor() {
    // Use mock keywords from your MockKeywordData file
    this.keywords = [...mockKeywords];
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

  async findByAdGroup(adGroupId: string): Promise<Keyword[]> {
    await this.simulateDelay();
    return this.keywords.filter(k => k.adGroupId === adGroupId);
  }

  async findByCampaign(campaignId: string): Promise<Keyword[]> {
    await this.simulateDelay();
    return this.keywords.filter(k => k.campaignId === campaignId);
  }

  async create(keyword: Keyword): Promise<Keyword> {
    await this.simulateDelay();
    this.keywords.push(keyword);
    return keyword;
  }

  async update(keyword: Keyword): Promise<Keyword> {
    await this.simulateDelay();
    const index = this.keywords.findIndex(k => k.id === keyword.id);
    if (index === -1) {
      throw new Error(`Keyword with id ${keyword.id} not found`);
    }
    this.keywords[index] = keyword;
    return keyword;
  }

  async delete(id: string): Promise<boolean> {
    await this.simulateDelay();
    const index = this.keywords.findIndex(k => k.id === id);
    if (index === -1) {
      return false;
    }
    this.keywords.splice(index, 1);
    return true;
  }

  async bulkUpdateStatus(keywordIds: string[], status: KeywordStatus): Promise<Keyword[]> {
    await this.simulateDelay();
    const updatedKeywords: Keyword[] = [];
    
    for (const id of keywordIds) {
      const keyword = this.keywords.find(k => k.id === id);
      if (keyword) {
        const updated = keyword.clone({ status });
        const index = this.keywords.findIndex(k => k.id === id);
        this.keywords[index] = updated;
        updatedKeywords.push(updated);
      }
    }
    
    return updatedKeywords;
  }

  async bulkUpdateBids(keywordIds: string[], bidAmount: number): Promise<Keyword[]> {
    await this.simulateDelay();
    const updatedKeywords: Keyword[] = [];
    
    for (const id of keywordIds) {
      const keyword = this.keywords.find(k => k.id === id);
      if (keyword) {
        const updatedBid = {
          ...keyword.bid,
          bidAmount: Money.create(bidAmount, keyword.bid.bidAmount.currency)
        };
        const updated = keyword.clone({ bid: updatedBid });
        const index = this.keywords.findIndex(k => k.id === id);
        this.keywords[index] = updated;
        updatedKeywords.push(updated);
      }
    }
    
    return updatedKeywords;
  }

  async getTimeSeries(
    keywordId: string,
    dateRange: DateRangeVO
  ): Promise<KeywordTimeSeriesDataPoint[]> {
    await this.simulateDelay();
    
    // Generate mock time series data
    const keyword = this.keywords.find(k => k.id === keywordId);
    if (!keyword || !keyword.performanceMetrics) {
      return [];
    }
    
    const days = dateRange.getDays();
    const dataPoints: KeywordTimeSeriesDataPoint[] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(dateRange.startDate);
      date.setDate(date.getDate() + i);
      
      // Generate realistic variations of the keyword's metrics
      const variation = 0.7 + Math.random() * 0.6; // 70% to 130% of base metrics
      
      dataPoints.push({
        date: date.toISOString().split('T')[0],
        impressions: Math.floor((keyword.performanceMetrics.impressions / 30) * variation),
        clicks: Math.floor((keyword.performanceMetrics.clicks / 30) * variation),
        ctr: keyword.performanceMetrics.ctr * variation,
        avgCpc: keyword.performanceMetrics.avgCpc.amount * variation,
        cost: keyword.performanceMetrics.cost.amount / 30 * variation,
        conversions: Math.floor((keyword.performanceMetrics.conversions / 30) * variation),
        conversionRate: keyword.performanceMetrics.conversionRate * variation,
      });
    }
    
    return dataPoints;
  }

  private async simulateDelay(): Promise<void> {
    const delay = 200 + Math.random() * 300;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

export const keywordRepository = new KeywordRepository();
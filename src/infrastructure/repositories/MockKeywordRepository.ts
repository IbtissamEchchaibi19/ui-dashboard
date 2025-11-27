// infrastructure/repositories/MockKeywordRepository.ts

import { Keyword, KeywordStatus } from '../../domain/entities/Keyword';
import { IKeywordRepository } from './IKeywordRepository';
import { mockKeywords } from '../mock-data/keywordData';
import { DateRangeVO, DateRange } from '../../domain/value-objects/DateRange';
import { KeywordTimeSeriesDataPoint } from '../../application/services/KeywordService';
import { Money } from '../../domain/value-objects/Money';

/**
 * Mock Keyword Repository Implementation
 * Simulates database operations with in-memory data
 */
export class MockKeywordRepository implements IKeywordRepository {
  private keywords: Keyword[] = [...mockKeywords];

  async findAll(): Promise<Keyword[]> {
    await this.delay(300);
    return [...this.keywords];
  }

  async findById(id: string): Promise<Keyword | null> {
    await this.delay(200);
    return this.keywords.find(k => k.id === id) ?? null;
  }

  async findByAdGroup(adGroupId: string): Promise<Keyword[]> {
    await this.delay(250);
    return this.keywords.filter(k => k.adGroupId === adGroupId);
  }

  async findByCampaign(campaignId: string): Promise<Keyword[]> {
    await this.delay(250);
    return this.keywords.filter(k => k.campaignId === campaignId);
  }

  async create(keyword: Keyword): Promise<Keyword> {
    await this.delay(400);
    if (this.keywords.find(k => k.id === keyword.id)) {
      throw new Error(`Keyword with id ${keyword.id} already exists`);
    }
    this.keywords.push(keyword);
    return keyword;
  }

  async update(keyword: Keyword): Promise<Keyword> {
    await this.delay(400);
    const index = this.keywords.findIndex(k => k.id === keyword.id);
    if (index === -1) throw new Error(`Keyword with id ${keyword.id} not found`);
    this.keywords[index] = keyword;
    return keyword;
  }

  async delete(id: string): Promise<boolean> {
    await this.delay(350);
    const index = this.keywords.findIndex(k => k.id === id);
    if (index === -1) return false;
    this.keywords.splice(index, 1);
    return true;
  }

  async bulkUpdateStatus(keywordIds: string[], status: KeywordStatus): Promise<Keyword[]> {
    await this.delay(500);
    const updatedKeywords: Keyword[] = [];

    for (const id of keywordIds) {
      const keyword = this.keywords.find(k => k.id === id);
      if (keyword) {
        const updated = keyword.clone({
          status,
          updatedAt: new Date(),
        });
        const index = this.keywords.findIndex(k => k.id === id);
        this.keywords[index] = updated;
        updatedKeywords.push(updated);
      }
    }

    return updatedKeywords;
  }

  async bulkUpdateBids(keywordIds: string[], bidAmount: number): Promise<Keyword[]> {
    await this.delay(500);
    const updatedKeywords: Keyword[] = [];

    for (const id of keywordIds) {
      const keyword = this.keywords.find(k => k.id === id);
      if (keyword) {
        const newBid = {
          ...keyword.bid,
          bidAmount: Money.create(bidAmount, keyword.bid.bidAmount.currency),
        };
        const updated = keyword.clone({
          bid: newBid,
          updatedAt: new Date(),
        });
        const index = this.keywords.findIndex(k => k.id === id);
        this.keywords[index] = updated;
        updatedKeywords.push(updated);
      }
    }

    return updatedKeywords;
  }

  async getTimeSeries(keywordId: string, dateRange: DateRangeVO): Promise<KeywordTimeSeriesDataPoint[]> {
    await this.delay(400);
    const keyword = await this.findById(keywordId);
    if (!keyword || !keyword.performanceMetrics) return [];

    const days = dateRange.getDays();
    const timeSeries: KeywordTimeSeriesDataPoint[] = [];

    const baseImpressions = keyword.performanceMetrics.impressions / 30;
    const baseClicks = keyword.performanceMetrics.clicks / 30;
    const baseCtr = keyword.performanceMetrics.ctr;
    const baseAvgCpc = keyword.performanceMetrics.avgCpc.amount;
    const baseCost = keyword.performanceMetrics.cost.amount / 30;
    const baseConversions = keyword.performanceMetrics.conversions / 30;
    const baseConversionRate = keyword.performanceMetrics.conversionRate;

    for (let i = 0; i < days; i++) {
      const date = new Date(dateRange.startDate);
      date.setDate(date.getDate() + i);

      const variance = 0.8 + Math.random() * 0.4;
      const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1.0;

      const dailyImpressions = Math.round(baseImpressions * variance * weekendFactor);
      const dailyClicks = Math.round(baseClicks * variance * weekendFactor);
      const dailyCtr = dailyImpressions > 0 ? (dailyClicks / dailyImpressions) * 100 : 0;
      const dailyAvgCpc = baseAvgCpc * (0.9 + Math.random() * 0.2);
      const dailyCost = dailyClicks * dailyAvgCpc;
      const dailyConversions = baseConversions * variance * weekendFactor;
      const dailyConversionRate = dailyClicks > 0 ? (dailyConversions / dailyClicks) * 100 : 0;

      timeSeries.push({
        date: date.toISOString().split('T')[0],
        impressions: dailyImpressions,
        clicks: dailyClicks,
        ctr: parseFloat(dailyCtr.toFixed(2)),
        avgCpc: parseFloat(dailyAvgCpc.toFixed(2)),
        cost: parseFloat(dailyCost.toFixed(2)),
        conversions: parseFloat(dailyConversions.toFixed(2)),
        conversionRate: parseFloat(dailyConversionRate.toFixed(2)),
      });
    }

    return timeSeries;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  reset(): void {
    this.keywords = [...mockKeywords];
  }
}

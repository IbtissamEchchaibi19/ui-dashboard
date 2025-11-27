// infrastructure/repositories/MockAdRepository.ts
import { Ad, AdStatus } from '@domain/entities';
import { DateRange } from '@domain/value-objects';
import { IAdRepository, AdFilters, AdTimeSeriesDataPoint } from './IAdRepository';
import { mockAds, generateMockAdTimeSeries } from '../mock-data/adData';

export class MockAdRepository implements IAdRepository {
  private ads: Ad[] = [...mockAds];

  async findAll(filters?: AdFilters): Promise<Ad[]> {
    let result = [...this.ads];

    if (!filters) return result;

    if (filters.status?.length) {
      result = result.filter(ad => filters.status!.includes(ad.status));
    }

    if (filters.type?.length) {
      result = result.filter(ad => filters.type!.includes(ad.type));
    }

    if (filters.adGroupId?.length) {
      result = result.filter(ad => filters.adGroupId!.includes(ad.adGroupId));
    }

    if (filters.campaignId?.length) {
      result = result.filter(ad => filters.campaignId!.includes(ad.campaignId));
    }

    if (filters.adStrength?.length) {
      result = result.filter(ad => filters.adStrength!.includes(ad.adStrength));
    }

    if (filters.approvalStatus?.length) {
      result = result.filter(ad => 
        filters.approvalStatus!.includes(ad.policySummary.approvalStatus)
      );
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(ad =>
        ad.name.toLowerCase().includes(term) ||
        ad.getPrimaryHeadline().toLowerCase().includes(term) ||
        ad.getPrimaryDescription().toLowerCase().includes(term)
      );
    }

    return result;
  }

  async findById(id: string): Promise<Ad | null> {
    return this.ads.find(ad => ad.id === id) || null;
  }

  async findByAdGroupId(adGroupId: string): Promise<Ad[]> {
    return this.ads.filter(ad => ad.adGroupId === adGroupId);
  }

  async findByCampaignId(campaignId: string): Promise<Ad[]> {
    return this.ads.filter(ad => ad.campaignId === campaignId);
  }

  async create(ad: Ad): Promise<Ad> {
    this.ads.push(ad);
    return ad;
  }

  async update(ad: Ad): Promise<Ad> {
    const index = this.ads.findIndex(a => a.id === ad.id);
    if (index === -1) throw new Error('Ad not found');
    this.ads[index] = ad;
    return ad;
  }

  async delete(id: string): Promise<void> {
    const index = this.ads.findIndex(ad => ad.id === id);
    if (index === -1) throw new Error('Ad not found');
    this.ads.splice(index, 1);
  }

  async pause(id: string): Promise<void> {
    const ad = await this.findById(id);
    if (!ad) throw new Error('Ad not found');
    ad.pause();
  }

  async enable(id: string): Promise<void> {
    const ad = await this.findById(id);
    if (!ad) throw new Error('Ad not found');
    ad.enable();
  }

  async getTimeSeries(id: string, dateRange: DateRange): Promise<AdTimeSeriesDataPoint[]> {
    const days = Math.ceil(
      (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return generateMockAdTimeSeries(id, days);
  }

  async bulkPause(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.pause(id);
    }
  }

  async bulkEnable(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.enable(id);
    }
  }

  async bulkDelete(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.delete(id);
    }
  }
}
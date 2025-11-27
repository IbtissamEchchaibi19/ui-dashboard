// infrastructure/repositories/MockAdGroupRepository.ts
import { AdGroup, AdGroupStatus } from '@domain/entities';
import { DateRange } from '@domain/value-objects';
import { IAdGroupRepository, AdGroupFilters, AdGroupTimeSeriesDataPoint } from './IAdGroupRepository';
import { mockAdGroups, generateMockAdGroupTimeSeries } from '../mock-data/adGroupData';

export class MockAdGroupRepository implements IAdGroupRepository {
  private adGroups: AdGroup[] = [...mockAdGroups];

  async findAll(filters?: AdGroupFilters): Promise<AdGroup[]> {
    let result = [...this.adGroups];

    if (!filters) return result;

    if (filters.status?.length) {
      result = result.filter(ag => filters.status!.includes(ag.status));
    }

    if (filters.type?.length) {
      result = result.filter(ag => filters.type!.includes(ag.type));
    }

    if (filters.campaignId?.length) {
      result = result.filter(ag => filters.campaignId!.includes(ag.campaignId));
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(ag =>
        ag.name.toLowerCase().includes(term) ||
        ag.id.toLowerCase().includes(term)
      );
    }

    if (filters.minCpcBid !== undefined && filters.minCpcBid !== null) {
      result = result.filter(ag => 
        ag.cpcBidMicros && ag.cpcBidMicros.amount >= filters.minCpcBid!
      );
    }

    if (filters.maxCpcBid !== undefined && filters.maxCpcBid !== null) {
      result = result.filter(ag => 
        ag.cpcBidMicros && ag.cpcBidMicros.amount <= filters.maxCpcBid!
      );
    }

    return result;
  }

  async findById(id: string): Promise<AdGroup | null> {
    return this.adGroups.find(ag => ag.id === id) || null;
  }

  async findByCampaignId(campaignId: string): Promise<AdGroup[]> {
    return this.adGroups.filter(ag => ag.campaignId === campaignId);
  }

  async findByCustomerId(customerId: string): Promise<AdGroup[]> {
    return this.adGroups.filter(ag => ag.customerId === customerId);
  }

  async create(adGroup: AdGroup): Promise<AdGroup> {
    this.adGroups.push(adGroup);
    return adGroup;
  }

  async update(adGroup: AdGroup): Promise<AdGroup> {
    const index = this.adGroups.findIndex(ag => ag.id === adGroup.id);
    if (index === -1) throw new Error('Ad group not found');
    this.adGroups[index] = adGroup;
    return adGroup;
  }

  async delete(id: string): Promise<void> {
    const index = this.adGroups.findIndex(ag => ag.id === id);
    if (index === -1) throw new Error('Ad group not found');
    this.adGroups.splice(index, 1);
  }

  async pause(id: string): Promise<void> {
    const adGroup = await this.findById(id);
    if (!adGroup) throw new Error('Ad group not found');
    adGroup.pause();
  }

  async enable(id: string): Promise<void> {
    const adGroup = await this.findById(id);
    if (!adGroup) throw new Error('Ad group not found');
    adGroup.enable();
  }

  async getTimeSeries(id: string, dateRange: DateRange): Promise<AdGroupTimeSeriesDataPoint[]> {
    const days = Math.ceil(
      (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return generateMockAdGroupTimeSeries(id, days);
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

  async getAdCount(adGroupId: string): Promise<number> {
    // Mock ad count - in real implementation, would query ads table
    return Math.floor(Math.random() * 10) + 1;
  }

  async getKeywordCount(adGroupId: string): Promise<number> {
    // Mock keyword count - in real implementation, would query keywords table
    return Math.floor(Math.random() * 50) + 5;
  }
}
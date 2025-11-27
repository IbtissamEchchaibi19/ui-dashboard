// infrastructure/repositories/MockAssetGroupRepository.ts
import { AssetGroup, AssetGroupStatus, AssetGroupPrimaryStatus } from '@domain/entities';
import { DateRange } from '@domain/value-objects';
import { 
  IAssetGroupRepository, 
  AssetGroupFilters, 
  AssetGroupTimeSeriesDataPoint,
  AssetPerformanceSummary 
} from './IAssetGroupRepository';
import { 
  mockAssetGroups, 
  generateMockAssetGroupTimeSeries,
  generateMockAssetPerformance 
} from '../mock-data/assetGroupData';

export class MockAssetGroupRepository implements IAssetGroupRepository {
  private assetGroups: AssetGroup[] = [...mockAssetGroups];

  async findAll(filters?: AssetGroupFilters): Promise<AssetGroup[]> {
    let result = [...this.assetGroups];

    if (!filters) return result;

    // Status filter
    if (filters.status?.length) {
      result = result.filter(ag => filters.status!.includes(ag.status));
    }

    // Primary Status filter
    if (filters.primaryStatus?.length) {
      result = result.filter(ag => filters.primaryStatus!.includes(ag.primaryStatus));
    }

    // Ad Strength filter
    if (filters.adStrength?.length) {
      result = result.filter(ag => filters.adStrength!.includes(ag.adStrength));
    }

    // Campaign ID filter
    if (filters.campaignId?.length) {
      result = result.filter(ag => filters.campaignId!.includes(ag.campaignId));
    }

    // Search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(ag =>
        ag.name.toLowerCase().includes(term) ||
        ag.id.toLowerCase().includes(term) ||
        ag.businessName.toLowerCase().includes(term) ||
        ag.finalUrls.some(url => url.toLowerCase().includes(term))
      );
    }

    // Has videos filter
    if (filters.hasVideos !== undefined) {
      result = result.filter(ag => 
        filters.hasVideos ? ag.videos.length > 0 : ag.videos.length === 0
      );
    }

    // Meets requirements filter
    if (filters.meetsRequirements !== undefined) {
      result = result.filter(ag => 
        ag.meetsMinimumRequirements() === filters.meetsRequirements
      );
    }

    return result;
  }

  async findById(id: string): Promise<AssetGroup | null> {
    return this.assetGroups.find(ag => ag.id === id) || null;
  }

  async findByCampaignId(campaignId: string): Promise<AssetGroup[]> {
    return this.assetGroups.filter(ag => ag.campaignId === campaignId);
  }

  async findByCustomerId(customerId: string): Promise<AssetGroup[]> {
    return this.assetGroups.filter(ag => ag.customerId === customerId);
  }

  async create(assetGroup: AssetGroup): Promise<AssetGroup> {
    this.assetGroups.push(assetGroup);
    return assetGroup;
  }

  async update(assetGroup: AssetGroup): Promise<AssetGroup> {
    const index = this.assetGroups.findIndex(ag => ag.id === assetGroup.id);
    if (index === -1) throw new Error('Asset group not found');
    this.assetGroups[index] = assetGroup;
    return assetGroup;
  }

  async delete(id: string): Promise<void> {
    const index = this.assetGroups.findIndex(ag => ag.id === id);
    if (index === -1) throw new Error('Asset group not found');
    this.assetGroups.splice(index, 1);
  }

  async pause(id: string): Promise<void> {
    const assetGroup = await this.findById(id);
    if (!assetGroup) throw new Error('Asset group not found');
    assetGroup.pause();
  }

  async enable(id: string): Promise<void> {
    const assetGroup = await this.findById(id);
    if (!assetGroup) throw new Error('Asset group not found');
    assetGroup.enable();
  }

  async getTimeSeries(id: string, dateRange: DateRange): Promise<AssetGroupTimeSeriesDataPoint[]> {
    const days = Math.ceil(
      (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return generateMockAssetGroupTimeSeries(id, Math.max(days, 1));
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

  async getAssetPerformance(assetGroupId: string): Promise<AssetPerformanceSummary[]> {
    return generateMockAssetPerformance(assetGroupId);
  }

  async getListingGroupCount(assetGroupId: string): Promise<number> {
    const assetGroup = await this.findById(assetGroupId);
    return assetGroup?.listingGroups.length || 0;
  }

  async getProductCount(assetGroupId: string): Promise<number> {
    const assetGroup = await this.findById(assetGroupId);
    if (!assetGroup) return 0;
    return assetGroup.listingGroups.reduce((sum, lg) => sum + (lg.productCount || 0), 0);
  }
}
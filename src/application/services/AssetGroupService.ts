// application/services/AssetGroupService.ts
import { AssetGroup } from '@domain/entities';
import { DateRange, Money } from '@domain/value-objects';
import { AssetGroupUI, AssetGroupMetricsUI } from '../dto/AssetGroupDTO';
import { 
  IAssetGroupRepository, 
  AssetGroupFilters, 
  AssetGroupTimeSeriesDataPoint,
  AssetPerformanceSummary 
} from '@infrastructure/repositories/IAssetGroupRepository';
import { MockAssetGroupRepository } from '@infrastructure/repositories/MockAssetGroupRepository';
import { pMaxCampaignNameMap, generateMockAssetGroupMetrics } from '@infrastructure/mock-data/assetGroupData';

// Singleton repository instance for static methods
const defaultRepository = new MockAssetGroupRepository();

export class AssetGroupService {
  private repository: IAssetGroupRepository;

  constructor(repository?: IAssetGroupRepository) {
    this.repository = repository || defaultRepository;
  }

  async getAssetGroups(filters?: AssetGroupFilters): Promise<AssetGroupUI[]> {
    const assetGroups = await this.repository.findAll(filters);
    const results: AssetGroupUI[] = [];

    for (const assetGroup of assetGroups) {
      const campaignName = pMaxCampaignNameMap[assetGroup.campaignId] || 'Unknown Campaign';
      const metrics = this.generateMetrics();
      results.push(AssetGroupUI.fromDomain(assetGroup, campaignName, metrics));
    }

    return results;
  }

  async getAssetGroupById(id: string): Promise<AssetGroupUI | null> {
    const assetGroup = await this.repository.findById(id);
    if (!assetGroup) return null;

    const campaignName = pMaxCampaignNameMap[assetGroup.campaignId] || 'Unknown Campaign';
    const metrics = this.generateMetrics();
    return AssetGroupUI.fromDomain(assetGroup, campaignName, metrics);
  }

  async getAssetGroupsByCampaignId(campaignId: string): Promise<AssetGroupUI[]> {
    const assetGroups = await this.repository.findByCampaignId(campaignId);
    const results: AssetGroupUI[] = [];

    for (const assetGroup of assetGroups) {
      const campaignName = pMaxCampaignNameMap[assetGroup.campaignId] || 'Unknown Campaign';
      const metrics = this.generateMetrics();
      results.push(AssetGroupUI.fromDomain(assetGroup, campaignName, metrics));
    }

    return results;
  }

  async createAssetGroup(assetGroup: AssetGroup): Promise<AssetGroupUI> {
    const created = await this.repository.create(assetGroup);
    const campaignName = pMaxCampaignNameMap[created.campaignId] || 'Unknown Campaign';
    const metrics = this.generateMetrics();
    return AssetGroupUI.fromDomain(created, campaignName, metrics);
  }

  async updateAssetGroup(assetGroup: AssetGroup): Promise<AssetGroupUI> {
    const updated = await this.repository.update(assetGroup);
    const campaignName = pMaxCampaignNameMap[updated.campaignId] || 'Unknown Campaign';
    const metrics = this.generateMetrics();
    return AssetGroupUI.fromDomain(updated, campaignName, metrics);
  }

  async deleteAssetGroup(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async pauseAssetGroup(id: string): Promise<void> {
    await this.repository.pause(id);
  }

  async enableAssetGroup(id: string): Promise<void> {
    await this.repository.enable(id);
  }

  async getTimeSeries(id: string, dateRange: DateRange): Promise<AssetGroupTimeSeriesDataPoint[]> {
    return this.repository.getTimeSeries(id, dateRange);
  }

  async getAssetPerformance(assetGroupId: string): Promise<AssetPerformanceSummary[]> {
    return this.repository.getAssetPerformance(assetGroupId);
  }

  async bulkPause(ids: string[]): Promise<void> {
    await this.repository.bulkPause(ids);
  }

  async bulkEnable(ids: string[]): Promise<void> {
    await this.repository.bulkEnable(ids);
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await this.repository.bulkDelete(ids);
  }

  // Static methods for direct access from UI components
  static async bulkPauseAssetGroups(ids: string[]): Promise<void> {
    await defaultRepository.bulkPause(ids);
  }

  static async bulkEnableAssetGroups(ids: string[]): Promise<void> {
    await defaultRepository.bulkEnable(ids);
  }

  static async bulkDeleteAssetGroups(ids: string[]): Promise<void> {
    await defaultRepository.bulkDelete(ids);
  }

  private generateMetrics(): AssetGroupMetricsUI {
    const raw = generateMockAssetGroupMetrics();

    return {
      impressions: raw.impressions,
      clicks: raw.clicks,
      interactions: raw.interactions,
      interactionRate: raw.interactionRate + '%',
      ctr: raw.ctr + '%',
      conversions: raw.conversions,
      conversionRate: raw.conversionRate + '%',
      conversionsValue: Money.create(raw.conversionsValue, 'INR'),
      cost: Money.create(raw.cost, 'INR'),
      averageCpc: Money.create(raw.averageCpc, 'INR'),
      costPerConversion: Money.create(raw.costPerConversion, 'INR'),
      roas: raw.roas.toFixed(2) + 'x'
    };
  }
}

// Export singleton instance
export const assetGroupService = new AssetGroupService();
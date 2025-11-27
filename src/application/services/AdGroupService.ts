// application/services/AdGroupService.ts
import { AdGroup } from '@domain/entities';
import { DateRange, Money } from '@domain/value-objects';
import { AdGroupUI, AdGroupMetricsUI } from '../dto/';
import { IAdGroupRepository, AdGroupFilters, AdGroupTimeSeriesDataPoint } from '@infrastructure/repositories/IAdGroupRepository';
import { MockAdGroupRepository } from '@infrastructure/repositories/MockAdGroupRepository';
import { campaignNameMap } from '@infrastructure/mock-data/adGroupData';

// Singleton repository instance for static methods
const defaultRepository = new MockAdGroupRepository();

export class AdGroupService {
  private repository: IAdGroupRepository;

  constructor(repository?: IAdGroupRepository) {
    this.repository = repository || defaultRepository;
  }

  async getAdGroups(filters?: AdGroupFilters): Promise<AdGroupUI[]> {
    const adGroups = await this.repository.findAll(filters);
    const results: AdGroupUI[] = [];

    for (const adGroup of adGroups) {
      const adCount = await this.repository.getAdCount(adGroup.id);
      const keywordCount = await this.repository.getKeywordCount(adGroup.id);
      const campaignName = campaignNameMap[adGroup.campaignId] || 'Unknown Campaign';
      const metrics = this.generateMetrics();
      
      results.push(AdGroupUI.fromDomain(adGroup, campaignName, metrics, adCount, keywordCount));
    }

    return results;
  }

  async getAdGroupById(id: string): Promise<AdGroupUI | null> {
    const adGroup = await this.repository.findById(id);
    if (!adGroup) return null;

    const adCount = await this.repository.getAdCount(id);
    const keywordCount = await this.repository.getKeywordCount(id);
    const campaignName = campaignNameMap[adGroup.campaignId] || 'Unknown Campaign';
    const metrics = this.generateMetrics();

    return AdGroupUI.fromDomain(adGroup, campaignName, metrics, adCount, keywordCount);
  }

  async getAdGroupsByCampaignId(campaignId: string): Promise<AdGroupUI[]> {
    const adGroups = await this.repository.findByCampaignId(campaignId);
    const results: AdGroupUI[] = [];

    for (const adGroup of adGroups) {
      const adCount = await this.repository.getAdCount(adGroup.id);
      const keywordCount = await this.repository.getKeywordCount(adGroup.id);
      const campaignName = campaignNameMap[adGroup.campaignId] || 'Unknown Campaign';
      const metrics = this.generateMetrics();
      
      results.push(AdGroupUI.fromDomain(adGroup, campaignName, metrics, adCount, keywordCount));
    }

    return results;
  }

  async createAdGroup(adGroup: AdGroup): Promise<AdGroupUI> {
    const created = await this.repository.create(adGroup);
    const campaignName = campaignNameMap[created.campaignId] || 'Unknown Campaign';
    const metrics = this.generateMetrics();
    return AdGroupUI.fromDomain(created, campaignName, metrics, 0, 0);
  }

  async updateAdGroup(adGroup: AdGroup): Promise<AdGroupUI> {
    const updated = await this.repository.update(adGroup);
    const adCount = await this.repository.getAdCount(updated.id);
    const keywordCount = await this.repository.getKeywordCount(updated.id);
    const campaignName = campaignNameMap[updated.campaignId] || 'Unknown Campaign';
    const metrics = this.generateMetrics();
    return AdGroupUI.fromDomain(updated, campaignName, metrics, adCount, keywordCount);
  }

  async deleteAdGroup(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async pauseAdGroup(id: string): Promise<void> {
    await this.repository.pause(id);
  }

  async enableAdGroup(id: string): Promise<void> {
    await this.repository.enable(id);
  }

  async getTimeSeries(id: string, dateRange: DateRange): Promise<AdGroupTimeSeriesDataPoint[]> {
    return this.repository.getTimeSeries(id, dateRange);
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
  static async bulkPauseAdGroups(ids: string[]): Promise<void> {
    await defaultRepository.bulkPause(ids);
  }

  static async bulkEnableAdGroups(ids: string[]): Promise<void> {
    await defaultRepository.bulkEnable(ids);
  }

  static async bulkDeleteAdGroups(ids: string[]): Promise<void> {
    await defaultRepository.bulkDelete(ids);
  }

  private generateMetrics(): AdGroupMetricsUI {
    const impressions = Math.floor(Math.random() * 10000) + 1000;
    const clicks = Math.floor(impressions * (Math.random() * 0.08 + 0.02));
    const interactions = clicks + Math.floor(Math.random() * 20);
    const cost = clicks * (Math.random() * 60 + 15);
    const conversions = Math.floor(clicks * (Math.random() * 0.12 + 0.03));
    const costPerConversion = conversions > 0 ? cost / conversions : 0;

    return {
      impressions,
      clicks,
      interactions,
      interactionRate: ((interactions / impressions) * 100).toFixed(2) + '%',
      averageCpc: Money.create(cost / clicks || 0, 'INR'),
      cost: Money.create(cost, 'INR'),
      conversions,
      conversionRate: ((conversions / clicks) * 100 || 0).toFixed(2) + '%',
      ctr: ((clicks / impressions) * 100).toFixed(2),
      averageCpm: Money.create((cost / impressions) * 1000, 'INR'),
      costPerConversion: Money.create(costPerConversion, 'INR'),
      videoViews: Math.floor(Math.random() * 200),
      videoViewRate: (Math.random() * 30).toFixed(2) + '%'
    };
  }
}

// Export singleton instance
export const adGroupService = new AdGroupService();
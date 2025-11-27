// application/services/AdService.ts
import { Ad } from '@domain/entities';
import { DateRange, Money } from '@domain/value-objects';
import { AdUI, AdMetricsUI } from '../dto/AdDTO';
import { IAdRepository, AdFilters, AdTimeSeriesDataPoint } from '@infrastructure/repositories/IAdRepository';
import { MockAdRepository } from '@infrastructure/repositories/MockAdRepository';

// Singleton repository instance for static methods
const defaultRepository = new MockAdRepository();

export class AdService {
  private repository: IAdRepository;

  constructor(repository?: IAdRepository) {
    this.repository = repository || defaultRepository;
  }

  async getAds(filters?: AdFilters): Promise<AdUI[]> {
    const ads = await this.repository.findAll(filters);
    return ads.map(ad => this.mapToUI(ad));
  }

  async getAdById(id: string): Promise<AdUI | null> {
    const ad = await this.repository.findById(id);
    return ad ? this.mapToUI(ad) : null;
  }

  async getAdsByAdGroupId(adGroupId: string): Promise<AdUI[]> {
    const ads = await this.repository.findByAdGroupId(adGroupId);
    return ads.map(ad => this.mapToUI(ad));
  }

  async getAdsByCampaignId(campaignId: string): Promise<AdUI[]> {
    const ads = await this.repository.findByCampaignId(campaignId);
    return ads.map(ad => this.mapToUI(ad));
  }

  async createAd(ad: Ad): Promise<AdUI> {
    const created = await this.repository.create(ad);
    return this.mapToUI(created);
  }

  async updateAd(ad: Ad): Promise<AdUI> {
    const updated = await this.repository.update(ad);
    return this.mapToUI(updated);
  }

  async deleteAd(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async pauseAd(id: string): Promise<void> {
    await this.repository.pause(id);
  }

  async enableAd(id: string): Promise<void> {
    await this.repository.enable(id);
  }

  async getTimeSeries(id: string, dateRange: DateRange): Promise<AdTimeSeriesDataPoint[]> {
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
  static async bulkPauseAds(ids: string[]): Promise<void> {
    await defaultRepository.bulkPause(ids);
  }

  static async bulkEnableAds(ids: string[]): Promise<void> {
    await defaultRepository.bulkEnable(ids);
  }

  static async bulkDeleteAds(ids: string[]): Promise<void> {
    await defaultRepository.bulkDelete(ids);
  }

  private mapToUI(ad: Ad): AdUI {
    const metrics = this.generateMetrics();
    return AdUI.fromDomain(ad, 'Ad Group Name', 'Campaign Name', metrics);
  }

  private generateMetrics(): AdMetricsUI {
    const impressions = Math.floor(Math.random() * 5000) + 500;
    const clicks = Math.floor(impressions * (Math.random() * 0.05 + 0.02));
    const interactions = clicks + Math.floor(Math.random() * 10);
    const cost = clicks * (Math.random() * 50 + 10);
    const conversions = Math.floor(clicks * (Math.random() * 0.1 + 0.05));

    return {
      impressions,
      clicks,
      interactions,
      interactionRate: ((interactions / impressions) * 100).toFixed(2) + '%',
      averageCost: Money.create(cost / clicks || 0, 'INR'),
      cost: Money.create(cost, 'INR'),
      conversions,
      conversionRate: ((conversions / clicks) * 100 || 0).toFixed(2) + '%',
      ctr: ((clicks / impressions) * 100).toFixed(2),
      averageCpc: Money.create(cost / clicks || 0, 'INR'),
      averageCpm: Money.create((cost / impressions) * 1000, 'INR'),
      videoViews: Math.floor(Math.random() * 100),
      videoViewRate: (Math.random() * 20).toFixed(2) + '%',
      engagements: Math.floor(Math.random() * 50),
      engagementRate: (Math.random() * 5).toFixed(2) + '%'
    };
  }
}
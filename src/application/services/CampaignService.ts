import { Campaign, CampaignMetrics } from '@domain/entities';
import { CampaignStatus, CampaignType } from '@domain/enums';
import { DateRange, Money } from '@domain/value-objects';
import { campaignRepository, CampaignFilters } from '@infrastructure/repositories';

export class CampaignService {
  async getCampaigns(filters?: CampaignFilters): Promise<Campaign[]> {
    return campaignRepository.findAll(filters);
  }

  async getCampaignById(id: string): Promise<Campaign | null> {
    return campaignRepository.findById(id);
  }

  async getCampaignMetrics(campaignId: string, dateRange?: DateRange): Promise<CampaignMetrics[]> {
    return campaignRepository.getMetrics(campaignId, dateRange);
  }

  async getCampaignTimeSeriesMetrics(campaignId: string, dateRange?: DateRange) {
    return campaignRepository.getTimeSeriesMetrics(campaignId, dateRange);
  }

  async getAggregatedMetrics(campaigns: Campaign[], dateRange?: DateRange) {
    const allMetrics = await Promise.all(
      campaigns.map(c => this.getCampaignMetrics(c.id, dateRange))
    );

    const aggregated = allMetrics.flat().reduce(
      (acc, metric) => {
        acc.totalImpressions += metric.impressions;
        acc.totalClicks += metric.clicks;
        acc.totalConversions += metric.conversions;
        acc.totalCost = acc.totalCost.add(metric.cost);
        return acc;
      },
      {
        totalImpressions: 0,
        totalClicks: 0,
        totalConversions: 0,
        // ✅ FIXED LINE (the ONLY change)
        totalCost: Money.zero(allMetrics[0]?.[0]?.cost.currency || 'USD'),
      }
    );

    return {
      ...aggregated,
      averageCtr: aggregated.totalClicks / aggregated.totalImpressions || 0,
      averageConversionRate: aggregated.totalConversions / aggregated.totalClicks || 0,
    };
  }

  async createCampaign(campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> {
    return campaignRepository.create(campaign);
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    return campaignRepository.update(id, updates);
  }

  async deleteCampaign(id: string): Promise<boolean> {
    return campaignRepository.delete(id);
  }

  async pauseCampaign(id: string): Promise<Campaign | null> {
    return this.updateCampaign(id, { status: CampaignStatus.PAUSED });
  }

  async enableCampaign(id: string): Promise<Campaign | null> {
    return this.updateCampaign(id, { status: CampaignStatus.ENABLED });
  }

  getActiveCampaigns(campaigns: Campaign[]): Campaign[] {
    return campaigns.filter(c => c.status === CampaignStatus.ENABLED);
  }

  getCampaignsByType(campaigns: Campaign[], type: CampaignType): Campaign[] {
    return campaigns.filter(c => c.type === type);
  }
}

export const campaignService = new CampaignService();

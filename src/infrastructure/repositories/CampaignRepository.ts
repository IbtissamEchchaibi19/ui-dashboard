import { Campaign, CampaignMetrics } from '@domain/entities';
import { CampaignStatus, CampaignType } from '@domain/enums';
import { DateRange } from '@domain/value-objects';
// import { mockApiClient, QueryParams } from '../api';
import { generateCampaigns, generateCampaignMetrics, generateTimeSeriesData } from '../mock-data';

export interface CampaignFilters {
  status?: CampaignStatus[];
  type?: CampaignType[];
  search?: string;
  dateRange?: DateRange;
}

export class CampaignRepository {
  private campaigns: Campaign[] = generateCampaigns(15);
  
  async findAll(filters?: CampaignFilters): Promise<Campaign[]> {
    await this.simulateDelay();
    
    let filtered = [...this.campaigns];
    
    if (filters?.status && filters.status.length > 0) {
      filtered = filtered.filter(c => filters.status!.includes(c.status));
    }
    
    if (filters?.type && filters.type.length > 0) {
      filtered = filtered.filter(c => filters.type!.includes(c.type));
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(search) ||
        c.id.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  }

  async findById(id: string): Promise<Campaign | null> {
    await this.simulateDelay();
    return this.campaigns.find(c => c.id === id) || null;
  }

  async getMetrics(campaignId: string, dateRange?: DateRange): Promise<CampaignMetrics[]> {
    await this.simulateDelay();
    
    const days = dateRange 
      ? Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 30;
    
    return generateCampaignMetrics(campaignId, days);
  }

  async getTimeSeriesMetrics(campaignId: string, dateRange?: DateRange) {
    await this.simulateDelay();
    
    const days = dateRange 
      ? Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 90;
    
    return generateTimeSeriesData(days);
  }

  async create(campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> {
    await this.simulateDelay();
    
    const newCampaign: Campaign = {
      ...campaign,
      id: `campaign-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.campaigns.push(newCampaign);
    return newCampaign;
  }

  async update(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    await this.simulateDelay();
    
    const index = this.campaigns.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.campaigns[index] = {
      ...this.campaigns[index],
      ...updates,
      updatedAt: new Date(),
    };
    
    return this.campaigns[index];
  }

  async delete(id: string): Promise<boolean> {
    await this.simulateDelay();
    
    const index = this.campaigns.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.campaigns.splice(index, 1);
    return true;
  }

  private async simulateDelay(): Promise<void> {
    const delay = 200 + Math.random() * 300;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

export const campaignRepository = new CampaignRepository();
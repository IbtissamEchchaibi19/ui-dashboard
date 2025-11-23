import { ICampaignRepository } from '../../domain/repositories/ICampaignRepository';
import { Campaign, AdGroup, Ad, Keyword, Experiment, ChangeHistoryEntry } from '../../domain/entities/Campaign';
import {
  generateCampaigns,
  generateAdGroups,
  generateAds,
  generateKeywords,
  generateExperiments,
  generateChangeHistory,
} from '../mock/dataGenerator';

export class CampaignRepository implements ICampaignRepository {
  private campaigns: Campaign[] = [];
  private adGroups: AdGroup[] = [];
  private ads: Ad[] = [];
  private keywords: Keyword[] = [];
  private experiments: Experiment[] = [];
  private changeHistory: ChangeHistoryEntry[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Generate campaigns
    this.campaigns = generateCampaigns(15);

    // Generate ad groups for each campaign
    this.campaigns.forEach(campaign => {
      const adGroups = generateAdGroups(campaign.id, 3);
      this.adGroups.push(...adGroups);

      // Generate ads and keywords for each ad group
      adGroups.forEach(adGroup => {
        const ads = generateAds(adGroup.id, 2);
        const keywords = generateKeywords(adGroup.id, 5);
        this.ads.push(...ads);
        this.keywords.push(...keywords);
        
        adGroup.ads = ads;
        adGroup.keywords = keywords;
      });

      campaign.adGroups = adGroups;
    });

    // Generate experiments
    this.experiments = generateExperiments(10);

    // Generate change history
    this.changeHistory = generateChangeHistory(50);
  }

  async getCampaigns(): Promise<Campaign[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.campaigns]), 300);
    });
  }

  async getCampaignById(id: string): Promise<Campaign | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const campaign = this.campaigns.find(c => c.id === id);
        resolve(campaign || null);
      }, 200);
    });
  }

  async createCampaign(campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCampaign: Campaign = {
          ...campaign,
          id: `camp_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.campaigns.push(newCampaign);
        resolve(newCampaign);
      }, 300);
    });
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.campaigns.findIndex(c => c.id === id);
        if (index === -1) {
          reject(new Error('Campaign not found'));
          return;
        }
        this.campaigns[index] = {
          ...this.campaigns[index],
          ...updates,
          updatedAt: new Date(),
        };
        resolve(this.campaigns[index]);
      }, 300);
    });
  }

  async deleteCampaign(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.campaigns.findIndex(c => c.id === id);
        if (index !== -1) {
          this.campaigns.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }

  async getAdGroups(campaignId: string): Promise<AdGroup[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const adGroups = this.adGroups.filter(ag => ag.campaignId === campaignId);
        resolve(adGroups);
      }, 200);
    });
  }

  async getAdGroupById(id: string): Promise<AdGroup | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const adGroup = this.adGroups.find(ag => ag.id === id);
        resolve(adGroup || null);
      }, 200);
    });
  }

  async createAdGroup(adGroup: Omit<AdGroup, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdGroup> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAdGroup: AdGroup = {
          ...adGroup,
          id: `ag_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.adGroups.push(newAdGroup);
        resolve(newAdGroup);
      }, 300);
    });
  }

  async updateAdGroup(id: string, updates: Partial<AdGroup>): Promise<AdGroup> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.adGroups.findIndex(ag => ag.id === id);
        if (index === -1) {
          reject(new Error('Ad Group not found'));
          return;
        }
        this.adGroups[index] = {
          ...this.adGroups[index],
          ...updates,
          updatedAt: new Date(),
        };
        resolve(this.adGroups[index]);
      }, 300);
    });
  }

  async deleteAdGroup(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.adGroups.findIndex(ag => ag.id === id);
        if (index !== -1) {
          this.adGroups.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }

  async getAds(adGroupId: string): Promise<Ad[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ads = this.ads.filter(ad => ad.adGroupId === adGroupId);
        resolve(ads);
      }, 200);
    });
  }

  async getAdById(id: string): Promise<Ad | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ad = this.ads.find(a => a.id === id);
        resolve(ad || null);
      }, 200);
    });
  }

  async createAd(ad: Omit<Ad, 'id' | 'createdAt'>): Promise<Ad> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAd: Ad = {
          ...ad,
          id: `ad_${Date.now()}`,
          createdAt: new Date(),
        };
        this.ads.push(newAd);
        resolve(newAd);
      }, 300);
    });
  }

  async updateAd(id: string, updates: Partial<Ad>): Promise<Ad> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.ads.findIndex(a => a.id === id);
        if (index === -1) {
          reject(new Error('Ad not found'));
          return;
        }
        this.ads[index] = {
          ...this.ads[index],
          ...updates,
        };
        resolve(this.ads[index]);
      }, 300);
    });
  }

  async deleteAd(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.ads.findIndex(a => a.id === id);
        if (index !== -1) {
          this.ads.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }

  async getKeywords(adGroupId: string): Promise<Keyword[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const keywords = this.keywords.filter(kw => kw.adGroupId === adGroupId);
        resolve(keywords);
      }, 200);
    });
  }

  async getKeywordById(id: string): Promise<Keyword | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const keyword = this.keywords.find(kw => kw.id === id);
        resolve(keyword || null);
      }, 200);
    });
  }

  async createKeyword(keyword: Omit<Keyword, 'id' | 'createdAt'>): Promise<Keyword> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newKeyword: Keyword = {
          ...keyword,
          id: `kw_${Date.now()}`,
          createdAt: new Date(),
        };
        this.keywords.push(newKeyword);
        resolve(newKeyword);
      }, 300);
    });
  }

  async updateKeyword(id: string, updates: Partial<Keyword>): Promise<Keyword> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.keywords.findIndex(kw => kw.id === id);
        if (index === -1) {
          reject(new Error('Keyword not found'));
          return;
        }
        this.keywords[index] = {
          ...this.keywords[index],
          ...updates,
        };
        resolve(this.keywords[index]);
      }, 300);
    });
  }

  async deleteKeyword(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.keywords.findIndex(kw => kw.id === id);
        if (index !== -1) {
          this.keywords.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }

  async getExperiments(): Promise<Experiment[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.experiments]), 200);
    });
  }

  async getExperimentById(id: string): Promise<Experiment | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const experiment = this.experiments.find(e => e.id === id);
        resolve(experiment || null);
      }, 200);
    });
  }

  async getChangeHistory(entityId?: string): Promise<ChangeHistoryEntry[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (entityId) {
          const filtered = this.changeHistory.filter(ch => ch.entityId === entityId);
          resolve(filtered);
        } else {
          resolve([...this.changeHistory]);
        }
      }, 200);
    });
  }
}
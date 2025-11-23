// src/domain/repositories/ICampaignRepository.ts

import { Campaign, AdGroup, Ad, Keyword, Experiment, ChangeHistoryEntry } from '../entities/Campaign';

export interface ICampaignRepository {
  getCampaigns(): Promise<Campaign[]>;
  getCampaignById(id: string): Promise<Campaign | null>;
  createCampaign(campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign>;
  updateCampaign(id: string, campaign: Partial<Campaign>): Promise<Campaign>;
  deleteCampaign(id: string): Promise<boolean>;
  
  getAdGroups(campaignId: string): Promise<AdGroup[]>;
  getAdGroupById(id: string): Promise<AdGroup | null>;
  createAdGroup(adGroup: Omit<AdGroup, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdGroup>;
  updateAdGroup(id: string, adGroup: Partial<AdGroup>): Promise<AdGroup>;
  deleteAdGroup(id: string): Promise<boolean>;
  
  getAds(adGroupId: string): Promise<Ad[]>;
  getAdById(id: string): Promise<Ad | null>;
  createAd(ad: Omit<Ad, 'id' | 'createdAt'>): Promise<Ad>;
  updateAd(id: string, ad: Partial<Ad>): Promise<Ad>;
  deleteAd(id: string): Promise<boolean>;
  
  getKeywords(adGroupId: string): Promise<Keyword[]>;
  getKeywordById(id: string): Promise<Keyword | null>;
  createKeyword(keyword: Omit<Keyword, 'id' | 'createdAt'>): Promise<Keyword>;
  updateKeyword(id: string, keyword: Partial<Keyword>): Promise<Keyword>;
  deleteKeyword(id: string): Promise<boolean>;
  
  getExperiments(): Promise<Experiment[]>;
  getExperimentById(id: string): Promise<Experiment | null>;
  
  getChangeHistory(entityId?: string): Promise<ChangeHistoryEntry[]>;
}



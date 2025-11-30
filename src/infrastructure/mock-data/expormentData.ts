
export interface Experiment {
  id: number;
  name: string;
  type: string;
  status: 'Running' | 'Creating' | 'Setup';
  split: string;
  splitType?: string;
  baseCampaign: string;
  treatmentCampaign?: string;
  syncStatus?: string;
  startDate: string;
  endDate: string;
}

export interface AdVariation {
  id: number;
  variation: string;
  status: string;
  adTextChanges: string;
  actions: string;
  affectedAds: number;
  clicks: number;
  impressions: number;
}

export interface PerformanceMaxExperiment {
  id: number;
  name: string;
  type: 'Performance Max';
  status: string;
  split: string;
  baseCampaign: string;
  treatmentCampaign: string;
  startDate: string;
  endDate: string;
}

export const allExperimentsData: Experiment[] = [
  {
    id: 1,
    name: 'Headline Test - Spring Campaign',
    type: 'Custom',
    status: 'Running',
    split: '50/50',
    splitType: 'Cookie-based',
    baseCampaign: 'Spring Sale 2024',
    treatmentCampaign: 'Spring Sale 2024 - Test',
    syncStatus: 'Synced',
    startDate: '2024-11-01',
    endDate: '2024-12-01',
  },
  {
    id: 2,
    name: 'Bid Strategy Optimization',
    type: 'Custom',
    status: 'Creating',
    split: '50/50',
    splitType: 'Search-based',
    baseCampaign: 'Holiday Campaign',
    treatmentCampaign: 'Holiday Campaign - Test',
    syncStatus: 'Pending',
    startDate: '2024-11-15',
    endDate: '2024-12-15',
  },
  {
    id: 3,
    name: 'Landing Page A/B Test',
    type: 'Custom',
    status: 'Setup',
    split: '60/40',
    splitType: 'Cookie-based',
    baseCampaign: 'Product Launch',
    treatmentCampaign: 'Product Launch - Variant B',
    syncStatus: 'Synced',
    startDate: '2024-11-20',
    endDate: '2024-12-20',
  },
];

export const customExperimentsData: Experiment[] = [allExperimentsData[0]];

export const adVariationsData: AdVariation[] = [
  {
    id: 1,
    variation: 'Headline Variation A',
    status: 'Active',
    adTextChanges: 'Updated headline copy',
    actions: 'Edit',
    affectedAds: 15,
    clicks: 1234,
    impressions: 45678,
  },
];

export const performanceMaxData: PerformanceMaxExperiment[] = [  
  {
    id: 1,
    name: 'PMax Test - Q4 Campaign',
    type: 'Performance Max',
    status: 'Running',
    split: '50/50',
    baseCampaign: 'PMax Q4 2024',
    treatmentCampaign: 'PMax Q4 2024 - Test',
    startDate: '2024-11-01',
    endDate: '2024-12-31',
  },
];

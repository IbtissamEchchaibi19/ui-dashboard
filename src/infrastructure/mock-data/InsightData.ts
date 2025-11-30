// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
export interface Campaign {
  id: string;
  name: string;
  status: string;
}

export interface BudgetInsight {
  id: string;
  campaign: string;
  budget: string;
  insights: string;
  takeAction: string;
  costToDate: string;
  monthlyCostForecast: string;
  monthlySpendingLimit: string;
  monthlyConvForecast: string;
}

export interface CampaignInsight {
  id: string;
  campaign: string;
  status: string;
  topPerformanceInsights: string;
  cost: string;
}

export interface SearchCategory {
  id: string;
  searchCategory: string;
  clicks: string;
  searchVolume: string;
  isExpanded?: boolean;
}

export const campaigns: Campaign[] = [
  { id: '1', name: 'Search 9th Oct', status: 'Eligible' }
];

export const budgetInsights: BudgetInsight[] = [ 
  {
    id: '1',
    campaign: 'Search 9th Oct',
    budget: '₹10.00/day',
    insights: 'On track',
    takeAction: 'No action needed',
    costToDate: '₹1,695.56',
    monthlyCostForecast: '₹1,642.11',
    monthlySpendingLimit: '₹1,642.11',
    monthlyConvForecast: ''
  }
];

export const campaignInsights: CampaignInsight[] = [
  {
    id: '1',
    campaign: 'Search 9th Oct',
    status: 'Eligible',
    topPerformanceInsights: 'Advertisers participating in your auction changed +3 more',
    cost: '₹70.01 (-52%)'
  }
];

export const searchCategories: SearchCategory[] = [
  {
    id: '1',
    searchCategory: 'data science course in chandigarh',
    clicks: '3 (+200%)',
    searchVolume: '100-1K (+0%)',
    isExpanded: false
  },
  {
    id: '2',
    searchCategory: 'ai course in chandigarh with fees',
    clicks: '1 (-67%)',
    searchVolume: '100-1K (-21%)',
    isExpanded: false
  },
  {
    id: '3',
    searchCategory: 'ai training center near me',
    clicks: '1 (+∞)',
    searchVolume: '100-1K (-4%)',
    isExpanded: false
  },
  {
    id: '4',
    searchCategory: 'ai and ml course near me',
    clicks: '0 (+0%)',
    searchVolume: '10K-100K (+5%)',
    isExpanded: false
  },
  {
    id: '5',
    searchCategory: 'ai institute chandigarh',
    clicks: '0 (+0%)',
    searchVolume: '1K-10K (-4%)',
    isExpanded: false
  }
];


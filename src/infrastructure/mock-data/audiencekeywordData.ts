

export interface AudienceSegment {
  id: string;
  audienceSegment: string;
  campaign: string;
  adGroup: string;
  status: 'Eligible' | 'Paused' | 'Removed';
  level: 'Campaign' | 'Ad group';
  bidAdj?: string;
  impressions?: number;
}

export interface DemographicData {
  category: string;
  clicks: number;
}

export interface ExcludedSegment {
  id: string;
  excludedSegment: string;
  type: string;
  excludedFrom: string;
  level: 'Campaign' | 'Ad group';
}

export const audienceSegmentsData: AudienceSegment[] = [
  {
    id: '1',
    audienceSegment: 'Education > Technology & Computing',
    campaign: 'Search 9th Oct',
    adGroup: '—',
    status: 'Eligible',
    level: 'Campaign',
    bidAdj: '—',
    impressions: 0
  },
  {
    id: '2',
    audienceSegment: 'Education',
    campaign: 'Search 9th Oct',
    adGroup: '—',
    status: 'Eligible',
    level: 'Campaign',
    bidAdj: '—',
    impressions: 0
  }
];

export const ageData: DemographicData[] = [
  { category: '18 - 24', clicks: 40 },
  { category: '25 - 34', clicks: 55 },
  { category: '35 - 44', clicks: 35 },
  { category: '45 - 54', clicks: 8 },
  { category: '55 - 64', clicks: 2 },
  { category: '65+', clicks: 1 },
  { category: 'Unknown', clicks: 130 }
];

export const genderData: DemographicData[] = [
  { category: 'Male', clicks: 180 },
  { category: 'Female', clicks: 60 },
  { category: 'Unknown', clicks: 30 }
];

export const householdIncomeData: DemographicData[] = [
  { category: 'Top 10%', clicks: 35 },
  { category: '11-20%', clicks: 28 },
  { category: '21-30%', clicks: 22 },
  { category: '31-40%', clicks: 18 },
  { category: '41-50%', clicks: 15 },
  { category: 'Lower 50%', clicks: 12 },
  { category: 'Unknown', clicks: 140 }
];

export const exclusionsData: ExcludedSegment[] = [];
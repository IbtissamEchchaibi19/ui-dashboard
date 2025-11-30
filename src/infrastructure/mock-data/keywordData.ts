
interface Keyword {
  id: string;
  keyword: string;
  matchType: 'Exact match' | 'Broad match' | 'Phrase match';
  campaign: string;
  adGroup: string;
  status: 'Eligible' | 'Paused' | 'Removed';
  finalUrl: string;
  impressions?: number;
  clicks?: number;
  cost?: number;
  conversions?: number;
}

interface NegativeKeyword {
  id: string;
  negativeKeyword: string;
  addedTo: string;
  level: 'Campaign' | 'Ad group';
  matchType: 'Exact match' | 'Broad match' | 'Phrase match';
}

interface URLInclusion {
  id: string;
  urlInclusion: string;
  campaign: string;
  adGroup: string;
  status: string;
  campaignType: string;
  impressions?: number;
  interactions?: number;
}

export const keywordsData: Keyword[] = [
  {
    id: '1',
    keyword: 'ai and machine learning',
    matchType: 'Exact match',
    campaign: 'Search 9th Oct - AI Courses in Chandigarh | Learn Artificial Intelligence',
    adGroup: 'Ad group',
    status: 'Eligible',
    finalUrl: 'https://example.com/ai-courses',
    impressions: 203,
    clicks: 0,
    cost: 0,
    conversions: 0
  },
  {
    id: '2',
    keyword: '[ai course in chandigarh]',
    matchType: 'Exact match',
    campaign: 'Search 9th Oct - AI Courses in Chandigarh | Learn Artificial Intelligence',
    adGroup: 'Ad group',
    status: 'Eligible',
    finalUrl: 'https://example.com/ai-courses',
    impressions: 62,
    clicks: 0,
    cost: 0,
    conversions: 0
  },
  {
    id: '3',
    keyword: '[ai training in chandigarh]',
    matchType: 'Exact match',
    campaign: 'Search 9th Oct - AI Courses in Chandigarh | Learn Artificial Intelligence',
    adGroup: 'Ad group',
    status: 'Eligible',
    finalUrl: 'https://example.com/ai-courses',
    impressions: 0,
    clicks: 0,
    cost: 0,
    conversions: 0
  }
];

export const negativeKeywordsData: NegativeKeyword[] = [ 
  {
    id: '1',
    negativeKeyword: '[a day goa ai intensive course with google]',
    addedTo: 'Search 9th Oct - AI Courses in Chandigarh | Learn Artificial Intelligence',
    level: 'Ad group',
    matchType: 'Exact match'
  },
  {
    id: '2',
    negativeKeyword: '[ai tutorial]',
    addedTo: 'Search 9th Oct',
    level: 'Campaign',
    matchType: 'Broad match'
  },
  {
    id: '3',
    negativeKeyword: 'arduino',
    addedTo: 'Search 9th Oct',
    level: 'Campaign',
    matchType: 'Broad match'
  },
  {
    id: '4',
    negativeKeyword: 'class 10/12',
    addedTo: 'Search 9th Oct',
    level: 'Campaign',
    matchType: 'Broad match'
  },
  {
    id: '5',
    negativeKeyword: '[computer class in]',
    addedTo: 'Search 9th Oct - AI Courses in Chandigarh | Learn Artificial Intelligence',
    level: 'Ad group',
    matchType: 'Exact match'
  },
  {
    id: '6',
    negativeKeyword: 'coursera',
    addedTo: 'Search 9th Oct',
    level: 'Campaign',
    matchType: 'Broad match'
  },
  {
    id: '7',
    negativeKeyword: 'crack',
    addedTo: 'Search 9th Oct',
    level: 'Campaign',
    matchType: 'Broad match'
  },
  {
    id: '8',
    negativeKeyword: 'definition',
    addedTo: 'Search 9th Oct',
    level: 'Campaign',
    matchType: 'Broad match'
  }
];

export const urlInclusionsData: URLInclusion[] = [];
export const chartsDataPoints = [
  { x: 50, y: 100 }, { x: 100, y: 60 }, { x: 150, y: 50 }, { x: 200, y: 90 },
  { x: 250, y: 100 }, { x: 300, y: 110 }, { x: 350, y: 120 }, { x: 400, y: 130 },
  { x: 450, y: 115 }, { x: 500, y: 105 }, { x: 550, y: 130 }, { x: 600, y: 140 },
  { x: 650, y: 150 }, { x: 700, y: 160 }, { x: 750, y: 165 }, { x: 800, y: 168 },
  { x: 850, y: 170 }, { x: 900, y: 168 }, { x: 950, y: 165 }, { x: 1000, y: 168 },
  { x: 1050, y: 170 }, { x: 1100, y: 168 }, { x: 1150, y: 170 }, { x: 1200, y: 168 },
  { x: 1250, y: 170 }, { x: 1300, y: 168 }, { x: 1350, y: 170 }
];


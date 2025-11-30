
export interface DeviceData {
  id: string;
  device: string;
  level: string;
  addedTo: string;
  bidAdj: string;
  adGroupBidAdj: string;
  impressions: number;
  interactions: number;
  interactionRate: string;
  avgCost: string;
  cost: string;
  convRate: string;
  conversions: string;
  costPerConv: string;
}

export interface WhenAdsShowedData {
  id: string;
  day: string;
  hour: string;
  campaign: string;
  impressions: number;
  interactions: number;
  interactionRate: string;
  avgCost: string;
  cost: string;
  convRate: string;
  conversions: string;
  costPerConv: string;
}

export interface MatchedLocationData {
  id: string;
  matchedLocation: string;
  clicks: number;
  impressions: number;
  ctr: string;
  avgCpc: string;
  cost: string;
  convRate: string;
  conversions: string;
  costPerConv: string;
}

export const devicesData: DeviceData[] = [
  {
    id: '1',
    device: 'Mobile phones',
    level: 'Campaign',
    addedTo: 'Search 9th Oct',
    bidAdj: '—',
    adGroupBidAdj: 'None',
    impressions: 1810,
    interactions: 233,
    interactionRate: '12.87%',
    avgCost: '₹7.18',
    cost: '₹1,672.12',
    convRate: '6.44%',
    conversions: '15.00',
    costPerConv: '₹111.48'
  },
  {
    id: '2',
    device: 'Computers',
    level: 'Campaign',
    addedTo: 'Search 9th Oct',
    bidAdj: '—',
    adGroupBidAdj: 'None',
    impressions: 167,
    interactions: 4,
    interactionRate: '2.40%',
    avgCost: '₹4.59',
    cost: '₹18.36',
    convRate: '0.00%',
    conversions: '0.00',
    costPerConv: '₹0.00'
  },
  {
    id: '3',
    device: 'Tablets',
    level: 'Campaign',
    addedTo: 'Search 9th Oct',
    bidAdj: '—',
    adGroupBidAdj: 'None',
    impressions: 17,
    interactions: 2,
    interactionRate: '11.76%',
    avgCost: '₹2.54',
    cost: '₹5.08',
    convRate: '0.00%',
    conversions: '0.00',
    costPerConv: '₹0.00'
  },
  {
    id: '4',
    device: 'Computers',
    level: 'Campaign',
    addedTo: 'Campaign #1',
    bidAdj: '',
    adGroupBidAdj: 'None',
    impressions: 0,
    interactions: 0,
    interactionRate: '—',
    avgCost: '—',
    cost: '₹0.00',
    convRate: '0.00%',
    conversions: '0.00',
    costPerConv: '₹0.00'
  },
  {
    id: '5',
    device: 'Mobile phones',
    level: 'Campaign',
    addedTo: 'Campaign #1',
    bidAdj: '',
    adGroupBidAdj: 'None',
    impressions: 0,
    interactions: 0,
    interactionRate: '—',
    avgCost: '—',
    cost: '₹0.00',
    convRate: '0.00%',
    conversions: '0.00',
    costPerConv: '₹0.00'
  }
];

export const whenAdsShowedData: WhenAdsShowedData[] = [
  {
    id: '1',
    day: 'Sunday',
    hour: '12 AM – 1 AM',
    campaign: 'Search 9th Oct',
    impressions: 224,
    interactions: 13,
    interactionRate: '5.80%',
    avgCost: '₹7.78',
    cost: '₹101.14',
    convRate: '15.38%',
    conversions: '2.00',
    costPerConv: '₹50.57'
  },
  {
    id: '2',
    day: 'Monday',
    hour: '12 AM – 1 AM',
    campaign: 'Search 9th Oct',
    impressions: 111,
    interactions: 13,
    interactionRate: '11.71%',
    avgCost: '₹6.77',
    cost: '₹88.07',
    convRate: '7.69%',
    conversions: '1.00',
    costPerConv: '₹88.07'
  },
  {
    id: '3',
    day: 'Sunday',
    hour: '1 AM – 2 AM',
    campaign: 'Search 9th Oct',
    impressions: 72,
    interactions: 10,
    interactionRate: '13.89%',
    avgCost: '₹4.28',
    cost: '₹42.82',
    convRate: '0.00%',
    conversions: '0.00',
    costPerConv: '₹0.00'
  },
  {
    id: '4',
    day: 'Saturday',
    hour: '12 AM – 1 AM',
    campaign: 'Search 9th Oct',
    impressions: 52,
    interactions: 9,
    interactionRate: '17.31%',
    avgCost: '₹11.91',
    cost: '₹107.17',
    convRate: '22.22%',
    conversions: '2.00',
    costPerConv: '₹53.59'
  },
  {
    id: '5',
    day: 'Saturday',
    hour: '6 AM – 7 AM',
    campaign: 'Search 9th Oct',
    impressions: 11,
    interactions: 8,
    interactionRate: '72.73%',
    avgCost: '₹3.53',
    cost: '₹28.27',
    convRate: '0.00%',
    conversions: '0.00',
    costPerConv: '₹0.00'
  },
  {
    id: '6',
    day: 'Sunday',
    hour: '11 AM – 12 PM',
    campaign: 'Search 9th Oct',
    impressions: 36,
    interactions: 7,
    interactionRate: '19.44%',
    avgCost: '₹3.53',
    cost: '₹24.72',
    convRate: '0.00%',
    conversions: '0.00',
    costPerConv: '₹0.00'
  },
  {
    id: '7',
    day: 'Monday',
    hour: '4 PM – 5 PM',
    campaign: 'Search 9th Oct',
    impressions: 11,
    interactions: 7,
    interactionRate: '63.64%',
    avgCost: '₹3.16',
    cost: '₹22.10',
    convRate: '0.00%',
    conversions: '0.00',
    costPerConv: '₹0.00'
  }
];

export const matchedLocationsData: MatchedLocationData[] = [
  {
    id: '1',
    matchedLocation: 'India',
    clicks: 239,
    impressions: 1994,
    ctr: '11.99%',
    avgCpc: '₹7.09',
    cost: '₹1,695.56',
    convRate: '6.28%',
    conversions: '15.00',
    costPerConv: '₹113.04'
  }
];



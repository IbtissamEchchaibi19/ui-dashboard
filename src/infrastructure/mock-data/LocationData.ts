
export interface Location {
  id: string;
  targetedLocation: string;
  campaign: string;
  impressions: number;
  interactions: number;
  interactionRate: string;
  avgCost: string;
  cost: string;
  convRate: string;
  conversions: number;
  costPerConv: string;
  [key: string]: any;
}

export interface ExcludedLocation {
  id: string;
  excludedLocation: string;
  campaign: string;
}

export interface LocationOfInterest {
  id: string;
  targetedLocationOfInterest: string;
  campaign: string;
  adGroup: string;
  clicks: number;
  impressions: number;
  ctr: string;
  avgCpc: string;
  cost: string;
}


export const locationsData: Location[] = [
  {
    id: '1',
    targetedLocation: 'Punjab, India',
    campaign: 'Search 9th Oct',
    impressions: 778,
    interactions: 105,
    interactionRate: '13.50%',
    avgCost: '₹4.92',
    cost: '₹516.47',
    convRate: '2.86%',
    conversions: 3.00,
    costPerConv: '₹172.16'
  },
  {
    id: '2',
    targetedLocation: 'Haryana, India',
    campaign: 'Search 9th Oct',
    impressions: 719,
    interactions: 76,
    interactionRate: '10.57%',
    avgCost: '₹10.42',
    cost: '₹791.75',
    convRate: '11.84%',
    conversions: 9.00,
    costPerConv: '₹87.97'
  },
  {
    id: '3',
    targetedLocation: 'Chandigarh, Chandigarh, India',
    campaign: 'Search 9th Oct',
    impressions: 270,
    interactions: 35,
    interactionRate: '12.96%',
    avgCost: '₹7.46',
    cost: '₹261.04',
    convRate: '8.57%',
    conversions: 3.00,
    costPerConv: '₹87.01'
  },
  {
    id: '4',
    targetedLocation: 'Himachal Pradesh, India',
    campaign: 'Search 9th Oct',
    impressions: 135,
    interactions: 15,
    interactionRate: '11.11%',
    avgCost: '₹6.81',
    cost: '₹102.16',
    convRate: '0.00%',
    conversions: 0.00,
    costPerConv: '₹0.00'
  }
];

export const excludedLocationsData: ExcludedLocation[] = [];
export const locationsOfInterestData: LocationOfInterest[] = [];


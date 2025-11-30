
export interface LandingPage {  
  id: string;
  landingPage: string;
  selectedBy: string;
  mobileSpeedScore: string;
  mobileFriendlyClickRate: string;
  validAmpClickRate: string;
  clicks: number;
  impressions: number;
  ctr: string;
  avgCpc: string;
  cost: string;
  [key: string]: any; // Add this line
}

export const landingPagesData: LandingPage[] = [
  {
    id: '1',
    landingPage: 'https://aiinfoxtech.com/',
    selectedBy: 'Advertiser selected',
    mobileSpeedScore: '—',
    mobileFriendlyClickRate: '—',
    validAmpClickRate: '—',
    clicks: 137,
    impressions: 1929,
    ctr: '7.10%',
    avgCpc: '₹8.79',
    cost: '₹1,203.77'
  },
  {
    id: '2',
    landingPage: 'https://aiinfoxtech.com/programs/mobile-app-development',
    selectedBy: 'Advertiser selected',
    mobileSpeedScore: '—',
    mobileFriendlyClickRate: '—',
    validAmpClickRate: '—',
    clicks: 44,
    impressions: 369,
    ctr: '11.92%',
    avgCpc: '₹2.40',
    cost: '₹105.47'
  },
  {
    id: '3',
    landingPage: 'https://aiinfoxtech.com/contact',
    selectedBy: 'Advertiser selected',
    mobileSpeedScore: '—',
    mobileFriendlyClickRate: '—',
    validAmpClickRate: '—',
    clicks: 5,
    impressions: 282,
    ctr: '1.77%',
    avgCpc: '₹2.01',
    cost: '₹10.07'
  },
  {
    id: '4',
    landingPage: 'https://aiinfoxtech.com/',
    selectedBy: 'Automatically selected',
    mobileSpeedScore: '—',
    mobileFriendlyClickRate: '—',
    validAmpClickRate: '—',
    clicks: 4,
    impressions: 45,
    ctr: '8.89%',
    avgCpc: '₹2.32',
    cost: '₹9.29'
  },
  {
    id: '5',
    landingPage: 'https://aiinfoxtech.com/programs/generative-ai-training',
    selectedBy: 'Advertiser selected',
    mobileSpeedScore: '—',
    mobileFriendlyClickRate: '—',
    validAmpClickRate: '—',
    clicks: 3,
    impressions: 336,
    ctr: '0.89%',
    avgCpc: '₹3.06',
    cost: '₹9.18'
  }
];
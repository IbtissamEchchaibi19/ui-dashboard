// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
export interface Asset {
  id: string;
  name: string;
  assetType: string;
  level: 'Account' | 'Campaign';
  status: 'Enabled' | 'Paused' | 'Eligible';
  addedBy: string;
  lastUpdated: string;
  impressions: number;
  interactions: number;
  interactionRate: string;
  avgCost: string;
  cost: string;
  imageUrl?: string;
  parentName?: string;
}

export interface AssetTypeFilter {
  id: string;
  label: string;
  icon: string;
}

// ──────────────────────────────────────────────────────────────
// Sample Data
// ──────────────────────────────────────────────────────────────
export const assetsData: Asset[] = [
  {
    id: '07888513249',
    name: '07888513249',
    assetType: 'Call',
    level: 'Account',
    status: 'Eligible',
    addedBy: 'Advertiser',
    lastUpdated: 'Oct 9, 2025, 8:25 AM',
    impressions: 481,
    interactions: 95,
    interactionRate: '19.75%',
    avgCost: '₹4.87',
    cost: '₹462.34'
  },
  {
    id: 'aidfox-logo',
    name: 'AidFox Logo',
    assetType: 'Business logo',
    level: 'Account',
    status: 'Eligible',
    addedBy: 'Advertiser',
    lastUpdated: 'Oct 13, 2025, 6:46 AM',
    impressions: 455,
    interactions: 90,
    interactionRate: '19.78%',
    avgCost: '₹4.03',
    cost: '₹362.91',
    imageUrl: '🦊'
  },
  {
    id: '07888513249-campaign',
    name: '07888513249',
    assetType: 'Call',
    level: 'Campaign',
    status: 'Eligible',
    addedBy: 'Advertiser',
    lastUpdated: 'Oct 9, 2025, 8:51 AM',
    impressions: 0,
    interactions: 0,
    interactionRate: '—',
    avgCost: '—',
    cost: '₹0.00',
    parentName: 'Campaign #1'
  },
  {
    id: '40i-logo',
    name: '40i Logo',
    assetType: 'Logo',
    level: 'Campaign',
    status: 'Eligible',
    addedBy: 'Advertiser',
    lastUpdated: 'Nov 7, 2025, 1:46 PM',
    impressions: 0,
    interactions: 0,
    interactionRate: '—',
    avgCost: '—',
    cost: '₹0.00',
    imageUrl: '🦊',
    parentName: 'Campaign #1'
  }
];

export const assetTypeFilters: AssetTypeFilter[] = [
  { id: 'all', label: 'All', icon: 'e-check' },
  { id: 'image', label: 'Image', icon: 'e-image' },
  { id: 'businessName', label: 'Business name', icon: 'e-home' },
  { id: 'businessLogo', label: 'Business logo', icon: 'e-image' },
  { id: 'sitelink', label: 'Sitelink', icon: 'e-link' },
  { id: 'headline', label: 'Headline', icon: 'e-text' },
  { id: 'description', label: 'Description', icon: 'e-text' },
  { id: 'callout', label: 'Callout', icon: 'e-comment' },
  { id: 'structuredSnippet', label: 'Structured snippet', icon: 'e-list' },
  { id: 'call', label: 'Call', icon: 'e-phone' },
  { id: 'leadForm', label: 'Lead form', icon: 'e-form' },
  { id: 'message', label: 'Message', icon: 'e-message' },
  { id: 'location', label: 'Location', icon: 'e-location' },
  { id: 'price', label: 'Price', icon: 'e-tag' },
  { id: 'app', label: 'App', icon: 'e-mobile' },
  { id: 'promotion', label: 'Promotion', icon: 'e-gift' }
];

export const tabs = [
  { id: 'associations', label: 'Associations' },
  { id: 'performance', label: 'Performance' },
  { id: 'assetCoverage', label: 'Asset coverage' },
  { id: 'expandedUrl', label: 'Expanded final URL assets' }
];
// ──────────────────────────────────────────────────────────────
interface BidAdjustment {
  id: string;
  interactionType: string;
  campaign: string;
  bidAdj: string;
  impressions: number;
  interactionRate: string;
  avgCost: string;
  cost: string;
  interactionCoverage: string;
  convRate: string;
  conversions: number;
  costPerConv: string;
}

// ──────────────────────────────────────────────────────────────
// Sample Data
// ──────────────────────────────────────────────────────────────
export const bidAdjustmentsData: BidAdjustment[] = [
  {
    id: '1',
    interactionType: 'Calls',
    campaign: 'Search 9th Oct',
    bidAdj: '—',
    impressions: 508,
    interactionRate: '8.27%',
    avgCost: '₹8.31',
    cost: '₹349.22',
    interactionCoverage: '77.44%',
    convRate: '0.00%',
    conversions: 0.00,
    costPerConv: '₹0.00'
  }
];

export const summaryData = [
  {
    id: 'total-interactions',
    label: 'Total: Interactions',
    impressions: 508,
    interactionRate: '8.27%',
    avgCost: '₹8.31',
    cost: '₹349.22',
    interactionCoverage: '77.44%',
    convRate: '0.00%',
    conversions: 0.00,
    costPerConv: '₹0.00'
  },
  {
    id: 'total-account',
    label: 'Total: Account',
    impressions: 1994,
    interactionRate: '11.99%',
    avgCost: '₹7.09',
    cost: '₹1,695.56',
    interactionCoverage: '77.44%',
    convRate: '6.28%',
    conversions: 15.00,
    costPerConv: '₹113.04'
  },
  {
    id: 'total-search',
    label: 'Total: Search campaigns',
    impressions: 1994,
    interactionRate: '11.99%',
    avgCost: '₹7.09',
    cost: '₹1,695.56',
    interactionCoverage: '77.44%',
    convRate: '6.28%',
    conversions: 15.00,
    costPerConv: '₹113.04'
  },
  {
    id: 'total-performance',
    label: 'Total: Performance Max campaigns',
    impressions: 0,
    interactionRate: '—',
    avgCost: '—',
    cost: '₹0.00',
    interactionCoverage: '—',
    convRate: '0.00%',
    conversions: 0.00,
    costPerConv: '₹0.00'
  }
];

// Chart data for line graph
export const chartDataPoints = [
  { x: 80, y: 160 }, { x: 160, y: 140 }, { x: 240, y: 145 }, { x: 320, y: 160 },
  { x: 400, y: 180 }, { x: 480, y: 200 }, { x: 560, y: 225 }, { x: 640, y: 215 },
  { x: 720, y: 210 }, { x: 800, y: 180 }, { x: 880, y: 70 }, { x: 960, y: 50 },
  { x: 1040, y: 30 }, { x: 1120, y: 80 }, { x: 1200, y: 100 }, { x: 1280, y: 200 },
  { x: 1360, y: 220 }, { x: 1440, y: 230 }, { x: 1520, y: 225 }, { x: 1600, y: 210 },
  { x: 1680, y: 200 }, { x: 1760, y: 210 }
];
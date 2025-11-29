import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import DataTable, { Column } from '@presentation/components/DataTable';

// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
interface DeviceData {
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
  [key: string]: any;
}

interface WhenAdsShowedData {
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
  [key: string]: any;
}

interface MatchedLocationData {
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
  [key: string]: any;
}

// ──────────────────────────────────────────────────────────────
// Sample Data
// ──────────────────────────────────────────────────────────────
const devicesData: DeviceData[] = [
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
  }
];

const whenAdsShowedData: WhenAdsShowedData[] = [
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
  }
];

const matchedLocationsData: MatchedLocationData[] = [
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

// ──────────────────────────────────────────────────────────────
// Column Definitions
// ──────────────────────────────────────────────────────────────
const devicesColumns: Column[] = [
  {
    key: 'device',
    label: 'Device',
    align: 'left',
    sticky: true,
    sortable: true,
    category: 'Device Info'
  },
  {
    key: 'level',
    label: 'Level',
    align: 'left',
    category: 'Device Info'
  },
  {
    key: 'addedTo',
    label: 'Added to',
    align: 'left',
    category: 'Device Info',
    render: (value) => <a href="#" className="text-blue-600 hover:underline">{value}</a>
  },
  {
    key: 'bidAdj',
    label: 'Bid adj.',
    align: 'left',
    category: 'Device Info'
  },
  {
    key: 'adGroupBidAdj',
    label: 'Ad group bid adj.',
    align: 'left',
    category: 'Device Info'
  },
  {
    key: 'impressions',
    label: 'Impr.',
    align: 'right',
    sortable: true,
    category: 'Performance'
  },
  {
    key: 'interactions',
    label: 'Interacti.',
    align: 'right',
    sortable: true,
    category: 'Performance',
    render: (value) => value > 0 ? (
      <div>
        {value}
        <div className="text-xs text-gray-500">clicks</div>
      </div>
    ) : value
  },
  {
    key: 'interactionRate',
    label: 'Interaction rate',
    align: 'right',
    sortable: true,
    category: 'Performance'
  },
  {
    key: 'avgCost',
    label: 'Avg. cost',
    align: 'right',
    sortable: true,
    category: 'Performance'
  },
  {
    key: 'cost',
    label: 'Cost',
    align: 'right',
    sortable: true,
    category: 'Performance'
  },
  {
    key: 'convRate',
    label: 'Conv. rate',
    align: 'right',
    category: 'Conversions'
  },
  {
    key: 'conversions',
    label: 'Conversions',
    align: 'right',
    category: 'Conversions'
  },
  {
    key: 'costPerConv',
    label: 'Cost / conv.',
    align: 'right',
    category: 'Conversions'
  }
];

const whenColumns: Column[] = [
  {
    key: 'day',
    label: 'Day',
    align: 'left',
    sticky: true,
    sortable: true,
    category: 'Time Info'
  },
  {
    key: 'hour',
    label: 'Hour',
    align: 'left',
    category: 'Time Info'
  },
  {
    key: 'campaign',
    label: 'Campaign',
    align: 'left',
    category: 'Time Info',
    render: (value) => <a href="#" className="text-blue-600 hover:underline">{value}</a>
  },
  {
    key: 'impressions',
    label: 'Impr.',
    align: 'right',
    sortable: true,
    category: 'Performance'
  },
  {
    key: 'interactions',
    label: 'Interaction',
    align: 'right',
    sortable: true,
    category: 'Performance',
    render: (value) => (
      <div>
        {value}
        <div className="text-xs text-gray-500">clicks</div>
      </div>
    )
  },
  {
    key: 'interactionRate',
    label: 'Interaction rate',
    align: 'right',
    sortable: true,
    category: 'Performance'
  },
  {
    key: 'avgCost',
    label: 'Avg. cost',
    align: 'right',
    sortable: true,
    category: 'Performance'
  },
  {
    key: 'cost',
    label: 'Cost',
    align: 'right',
    sortable: true,
    category: 'Performance'
  },
  {
    key: 'convRate',
    label: 'Conv. rate',
    align: 'right',
    category: 'Conversions'
  },
  {
    key: 'conversions',
    label: 'Conversions',
    align: 'right',
    category: 'Conversions'
  },
  {
    key: 'costPerConv',
    label: 'Cost / conv.',
    align: 'right',
    category: 'Conversions'
  }
];

const matchedColumns: Column[] = [
  {
    key: 'matchedLocation',
    label: 'Matched location',
    align: 'left',
    sticky: true,
    sortable: true,
    category: 'Location',
    render: (value) => <a href="#" className="text-blue-600 hover:underline">{value}</a>
  },
  {
    key: 'clicks',
    label: 'Clicks',
    align: 'right',
    sortable: true,
    category: 'Performance'
  },
  {
    key: 'impressions',
    label: 'Impr.',
    align: 'right',
    sortable: true,
    category: 'Performance'
  },
  {
    key: 'ctr',
    label: 'CTR',
    align: 'right',
    sortable: true,
    category: 'Performance'
  },
  {
    key: 'avgCpc',
    label: 'Avg. CPC',
    align: 'right',
    sortable: true,
    category: 'Performance'
  },
  {
    key: 'cost',
    label: 'Cost',
    align: 'right',
    sortable: true,
    category: 'Performance'
  },
  {
    key: 'convRate',
    label: 'Conv. rate',
    align: 'right',
    category: 'Conversions'
  },
  {
    key: 'conversions',
    label: 'Conversions',
    align: 'right',
    category: 'Conversions'
  },
  {
    key: 'costPerConv',
    label: 'Cost / conv.',
    align: 'right',
    category: 'Conversions'
  }
];

// ──────────────────────────────────────────────────────────────
// Calculate Totals Functions
// ──────────────────────────────────────────────────────────────
const calculateDeviceTotals = (data: DeviceData[], column: Column) => {
  switch (column.key) {
    case 'impressions':
      return data.reduce((sum, row) => sum + row.impressions, 0).toLocaleString();
    case 'interactions':
      const total = data.reduce((sum, row) => sum + row.interactions, 0);
      return (
        <div>
          {total}
          <div className="text-xs text-gray-500">clicks</div>
        </div>
      );
    case 'interactionRate':
      const totalImp = data.reduce((sum, row) => sum + row.impressions, 0);
      const totalInt = data.reduce((sum, row) => sum + row.interactions, 0);
      return totalImp > 0 ? `${((totalInt / totalImp) * 100).toFixed(2)}%` : '0.00%';
    case 'avgCost':
      const totalCost = data.reduce((sum, row) => sum + parseFloat(row.cost.replace(/[₹,]/g, '')), 0);
      const totalInter = data.reduce((sum, row) => sum + row.interactions, 0);
      return totalInter > 0 ? `₹${(totalCost / totalInter).toFixed(2)}` : '₹0.00';
    case 'cost':
      const cost = data.reduce((sum, row) => sum + parseFloat(row.cost.replace(/[₹,]/g, '')), 0);
      return `₹${cost.toFixed(2)}`;
    case 'convRate':
    case 'conversions':
    case 'costPerConv':
      return data.reduce((sum, row) => {
        const val = parseFloat(row[column.key].toString().replace(/[₹,%]/g, ''));
        return sum + (isNaN(val) ? 0 : val);
      }, 0).toFixed(2) + (column.key === 'convRate' ? '%' : column.key === 'costPerConv' ? '' : '');
    default:
      return '';
  }
};

const calculateWhenTotals = (data: WhenAdsShowedData[], column: Column) => {
  switch (column.key) {
    case 'day':
      return 'Total: Day...';
    case 'impressions':
      return data.reduce((sum, row) => sum + row.impressions, 0).toLocaleString();
    case 'interactions':
      const total = data.reduce((sum, row) => sum + row.interactions, 0);
      return (
        <div>
          {total}
          <div className="text-xs text-gray-500">clicks</div>
        </div>
      );
    case 'interactionRate':
    case 'avgCost':
    case 'cost':
    case 'convRate':
    case 'conversions':
    case 'costPerConv':
      return calculateDeviceTotals(data as any, column);
    default:
      return '';
  }
};

const calculateMatchedTotals = (data: MatchedLocationData[], column: Column) => {
  switch (column.key) {
    case 'matchedLocation':
      return 'Total: Locations';
    case 'clicks':
    case 'impressions':
      return data.reduce((sum, row) => sum + row[column.key], 0).toLocaleString();
    case 'ctr':
      const totalClicks = data.reduce((sum, row) => sum + row.clicks, 0);
      const totalImp = data.reduce((sum, row) => sum + row.impressions, 0);
      return totalImp > 0 ? `${((totalClicks / totalImp) * 100).toFixed(2)}%` : '0.00%';
    case 'avgCpc':
    case 'cost':
    case 'convRate':
    case 'conversions':
    case 'costPerConv':
      return calculateDeviceTotals(data as any, column);
    default:
      return '';
  }
};

// Chart data
const chartDataPoints = [
  { x: 100, y: 180 }, { x: 200, y: 150 }, { x: 300, y: 250 }, { x: 400, y: 305 },
  { x: 500, y: 280 }, { x: 600, y: 290 }, { x: 700, y: 305 }, { x: 800, y: 315 },
  { x: 900, y: 345 }, { x: 1000, y: 365 }, { x: 1100, y: 360 }, { x: 1200, y: 362 }
];

// ──────────────────────────────────────────────────────────────
// Main Component

// ──────────────────────────────────────────────────────────────
export const  WhenWhereAdsShowedPage : React.FC = () =>{
  const [selectedTab, setSelectedTab] = useState<'devices' | 'when' | 'where' | 'matched'>('devices');
  const [selectedMetric, setSelectedMetric] = useState('clicks');
  const [selectedComparison, setSelectedComparison] = useState('none');

  const tabs = [
    { id: 'devices' as const, label: 'Devices' },
    { id: 'when' as const, label: 'When ads showed' },
    { id: 'where' as const, label: 'Where ads showed' },
    { id: 'matched' as const, label: 'Matched locations' }
  ];

  // Get current data and columns based on selected tab
  const getCurrentConfig = () => {
    switch (selectedTab) {
      case 'devices':
        return { 
          data: devicesData, 
          columns: devicesColumns, 
          calculateTotal: calculateDeviceTotals,
          totalLabel: 'Total'
        };
      case 'when':
        return { 
          data: whenAdsShowedData, 
          columns: whenColumns, 
          calculateTotal: calculateWhenTotals,
          totalLabel: 'Total: Day...'
        };
      case 'matched':
        return { 
          data: matchedLocationsData, 
          columns: matchedColumns, 
          calculateTotal: calculateMatchedTotals,
          totalLabel: 'Total: Locations'
        };
      default:
        return { 
          data: devicesData, 
          columns: devicesColumns, 
          calculateTotal: calculateDeviceTotals,
          totalLabel: 'Total'
        };
    }
  };

  const config = getCurrentConfig();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-normal text-gray-900">When and where ads showed</h1>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded text-sm">
                <span className="text-gray-600">View (2 filters)</span>
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="text-gray-900 font-medium">All campaigns</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">This month</span>
              <select className="px-3 py-2 border border-gray-300 rounded text-sm bg-white">
                <option>Nov 1 – 28, 2025</option>
              </select>
              <button className="text-blue-600 text-sm font-medium hover:underline">
                Show last 30 days
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white px-6 pt-6">
        {/* Chart Controls */}
        <div className="flex items-center justify-end gap-3 mb-4">
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 cursor-pointer"
          >
            <option value="clicks">▬ Clicks</option>
            <option value="impressions">▬ Impressions</option>
            <option value="cost">▬ Cost</option>
            <option value="interactionRate">▬ Interaction rate</option>
          </select>
          
          <select 
            value={selectedComparison}
            onChange={(e) => setSelectedComparison(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 cursor-pointer"
          >
            <option value="none">▬ None</option>
            <option value="previous">Compare to: Previous period</option>
            <option value="lastYear">Compare to: Last year</option>
          </select>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
      
            Chart type
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
            <Maximize2 className="w-4 h-4" />
            Expand
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
        
            Adjust
          </button>
        </div>

        {/* Chart */}
        <div className="pb-6">
          <div className="h-64 bg-white relative border-l border-b border-gray-200">
            <svg className="w-full h-full" viewBox="0 0 1400 256" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="51" x2="1400" y2="51" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="128" x2="1400" y2="128" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="205" x2="1400" y2="205" stroke="#e5e7eb" strokeWidth="1" />
              
              {/* Weekend shading */}
              <rect x="200" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.6" />
              <rect x="550" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.6" />
              <rect x="900" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.6" />
              <rect x="1250" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.6" />
              
              {/* Line graph - matching Google Ads curve */}
              <path
                d="M 0,210 L 50,200 L 100,180 L 150,160 L 200,140 L 250,105 L 300,85 L 350,230 L 400,235 L 450,238 L 500,237 L 550,236 L 600,237 L 650,235 L 700,234 L 750,236 L 800,235 L 850,237 L 900,236 L 950,233 L 1000,235 L 1050,232 L 1100,230 L 1150,232 L 1200,228 L 1250,230 L 1300,232 L 1350,230 L 1400,232"
                fill="none"
                stroke="#1a73e8"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            
            {/* Y-axis labels */}
            <div className="absolute -left-8 top-8 text-xs text-gray-600">40</div>
            <div className="absolute -left-8 top-[120px] text-xs text-gray-600">20</div>
            <div className="absolute -left-6 bottom-2 text-xs text-gray-600">0</div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-600 pl-2">
            <span>Nov 1, 2025</span>
            <span className="pr-4">Nov 29, 2025</span>
          </div>
        </div>
      </div>

      {/* Data Table - Using Reusable Component */}
      {selectedTab !== 'where' ? (
        <div className="px-6 py-6">
          <DataTable
            data={config.data}
            columns={config.columns}
            title={`When and where ads showed - ${selectedTab}`}
            enableSearch={true}
            enableFilters={true}
            enableColumns={true}
            enableSegment={selectedTab === 'matched'}
            enableDownload={true}
            enableExpand={true}
            enableRowSelection={true}
            searchPlaceholder={`Search ${selectedTab}...`}
            filterOptions={
              selectedTab === 'devices'
                ? ['Device type', 'Campaign', 'Bid adjustment']
                : selectedTab === 'when'
                ? ['Day', 'Hour', 'Campaign']
                : ['Location', 'Campaign']
            }
            segmentOptions={['Time', 'Device', 'Network']}
            rowKey="id"
            showTotal={true}
            totalLabel={config.totalLabel}
            calculateTotal={config.calculateTotal}
            emptyMessage={`No ${selectedTab} data available`}
            stickyHeader={true}
          />
        </div>
      ) : (
        <div className="px-6 py-6">
          <div className="bg-white border border-gray-200 rounded p-12 text-center text-gray-500">
            <p>Where ads showed data will be displayed here</p>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-blue-50 border-t border-blue-100 px-6 py-3 mt-6">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-900">
            <span className="font-medium">Optimize device performance:</span> Review which devices are 
            driving the most conversions and adjust your bids accordingly. Learn more about{' '}
            <a href="#" className="underline hover:text-blue-700">device targeting and bid adjustments</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
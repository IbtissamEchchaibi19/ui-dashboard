import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Download, Maximize2 } from 'lucide-react';

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

// Chart data
const chartDataPoints = [
  { x: 100, y: 180 }, { x: 200, y: 150 }, { x: 300, y: 250 }, { x: 400, y: 305 },
  { x: 500, y: 280 }, { x: 600, y: 290 }, { x: 700, y: 305 }, { x: 800, y: 315 },
  { x: 900, y: 345 }, { x: 1000, y: 365 }, { x: 1100, y: 360 }, { x: 1200, y: 362 },
  { x: 1300, y: 365 }, { x: 1400, y: 362 }, { x: 1500, y: 360 }, { x: 1600, y: 362 },
  { x: 1700, y: 365 }
];

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────
export const WhenWhereAdsShowedPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'devices' | 'when' | 'where' | 'matched'>('devices');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedMetric, setSelectedMetric] = useState('clicks');
  const [selectedComparison, setSelectedComparison] = useState('none');
  const [levelFilter, setLevelFilter] = useState('campaign');

  const tabs = [
    { id: 'devices' as const, label: 'Devices' },
    { id: 'when' as const, label: 'When ads showed' },
    { id: 'where' as const, label: 'Where ads showed' },
    { id: 'matched' as const, label: 'Matched locations' }
  ];

  // Get current data based on selected tab
  const getCurrentData = () => {
    switch (selectedTab) {
      case 'devices':
        return devicesData;
      case 'when':
        return whenAdsShowedData;
      case 'matched':
        return matchedLocationsData;
      default:
        return devicesData;
    }
  };

  const currentData = getCurrentData();

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === currentData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(currentData.map((r: any) => r.id)));
    }
  };

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
              
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
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
              onClick={() => {
                setSelectedTab(tab.id);
                setSelectedRows(new Set());
              }}
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
      <div className="bg-white mx-6 mt-6 rounded border border-gray-200">
        {/* Chart Controls */}
        <div className="px-6 py-4 flex items-center justify-end gap-4">
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm bg-white"
          >
            <option value="clicks">▬ Clicks</option>
            <option value="impressions">▬ Impressions</option>
            <option value="cost">▬ Cost</option>
          </select>
          
          <select 
            value={selectedComparison}
            onChange={(e) => setSelectedComparison(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm bg-white"
          >
            <option value="none">▬ None</option>
            <option value="previous">Compare periods</option>
          </select>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" />
            </svg>
            Chart type
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
            <Maximize2 className="w-4 h-4" />
            Expand
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" />
            </svg>
            Adjust
          </button>
        </div>

        {/* Chart */}
        <div className="px-6 pb-6">
          <div className="h-64 bg-white relative">
            <svg className="w-full h-full" viewBox="0 0 1800 256" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="64" x2="1800" y2="64" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="128" x2="1800" y2="128" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="192" x2="1800" y2="192" stroke="#e5e7eb" strokeWidth="1" />
              
              {/* Weekend shading */}
              <rect x="300" y="0" width="120" height="256" fill="#f3f4f6" opacity="0.5" />
              <rect x="720" y="0" width="120" height="256" fill="#f3f4f6" opacity="0.5" />
              <rect x="1140" y="0" width="120" height="256" fill="#f3f4f6" opacity="0.5" />
              <rect x="1560" y="0" width="120" height="256" fill="#f3f4f6" opacity="0.5" />
              
              {/* Line graph */}
              <polyline
                points={chartDataPoints.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              
              {/* Data points */}
              {chartDataPoints.map((point, idx) => (
                <circle key={idx} cx={point.x} cy={point.y} r="3" fill="#2563eb" />
              ))}
            </svg>
            
            {/* Y-axis labels */}
            <div className="absolute left-2 top-2 text-xs text-gray-600">50</div>
            <div className="absolute left-2 top-1/3 text-xs text-gray-600">25</div>
            <div className="absolute left-2 bottom-2 text-xs text-gray-600">0</div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-600 px-4">
            <span>Nov 1, 2025</span>
            <span>Nov 28, 2025</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 mx-6 mt-6 border-t border-x">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedTab === 'devices' && (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-blue-900 font-medium">1</span>
                </div>
                
                <button className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50">
                  Level: Campaign
                </button>
              </>
            )}
            
            {selectedTab === 'when' && (
              <button className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-2">
                Day & hour
                <ChevronDown className="w-4 h-4" />
              </button>
            )}

            {selectedTab === 'matched' && (
              <button className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-2">
                Account view
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <Filter className="w-4 h-4" />
              Add filter
            </button>
          </div>

          <div className="flex items-center gap-4">
            {selectedTab === 'matched' && (
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Segment
              </button>
            )}

            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              Columns
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <Download className="w-4 h-4" />
              Download
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <Maximize2 className="w-4 h-4" />
              Expand
            </button>
            
            {selectedTab !== 'matched' && (
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <ChevronUp className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="px-6 pb-4 bg-gray-50">
        <div className="bg-white border border-gray-200 border-t-0 rounded-b overflow-x-auto">
          {selectedTab === 'devices' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.size === currentData.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Device</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Level</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Added to</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Bid adj.</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Ad group bid adj.</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Impr.</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">
                    <div className="flex items-center justify-end gap-1">
                      <ChevronDown className="w-4 h-4" />
                      Interacti.
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Interaction rate</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Avg. cost</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Cost</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Conv. rate</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Conversions</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Cost / conv.</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {devicesData.map((device) => (
                  <tr key={device.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 cursor-pointer"
                        checked={selectedRows.has(device.id)}
                        onChange={() => toggleRowSelection(device.id)}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-900">{device.device}</td>
                    <td className="px-4 py-3 text-gray-700">{device.level}</td>
                    <td className="px-4 py-3">
                      <a href="#" className="text-blue-600 hover:underline">{device.addedTo}</a>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{device.bidAdj || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{device.adGroupBidAdj}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{device.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {device.interactions > 0 ? (
                        <>
                          {device.interactions}
                          <div className="text-xs text-gray-500">clicks</div>
                        </>
                      ) : (
                        device.interactions
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{device.interactionRate}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{device.avgCost}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{device.cost}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{device.convRate}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{device.conversions}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{device.costPerConv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTab === 'when' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.size === currentData.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Day</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Hour</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Campaign</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Impr.</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">
                    <div className="flex items-center justify-end gap-1">
                      <ChevronDown className="w-4 h-4" />
                      Interaction
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Interaction rate</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Avg. cost</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Cost</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Conv. rate</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Conversions</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Cost / conv.</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {/* Total Row */}
                <tr className="bg-gray-50 font-medium border-b border-gray-200">
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 flex items-center gap-2 text-gray-900">
                    Total: Day...
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right text-gray-900">1,994</td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    239
                    <div className="text-xs text-gray-500">clicks</div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">11.99%</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹7.09</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹1,695.56</td>
                  <td className="px-4 py-3 text-right text-gray-900">6.28%</td>
                  <td className="px-4 py-3 text-right text-gray-900">15.00</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹113.04</td>
                </tr>

                {whenAdsShowedData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 cursor-pointer"
                        checked={selectedRows.has(item.id)}
                        onChange={() => toggleRowSelection(item.id)}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-900">{item.day}</td>
                    <td className="px-4 py-3 text-gray-700">{item.hour}</td>
                    <td className="px-4 py-3">
                      <a href="#" className="text-blue-600 hover:underline">{item.campaign}</a>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.impressions}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {item.interactions}
                      <div className="text-xs text-gray-500">clicks</div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.interactionRate}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.avgCost}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.cost}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.convRate}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.conversions}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.costPerConv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTab === 'matched' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.size === currentData.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Matched location</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">
                    <div className="flex items-center justify-end gap-1">
                      <ChevronDown className="w-4 h-4" />
                      Clicks
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Impr.</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">CTR</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Avg. CPC</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Cost</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Conv. rate</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Conversions</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Cost / conv.</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {matchedLocationsData.map((location) => (
                  <tr key={location.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 cursor-pointer"
                        checked={selectedRows.has(location.id)}
                        onChange={() => toggleRowSelection(location.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <a href="#" className="text-blue-600 hover:underline">{location.matchedLocation}</a>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.clicks}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.ctr}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.avgCpc}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.cost}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.convRate}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.conversions}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.costPerConv}</td>
                  </tr>
                ))}

                {/* Total: Locations Row */}
                <tr className="bg-gray-50 font-medium border-b border-gray-200">
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 flex items-center gap-2 text-gray-900">
                    Total: Locations
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">239</td>
                  <td className="px-4 py-3 text-right text-gray-900">1,994</td>
                  <td className="px-4 py-3 text-right text-gray-900">11.99%</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹7.09</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹1,695.56</td>
                  <td className="px-4 py-3 text-right text-gray-900">6.28%</td>
                  <td className="px-4 py-3 text-right text-gray-900">15.00</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹113.04</td>
                </tr>

                {/* Total: Account Row */}
                <tr className="bg-gray-50 font-medium border-b border-gray-200">
                  <td className="px-4 py-3">
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2 text-gray-900">
                    Total: Acco...
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">239</td>
                  <td className="px-4 py-3 text-right text-gray-900">1,994</td>
                  <td className="px-4 py-3 text-right text-gray-900">11.99%</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹7.09</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹1,695.56</td>
                  <td className="px-4 py-3 text-right text-gray-900">6.28%</td>
                  <td className="px-4 py-3 text-right text-gray-900">15.00</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹113.04</td>
                </tr>
              </tbody>
            </table>
          )}

          {selectedTab === 'where' && (
            <div className="p-12 text-center text-gray-500">
              <p>Where ads showed data will be displayed here</p>
            </div>
          )}
        </div>

        {/* Pagination for Matched locations tab */}
        {selectedTab === 'matched' && (
          <div className="mt-4 flex justify-end">
            <span className="text-sm text-gray-600">1 - 1 of 1</span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 border-t border-blue-100 px-6 py-3 mt-6">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-900">
            <span className="font-medium">Optimize device performance:</span> Review which devices are 
            driving the most conversions and adjust your bids accordingly. Consider setting bid adjustments 
            to increase or decrease bids for specific devices. Mobile phones often have different conversion 
            patterns than desktops, so tailor your strategy to each device type. Learn more about{' '}
            <a href="#" className="underline hover:text-blue-700">device targeting and bid adjustments</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
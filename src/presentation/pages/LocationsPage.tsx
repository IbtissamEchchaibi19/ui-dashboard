import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Download, Maximize2, MoreVertical, Edit2, Plus } from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
interface Location {
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
}

interface ExcludedLocation {
  id: string;
  excludedLocation: string;
  campaign: string;
}

interface LocationOfInterest {
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

// ──────────────────────────────────────────────────────────────
// Sample Data
// ──────────────────────────────────────────────────────────────
const locationsData: Location[] = [
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
  },
  {
    id: '5',
    targetedLocation: 'Sahibzada Ajit Singh Nagar, Punjab, India',
    campaign: 'Search 9th Oct',
    impressions: 92,
    interactions: 8,
    interactionRate: '8.70%',
    avgCost: '₹3.02',
    cost: '₹24.13',
    convRate: '0.00%',
    conversions: 0.00,
    costPerConv: '₹0.00'
  },
  {
    id: '6',
    targetedLocation: 'Haryana, India',
    campaign: 'Campaign #1',
    impressions: 0,
    interactions: 0,
    interactionRate: '—',
    avgCost: '—',
    cost: '₹0.00',
    convRate: '0.00%',
    conversions: 0.00,
    costPerConv: '₹0.00'
  },
  {
    id: '7',
    targetedLocation: 'Punjab, India',
    campaign: 'Campaign #1',
    impressions: 0,
    interactions: 0,
    interactionRate: '—',
    avgCost: '—',
    cost: '₹0.00',
    convRate: '0.00%',
    conversions: 0.00,
    costPerConv: '₹0.00'
  },
  {
    id: '8',
    targetedLocation: 'Himachal Pradesh, India',
    campaign: 'Campaign #1',
    impressions: 0,
    interactions: 0,
    interactionRate: '—',
    avgCost: '—',
    cost: '₹0.00',
    convRate: '0.00%',
    conversions: 0.00,
    costPerConv: '₹0.00'
  },
  {
    id: '9',
    targetedLocation: 'Chandigarh, Chandigarh, India',
    campaign: 'Campaign #1',
    impressions: 0,
    interactions: 0,
    interactionRate: '—',
    avgCost: '—',
    cost: '₹0.00',
    convRate: '0.00%',
    conversions: 0.00,
    costPerConv: '₹0.00'
  }
];

const excludedLocationsData: ExcludedLocation[] = [];

const locationsOfInterestData: LocationOfInterest[] = [];

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────
export const LocationsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'locations' | 'exclusions' | 'interest'>('locations');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Tab definitions
  const tabs = [
    { id: 'locations' as const, label: 'Locations' },
    { id: 'exclusions' as const, label: 'Location exclusions' },
    { id: 'interest' as const, label: 'Locations of interest' }
  ];

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
    const currentData = selectedTab === 'locations' 
      ? locationsData 
      : selectedTab === 'exclusions' 
      ? excludedLocationsData 
      : locationsOfInterestData;
    
    if (selectedRows.size === currentData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(currentData.map(r => r.id)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-normal text-gray-900">Locations</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded text-sm">
                <span className="text-gray-600">This month</span>
              </div>
              
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

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedTab === 'locations' && (
              <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                <Edit2 className="w-5 h-5" />
              </button>
            )}
            
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <Filter className="w-4 h-4" />
              Add filter
            </button>
          </div>

          <div className="flex items-center gap-4">
            {selectedTab === 'exclusions' && (
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                  <Maximize2 className="w-4 h-4" />
                  Expand
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {selectedTab === 'locations' && (
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  Segment
                </button>
                
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
                
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {selectedTab === 'interest' && (
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  Segment
                </button>
                
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          {/* Locations Tab Table */}
          {selectedTab === 'locations' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.size === locationsData.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Targeted location
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Campaign</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Impr.</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">
                    <div className="flex items-center justify-end gap-1">
                      <ChevronDown className="w-4 h-4" />
                      Interacti.
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">
                    Interaction rate
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Avg. cost</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Cost</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Conv. rate</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Conversions</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Cost / conv.</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {locationsData.map((location) => (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 cursor-pointer"
                        checked={selectedRows.has(location.id)}
                        onChange={() => toggleRowSelection(location.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <a href="#" className="text-blue-600 hover:underline">{location.targetedLocation}</a>
                    </td>
                    <td className="px-4 py-3">
                      <a href="#" className="text-blue-600 hover:underline">{location.campaign}</a>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.impressions}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {location.interactions > 0 ? (
                        <>
                          {location.interactions}
                          <div className="text-xs text-gray-500">clicks</div>
                        </>
                      ) : (
                        location.interactions
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.interactionRate}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.avgCost}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.cost}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.convRate}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {location.conversions.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.costPerConv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Location Exclusions Tab Table */}
          {selectedTab === 'exclusions' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      disabled
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    <div className="flex items-center gap-1">
                      Excluded location
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Campaign</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-gray-500">
                        You haven't excluded any locations. To refine your targeting, edit your locations.
                      </div>
                      <button className="flex items-center gap-2 text-blue-600 hover:underline font-medium">
                        <Plus className="w-4 h-4" />
                        Edit locations
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {/* Locations of Interest Tab Table */}
          {selectedTab === 'interest' && (
            <>
              {/* Info Banner */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      This report shows your performance based on ad group locations of interest. To view your 
                      performance based on your campaign location setting, go to the 'Locations' tab.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-blue-600 text-sm font-medium hover:underline whitespace-nowrap">
                      Hide for now
                    </button>
                    <button className="text-blue-600 text-sm font-medium hover:underline whitespace-nowrap">
                      Learn more about locations of interest
                    </button>
                  </div>
                </div>
              </div>

              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left w-10">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 cursor-pointer"
                        disabled
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Targeted location of interest
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Campaign</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Ad group</th>
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
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center text-gray-500">
                      You don't have any entries yet
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 border-t border-blue-100 px-6 py-3 mt-6">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-900">
            {selectedTab === 'locations' && (
              <>
                <span className="font-medium">Optimize your location targeting:</span> Review your location 
                performance regularly to identify high-performing areas and adjust your bids accordingly. Use 
                location exclusions to prevent ads from showing in areas where your business doesn't operate. 
                Learn more in our{' '}
                <a href="#" className="underline hover:text-blue-700">Location Targeting Guide</a>.
              </>
            )}
            {selectedTab === 'exclusions' && (
              <>
                <span className="font-medium">Refine your targeting with exclusions:</span> Location exclusions 
                help you prevent your ads from showing in specific geographic areas, ensuring your budget is spent 
                on locations where your services are available. You can exclude countries, states, cities, or custom 
                radius areas. Visit our{' '}
                <a href="#" className="underline hover:text-blue-700">Help Center</a> to learn more.
              </>
            )}
            {selectedTab === 'interest' && (
              <>
                <span className="font-medium">Understanding locations of interest:</span> This report shows 
                performance based on locations that users have shown interest in, even if they're not physically 
                located there. This is useful for businesses in travel, real estate, and education sectors. 
                Learn more about{' '}
                <a href="#" className="underline hover:text-blue-700">location of interest targeting</a>.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
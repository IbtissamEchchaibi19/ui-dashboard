import { useState } from 'react';
import { Edit2, Plus } from 'lucide-react';
import DataTable, { Column } from '@presentation/components/DataTable';

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
  [key: string]: any;
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
  }
];

const excludedLocationsData: ExcludedLocation[] = [];
const locationsOfInterestData: LocationOfInterest[] = [];

// ──────────────────────────────────────────────────────────────
// Column Definitions
// ──────────────────────────────────────────────────────────────
const locationsColumns: Column[] = [
  {
    key: 'targetedLocation',
    label: 'Targeted location',
    align: 'left',
    sticky: true,
    sortable: true,
    category: 'Location Info',
    render: (value) => <a href="#" className="text-blue-600 hover:underline">{value}</a>
  },
  {
    key: 'campaign',
    label: 'Campaign',
    align: 'left',
    category: 'Location Info',
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
    sortable: true,
    category: 'Conversions',
    render: (value) => value.toFixed(2)
  },
  {
    key: 'costPerConv',
    label: 'Cost / conv.',
    align: 'right',
    category: 'Conversions'
  }
];

const excludedLocationsColumns: Column[] = [
  {
    key: 'excludedLocation',
    label: 'Excluded location',
    align: 'left',
    sortable: true,
    category: 'Exclusion Info'
  },
  {
    key: 'campaign',
    label: 'Campaign',
    align: 'left',
    category: 'Exclusion Info'
  }
];

const interestColumns: Column[] = [
  {
    key: 'targetedLocationOfInterest',
    label: 'Targeted location of interest',
    align: 'left',
    sticky: true,
    sortable: true,
    category: 'Location Info'
  },
  {
    key: 'campaign',
    label: 'Campaign',
    align: 'left',
    category: 'Location Info'
  },
  {
    key: 'adGroup',
    label: 'Ad group',
    align: 'left',
    category: 'Location Info'
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
  }
];

// ──────────────────────────────────────────────────────────────
// Calculate Totals
// ──────────────────────────────────────────────────────────────
const calculateLocationTotals = (data: Location[], column: Column) => {
  switch (column.key) {
    case 'targetedLocation':
      return 'Total';
    
    case 'impressions':
    case 'interactions':
      return data.reduce((sum, row) => sum + row[column.key], 0).toLocaleString();
    
    case 'interactionRate':
      const totalImp = data.reduce((sum, row) => sum + row.impressions, 0);
      const totalInt = data.reduce((sum, row) => sum + row.interactions, 0);
      return totalImp > 0 ? `${((totalInt / totalImp) * 100).toFixed(2)}%` : '0.00%';
    
    case 'avgCost':
      const totalCost = data.reduce((sum, row) => sum + parseFloat(row.cost.replace(/[₹,]/g, '')), 0);
      const totalInteractions = data.reduce((sum, row) => sum + row.interactions, 0);
      return totalInteractions > 0 ? `₹${(totalCost / totalInteractions).toFixed(2)}` : '₹0.00';
    
    case 'cost':
      const cost = data.reduce((sum, row) => sum + parseFloat(row.cost.replace(/[₹,]/g, '')), 0);
      return `₹${cost.toFixed(2)}`;
    
    case 'convRate':
      const totConv = data.reduce((sum, row) => sum + row.conversions, 0);
      const totInt = data.reduce((sum, row) => sum + row.interactions, 0);
      return totInt > 0 ? `${((totConv / totInt) * 100).toFixed(2)}%` : '0.00%';
    
    case 'conversions':
      return data.reduce((sum, row) => sum + row.conversions, 0).toFixed(2);
    
    case 'costPerConv':
      const totCost = data.reduce((sum, row) => sum + parseFloat(row.cost.replace(/[₹,]/g, '')), 0);
      const totConversions = data.reduce((sum, row) => sum + row.conversions, 0);
      return totConversions > 0 ? `₹${(totCost / totConversions).toFixed(2)}` : '₹0.00';
    
    default:
      return '';
  }
};

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────
export const  LocationsPage: React.FC = ()=>{
  const [selectedTab, setSelectedTab] = useState<'locations' | 'exclusions' | 'interest'>('locations');

  const tabs = [
    { id: 'locations' as const, label: 'Locations' },
    { id: 'exclusions' as const, label: 'Location exclusions' },
    { id: 'interest' as const, label: 'Locations of interest' }
  ];

  const getCurrentConfig = () => {
    switch (selectedTab) {
      case 'locations':
        return {
          data: locationsData,
          columns: locationsColumns,
          calculateTotal: calculateLocationTotals,
          totalLabel: 'Total',
          emptyMessage: 'No locations found'
        };
      case 'exclusions':
        return {
          data: excludedLocationsData,
          columns: excludedLocationsColumns,
          calculateTotal: undefined,
          totalLabel: '',
          emptyMessage: 'You haven\'t excluded any locations. To refine your targeting, edit your locations.'
        };
      case 'interest':
        return {
          data: locationsOfInterestData,
          columns: interestColumns,
          calculateTotal: undefined,
          totalLabel: '',
          emptyMessage: 'You don\'t have any entries yet'
        };
      default:
        return {
          data: locationsData,
          columns: locationsColumns,
          calculateTotal: calculateLocationTotals,
          totalLabel: 'Total',
          emptyMessage: 'No locations found'
        };
    }
  };

  const config = getCurrentConfig();

  return (
    <div className="min-h-screen bg-gray-50">
       <div className="bg-[#f8f9fa] border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - View and Campaign Selectors */}
          <div className="flex items-center gap-3">
            {/* View Dropdown */}
            <div className="relative">
              <button className="bg-white border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 min-w-[200px]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <div className="flex-1 text-left">
                  <div className="text-xs text-gray-500">View (2 filters)</div>
                  <div className="text-sm font-medium text-gray-900">All campaigns</div>
                </div>
              </button>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
            </div>

            {/* Campaign Dropdown */}
            <div className="relative">
              <button className="bg-white border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 min-w-[200px]">
                <div className="flex-1 text-left">
                  <div className="text-xs text-gray-500">Campaigns (2)</div>
                  <div className="text-sm font-medium text-gray-900">Select a campaign</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Side - Save Button */}
          <button className="flex flex-col items-center gap-1 px-3 py-1 hover:bg-gray-200 rounded text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
            <span className="text-xs">Save</span>
          </button>
        </div>

        {/* Filter Tags Row */}
        <div className="flex items-center gap-3 mt-3">
          <span className="text-sm text-gray-600">Filters</span>
          <button className="bg-white border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1">
            Campaign status: Enabled, Paused
          </button>
          <button className="bg-white border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1">
            Ad group status: Enabled, Paused
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-900">
            Add filter
          </button>
        </div>
      </div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-normal text-gray-900">Locations</h1>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded text-sm">
                <span className="text-gray-600">This month</span>
              </div>
              
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

      {/* Edit Button for Locations Tab */}
      {selectedTab === 'locations' && (
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Info Banner for Interest Tab */}
      {selectedTab === 'interest' && (
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
      )}

      {/* Data Table - Using Reusable Component */}
      <div className="px-6 py-4">
        {selectedTab === 'exclusions' && excludedLocationsData.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input type="checkbox" className="rounded border-gray-300 cursor-pointer" disabled />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    <div className="flex items-center gap-1">
                      Excluded location
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
          </div>
        ) : (
          <DataTable
            data={config.data}
            columns={config.columns}
            title={`Locations - ${selectedTab}`}
            enableSearch={true}
            enableFilters={true}
            enableColumns={selectedTab !== 'exclusions'}
            enableSegment={selectedTab !== 'exclusions'}
            enableDownload={true}
            enableExpand={selectedTab !== 'exclusions'}
            enableRowSelection={true}
            searchPlaceholder={`Search ${selectedTab}...`}
            filterOptions={
              selectedTab === 'locations'
                ? ['Location type', 'Campaign', 'Performance']
                : selectedTab === 'interest'
                ? ['Campaign', 'Ad group', 'Location']
                : ['Location', 'Campaign']
            }
            segmentOptions={['Time', 'Device', 'Network']}
            rowKey="id"
            showTotal={selectedTab === 'locations'}
            totalLabel={config.totalLabel}
            calculateTotal={config.calculateTotal}
            emptyMessage={config.emptyMessage}
            stickyHeader={true}
          />
        )}
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
                performance regularly to identify high-performing areas and adjust your bids accordingly. Learn 
                more in our{' '}
                <a href="#" className="underline hover:text-blue-700">Location Targeting Guide</a>.
              </>
            )}
            {selectedTab === 'exclusions' && (
              <>
                <span className="font-medium">Refine your targeting with exclusions:</span> Location exclusions 
                help you prevent your ads from showing in specific geographic areas. Visit our{' '}
                <a href="#" className="underline hover:text-blue-700">Help Center</a> to learn more.
              </>
            )}
            {selectedTab === 'interest' && (
              <>
                <span className="font-medium">Understanding locations of interest:</span> This report shows 
                performance based on locations that users have shown interest in. Learn more about{' '}
                <a href="#" className="underline hover:text-blue-700">location of interest targeting</a>.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
// GoogleAdsCampaignGroups.tsx — FINAL VERSION (No JSX in templates, 100% Syncfusion-safe)
import React, { useState, useRef } from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Sort,
  Filter,
  Toolbar,
  Inject,
  FilterSettingsModel,
  ToolbarItems,
} from '@syncfusion/ej2-react-grids';

interface CampaignGroup {
  id: number;
  name: string;
  campaigns: number;
  status: 'Active' | 'Paused' | 'Removed';
  budget: string;
  startDate: string;
  endDate?: string;
  performance: 'On target' | 'Underperforming' | 'Overperforming';
}

const campaignGroupsData: CampaignGroup[] = [
  {
    id: 1,
    name: 'Black Friday 2025',
    campaigns: 12,
    status: 'Active',
    budget: '$15,000',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    performance: 'On target',
  },
  {
    id: 2,
    name: 'Holiday Season Bundle',
    campaigns: 8,
    status: 'Active',
    budget: '$8,500',
    startDate: '2025-12-01',
    endDate: '2026-01-05',
    performance: 'Overperforming',
  },
  {
    id: 3,
    name: 'Summer Clearance 2025',
    campaigns: 5,
    status: 'Paused',
    budget: '$4,200',
    startDate: '2025-06-15',
    endDate: '2025-08-31',
    performance: 'Underperforming',
  },
];
interface PerformanceTarget {
  id: number;
  campaignGroupName: string;
  dateRange: string;
  recurrence: string;
  status: 'Active' | 'Paused' | 'Ended';
  metric: string;
  volumeTarget: string;
  volumeActual: string;
  spendTarget: string;
  spendActual: string;
  efficiencyTarget: string;
  efficiencyActual: string;
}

const performanceTargetsData: PerformanceTarget[] = [
  {
    id: 1,
    campaignGroupName: 'Black Friday 2025',
    dateRange: 'Nov 1 - Nov 30, 2025',
    recurrence: 'One-time',
    status: 'Active',
    metric: 'Clicks',
    volumeTarget: '50,000',
    volumeActual: '32,450',
    spendTarget: '$15,000',
    spendActual: '$9,850',
    efficiencyTarget: '$0.30',
    efficiencyActual: '$0.30',
  },
  {
    id: 2,
    campaignGroupName: 'Holiday Season Bundle',
    dateRange: 'Dec 1, 2025 - Jan 5, 2026',
    recurrence: 'Weekly',
    status: 'Active',
    metric: 'Conversions',
    volumeTarget: '1,200',
    volumeActual: '1,580',
    spendTarget: '$8,500',
    spendActual: '$8,200',
    efficiencyTarget: '$7.08',
    efficiencyActual: '$5.19',
  },
  {
    id: 3,
    campaignGroupName: 'Summer Clearance 2025',
    dateRange: 'Jun 15 - Aug 31, 2025',
    recurrence: 'Monthly',
    status: 'Ended',
    metric: 'Impressions',
    volumeTarget: '2,000,000',
    volumeActual: '1,450,000',
    spendTarget: '$4,200',
    spendActual: '$4,150',
    efficiencyTarget: '$0.002',
    efficiencyActual: '$0.003',
  },
];
export const GoogleAdsCampaignGroups: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'groups' | 'targets'>('groups');
  const [dateRange, setDateRange] = useState('Nov 1 – 28, 2025');
  const [metric1, setMetric1] = useState('Clicks');
  const [metric2, setMetric2] = useState('None');
  const gridRef = useRef<GridComponent>(null);

  const filterSettings: FilterSettingsModel = { type: 'Excel' };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-32 text-center bg-white">
      <p className="text-gray-600 mb-4">
        {activeTab === 'groups' 
          ? "You don't have any campaign groups yet" 
          : "You don't have any performance targets yet"}
      </p>
      <button className="text-blue-600 hover:underline flex items-center gap-2">
        <span className="text-xl">+</span> 
        {activeTab === 'groups' ? 'Campaign group' : 'Performance target'}
      </button>
    </div>
  );

  const renderCampaignGroups = () => (
    <div className="bg-white">
      {/* Table Rows */}
      {campaignGroupsData.map((group) => (
        <div 
          key={group.id}
          className="grid grid-cols-9 gap-4 px-6 py-4 border-b border-gray-200 text-sm hover:bg-gray-50 cursor-pointer"
        >
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
            <span className="text-blue-600 hover:underline">{group.name}</span>
          </div>
          <div className="text-right text-gray-900">0</div>
          <div className="text-right text-gray-900">0</div>
          <div className="text-right text-gray-900">0.00%</div>
          <div className="text-right text-gray-900">$0.00</div>
          <div className="text-right text-gray-900">{group.budget}</div>
          <div className="text-right text-gray-900">0.00%</div>
          <div className="text-right text-gray-900">0</div>
          <div className="text-right text-gray-900">$0.00</div>
        </div>
      ))}
    </div>
  );

  const renderPerformanceTargets = () => (
    <div className="bg-white">
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
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-700">
        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
          <span>Campaign group name</span>
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="col-span-1">Date Range</div>
        <div className="col-span-1">Recurrence</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Metric</div>
        <div className="col-span-2 text-center border-l border-gray-300">Volume</div>
        <div className="col-span-2 text-center border-l border-gray-300">Spend</div>
        <div className="col-span-2 text-center border-l border-gray-300">Efficiency</div>
      </div>

      {/* Sub-header for Target/Actual columns */}
      <div className="grid grid-cols-12 gap-4 px-6 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
        <div className="col-span-6"></div>
        <div className="col-span-1 text-center">Target</div>
        <div className="col-span-1 text-center">Actual</div>
        <div className="col-span-1 text-center">Target</div>
        <div className="col-span-1 text-center">Actual</div>
        <div className="col-span-1 text-center">Target</div>
        <div className="col-span-1 text-center">Actual</div>
      </div>

      {/* Table Rows */}
      {performanceTargetsData.map((target) => (
        <div 
          key={target.id}
          className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 text-sm hover:bg-gray-50 cursor-pointer"
        >
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
            <span className="text-gray-900">{target.campaignGroupName}</span>
          </div>
          <div className="col-span-1 text-gray-700">{target.dateRange}</div>
          <div className="col-span-1 text-gray-700">{target.recurrence}</div>
          <div className="col-span-1">
            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
              target.status === 'Active' 
                ? 'bg-green-100 text-green-800' 
                : target.status === 'Paused'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {target.status}
            </span>
          </div>
          <div className="col-span-1 text-gray-700">{target.metric}</div>
          <div className="col-span-1 text-right text-gray-900">{target.volumeTarget}</div>
          <div className="col-span-1 text-right text-gray-900">{target.volumeActual}</div>
          <div className="col-span-1 text-right text-gray-900">{target.spendTarget}</div>
          <div className="col-span-1 text-right text-gray-900">{target.spendActual}</div>
          <div className="col-span-1 text-right text-gray-900">{target.efficiencyTarget}</div>
          <div className="col-span-1 text-right text-gray-900">{target.efficiencyActual}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
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
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-normal text-gray-900">Campaign groups</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">This month</span>
          <div className="relative">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-10 text-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Nov 1 – 28, 2025</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This month</option>
              <option>Last month</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="text-sm text-blue-600 hover:underline">Show last 30 days</button>
          <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
            Save
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-between items-end border-b border-gray-200 px-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'groups'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Campaign groups
          </button>
          <button
            onClick={() => setActiveTab('targets')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'targets'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Performance targets
          </button>
        </div>
        <button className="mb-2 p-2 hover:bg-gray-100 rounded" title="Expand">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      {/* Chart Section - Only show for Campaign groups tab */}
      {activeTab === 'groups' && (
        <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4">
              <div className="relative">
                <select 
                  value={metric1}
                  onChange={(e) => setMetric1(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-10 text-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Clicks</option>
                  <option>Impressions</option>
                  <option>Cost</option>
                  <option>Conversions</option>
                </select>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full pointer-events-none"></span>
              </div>
              <div className="relative">
                <select 
                  value={metric2}
                  onChange={(e) => setMetric2(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-10 text-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>None</option>
                  <option>Clicks</option>
                  <option>Impressions</option>
                  <option>Cost</option>
                  <option>Conversions</option>
                </select>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full pointer-events-none"></span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-white rounded" title="Chart type">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-white rounded" title="Expand">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
              <button className="p-2 hover:bg-white rounded" title="Adjust">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white border border-gray-200 rounded p-6" style={{height: '280px'}}>
            <div className="relative h-full">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
                <span>2</span>
                <span>1</span>
                <span>0</span>
              </div>
              <div className="ml-8 h-full border-b border-gray-200 relative">
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" style={{width: '100%'}}></div>
                <div className="absolute left-0 bottom-0 text-xs text-gray-500">Nov 1, 2025</div>
                <div className="absolute right-0 bottom-0 text-xs text-gray-500">Nov 28, 2025</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar with Create Button */}
      {activeTab === 'groups' && (
        <div className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-200">
          <button className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add filter
          </button>
        </div>
      )}

      {/* Table Toolbar */}
      {activeTab === 'groups' && (
        <>
          <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center gap-4">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
              <button className="text-sm text-gray-600 hover:text-gray-900">Campaign group ↓</button>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded" title="Search">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded" title="Segment">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded" title="Columns">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded" title="Download">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded" title="Expand">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Table Header Row */}
          <div className="grid grid-cols-9 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
            <div className="col-span-2">Campaign group</div>
            <div className="text-right">Impr.</div>
            <div className="text-right">Interactions</div>
            <div className="text-right">Interaction rate</div>
            <div className="text-right">Avg. cost</div>
            <div className="text-right">Cost</div>
            <div className="text-right">Conv. rate</div>
            <div className="text-right">Conversions</div>
            <div className="text-right">Cost / conv.</div>
          </div>
        </>
      )}

      {/* Content */}
      {activeTab === 'groups' ? renderCampaignGroups() : renderPerformanceTargets()}
    </div>
  );
};
import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import DataTable, { Column } from '@presentation/components/DataTable';
import {LandingPage,landingPagesData} from '@infrastructure/mock-data'


const landingPagesColumns: Column[] = [
  {
    key: 'landingPage',
    label: 'Landing page',
    align: 'left',
    sticky: true,
    sortable: true,
    category: 'Page Info',
    render: (value) => (
      <div>
        <a href="#" className="text-blue-600 hover:underline break-all">{value}</a>
        <div className="text-xs text-blue-600 hover:underline mt-1">
          View expanded landing pages
        </div>
      </div>
    )
  },
  {
    key: 'selectedBy',
    label: 'Selected by',
    align: 'left',
    category: 'Page Info'
  },
  {
    key: 'mobileSpeedScore',
    label: 'Mobile speed score',
    align: 'left',
    category: 'Mobile Metrics'
  },
  {
    key: 'mobileFriendlyClickRate',
    label: 'Mobile-friendly click rate',
    align: 'left',
    category: 'Mobile Metrics'
  },
  {
    key: 'validAmpClickRate',
    label: 'Valid AMP click rate',
    align: 'left',
    category: 'Mobile Metrics'
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
const calculateTotals = (data: LandingPage[], column: Column) => {
  switch (column.key) {
    case 'landingPage':
      return 'Total: Landing pages';
    
    case 'mobileSpeedScore':
    case 'mobileFriendlyClickRate':
    case 'validAmpClickRate':
      return '—';
    
    case 'clicks':
    case 'impressions':
      return data.reduce((sum, row) => sum + row[column.key], 0).toLocaleString();
    
    case 'ctr':
      const totalClicks = data.reduce((sum, row) => sum + row.clicks, 0);
      const totalImpressions = data.reduce((sum, row) => sum + row.impressions, 0);
      return totalImpressions > 0 ? `${((totalClicks / totalImpressions) * 100).toFixed(2)}%` : '0.00%';
    
    case 'avgCpc':
      const totalCost = data.reduce((sum, row) => sum + parseFloat(row.cost.replace(/[₹,]/g, '')), 0);
      const clicks = data.reduce((sum, row) => sum + row.clicks, 0);
      return clicks > 0 ? `₹${(totalCost / clicks).toFixed(2)}` : '₹0.00';
    
    case 'cost':
      const cost = data.reduce((sum, row) => sum + parseFloat(row.cost.replace(/[₹,]/g, '')), 0);
      return `₹${cost.toFixed(2)}`;
    
    default:
      return '';
  }
};

export const LandingPagesPage:  React.FC =() =>{
  const [selectedTab, setSelectedTab] = useState<'landing' | 'expanded'>('landing');
  const [selectedMetric, setSelectedMetric] = useState('clicks');
  const [selectedComparison, setSelectedComparison] = useState('none');
  const [showBanner, setShowBanner] = useState(true);

  const tabs = [
    { id: 'landing' as const, label: 'Landing pages' },
    { id: 'expanded' as const, label: 'Expanded landing pages' }
  ];

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
            <h1 className="text-2xl font-normal text-gray-900">Landing pages</h1>
            
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

      {/* Info Banner */}
      <div className="bg-gray-100 border-b border-gray-200 px-6 py-3">
        <p className="text-sm text-gray-700">
          We reserve the right to direct HTTP clicks to HTTPS on occasion.{' '}
          <a href="#" className="text-blue-600 hover:underline">Learn more about HTTPS</a>
        </p>
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
      {/* Loading Banner */}
      {showBanner && (
        <div className="mx-6 mt-6 px-4 py-3 bg-blue-50 border border-blue-200 rounded flex items-center justify-between">
          <p className="text-sm text-blue-900">
            Your report is still loading. Meanwhile, you can start downloading the data.
          </p>
          <button 
            onClick={() => setShowBanner(false)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Data Table - Using Reusable Component */}
      <div className="px-6 py-6">
        <DataTable
          data={landingPagesData}
          columns={landingPagesColumns}
          title="Landing pages"
          enableSearch={true}
          enableFilters={true}
          enableColumns={true}
          enableSegment={true}
          enableDownload={true}
          enableExpand={true}
          enableRowSelection={true}
          searchPlaceholder="Search landing pages..."
          filterOptions={['Selected by', 'Mobile speed score', 'Device type', 'Campaign']}
          segmentOptions={['Device', 'Time', 'Network', 'Click type']}
          rowKey="id"
          showTotal={true}
          totalLabel="Total: Landing pages"
          calculateTotal={calculateTotals}
          emptyMessage="No landing pages found"
          stickyHeader={true}
        />
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 border-t border-blue-100 px-6 py-3 mt-6">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-900">
            <span className="font-medium">Optimize your landing page performance:</span> Review which landing 
            pages are driving the most clicks and conversions. Ensure your landing pages load quickly on mobile 
            devices and provide a good user experience. Learn more about{' '}
            <a href="#" className="underline hover:text-blue-700">landing page optimization</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
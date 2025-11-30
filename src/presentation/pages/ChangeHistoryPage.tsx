import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Download, Maximize2, MessageSquare } from 'lucide-react';
import {changeRecordsData,campaignSummaryData,changeTypeFilters ,ChangeRecord } from '@infrastructure/mock-data'

export const  ChangeHistoryPage : React.FC = () =>  {
  const [selectedTab, setSelectedTab] = useState<'user' | 'campaign' | 'performance'>('user');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [changeRecords, setChangeRecords] = useState<ChangeRecord[]>(changeRecordsData);
  const [showChangeOverview, setShowChangeOverview] = useState(true);
  const [selectedChangeType, setSelectedChangeType] = useState('all');
  const [showAddFilter, setShowAddFilter] = useState(false);

  const tabs = [
    { id: 'user' as const, label: 'By user' },
    { id: 'campaign' as const, label: 'By campaign' },
    { id: 'performance' as const, label: 'Performance' }
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
    if (selectedRows.size === changeRecords.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(changeRecords.map(r => r.id)));
    }
  };

  const toggleExpanded = (id: string) => {
    setChangeRecords(prev =>
      prev.map(record =>
        record.id === id ? { ...record, expanded: !record.expanded } : record
      )
    );
  };

  const undoChange = (id: string) => {
    setChangeRecords(prev =>
      prev.map(record =>
        record.id === id ? { ...record, isUndone: true } : record
      )
    );
  };

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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-normal text-gray-900">Change history</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded text-sm">
                <span className="text-gray-600">View (2 filters)</span>
                <div className="flex items-center gap-1 text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span>All campaigns</span>
                </div>
              </div>
              
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

      {/* Change Overview Section */}
      {selectedTab === 'user' && (
        <div className="bg-white border-b border-gray-200 mx-6 mt-6 rounded">
          <button
            onClick={() => setShowChangeOverview(!showChangeOverview)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
          >
            <h2 className="text-base font-medium text-gray-900">Change overview</h2>
            {showChangeOverview ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
          </button>
          
          {showChangeOverview && (
            <div className="border-t border-gray-200">
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      selectedTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Table Headers */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-gray-700">User</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-700">Changes</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-700">Summary</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        There is no user summary available for the selected date range.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Campaign Tab Content */}
      {selectedTab === 'campaign' && (
        <div className="bg-white border-b border-gray-200 mx-6 mt-6 rounded">
          <div className="border-t border-gray-200">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    selectedTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Campaign Summary Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-700">Campaign</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-700">Changes</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-700">Summary</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignSummaryData.map((campaign, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <a href="#" className="text-blue-600 hover:underline">{campaign.name}</a>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span>~{campaign.changes}</span>
                          <div className="bg-blue-600 h-2 rounded" style={{ width: '60px' }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-700">{campaign.summary}</td>
                      <td className="px-6 py-3">
                        <button className="text-blue-600 hover:underline text-sm">Add filter</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab Content */}
      {selectedTab === 'performance' && (
        <div className="bg-white border-b border-gray-200 mx-6 mt-6 rounded">
          <div className="border-t border-gray-200">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    selectedTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Performance Chart Controls */}
            <div className="p-6 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-4">
                <select className="px-4 py-2 border border-gray-300 rounded text-sm bg-white flex items-center gap-2">
                  <option>● Clicks</option>
                  <option>● Impressions</option>
                  <option>● Cost</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded text-sm bg-white">
                  <option>⊖ None</option>
                  <option>Compare periods</option>
                </select>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                <Filter className="w-4 h-4" />
                Adjust
              </button>
            </div>

            {/* Performance Chart */}
            <div className="p-6 bg-gray-50">
              <div className="h-64 bg-white border border-gray-200 rounded relative">
                <svg className="w-full h-full" viewBox="0 0 1400 256" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="64" x2="1400" y2="64" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="128" x2="1400" y2="128" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="192" x2="1400" y2="192" stroke="#e5e7eb" strokeWidth="1" />
                  
                  {/* Vertical grid lines (weekend shading areas) */}
                  <rect x="200" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.5" />
                  <rect x="500" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.5" />
                  <rect x="800" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.5" />
                  <rect x="1100" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.5" />
                  
                  {/* Line graph */}
                  <polyline
                    points="50,100 100,60 150,50 200,90 250,100 300,110 350,120 400,130 450,115 500,105 550,130 600,140 650,150 700,160 750,165 800,168 850,170 900,168 950,165 1000,168 1050,170 1100,168 1150,170 1200,168 1250,170 1300,168 1350,170"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                  
                  {/* Area under the line */}
                  <polygon
                    points="50,100 100,60 150,50 200,90 250,100 300,110 350,120 400,130 450,115 500,105 550,130 600,140 650,150 700,160 750,165 800,168 850,170 900,168 950,165 1000,168 1050,170 1100,168 1150,170 1200,168 1250,170 1300,168 1350,170 1350,256 50,256"
                    fill="#2563eb"
                    opacity="0.1"
                  />
                  
                  {/* Data points */}
                  <circle cx="50" cy="100" r="3" fill="#2563eb" />
                  <circle cx="100" cy="60" r="3" fill="#2563eb" />
                  <circle cx="150" cy="50" r="3" fill="#2563eb" />
                  <circle cx="200" cy="90" r="3" fill="#2563eb" />
                  <circle cx="250" cy="100" r="3" fill="#2563eb" />
                  <circle cx="500" cy="105" r="3" fill="#2563eb" />
                  <circle cx="800" cy="168" r="3" fill="#2563eb" />
                  <circle cx="1100" cy="168" r="3" fill="#2563eb" />
                  <circle cx="1350" cy="170" r="3" fill="#2563eb" />
                </svg>
                
                {/* Y-axis labels */}
                <div className="absolute left-2 top-2 text-xs text-gray-600">50</div>
                <div className="absolute left-2 top-16 text-xs text-gray-600">25</div>
                <div className="absolute left-2 bottom-12 text-xs text-gray-600">0</div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600 px-4">
                <span>Nov 1, 2025</span>
                <span>Nov 28, 2025</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Type Filters */}
      <div className="px-6 py-4 bg-white">
        <div className="flex flex-wrap gap-2">
          {changeTypeFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedChangeType(filter.id)}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                selectedChangeType === filter.id
                  ? 'bg-blue-50 text-blue-600 border-2 border-blue-600'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              } ${filter.active ? 'border-blue-600' : ''}`}
            >
              {selectedChangeType === filter.id && '✓ '}
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="relative">
              <button
                onClick={() => setShowAddFilter(!showAddFilter)}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Add filter
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <MessageSquare className="w-4 h-4" />
              Feedback
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
        </div>
      </div>

      {/* Changes Table */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 cursor-pointer"
                    checked={selectedRows.size === changeRecords.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  <div className="flex items-center gap-1">
                    User / Date & Time
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Tool</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Change</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Campaign</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Ad group</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Asset group</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {changeRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.has(record.id)}
                      onChange={() => toggleRowSelection(record.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="text-gray-900">{record.user}</div>
                      <div className="text-gray-600 text-xs">{record.dateTime}</div>
                      {record.canUndo && !record.isUndone && (
                        <button
                          onClick={() => undoChange(record.id)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Undo
                        </button>
                      )}
                      {record.isUndone && (
                        <div className="text-gray-500 text-xs">Changes undone</div>
                      )}
                      {!record.canUndo && (
                        <div className="text-gray-500 text-xs underline">Changes can't be undone</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{record.tool}</td>
                  <td className="px-4 py-3">
                    <div className="text-gray-700 whitespace-pre-line">
                      {record.change}
                    </div>
                    {record.expandable && (
                      <button
                        onClick={() => toggleExpanded(record.id)}
                        className="flex items-center gap-1 mt-2 text-gray-600 hover:text-gray-900"
                      >
                        {record.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        <span className="text-sm">{record.expanded ? 'Show less' : 'Show more'}</span>
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {record.campaign && (
                      <a href="#" className="text-blue-600 hover:underline">{record.campaign}</a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{record.adGroup || '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{record.assetGroup || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-50 border-t border-blue-100 px-6 py-3 mt-6">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-900">
            <span className="font-medium">Need help understanding changes?</span> Visit our{' '}
            <a href="#" className="underline hover:text-blue-700">Help Center</a> to learn more about change history and how to interpret your account modifications.
          </p>
        </div>
      </div>
    </div>
  );
}
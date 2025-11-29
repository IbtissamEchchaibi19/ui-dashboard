import { useState } from 'react';
import { ChevronDown, Filter, Download, Maximize2, Plus, MoreVertical, Calendar, Share2, Mail, Trash2, Edit2, Copy } from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
interface SavedReport {
  id: string;
  name: string;
  type: string;
  lastModified: string;
  createdBy: string;
  scheduled: boolean;
}

interface PredefinedReport {
  id: string;
  name: string;
  description: string;
  category: string;
}

// ──────────────────────────────────────────────────────────────
// Sample Data
// ──────────────────────────────────────────────────────────────
const savedReports: SavedReport[] = [
  {
    id: '1',
    name: 'Campaign Performance Overview',
    type: 'Table',
    lastModified: 'Nov 27, 2025',
    createdBy: 'You',
    scheduled: true
  },
  {
    id: '2',
    name: 'Keyword Analysis Report',
    type: 'Line chart',
    lastModified: 'Nov 25, 2025',
    createdBy: 'You',
    scheduled: false
  },
  {
    id: '3',
    name: 'Monthly Conversion Trends',
    type: 'Column chart',
    lastModified: 'Nov 20, 2025',
    createdBy: 'Team Member',
    scheduled: true
  }
];

const predefinedReports: PredefinedReport[] = [
  {
    id: 'campaign',
    name: 'Campaign',
    description: 'View performance data for your campaigns',
    category: 'Basic'
  },
  {
    id: 'adgroup',
    name: 'Ad group',
    description: 'View performance data for your ad groups',
    category: 'Basic'
  },
  {
    id: 'keyword',
    name: 'Search keyword',
    description: 'View performance data for your keywords',
    category: 'Basic'
  },
  {
    id: 'searchterm',
    name: 'Search term',
    description: 'View the search terms that triggered your ads',
    category: 'Basic'
  },
  {
    id: 'age',
    name: 'Age',
    description: 'View performance by age demographic',
    category: 'Demographics'
  },
  {
    id: 'gender',
    name: 'Gender',
    description: 'View performance by gender demographic',
    category: 'Demographics'
  },
  {
    id: 'location',
    name: 'Geographic',
    description: 'View performance by location',
    category: 'Geographic'
  },
  {
    id: 'time',
    name: 'Time',
    description: 'View performance by time of day and day of week',
    category: 'Time'
  }
];

const chartTypes = [
  { id: 'table', name: 'Table', icon: '▦' },
  { id: 'tree', name: 'Tree table', icon: '≡' },
  { id: 'line', name: 'Line', icon: '📈' },
  { id: 'column', name: 'Column', icon: '📊' },
  { id: 'bar', name: 'Bar', icon: '▬' },
  { id: 'scatter', name: 'Scatter', icon: '⋯' },
  { id: 'pie', name: 'Pie', icon: '◐' }
];

const availableDimensions = [
  'Campaign', 'Ad group', 'Search keyword', 'Search term', 'Ad type', 
  'Device', 'Location', 'Age', 'Gender', 'Day of week', 'Hour of day'
];

const availableMetrics = [
  'Clicks', 'Impressions', 'CTR', 'Avg. CPC', 'Cost', 
  'Conversions', 'Conv. rate', 'Cost / conv.', 'Impr. share'
];

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────
export const ReportsPage: React.FC = () => {
  const [view, setView] = useState<'list' | 'predefined' | 'editor'>('list');
  const [selectedChart, setSelectedChart] = useState<string>('table');
  const [showYourReportsOnly, setShowYourReportsOnly] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [reportName, setReportName] = useState('Untitled report');

  const filteredReports = showYourReportsOnly 
    ? savedReports.filter(r => r.createdBy === 'You')
    : savedReports;

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
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-normal text-gray-900">Reports</h1>
              
              {(view === 'list' || view === 'predefined') && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setView('list')}
                    className={`px-4 py-2 text-sm font-medium rounded ${
                      view === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Your saved reports
                  </button>
                  <button
                    onClick={() => setView('predefined')}
                    className={`px-4 py-2 text-sm font-medium rounded ${
                      view === 'predefined' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Predefined reports
                  </button>
                </div>
              )}

              {view === 'editor' && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm"
                  />
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {view === 'list' && (
                <>
                  <button
                    onClick={() => setView('editor')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Custom
                  </button>
                  
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </>
              )}

              {view === 'editor' && (
                <>
                  <button className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50">
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">
                    Save
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50">
                    Save as
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Reports List View */}
      {view === 'list' && (
        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Filter Options */}
            <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showYourReportsOnly}
                    onChange={(e) => setShowYourReportsOnly(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-gray-700">Show your reports only</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">
                  Sort by: Last modified
                </button>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
            </div>

            {/* Reports Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-700">Report name</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-700">Type</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-700">Last modified</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-700">Created by</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-700">Scheduled</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:underline font-medium">
                          {report.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{report.type}</td>
                      <td className="px-6 py-4 text-gray-700">{report.lastModified}</td>
                      <td className="px-6 py-4 text-gray-700">{report.createdBy}</td>
                      <td className="px-6 py-4">
                        {report.scheduled ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <Calendar className="w-4 h-4" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-600 hover:text-gray-900" title="Share">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-gray-900" title="Schedule">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-gray-900" title="Duplicate">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-gray-900" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredReports.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500">
                <p>No reports found. Create your first custom report to get started.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Predefined Reports View */}
      {view === 'predefined' && (
        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Predefined reports (dimensions)</h2>
              <p className="text-sm text-gray-600">
                Choose from ready-made reports to quickly answer specific questions about your data. 
                You can customize and save these reports for future use.
              </p>
            </div>

            {/* Basic Reports */}
            <div className="mb-8">
              <h3 className="text-base font-medium text-gray-900 mb-4">Basic reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predefinedReports.filter(r => r.category === 'Basic').map((report) => (
                  <button
                    key={report.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-colors"
                  >
                    <div className="font-medium text-gray-900 mb-1">{report.name}</div>
                    <div className="text-sm text-gray-600">{report.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Demographics Reports */}
            <div className="mb-8">
              <h3 className="text-base font-medium text-gray-900 mb-4">Demographics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predefinedReports.filter(r => r.category === 'Demographics').map((report) => (
                  <button
                    key={report.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-colors"
                  >
                    <div className="font-medium text-gray-900 mb-1">{report.name}</div>
                    <div className="text-sm text-gray-600">{report.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Other Reports */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">Other reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predefinedReports.filter(r => ['Geographic', 'Time'].includes(r.category)).map((report) => (
                  <button
                    key={report.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-colors"
                  >
                    <div className="font-medium text-gray-900 mb-1">{report.name}</div>
                    <div className="text-sm text-gray-600">{report.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Editor View */}
      {view === 'editor' && (
        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Sidebar - Dimensions and Metrics */}
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Chart type</h3>
                <div className="grid grid-cols-2 gap-2">
                  {chartTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedChart(type.id)}
                      className={`p-3 border rounded text-sm flex items-center gap-2 ${
                        selectedChart === type.id
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span>{type.icon}</span>
                      <span>{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Dimensions</h3>
                <input
                  type="text"
                  placeholder="Search dimensions"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-3"
                />
                <div className="space-y-1">
                  {availableDimensions.map((dimension) => (
                    <button
                      key={dimension}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded flex items-center justify-between"
                      draggable
                    >
                      <span className="text-gray-700">{dimension}</span>
                      <span className="text-gray-400">⋮⋮</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Metrics</h3>
                <input
                  type="text"
                  placeholder="Search metrics"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-3"
                />
                <div className="space-y-1">
                  {availableMetrics.map((metric) => (
                    <button
                      key={metric}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded flex items-center justify-between"
                      draggable
                    >
                      <span className="text-gray-700">{metric}</span>
                      <span className="text-gray-400">⋮⋮</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Date Range Selector */}
              <div className="flex items-center justify-end mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Date range:</span>
                  <select className="px-3 py-2 border border-gray-300 rounded text-sm bg-white">
                    <option>Last 30 days</option>
                    <option>Last 7 days</option>
                    <option>This month</option>
                    <option>Last month</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>

              {/* Drop Zones */}
              <div className="mb-6">
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Rows {selectedChart === 'table' && '(Drag dimensions here)'}
                  </label>
                  <div className="min-h-[60px] border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    {selectedRows.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center">
                        Drag and drop dimensions here
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedRows.map((row) => (
                          <div key={row} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm flex items-center gap-2">
                            {row}
                            <button className="hover:text-blue-900">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Columns {selectedChart === 'table' && '(Drag metrics here)'}
                  </label>
                  <div className="min-h-[60px] border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    {selectedColumns.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center">
                        Drag and drop metrics here
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedColumns.map((col) => (
                          <div key={col} className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm flex items-center gap-2">
                            {col}
                            <button className="hover:text-green-900">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview Area */}
              <div className="border border-gray-200 rounded-lg p-8 bg-gray-50">
                <div className="text-center text-gray-500">
                  <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium mb-2">Start building your report</p>
                  <p className="text-sm">
                    Drag dimensions to rows and metrics to columns to create your custom report
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                  <Filter className="w-4 h-4" />
                  Add filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                  <Maximize2 className="w-4 h-4" />
                  Expand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      {view !== 'editor' && (
        <div className="bg-blue-50 border-t border-blue-100 px-6 py-3 mt-6">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-900">
              <span className="font-medium">Reports help you analyze your data:</span> Create custom reports with the 
              Report Editor to visualize your campaign performance. You can save reports, schedule them to be emailed, 
              and add them to dashboards for easy access. Learn more about{' '}
              <a href="#" className="underline hover:text-blue-700">creating custom reports</a>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Download, Maximize2, Search as SearchIcon, Plus, MoreVertical } from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
interface Keyword {
  id: string;
  keyword: string;
  matchType: 'Exact match' | 'Broad match' | 'Phrase match';
  campaign: string;
  adGroup: string;
  status: 'Eligible' | 'Paused' | 'Removed';
  finalUrl: string;
  impressions?: number;
  clicks?: number;
  cost?: number;
  conversions?: number;
}

interface NegativeKeyword {
  id: string;
  negativeKeyword: string;
  addedTo: string;
  level: 'Campaign' | 'Ad group';
  matchType: 'Exact match' | 'Broad match' | 'Phrase match';
}

interface URLInclusion {
  id: string;
  urlInclusion: string;
  campaign: string;
  adGroup: string;
  status: string;
  campaignType: string;
  impressions?: number;
  interactions?: number;
}

// ──────────────────────────────────────────────────────────────
// Sample Data
// ──────────────────────────────────────────────────────────────
const keywordsData: Keyword[] = [
  {
    id: '1',
    keyword: 'ai and machine learning',
    matchType: 'Exact match',
    campaign: 'Search 9th Oct - AI Courses in Chandigarh | Learn Artificial Intelligence',
    adGroup: 'Ad group',
    status: 'Eligible',
    finalUrl: 'https://example.com/ai-courses',
    impressions: 203,
    clicks: 0,
    cost: 0,
    conversions: 0
  },
  {
    id: '2',
    keyword: '[ai course in chandigarh]',
    matchType: 'Exact match',
    campaign: 'Search 9th Oct - AI Courses in Chandigarh | Learn Artificial Intelligence',
    adGroup: 'Ad group',
    status: 'Eligible',
    finalUrl: 'https://example.com/ai-courses',
    impressions: 62,
    clicks: 0,
    cost: 0,
    conversions: 0
  },
  {
    id: '3',
    keyword: '[ai training in chandigarh]',
    matchType: 'Exact match',
    campaign: 'Search 9th Oct - AI Courses in Chandigarh | Learn Artificial Intelligence',
    adGroup: 'Ad group',
    status: 'Eligible',
    finalUrl: 'https://example.com/ai-courses',
    impressions: 0,
    clicks: 0,
    cost: 0,
    conversions: 0
  }
];

const negativeKeywordsData: NegativeKeyword[] = [
  {
    id: '1',
    negativeKeyword: '[a day goa ai intensive course with google]',
    addedTo: 'Search 9th Oct - AI Courses in Chandigarh | Learn Artificial Intelligence',
    level: 'Ad group',
    matchType: 'Exact match'
  },
  {
    id: '2',
    negativeKeyword: '[ai tutorial]',
    addedTo: 'Search 9th Oct',
    level: 'Campaign',
    matchType: 'Broad match'
  },
  {
    id: '3',
    negativeKeyword: 'arduino',
    addedTo: 'Search 9th Oct',
    level: 'Campaign',
    matchType: 'Broad match'
  },
  {
    id: '4',
    negativeKeyword: 'class 10/12',
    addedTo: 'Search 9th Oct',
    level: 'Campaign',
    matchType: 'Broad match'
  },
  {
    id: '5',
    negativeKeyword: '[computer class in]',
    addedTo: 'Search 9th Oct - AI Courses in Chandigarh | Learn Artificial Intelligence',
    level: 'Ad group',
    matchType: 'Exact match'
  },
  {
    id: '6',
    negativeKeyword: 'coursera',
    addedTo: 'Search 9th Oct',
    level: 'Campaign',
    matchType: 'Broad match'
  },
  {
    id: '7',
    negativeKeyword: 'crack',
    addedTo: 'Search 9th Oct',
    level: 'Campaign',
    matchType: 'Broad match'
  },
  {
    id: '8',
    negativeKeyword: 'definition',
    addedTo: 'Search 9th Oct',
    level: 'Campaign',
    matchType: 'Broad match'
  }
];

const urlInclusionsData: URLInclusion[] = [];

// Chart data points for the performance graph
const chartDataPoints = [
  { x: 50, y: 100 }, { x: 100, y: 60 }, { x: 150, y: 50 }, { x: 200, y: 90 },
  { x: 250, y: 100 }, { x: 300, y: 110 }, { x: 350, y: 120 }, { x: 400, y: 130 },
  { x: 450, y: 115 }, { x: 500, y: 105 }, { x: 550, y: 130 }, { x: 600, y: 140 },
  { x: 650, y: 150 }, { x: 700, y: 160 }, { x: 750, y: 165 }, { x: 800, y: 168 },
  { x: 850, y: 170 }, { x: 900, y: 168 }, { x: 950, y: 165 }, { x: 1000, y: 168 },
  { x: 1050, y: 170 }, { x: 1100, y: 168 }, { x: 1150, y: 170 }, { x: 1200, y: 168 },
  { x: 1250, y: 170 }, { x: 1300, y: 168 }, { x: 1350, y: 170 }
];

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────
export const KeywordsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'keywords' | 'negative' | 'urlInclusions' | 'urlExclusions'>('keywords');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('clicks');
  const [selectedComparison, setSelectedComparison] = useState('none');

  // Tab definitions
  const tabs = [
    { id: 'keywords' as const, label: 'Keywords' },
    { id: 'negative' as const, label: 'Negative keywords' },
    { id: 'urlInclusions' as const, label: 'URL inclusions' },
    { id: 'urlExclusions' as const, label: 'URL exclusions' }
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

  const toggleSelectAll = (dataLength: number) => {
    if (selectedRows.size === dataLength) {
      setSelectedRows(new Set());
    } else {
      const allIds = selectedTab === 'keywords' 
        ? keywordsData.map(r => r.id)
        : selectedTab === 'negative'
        ? negativeKeywordsData.map(r => r.id)
        : urlInclusionsData.map(r => r.id);
      setSelectedRows(new Set(allIds));
    }
  };

  // Render chart polyline points
  const getPolylinePoints = () => {
    return chartDataPoints.map(p => `${p.x},${p.y}`).join(' ');
  };

  // Render chart polygon points for area fill
  const getPolygonPoints = () => {
    const points = chartDataPoints.map(p => `${p.x},${p.y}`).join(' ');
    return `${points} 1350,256 50,256`;
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
              <h1 className="text-2xl font-normal text-gray-900">Keywords</h1>
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

      {/* Chart Section (Only for Keywords and URL Inclusions tabs) */}
      {(selectedTab === 'keywords' || selectedTab === 'urlInclusions') && (
        <div className="bg-white mx-6 mt-6 rounded border border-gray-200">
          {/* Chart Controls */}
          <div className="p-4 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-4">
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded text-sm bg-white flex items-center gap-2"
              >
                <option value="clicks">● Clicks</option>
                <option value="impressions">● Impressions</option>
                <option value="cost">● Cost</option>
              </select>
              
              <select 
                value={selectedComparison}
                onChange={(e) => setSelectedComparison(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded text-sm bg-white"
              >
                <option value="none">⊖ None</option>
                <option value="previous">Compare periods</option>
              </select>
            </div>
            
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <Filter className="w-4 h-4" />
              Adjust
            </button>
          </div>

          {/* Chart */}
          <div className="p-6 bg-gray-50">
            <div className="h-64 bg-white border border-gray-200 rounded relative">
              <svg className="w-full h-full" viewBox="0 0 1400 256" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="64" x2="1400" y2="64" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="128" x2="1400" y2="128" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="192" x2="1400" y2="192" stroke="#e5e7eb" strokeWidth="1" />
                
                {/* Weekend shading areas */}
                <rect x="200" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.5" />
                <rect x="500" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.5" />
                <rect x="800" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.5" />
                <rect x="1100" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.5" />
                
                {/* Area under the line */}
                <polygon
                  points={getPolygonPoints()}
                  fill="#2563eb"
                  opacity="0.1"
                />
                
                {/* Line graph */}
                <polyline
                  points={getPolylinePoints()}
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
              <div className="absolute left-2 top-2 text-xs text-gray-600">16</div>
              <div className="absolute left-2 top-1/4 text-xs text-gray-600">8</div>
              <div className="absolute left-2 bottom-12 text-xs text-gray-600">0</div>
            </div>
            
            <div className="flex justify-between mt-2 text-xs text-gray-600 px-4">
              <span>Nov 1, 2025</span>
              <span>Nov 28, 2025</span>
            </div>
          </div>
        </div>
      )}

      {/* Status Badge (Only for Keywords tab) */}
      {selectedTab === 'keywords' && (
        <div className="px-6 py-3 bg-white mt-6 mx-6 rounded border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-gray-700">Keyword status: Enabled, Paused</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 mt-6 mx-6 rounded-t border-t border-x">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">
              <Plus className="w-4 h-4" />
              Add filter
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <SearchIcon className="w-4 h-4" />
              Search
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
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
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Reports
            </button>
          </div>

          <div className="flex items-center gap-4">
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

      {/* Data Table */}
      <div className="px-6 pb-4 bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-b overflow-hidden">
          {/* Keywords Tab Table */}
          {selectedTab === 'keywords' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.size === keywordsData.length}
                      onChange={() => toggleSelectAll(keywordsData.length)}
                    />
                  </th>
                  <th className="px-4 py-3 text-left w-8">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    <div className="flex items-center gap-1">
                      Keyword
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Match type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Campaign</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Ad group</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Final URL</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Impr.</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">
                    <div className="flex items-center justify-end gap-1">
                      <ChevronDown className="w-4 h-4" />
                      Interact.
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {keywordsData.length > 0 ? (
                  keywordsData.map((keyword) => (
                    <tr key={keyword.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 cursor-pointer"
                          checked={selectedRows.has(keyword.id)}
                          onChange={() => toggleRowSelection(keyword.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      </td>
                      <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                        {keyword.keyword}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{keyword.matchType}</td>
                      <td className="px-4 py-3">
                        <a href="#" className="text-blue-600 hover:underline">{keyword.campaign}</a>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{keyword.adGroup}</td>
                      <td className="px-4 py-3 text-gray-700">{keyword.status}</td>
                      <td className="px-4 py-3 text-gray-700 truncate max-w-xs">
                        {keyword.finalUrl}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">{keyword.impressions ?? '—'}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{keyword.clicks ?? '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                      No keywords found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr className="font-medium">
                  <td colSpan={8} className="px-4 py-3 text-gray-900">
                    Total: Keywords at the ad group level (3)
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">646</td>
                  <td className="px-4 py-3 text-right text-gray-900">0</td>
                </tr>
              </tfoot>
            </table>
          )}

          {/* Negative Keywords Tab Table */}
          {selectedTab === 'negative' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.size === negativeKeywordsData.length}
                      onChange={() => toggleSelectAll(negativeKeywordsData.length)}
                    />
                  </th>
                  <th className="px-4 py-3 text-left w-8">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    <div className="flex items-center gap-1">
                      Negative keyword
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Added to</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Level</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Match type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {negativeKeywordsData.length > 0 ? (
                  negativeKeywordsData.map((keyword) => (
                    <tr key={keyword.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 cursor-pointer"
                          checked={selectedRows.has(keyword.id)}
                          onChange={() => toggleRowSelection(keyword.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      </td>
                      <td className="px-4 py-3 text-gray-900">{keyword.negativeKeyword}</td>
                      <td className="px-4 py-3">
                        <a href="#" className="text-blue-600 hover:underline">{keyword.addedTo}</a>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{keyword.level}</td>
                      <td className="px-4 py-3 text-gray-700">{keyword.matchType}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No negative keywords found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* URL Inclusions Tab Table */}
          {selectedTab === 'urlInclusions' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.size === urlInclusionsData.length}
                      onChange={() => toggleSelectAll(urlInclusionsData.length)}
                    />
                  </th>
                  <th className="px-4 py-3 text-left w-8">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    <div className="flex items-center gap-1">
                      URL inclusion
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Campaign</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Ad group</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Campaign type</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Impr.</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Interact.</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    You don't have any enabled URL inclusions
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {/* URL Exclusions Tab Table */}
          {selectedTab === 'urlExclusions' && (
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
                  <th className="px-4 py-3 text-left w-8">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    <div className="flex items-center gap-1">
                      URL exclusion status: All but removed
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-gray-500">
                        You don't have any enabled URL exclusions
                      </div>
                      <div className="text-sm text-gray-500 max-w-2xl">
                        <div className="bg-blue-50 border border-blue-200 rounded p-4 text-left">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Note:</span> URL exclusions help you control which pages from your website 
                            are excluded from generating ads. This feature is particularly useful for Dynamic Search Ads 
                            and Performance Max campaigns.
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Footer Info (Only for specific tabs) */}
      {(selectedTab === 'keywords' || selectedTab === 'urlInclusions') && (
        <div className="bg-blue-50 border-t border-blue-100 px-6 py-3 mt-6">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-900">
              {selectedTab === 'keywords' && (
                <>
                  <span className="font-medium">Optimize your keyword strategy:</span> Review your keywords regularly 
                  to ensure they align with your campaign goals. Use match types strategically and add negative keywords 
                  to filter out irrelevant traffic. Visit our{' '}
                  <a href="#" className="underline hover:text-blue-700">Keyword Guide</a> to learn more.
                </>
              )}
              {selectedTab === 'urlInclusions' && (
                <>
                  <span className="font-medium">Control your ad generation:</span> URL inclusions allow you to specify 
                  which pages from your website should be prioritized for ad generation. This helps ensure your most 
                  relevant content drives your ad campaigns. Learn more in our{' '}
                  <a href="#" className="underline hover:text-blue-700">Help Center</a>.
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Download, Maximize2, MoreVertical } from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
interface AudienceSegment {
  id: string;
  audienceSegment: string;
  campaign: string;
  adGroup: string;
  status: 'Eligible' | 'Paused' | 'Removed';
  level: 'Campaign' | 'Ad group';
  bidAdj?: string;
  impressions?: number;
}

interface DemographicData {
  category: string;
  clicks: number;
}

interface ExcludedSegment {
  id: string;
  excludedSegment: string;
  type: string;
  excludedFrom: string;
  level: 'Campaign' | 'Ad group';
}

// ──────────────────────────────────────────────────────────────
// Sample Data
// ──────────────────────────────────────────────────────────────
const audienceSegmentsData: AudienceSegment[] = [
  {
    id: '1',
    audienceSegment: 'Education > Technology & Computing',
    campaign: 'Search 9th Oct',
    adGroup: '—',
    status: 'Eligible',
    level: 'Campaign',
    bidAdj: '—',
    impressions: 0
  },
  {
    id: '2',
    audienceSegment: 'Education',
    campaign: 'Search 9th Oct',
    adGroup: '—',
    status: 'Eligible',
    level: 'Campaign',
    bidAdj: '—',
    impressions: 0
  }
];

const ageData: DemographicData[] = [
  { category: '18 - 24', clicks: 40 },
  { category: '25 - 34', clicks: 55 },
  { category: '35 - 44', clicks: 35 },
  { category: '45 - 54', clicks: 8 },
  { category: '55 - 64', clicks: 2 },
  { category: '65+', clicks: 1 },
  { category: 'Unknown', clicks: 130 }
];

const genderData: DemographicData[] = [
  { category: 'Male', clicks: 180 },
  { category: 'Female', clicks: 60 },
  { category: 'Unknown', clicks: 30 }
];

const householdIncomeData: DemographicData[] = [
  { category: 'Top 10%', clicks: 35 },
  { category: '11-20%', clicks: 28 },
  { category: '21-30%', clicks: 22 },
  { category: '31-40%', clicks: 18 },
  { category: '41-50%', clicks: 15 },
  { category: 'Lower 50%', clicks: 12 },
  { category: 'Unknown', clicks: 140 }
];

const exclusionsData: ExcludedSegment[] = [];

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────
export const AudiencesPage: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showAudienceTable, setShowAudienceTable] = useState(true);
  const [showDemographicsTable, setShowDemographicsTable] = useState(false);
  const [showExclusionsTable, setShowExclusionsTable] = useState(true);
  const [selectedDemographicTab, setSelectedDemographicTab] = useState<'age' | 'gender' | 'income'>('age');
  const [selectedMetric, setSelectedMetric] = useState('clicks');
  const [selectedComparison, setSelectedComparison] = useState('none');
  const [viewLevel, setViewLevel] = useState('adGroup');

  const demographicTabs = [
    { id: 'age' as const, label: 'Age' },
    { id: 'gender' as const, label: 'Gender' },
    { id: 'income' as const, label: 'Household income' }
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
      const allIds = audienceSegmentsData.map(r => r.id);
      setSelectedRows(new Set(allIds));
    }
  };

  // Get current demographic data
  const getCurrentDemographicData = () => {
    switch (selectedDemographicTab) {
      case 'age':
        return ageData;
      case 'gender':
        return genderData;
      case 'income':
        return householdIncomeData;
      default:
        return ageData;
    }
  };

  // Generate bar chart for demographics
  const renderDemographicChart = () => {
    const data = getCurrentDemographicData();
    const maxClicks = Math.max(...data.map(d => d.clicks));
    
    return (
      <div className="flex items-end justify-around h-64 px-8 py-4 bg-white">
        {data.map((item, idx) => {
          const heightPercent = (item.clicks / maxClicks) * 100;
          return (
            <div key={idx} className="flex flex-col items-center gap-2" style={{ width: `${100 / data.length}%` }}>
              <div className="relative w-full flex items-end justify-center" style={{ height: '200px' }}>
                <div 
                  className="bg-blue-600 rounded-t transition-all duration-300 hover:bg-blue-700"
                  style={{ 
                    height: `${heightPercent}%`,
                    width: '70%',
                    minHeight: item.clicks > 0 ? '8px' : '0px'
                  }}
                  title={`${item.clicks} clicks`}
                ></div>
              </div>
              <span className="text-xs text-gray-600 text-center">{item.category}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Chart for audience segments
  const renderAudienceSegmentChart = () => {
    // Sample data points for line chart
    const dataPoints = [
      { x: 50, y: 100 }, { x: 150, y: 50 }, { x: 250, y: 180 }, { x: 350, y: 40 },
      { x: 450, y: 130 }, { x: 550, y: 90 }, { x: 650, y: 40 }, { x: 750, y: 70 },
      { x: 850, y: 40 }, { x: 950, y: 100 }, { x: 1050, y: 180 }, { x: 1150, y: 50 },
      { x: 1250, y: 180 }, { x: 1350, y: 90 }
    ];

    return (
      <div className="h-64 bg-white relative">
        <svg className="w-full h-full" viewBox="0 0 1400 256" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="64" x2="1400" y2="64" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="0" y1="128" x2="1400" y2="128" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="0" y1="192" x2="1400" y2="192" stroke="#e5e7eb" strokeWidth="1" />
          
          {/* Weekend shading */}
          <rect x="200" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.5" />
          <rect x="500" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.5" />
          <rect x="800" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.5" />
          <rect x="1100" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.5" />
          
          {/* Line graph */}
          <polyline
            points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Data points */}
          {dataPoints.map((point, idx) => (
            <circle key={idx} cx={point.x} cy={point.y} r="3" fill="#2563eb" />
          ))}
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-2 top-2 text-xs text-gray-600">6</div>
        <div className="absolute left-2 top-1/3 text-xs text-gray-600">3</div>
        <div className="absolute left-2 bottom-12 text-xs text-gray-600">0</div>
      </div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-normal text-gray-900">Audiences</h1>
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

      {/* Audience Segments Section */}
      <div className="bg-white mx-6 mt-6 rounded border border-gray-200">
        <div className="px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Audience segments</h2>
        </div>

        {/* Chart Controls */}
        <div className="px-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select 
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded text-sm bg-white flex items-center gap-2"
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
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Chart type
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Adjust
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="border-t border-gray-200">
          {renderAudienceSegmentChart()}
          <div className="flex justify-between px-6 py-2 text-xs text-gray-600 bg-gray-50">
            <span>Nov 1, 2025</span>
            <span>Nov 28, 2025</span>
          </div>
        </div>

        {/* Toggle Table */}
        <div className="border-t border-gray-200">
          <button
            onClick={() => setShowAudienceTable(!showAudienceTable)}
            className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              {showAudienceTable ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
              <span className="text-sm text-gray-700">{showAudienceTable ? 'Hide' : 'Show'} table</span>
            </div>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Edit audience segments
            </button>
          </button>
        </div>

        {/* Table */}
        {showAudienceTable && (
          <div className="border-t border-gray-200">
            {/* Action Bar */}
            <div className="px-6 py-3 bg-white flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                  <Filter className="w-4 h-4" />
                  Add filter
                </button>
                
                <select 
                  value={viewLevel}
                  onChange={(e) => setViewLevel(e.target.value)}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white border-none"
                >
                  <option value="adGroup">Ad group view</option>
                  <option value="campaign">Campaign view</option>
                  <option value="account">Account view</option>
                </select>
              </div>
              
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
                
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Data Table */}
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.size === audienceSegmentsData.length}
                      onChange={() => toggleSelectAll(audienceSegmentsData.length)}
                    />
                  </th>
                  <th className="px-4 py-3 text-left w-8">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Audience segment
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Campaign</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Ad group</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Level</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Bid adj.</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Impr.</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {audienceSegmentsData.map((segment) => (
                  <tr key={segment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 cursor-pointer"
                        checked={selectedRows.has(segment.id)}
                        onChange={() => toggleRowSelection(segment.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{segment.audienceSegment}</td>
                    <td className="px-4 py-3">
                      <a href="#" className="text-blue-600 hover:underline">{segment.campaign}</a>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{segment.adGroup}</td>
                    <td className="px-4 py-3 text-gray-700">{segment.status}</td>
                    <td className="px-4 py-3 text-gray-700">{segment.level}</td>
                    <td className="px-4 py-3 text-gray-700">{segment.bidAdj}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{segment.impressions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Demographics Section */}
      <div className="bg-white mx-6 mt-6 rounded border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Demographics</h2>
        </div>

        {/* Demographic Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {demographicTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedDemographicTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                selectedDemographicTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chart Controls */}
        <div className="px-6 py-4 flex items-center justify-end gap-4">
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm bg-white"
          >
            <option value="clicks">■ Clicks</option>
            <option value="impressions">■ Impressions</option>
            <option value="cost">■ Cost</option>
          </select>
          
          <select 
            value={selectedComparison}
            onChange={(e) => setSelectedComparison(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm bg-white"
          >
            <option value="none">■ None</option>
            <option value="previous">Compare periods</option>
          </select>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            Chart type
          </button>
        </div>

        {/* Bar Chart */}
        <div className="border-t border-gray-200">
          {renderDemographicChart()}
        </div>

        {/* Toggle Table */}
        <div className="border-t border-gray-200">
          <button
            onClick={() => setShowDemographicsTable(!showDemographicsTable)}
            className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              {showDemographicsTable ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
              <span className="text-sm text-gray-700">{showDemographicsTable ? 'Hide' : 'Show'} table</span>
            </div>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Edit demographics
            </button>
          </button>
        </div>
      </div>

      {/* Exclusions Section */}
      <div className="bg-white mx-6 mt-6 mb-6 rounded border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Exclusions</h2>
        </div>

        {/* Toggle Table */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setShowExclusionsTable(!showExclusionsTable)}
            className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              {showExclusionsTable ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
              <span className="text-sm text-gray-700">{showExclusionsTable ? 'Hide' : 'Show'} table</span>
            </div>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Edit exclusions
            </button>
          </button>
        </div>

        {/* Table */}
        {showExclusionsTable && (
          <div className="border-t border-gray-200">
            {/* Action Bar */}
            <div className="px-6 py-3 bg-white flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                  <Filter className="w-4 h-4" />
                  Add filter
                </button>
                
                <select 
                  value={viewLevel}
                  onChange={(e) => setViewLevel(e.target.value)}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white border-none"
                >
                  <option value="adGroup">Ad group view</option>
                  <option value="campaign">Campaign view</option>
                  <option value="account">Account view</option>
                </select>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  Segment
                </button>
                
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Data Table */}
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
                      Excluded segment
                      <ChevronUp className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    <div className="flex items-center gap-1">
                      Type
                      <ChevronUp className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Excluded from</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Level</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-gray-500">
                        You don't have any exclusions
                      </div>
                      <div className="text-sm text-gray-500 max-w-2xl">
                        <div className="bg-blue-50 border border-blue-200 rounded p-4 text-left">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Tip:</span> Use audience exclusions to prevent your ads 
                            from showing to specific segments that may not be relevant to your business. This helps 
                            you focus your budget on the audiences most likely to convert.
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 border-t border-blue-100 px-6 py-3">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-900">
            <span className="font-medium">Optimize your audience targeting:</span> Use audience segments 
            to reach people based on their interests, habits, and how they've interacted with your business. 
            Combine demographic targeting with exclusions to refine your reach and improve campaign performance. 
            Learn more in our{' '}
            <a href="#" className="underline hover:text-blue-700">Audience Targeting Guide</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

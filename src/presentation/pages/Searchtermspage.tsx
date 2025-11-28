import { useState } from 'react';
import { ChevronDown, Filter, Download, Maximize2, HelpCircle } from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
interface SearchTerm {
  id: string;
  searchTerm: string;
  matchType: string;
  addedExcluded: string;
  campaign: string;
  adGroup: string;
  impressions: number;
  interactions: number;
  interactionRate: string;
  avgCost: string;
}

// ──────────────────────────────────────────────────────────────
// Sample Data
// ──────────────────────────────────────────────────────────────
const searchTermsData: SearchTerm[] = [
  {
    id: '1',
    searchTerm: 'data analytics courses fees',
    matchType: 'AI Max',
    addedExcluded: 'None',
    campaign: 'Search 9th Oct',
    adGroup: 'AI Courses in Chandigarh | Learn Artificial Intelligence',
    impressions: 86,
    interactions: 39,
    interactionRate: '45.35%',
    avgCost: '₹3.36'
  },
  {
    id: '2',
    searchTerm: 'data analytics course with placement',
    matchType: 'AI Max',
    addedExcluded: 'None',
    campaign: 'Search 9th Oct',
    adGroup: 'AI Courses in Chandigarh | Learn Artificial Intelligence',
    impressions: 94,
    interactions: 37,
    interactionRate: '39.36%',
    avgCost: '₹3.18'
  },
  {
    id: '3',
    searchTerm: 'data analytics course online',
    matchType: 'AI Max',
    addedExcluded: 'None',
    campaign: 'Search 9th Oct',
    adGroup: 'AI Courses in Chandigarh | Learn Artificial Intelligence',
    impressions: 33,
    interactions: 15,
    interactionRate: '45.45%',
    avgCost: '₹3.46'
  },
  {
    id: '4',
    searchTerm: 'ai classes for beginners',
    matchType: 'Exact match (close variant)',
    addedExcluded: 'None',
    campaign: 'Search 9th Oct',
    adGroup: 'AI Courses in Chandigarh | Learn Artificial Intelligence',
    impressions: 18,
    interactions: 2,
    interactionRate: '11.11%',
    avgCost: '₹4.36'
  },
  {
    id: '5',
    searchTerm: 'ai course in chandigarh with fees',
    matchType: 'AI Max',
    addedExcluded: 'None',
    campaign: 'Search 9th Oct',
    adGroup: 'AI Courses in Chandigarh | Learn Artificial Intelligence',
    impressions: 2,
    interactions: 2,
    interactionRate: '100.00%',
    avgCost: '₹29.00'
  },
  {
    id: '6',
    searchTerm: 'ai classes near me',
    matchType: 'Exact match',
    addedExcluded: '✓ Added',
    campaign: 'Search 9th Oct',
    adGroup: 'AI Courses in Chandigarh | Learn Artificial Intelligence',
    impressions: 2,
    interactions: 1,
    interactionRate: '50.00%',
    avgCost: '₹0.79'
  },
  {
    id: '7',
    searchTerm: 'data science course in chandigarh',
    matchType: 'Exact match',
    addedExcluded: '✓ Added',
    campaign: 'Search 9th Oct',
    adGroup: 'AI Courses in Chandigarh | Learn Artificial Intelligence',
    impressions: 5,
    interactions: 1,
    interactionRate: '20.00%',
    avgCost: '₹0.34'
  }
];

// Chart data
const chartDataPoints = [
  { x: 100, y: 215 }, { x: 200, y: 220 }, { x: 300, y: 235 }, { x: 400, y: 250 },
  { x: 500, y: 305 }, { x: 600, y: 320 }, { x: 700, y: 315 }, { x: 800, y: 325 },
  { x: 900, y: 325 }, { x: 1000, y: 330 }, { x: 1100, y: 330 }, { x: 1200, y: 328 },
  { x: 1300, y: 330 }, { x: 1400, y: 328 }, { x: 1500, y: 330 }, { x: 1600, y: 328 },
  { x: 1700, y: 330 }
];

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────
export const SearchTermsPage: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedMetric, setSelectedMetric] = useState('clicks');
  const [selectedComparison, setSelectedComparison] = useState('none');

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
    if (selectedRows.size === searchTermsData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(searchTermsData.map(r => r.id)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-normal text-gray-900">Search terms</h1>
              <button className="text-gray-400 hover:text-gray-600">
                <HelpCircle className="w-5 h-5" />
              </button>
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
            <div className="absolute left-2 top-2 text-xs text-gray-600">40</div>
            <div className="absolute left-2 top-1/3 text-xs text-gray-600">20</div>
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
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <Filter className="w-4 h-4" />
              Add filter
            </button>
            
            <button className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-2">
              Search terms
              <ChevronDown className="w-4 h-4" />
            </button>
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
        <div className="bg-white border border-gray-200 border-t-0 rounded-b overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 cursor-pointer"
                    checked={selectedRows.size === searchTermsData.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Search term</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Match type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Added/Excluded</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Campaign</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Ad group</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Impr.</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">
                  <div className="flex items-center justify-end gap-1">
                    <ChevronDown className="w-4 h-4" />
                    Interacti.
                  </div>
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Interaction rate</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Avg. cost</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {/* Total Row */}
              <tr className="bg-gray-50 font-medium border-b border-gray-200">
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 flex items-center gap-2 text-gray-900">
                  Total: Search te...
                  <button className="text-gray-400 hover:text-gray-600">
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-gray-900">635</td>
                <td className="px-4 py-3 text-right text-gray-900">
                  110
                  <div className="text-xs text-gray-500">clicks</div>
                </td>
                <td className="px-4 py-3 text-right text-gray-900">17.32%</td>
                <td className="px-4 py-3 text-right text-gray-900">₹3.70</td>
              </tr>
              
              {/* Data Rows */}
              {searchTermsData.map((term) => (
                <tr key={term.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.has(term.id)}
                      onChange={() => toggleRowSelection(term.id)}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-900">{term.searchTerm}</td>
                  <td className="px-4 py-3 text-gray-700">{term.matchType}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {term.addedExcluded.includes('✓') ? (
                      <span className="text-green-600">{term.addedExcluded}</span>
                    ) : (
                      term.addedExcluded
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <a href="#" className="text-blue-600 hover:underline">{term.campaign}</a>
                  </td>
                  <td className="px-4 py-3">
                    <a href="#" className="text-blue-600 hover:underline">{term.adGroup}</a>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{term.impressions}</td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {term.interactions}
                    <div className="text-xs text-gray-500">clicks</div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{term.interactionRate}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{term.avgCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 border-t border-blue-100 px-6 py-3 mt-6">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-900">
            <span className="font-medium">Optimize with search terms:</span> Review your search terms report 
            regularly to identify high-performing keywords to add to your campaigns and irrelevant terms to 
            exclude as negative keywords. This helps improve your targeting and reduce wasted spend. Learn more 
            about{' '}
            <a href="#" className="underline hover:text-blue-700">search terms best practices</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
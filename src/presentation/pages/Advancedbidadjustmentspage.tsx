import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Download, Maximize2, MoreVertical } from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
interface BidAdjustment {
  id: string;
  interactionType: string;
  campaign: string;
  bidAdj: string;
  impressions: number;
  interactionRate: string;
  avgCost: string;
  cost: string;
  interactionCoverage: string;
  convRate: string;
  conversions: number;
  costPerConv: string;
}

// ──────────────────────────────────────────────────────────────
// Sample Data
// ──────────────────────────────────────────────────────────────
const bidAdjustmentsData: BidAdjustment[] = [
  {
    id: '1',
    interactionType: 'Calls',
    campaign: 'Search 9th Oct',
    bidAdj: '—',
    impressions: 508,
    interactionRate: '8.27%',
    avgCost: '₹8.31',
    cost: '₹349.22',
    interactionCoverage: '77.44%',
    convRate: '0.00%',
    conversions: 0.00,
    costPerConv: '₹0.00'
  }
];

const summaryData = [
  {
    id: 'total-interactions',
    label: 'Total: Interactions',
    impressions: 508,
    interactionRate: '8.27%',
    avgCost: '₹8.31',
    cost: '₹349.22',
    interactionCoverage: '77.44%',
    convRate: '0.00%',
    conversions: 0.00,
    costPerConv: '₹0.00'
  },
  {
    id: 'total-account',
    label: 'Total: Account',
    impressions: 1994,
    interactionRate: '11.99%',
    avgCost: '₹7.09',
    cost: '₹1,695.56',
    interactionCoverage: '77.44%',
    convRate: '6.28%',
    conversions: 15.00,
    costPerConv: '₹113.04'
  },
  {
    id: 'total-search',
    label: 'Total: Search campaigns',
    impressions: 1994,
    interactionRate: '11.99%',
    avgCost: '₹7.09',
    cost: '₹1,695.56',
    interactionCoverage: '77.44%',
    convRate: '6.28%',
    conversions: 15.00,
    costPerConv: '₹113.04'
  },
  {
    id: 'total-performance',
    label: 'Total: Performance Max campaigns',
    impressions: 0,
    interactionRate: '—',
    avgCost: '—',
    cost: '₹0.00',
    interactionCoverage: '—',
    convRate: '0.00%',
    conversions: 0.00,
    costPerConv: '₹0.00'
  }
];

// Chart data for line graph
const chartDataPoints = [
  { x: 80, y: 160 }, { x: 160, y: 140 }, { x: 240, y: 145 }, { x: 320, y: 160 },
  { x: 400, y: 180 }, { x: 480, y: 200 }, { x: 560, y: 225 }, { x: 640, y: 215 },
  { x: 720, y: 210 }, { x: 800, y: 180 }, { x: 880, y: 70 }, { x: 960, y: 50 },
  { x: 1040, y: 30 }, { x: 1120, y: 80 }, { x: 1200, y: 100 }, { x: 1280, y: 200 },
  { x: 1360, y: 220 }, { x: 1440, y: 230 }, { x: 1520, y: 225 }, { x: 1600, y: 210 },
  { x: 1680, y: 200 }, { x: 1760, y: 210 }
];

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────
export const AdvancedBidAdjustmentsPage: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedMetric, setSelectedMetric] = useState('interactions');
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
    if (selectedRows.size === bidAdjustmentsData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(bidAdjustmentsData.map(r => r.id)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-normal text-gray-900">Advanced bid adjustments</h1>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded text-sm">
                <span className="text-gray-600">View (2 filters)</span>
                <div className="flex items-center gap-1 text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span>All campaigns</span>
                </div>
              </div>
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

      {/* Chart Section */}
      <div className="bg-white mx-6 mt-6 rounded border border-gray-200">
        {/* Chart Controls */}
        <div className="px-6 py-4 flex items-center justify-end gap-4 border-b border-gray-200">
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm bg-white"
          >
            <option value="interactions">▬ Interactions</option>
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
        <div className="p-6 bg-white">
          <div className="h-64 bg-white border-b border-gray-200 relative">
            <svg className="w-full h-full" viewBox="0 0 1800 256" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="64" x2="1800" y2="64" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="128" x2="1800" y2="128" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="192" x2="1800" y2="192" stroke="#e5e7eb" strokeWidth="1" />
              
              {/* Weekend shading */}
              <rect x="250" y="0" width="120" height="256" fill="#f3f4f6" opacity="0.5" />
              <rect x="620" y="0" width="120" height="256" fill="#f3f4f6" opacity="0.5" />
              <rect x="990" y="0" width="120" height="256" fill="#f3f4f6" opacity="0.5" />
              <rect x="1360" y="0" width="120" height="256" fill="#f3f4f6" opacity="0.5" />
              
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
            <div className="absolute left-2 top-2 text-xs text-gray-600">12</div>
            <div className="absolute left-2 top-1/3 text-xs text-gray-600">6</div>
            <div className="absolute left-2 bottom-2 text-xs text-gray-600">0</div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-600 px-4">
            <span>Nov 1, 2025</span>
            <span>Nov 28, 2025</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 mx-6 border-x">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <Filter className="w-4 h-4" />
              Add filter
            </button>
          </div>

          <div className="flex items-center gap-4">
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
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="px-6 pb-4 bg-gray-50">
        <div className="bg-white border border-gray-200 border-t-0 rounded-b overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 cursor-pointer"
                    checked={selectedRows.size === bidAdjustmentsData.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  <div className="flex items-center gap-1">
                    Interaction type
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Campaign</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Bid adj.</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Impr.</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">
                  Interaction rate
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Avg. cost</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Cost</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">
                  Inter. coverage
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Conv. rate</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Conversions</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Cost / conv.</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {bidAdjustmentsData.map((adjustment) => (
                <tr key={adjustment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.has(adjustment.id)}
                      onChange={() => toggleRowSelection(adjustment.id)}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-900">{adjustment.interactionType}</td>
                  <td className="px-4 py-3">
                    <a href="#" className="text-blue-600 hover:underline">{adjustment.campaign}</a>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{adjustment.bidAdj}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{adjustment.impressions}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{adjustment.interactionRate}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{adjustment.avgCost}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{adjustment.cost}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{adjustment.interactionCoverage}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{adjustment.convRate}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{adjustment.conversions.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{adjustment.costPerConv}</td>
                </tr>
              ))}
              
              {/* Summary Rows */}
              {summaryData.map((summary) => (
                <tr key={summary.id} className="bg-gray-50 font-medium border-b border-gray-200">
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-gray-900 flex items-center gap-2">
                    {summary.label}
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right text-gray-900">{summary.impressions}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{summary.interactionRate}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{summary.avgCost}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{summary.cost}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{summary.interactionCoverage}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{summary.convRate}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{summary.conversions.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{summary.costPerConv}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
            <span className="text-sm text-gray-600">1 - 1 of 1</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 border-t border-blue-100 px-6 py-3 mt-6">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-900">
            <span className="font-medium">Optimize with advanced bid adjustments:</span> Use interaction-based 
            bid adjustments to increase or decrease your bids for specific interaction types like calls, store visits, 
            or app installs. This helps you focus your budget on the interactions that matter most to your business. 
            Learn more in our{' '}
            <a href="#" className="underline hover:text-blue-700">Bid Adjustments Guide</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Download, Maximize2 } from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
interface LandingPage {
  id: string;
  landingPage: string;
  selectedBy: string;
  mobileSpeedScore: string;
  mobileFriendlyClickRate: string;
  validAmpClickRate: string;
  clicks: number;
  impressions: number;
  ctr: string;
  avgCpc: string;
  cost: string;
}

// ──────────────────────────────────────────────────────────────
// Sample Data
// ──────────────────────────────────────────────────────────────
const landingPagesData: LandingPage[] = [
  {
    id: '1',
    landingPage: 'https://aiinfoxtech.com/',
    selectedBy: 'Advertiser selected',
    mobileSpeedScore: '—',
    mobileFriendlyClickRate: '—',
    validAmpClickRate: '—',
    clicks: 137,
    impressions: 1929,
    ctr: '7.10%',
    avgCpc: '₹8.79',
    cost: '₹1,203.77'
  },
  {
    id: '2',
    landingPage: 'https://aiinfoxtech.com/programs/mobile-app-development',
    selectedBy: 'Advertiser selected',
    mobileSpeedScore: '—',
    mobileFriendlyClickRate: '—',
    validAmpClickRate: '—',
    clicks: 44,
    impressions: 369,
    ctr: '11.92%',
    avgCpc: '₹2.40',
    cost: '₹105.47'
  },
  {
    id: '3',
    landingPage: 'https://aiinfoxtech.com/contact',
    selectedBy: 'Advertiser selected',
    mobileSpeedScore: '—',
    mobileFriendlyClickRate: '—',
    validAmpClickRate: '—',
    clicks: 5,
    impressions: 282,
    ctr: '1.77%',
    avgCpc: '₹2.01',
    cost: '₹10.07'
  },
  {
    id: '4',
    landingPage: 'https://aiinfoxtech.com/',
    selectedBy: 'Automatically selected',
    mobileSpeedScore: '—',
    mobileFriendlyClickRate: '—',
    validAmpClickRate: '—',
    clicks: 4,
    impressions: 45,
    ctr: '8.89%',
    avgCpc: '₹2.32',
    cost: '₹9.29'
  },
  {
    id: '5',
    landingPage: 'https://aiinfoxtech.com/programs/generative-ai-training',
    selectedBy: 'Advertiser selected',
    mobileSpeedScore: '—',
    mobileFriendlyClickRate: '—',
    validAmpClickRate: '—',
    clicks: 3,
    impressions: 336,
    ctr: '0.89%',
    avgCpc: '₹3.06',
    cost: '₹9.18'
  }
];

// Chart data
const chartDataPoints = [
  { x: 100, y: 250 }, { x: 200, y: 180 }, { x: 300, y: 320 }, { x: 400, y: 315 },
  { x: 500, y: 320 }, { x: 600, y: 310 }, { x: 700, y: 305 }, { x: 800, y: 350 },
  { x: 900, y: 370 }, { x: 1000, y: 320 }, { x: 1100, y: 340 }, { x: 1200, y: 325 },
  { x: 1300, y: 328 }, { x: 1400, y: 330 }, { x: 1500, y: 335 }, { x: 1600, y: 330 },
  { x: 1700, y: 328 }
];

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────
export const LandingPagesPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'landing' | 'expanded'>('landing');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedMetric, setSelectedMetric] = useState('clicks');
  const [selectedComparison, setSelectedComparison] = useState('none');
  const [showBanner, setShowBanner] = useState(true);

  const tabs = [
    { id: 'landing' as const, label: 'Landing pages' },
    { id: 'expanded' as const, label: 'Expanded landing pages' }
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
    if (selectedRows.size === landingPagesData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(landingPagesData.map(r => r.id)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-normal text-gray-900">Landing pages</h1>
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

      {/* Info Banner */}
      <div className="bg-gray-100 border-b border-gray-200 px-6 py-3">
        <p className="text-sm text-gray-700">
          We reserve the right to direct HTTP clicks to HTTPS on occasion.{' '}
          <a href="#" className="text-blue-600 hover:underline">Learn more about HTTPS</a>
        </p>
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
        {/* Loading Banner */}
        {showBanner && (
          <div className="mb-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded flex items-center justify-between">
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
              <ChevronUp className="w-5 h-5" />
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
                    checked={selectedRows.size === landingPagesData.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Landing page</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Selected by</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Mobile speed score</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Mobile-friendly click rate</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Valid AMP click rate</th>
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
              {/* Total Row */}
              <tr className="bg-gray-50 font-medium border-b border-gray-200">
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-gray-900">Total: Landing pages</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-gray-900">—</td>
                <td className="px-4 py-3 text-gray-900">—</td>
                <td className="px-4 py-3 text-gray-900">—</td>
                <td className="px-4 py-3 text-right text-gray-900">141</td>
                <td className="px-4 py-3 text-right text-gray-900">1,994</td>
                <td className="px-4 py-3 text-right text-gray-900">7.07%</td>
                <td className="px-4 py-3 text-right text-gray-900">₹8.60</td>
                <td className="px-4 py-3 text-right text-gray-900">₹1,213.06</td>
              </tr>
              
              {/* Data Rows */}
              {landingPagesData.map((page) => (
                <tr key={page.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.has(page.id)}
                      onChange={() => toggleRowSelection(page.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <a href="#" className="text-blue-600 hover:underline break-all">{page.landingPage}</a>
                    <div className="text-xs text-blue-600 hover:underline mt-1">
                      View expanded landing pages
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{page.selectedBy}</td>
                  <td className="px-4 py-3 text-gray-700">{page.mobileSpeedScore}</td>
                  <td className="px-4 py-3 text-gray-700">{page.mobileFriendlyClickRate}</td>
                  <td className="px-4 py-3 text-gray-700">{page.validAmpClickRate}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{page.clicks}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{page.impressions}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{page.ctr}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{page.avgCpc}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{page.cost}</td>
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
            <span className="font-medium">Optimize your landing page performance:</span> Review which landing 
            pages are driving the most clicks and conversions. Ensure your landing pages load quickly on mobile 
            devices and provide a good user experience. Use the mobile speed score and mobile-friendly metrics 
            to identify pages that need improvement. Learn more about{' '}
            <a href="#" className="underline hover:text-blue-700">landing page optimization</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

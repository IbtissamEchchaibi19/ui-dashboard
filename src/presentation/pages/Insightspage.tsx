import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Download, TrendingUp, TrendingDown } from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
interface Campaign {
  id: string;
  name: string;
  status: string;
}

interface BudgetInsight {
  id: string;
  campaign: string;
  budget: string;
  insights: string;
  takeAction: string;
  costToDate: string;
  monthlyCostForecast: string;
  monthlySpendingLimit: string;
  monthlyConvForecast: string;
}

interface CampaignInsight {
  id: string;
  campaign: string;
  status: string;
  topPerformanceInsights: string;
  cost: string;
}

interface SearchCategory {
  id: string;
  searchCategory: string;
  clicks: string;
  searchVolume: string;
  isExpanded?: boolean;
}

// ──────────────────────────────────────────────────────────────
// Sample Data
// ──────────────────────────────────────────────────────────────
const campaigns: Campaign[] = [
  { id: '1', name: 'Search 9th Oct', status: 'Eligible' }
];

const budgetInsights: BudgetInsight[] = [
  {
    id: '1',
    campaign: 'Search 9th Oct',
    budget: '₹10.00/day',
    insights: 'On track',
    takeAction: 'No action needed',
    costToDate: '₹1,695.56',
    monthlyCostForecast: '₹1,642.11',
    monthlySpendingLimit: '₹1,642.11',
    monthlyConvForecast: ''
  }
];

const campaignInsights: CampaignInsight[] = [
  {
    id: '1',
    campaign: 'Search 9th Oct',
    status: 'Eligible',
    topPerformanceInsights: 'Advertisers participating in your auction changed +3 more',
    cost: '₹70.01 (-52%)'
  }
];

const searchCategories: SearchCategory[] = [
  {
    id: '1',
    searchCategory: 'data science course in chandigarh',
    clicks: '3 (+200%)',
    searchVolume: '100-1K (+0%)',
    isExpanded: false
  },
  {
    id: '2',
    searchCategory: 'ai course in chandigarh with fees',
    clicks: '1 (-67%)',
    searchVolume: '100-1K (-21%)',
    isExpanded: false
  },
  {
    id: '3',
    searchCategory: 'ai training center near me',
    clicks: '1 (+∞)',
    searchVolume: '100-1K (-4%)',
    isExpanded: false
  },
  {
    id: '4',
    searchCategory: 'ai and ml course near me',
    clicks: '0 (+0%)',
    searchVolume: '10K-100K (+5%)',
    isExpanded: false
  },
  {
    id: '5',
    searchCategory: 'ai institute chandigarh',
    clicks: '0 (+0%)',
    searchVolume: '1K-10K (-4%)',
    isExpanded: false
  }
];

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────
export const InsightsPage: React.FC = () => {
  const [showCampaignDetails, setShowCampaignDetails] = useState(true);
  const [showBudgetInsights, setShowBudgetInsights] = useState(true);
  const [showOverallPerformance, setShowOverallPerformance] = useState(true);
  const [showPerformanceHighlights, setShowPerformanceHighlights] = useState(true);
  const [showCampaignsWithInsights, setShowCampaignsWithInsights] = useState(true);
  const [showSearchCategories, setShowSearchCategories] = useState(true);
  
  const [selectedBudgetFilter, setSelectedBudgetFilter] = useState('all');
  const [selectedPerformanceTab, setSelectedPerformanceTab] = useState('campaigns');
  const [selectedTimeRange, setSelectedTimeRange] = useState('last7days');
  const [selectedMetric, setSelectedMetric] = useState('clicks');

  const budgetFilters = [
    { id: 'all', label: 'All' },
    { id: 'limited', label: 'Limited by budget' },
    { id: 'remaining', label: 'Budget remaining' },
    { id: 'ontrack', label: 'On track' }
  ];

  const performanceTabs = [
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'portfolios', label: 'Portfolios' },
    { id: 'conversion', label: 'Conversion goals' },
    { id: 'landing', label: 'Landing pages' },
    { id: 'locations', label: 'Targeted locations' },
    { id: 'schedule', label: 'When your ads showed' },
    { id: 'devices', label: 'Devices' }
  ];

  // Chart data for overall performance
  const performanceChartData = [
    { x: 80, y: 600, y2: 600 },
    { x: 200, y: 285, y2: 315 },
    { x: 320, y: 20, y2: 100 },
    { x: 440, y: 455, y2: 520 },
    { x: 560, y: 80, y2: 550 },
    { x: 680, y: 80, y2: 560 },
    { x: 800, y: 80, y2: 560 },
    { x: 920, y: 80, y2: 560 },
    { x: 1040, y: 80, y2: 560 },
    { x: 1160, y: 80, y2: 550 },
    { x: 1280, y: 80, y2: 560 },
    { x: 1400, y: 80, y2: 570 },
    { x: 1520, y: 80, y2: 580 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-normal text-gray-900">Insights</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Last 7 days</span>
              
              <select className="px-3 py-2 border border-gray-300 rounded text-sm bg-white">
                <option>Nov 21 – 27, 2025</option>
              </select>
              
              <button className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50">
                Save
              </button>
            </div>
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            Compared: Nov 14 – 20, 2025
          </div>
        </div>
      </div>

      {/* Campaign Performance Card */}
      <div className="mx-6 mt-6 bg-white rounded-lg border border-gray-200">
        <button
          onClick={() => setShowCampaignDetails(!showCampaignDetails)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
        >
          <h2 className="text-base font-medium text-gray-900">See how your latest campaigns are doing</h2>
          {showCampaignDetails ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
        </button>
        
        {showCampaignDetails && (
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <div>
                  <a href="#" className="text-blue-600 hover:underline font-medium">Search 9th Oct</a>
                  <div className="text-sm text-gray-500">Eligible</div>
                </div>
              </div>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">
                View details
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Budget Pacing Insights */}
      <div className="mx-6 mt-6 bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <h2 className="text-base font-medium text-gray-900">Budget pacing insights</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
            </svg>
            <span>Nov 1 – 30, 2025</span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Review campaign budget utilization and performance forecasts for this month
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            To help get the best results, take quick action if you see unused or limited budgets.
          </p>

          {/* Budget Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {budgetFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedBudgetFilter(filter.id)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  selectedBudgetFilter === filter.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
            <Filter className="w-4 h-4" />
            Add filter
          </button>

          {/* Budget Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Campaign and budget group</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Budget</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Insights</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Take action</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Cost to date</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Monthly cost forecast</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Monthly spending limit</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Monthly conv. forecast</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {budgetInsights.map((insight) => (
                  <tr key={insight.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <a href="#" className="text-blue-600 hover:underline">{insight.campaign}</a>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <div className="flex items-center gap-1">
                        {insight.budget}
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-green-600 font-medium">{insight.insights}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{insight.takeAction}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{insight.costToDate}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{insight.monthlyCostForecast}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{insight.monthlySpendingLimit}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{insight.monthlyConvForecast || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Overall Performance Chart */}
      <div className="mx-6 mt-6 bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <h2 className="text-base font-medium text-gray-900">Overall performance across campaigns</h2>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="timeRange" value="last7days" checked={selectedTimeRange === 'last7days'} onChange={() => setSelectedTimeRange('last7days')} className="text-blue-600" />
              <span className="text-sm text-gray-700">Last 7 days</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="timeRange" value="last28days" checked={selectedTimeRange === 'last28days'} onChange={() => setSelectedTimeRange('last28days')} className="text-blue-600" />
              <span className="text-sm text-gray-700">Last 28 days</span>
            </label>
          </div>
        </div>

        <div className="p-6">
          {/* Metrics Summary */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                Conversions (incl. proj...)
              </div>
              <div className="text-3xl font-medium text-gray-900">-100%</div>
              <div className="text-sm text-gray-600">Total: 0.00</div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                Cost
              </div>
              <div className="text-3xl font-medium text-gray-900">-52.09%</div>
              <div className="text-sm text-gray-600">Total: ₹70.01</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 mb-1">CPA (incl. projected)</div>
              <div className="text-3xl font-medium text-gray-900">₹0.00</div>
              <div className="text-sm text-gray-600">Current target: —</div>
              <div className="text-sm text-gray-600">Average target: —</div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-80 bg-white border border-gray-200 rounded relative">
            <svg className="w-full h-full" viewBox="0 0 1600 320" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="80" x2="1600" y2="80" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="160" x2="1600" y2="160" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="240" x2="1600" y2="240" stroke="#e5e7eb" strokeWidth="1" />
              
              {/* Vertical date line */}
              <line x1="720" y1="0" x2="720" y2="320" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
              <text x="720" y="280" fontSize="12" fill="#6b7280" textAnchor="middle">11/21</text>
              
              {/* Red line (Cost) */}
              <polyline
                points={performanceChartData.map(p => `${p.x},${p.y2}`).join(' ')}
                fill="none"
                stroke="#dc2626"
                strokeWidth="2"
              />
              
              {/* Blue line (Conversions) */}
              <polyline
                points={performanceChartData.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
              />
            </svg>
            
            {/* Y-axis labels */}
            <div className="absolute left-2 top-2 text-xs text-gray-600">2.00</div>
            <div className="absolute left-2 top-1/3 text-xs text-gray-600">1.00</div>
            <div className="absolute left-2 bottom-8 text-xs text-gray-600">0.00</div>
            
            <div className="absolute right-2 top-2 text-xs text-gray-600">₹100</div>
            <div className="absolute right-2 top-1/3 text-xs text-gray-600">₹50.00</div>
            <div className="absolute right-2 bottom-8 text-xs text-gray-600">₹0.00</div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-600 px-4">
            <span>Nov 14, 2025</span>
            <span>Nov 27, 2025</span>
          </div>
        </div>
      </div>

      {/* Performance Highlights */}
      <div className="mx-6 mt-6 bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          <h2 className="text-base font-medium text-gray-900">Performance highlights</h2>
          <div className="flex items-center gap-4 ml-auto">
            <label className="flex items-center gap-2">
              <input type="radio" name="perfTimeRange" checked className="text-blue-600" />
              <span className="text-sm text-gray-700">Last 7 days</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="perfTimeRange" className="text-blue-600" />
              <span className="text-sm text-gray-700">Last 28 days</span>
            </label>
            <select className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white">
              <option>Clicks</option>
              <option>Impressions</option>
              <option>Conversions</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Performance highlights in your account
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            View top performers and significant performance changes in your account
          </p>

          {/* Performance Tabs */}
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
            {performanceTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedPerformanceTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  selectedPerformanceTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Performance Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Top Performing */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">Top performing</div>
                  <div className="text-xs text-gray-500">Nov 21 – 27, 2025</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <a href="#" className="text-blue-600 hover:underline">Search 9th Oct</a>
                <span className="text-gray-900 font-medium">20</span>
              </div>
            </div>

            {/* Significant Increases */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Significant increases</div>
                  <div className="text-xs text-gray-500">Nov 21 – 27, 2025 compared to Nov 14 – 20, 2025</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <a href="#" className="text-blue-600 hover:underline">Search 9th Oct</a>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">+43%</span>
                  <span className="text-gray-500">(+6)</span>
                </div>
              </div>
            </div>

            {/* Significant Decreases */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Significant decreases</div>
                  <div className="text-xs text-gray-500">Nov 21 – 27, 2025 compared to Nov 14 – 20, 2025</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Your clicks are steady. We haven't detected any significant decreases.
              </div>
              <div className="mt-4 flex justify-center">
                <svg className="w-24 h-24" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="#e5e7eb" />
                  <path d="M50 10 A 40 40 0 0 1 85 50" fill="#fbbf24" />
                  <path d="M85 50 A 40 40 0 0 1 50 90" fill="#3b82f6" />
                  <path d="M50 90 A 40 40 0 0 1 15 50" fill="#f3f4f6" />
                  <path d="M30 70 L 35 65 L 40 70 L 50 60 L 45 65 Z" fill="#22c55e" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-6 text-right">
            <a href="#" className="text-blue-600 hover:underline font-medium">All campaigns</a>
          </div>
        </div>
      </div>

      {/* Campaigns with Performance Insights */}
      <div className="mx-6 mt-6 bg-white rounded-lg border border-gray-200">
        <button
          onClick={() => setShowCampaignsWithInsights(!showCampaignsWithInsights)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
        >
          <h2 className="text-base font-medium text-gray-900">Campaigns with performance insights</h2>
          {showCampaignsWithInsights ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
        </button>

        {showCampaignsWithInsights && (
          <div className="border-t border-gray-200">
            <div className="px-6 py-3 flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <button className="text-sm text-gray-600 hover:text-gray-900">Add filter</button>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Campaign</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Top performance insights</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {campaignInsights.map((insight) => (
                  <tr key={insight.id} className="border-b border-gray-100">
                    <td className="px-6 py-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                      <a href="#" className="text-blue-600 hover:underline">{insight.campaign}</a>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{insight.status}</td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 underline decoration-dotted cursor-help">
                        {insight.topPerformanceInsights}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-700">{insight.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show rows:</span>
                <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                  <option>5</option>
                  <option>10</option>
                  <option>25</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">1 - 1 of 1</span>
                <div className="flex gap-2">
                  <button className="p-1 text-gray-400" disabled>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="p-1 text-gray-400" disabled>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Term Categories */}
      <div className="mx-6 mt-6 mb-6 bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4">
          <h2 className="text-base font-medium text-gray-900 mb-2">
            Understand the search term categories your ads appeared against and your performance on each category
          </h2>
          <p className="text-sm text-gray-600">
            Top search categories can provide inspiration for your ads and business by revealing what your customers are searching for, the words they use to search, and what categories are growing and declining
          </p>
        </div>

        <div className="px-6 py-3 bg-blue-50 border-y border-blue-100">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-blue-900">Historical data is available starting March 2023</span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <button className="text-sm text-gray-600 hover:text-gray-900">Add filter</button>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-blue-600 hover:underline text-sm font-medium">View detailed report</a>
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left w-10"></th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Search category</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  <div className="flex items-center gap-1">
                    Clicks
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Search volume</th>
                <th className="px-4 py-3 text-right w-24"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {searchCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{category.searchCategory}</td>
                  <td className="px-4 py-3 text-gray-700">{category.clicks}</td>
                  <td className="px-4 py-3 text-gray-700">{category.searchVolume}</td>
                  <td className="px-4 py-3 text-right">
                    <a href="#" className="text-blue-600 hover:underline text-sm">Details</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show rows:</span>
              <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                <option>5</option>
                <option>10</option>
                <option>25</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">1 - 5 of 8</span>
              <div className="flex gap-2">
                <button className="p-1 text-gray-400" disabled>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="p-1 text-gray-600 hover:text-gray-900">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
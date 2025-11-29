import { useState } from 'react';
import { ChevronDown, Filter, Download, Maximize2, HelpCircle } from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
interface AuctionInsight {
  id: string;
  displayUrlDomain: string;
  impressionShare: string;
  overlapRate: string;
  positionAboveRate: string;
  topOfPageRate: string;
  absTopOfPageRate: string;
  outrankingShare: string;
}

// ──────────────────────────────────────────────────────────────
// Sample Data
// ──────────────────────────────────────────────────────────────
const auctionInsightsData: AuctionInsight[] = [];

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────
export const AuctionInsightsPage: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchFilter, setSearchFilter] = useState('search');

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
    if (selectedRows.size === auctionInsightsData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(auctionInsightsData.map(r => r.id)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-normal text-gray-900">Auction insights</h1>
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

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 mx-6 mt-6 border-t border-x">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <Filter className="w-4 h-4" />
              Add filter
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-2">
              Search
              <ChevronDown className="w-4 h-4" />
            </button>

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
                <th className="px-4 py-3 text-left font-medium text-gray-700">Display URL domain</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  <div className="flex items-center gap-1">
                    <ChevronDown className="w-4 h-4" />
                    Impression share
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Overlap rate</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Position above rate</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Top of page rate</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Abs. Top of page rate</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Outranking share</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {auctionInsightsData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="max-w-2xl mx-auto">
                      <p className="text-gray-700 text-sm">
                        You don't have any auction insights because your Search impression share is less than 10% in your selected date range or filters.{' '}
                        <a href="#" className="text-blue-600 hover:underline">Learn more</a>
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-100 border-t border-gray-200 px-6 py-3 mt-6">
        <div className="flex items-start gap-2 text-sm text-gray-700">
          <a href="#" className="text-blue-600 hover:underline">Reporting is not real-time.</a>
          <span>Time zone for all dates and times: (GMT+05:30) India Standard Time.</span>
          <a href="#" className="text-blue-600 hover:underline">Learn more</a>
        </div>
        <p className="text-sm text-gray-700 mt-2">
          Some inventory may be provided through third party intermediaries.
        </p>
      </div>
    </div>
  );
};
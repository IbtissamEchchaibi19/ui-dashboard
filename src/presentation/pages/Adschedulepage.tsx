import { useState } from 'react';
import { ChevronDown, Filter, Download, Maximize2, Plus, Edit2 } from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
interface AdSchedule {
  id: string;
  dayAndTime: string;
  campaign: string;
  bidAdj: string;
  impressions: number;
  interactions: number;
  interactionRate: string;
  avgCost: string;
  cost: string;
  convRate: string;
  conversions: number;
  costPerConv: string;
}

// ──────────────────────────────────────────────────────────────
// Sample Data
// ──────────────────────────────────────────────────────────────
const adScheduleData: AdSchedule[] = [];

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────
export const AdSchedulePage: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-normal text-gray-900">Ad schedule</h1>
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

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
              <Edit2 className="w-5 h-5" />
            </button>
            
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
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
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
                <th className="px-4 py-3 text-left font-medium text-gray-700">Day & time</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Campaign</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Bid adj.</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Impr.</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">
                  <div className="flex items-center justify-end gap-1">
                    <ChevronDown className="w-4 h-4" />
                    Interacti.
                  </div>
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">
                  Interaction rate
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Avg. cost</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Cost</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Conv. rate</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Conversions</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Cost / conv.</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td colSpan={12} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-gray-700">
                      Your ads are eligible to appear all days of the week, at all times of the day
                    </div>
                    <button className="flex items-center gap-2 text-blue-600 hover:underline font-medium">
                      <Plus className="w-4 h-4" />
                      Edit ad schedule
                    </button>
                  </div>
                </td>
              </tr>
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
            <span className="font-medium">Maximize performance with ad scheduling:</span> Ad scheduling (also 
            known as dayparting) allows you to specify certain hours or days when you want your ads to appear. 
            You can also set bid adjustments to increase or decrease your bids during specific times. This helps 
            you show ads when your target audience is most active and likely to convert. Learn more about{' '}
            <a href="#" className="underline hover:text-blue-700">ad scheduling best practices</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
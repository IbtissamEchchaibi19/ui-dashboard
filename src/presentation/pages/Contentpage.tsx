import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Download, Maximize2, MoreVertical } from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
interface ContentExclusion {
  id: string;
  content: string;
  type: 'Keyword' | 'Placement' | 'Topic';
  excludedFrom: string;
  level: 'Campaign' | 'Ad group' | 'Ad Group';
}

// ──────────────────────────────────────────────────────────────
// Sample Data
// ──────────────────────────────────────────────────────────────
const contentExclusionsData: ContentExclusion[] = [
  {
    id: '1',
    content: '[5 day gen ai intensive course with google]',
    type: 'Keyword',
    excludedFrom: 'Search 9th Oct › AI Courses in Chandigarh | Learn Artificial Intelligence',
    level: 'Ad Group'
  },
  {
    id: '2',
    content: '[ai tutorial]',
    type: 'Keyword',
    excludedFrom: 'Search 9th Oct › AI Courses in Chandigarh | Learn Artificial Intelligence',
    level: 'Ad Group'
  },
  {
    id: '3',
    content: 'arduino',
    type: 'Keyword',
    excludedFrom: 'Search 9th Oct',
    level: 'Campaign'
  },
  {
    id: '4',
    content: 'class 10/12',
    type: 'Keyword',
    excludedFrom: 'Search 9th Oct',
    level: 'Campaign'
  },
  {
    id: '5',
    content: '[cognitive class ai]',
    type: 'Keyword',
    excludedFrom: 'Search 9th Oct › AI Courses in Chandigarh | Learn Artificial Intelligence',
    level: 'Ad Group'
  },
  {
    id: '6',
    content: 'coursera',
    type: 'Keyword',
    excludedFrom: 'Search 9th Oct',
    level: 'Campaign'
  },
  {
    id: '7',
    content: 'crack',
    type: 'Keyword',
    excludedFrom: 'Search 9th Oct',
    level: 'Campaign'
  }
];

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────
export const ContentPage: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showTable, setShowTable] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Type: Placement, Keyword, ... (and 1 more)');

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
    if (selectedRows.size === contentExclusionsData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(contentExclusionsData.map(r => r.id)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-normal text-gray-900">Content</h1>
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

      {/* Exclusions Section */}
      <div className="bg-white mx-6 mt-6 rounded border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Exclusions</h2>
        </div>

        {/* Toggle Table */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setShowTable(!showTable)}
            className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              {showTable ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
              <span className="text-sm text-gray-700">{showTable ? 'Hide' : 'Show'} table</span>
            </div>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Edit exclusions
            </button>
          </button>
        </div>

        {/* Table */}
        {showTable && (
          <div>
            {/* Action Bar */}
            <div className="px-6 py-3 bg-white flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center gap-2">
                  <div className="relative">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                    <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      1
                    </div>
                  </div>
                  
                  <button className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                    {activeFilter}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                  Add filter
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                  <Maximize2 className="w-4 h-4" />
                  Expand
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
                      checked={selectedRows.size === contentExclusionsData.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    <div className="flex items-center gap-1">
                      Content
                      <ChevronUp className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Excluded from</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Level</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {contentExclusionsData.map((exclusion) => (
                  <tr key={exclusion.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 cursor-pointer"
                        checked={selectedRows.has(exclusion.id)}
                        onChange={() => toggleRowSelection(exclusion.id)}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-900">{exclusion.content}</td>
                    <td className="px-4 py-3 text-gray-700">{exclusion.type}</td>
                    <td className="px-4 py-3">
                      <a href="#" className="text-blue-600 hover:underline">{exclusion.excludedFrom}</a>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{exclusion.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 border-t border-blue-100 px-6 py-3 mt-6">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-900">
            <span className="font-medium">Protect your brand with content exclusions:</span> Use content 
            exclusions to prevent your ads from appearing on specific placements, topics, or keywords that 
            may not align with your brand values. You can exclude content at the account, campaign, or ad 
            group level to maintain better control over where your ads appear. Learn more in our{' '}
            <a href="#" className="underline hover:text-blue-700">Content Suitability Guide</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
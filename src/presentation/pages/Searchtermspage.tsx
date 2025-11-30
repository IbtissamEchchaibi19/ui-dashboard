import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Filter, Download, Maximize2, HelpCircle, Search, Menu, BarChart3, Settings, X } from 'lucide-react';
import {SearchTerm ,searchTermsData} from '@infrastructure/mock-data'
export const SearchTermsPage:  React.FC = () =>{
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedMetric, setSelectedMetric] = useState('clicks');
  const [selectedComparison, setSelectedComparison] = useState('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [showSegmentMenu, setShowSegmentMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState({
    searchTerm: true,
    adGroup: true,
    impressions: true,
    interactions: true,
    interactionRate: true,
    avgCost: true,
    cost: true,
    campaignType: true,
    convRate: true,
    conversions: true,
    costPerConv: true
  });

  const filterMenuRef = useRef<HTMLDivElement>(null);
  const columnsMenuRef = useRef<HTMLDivElement>(null);
  const segmentMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setShowFilterMenu(false);
      }
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(event.target as Node)) {
        setShowColumnsMenu(false);
      }
      if (segmentMenuRef.current && !segmentMenuRef.current.contains(event.target as Node)) {
        setShowSegmentMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const addFilter = (filterType: string) => {
    setActiveFilters(prev => [...prev, filterType]);
    setShowFilterMenu(false);
  };

  const removeFilter = (index: number) => {
    setActiveFilters(prev => prev.filter((_, i) => i !== index));
  };

  const handleDownload = () => {
    // Create CSV content
    const headers = ['Search term', 'Ad group', 'Impressions', 'Interactions', 'Interaction rate', 'Avg. cost', 'Cost', 'Campaign type', 'Conv. rate', 'Conversions', 'Cost / conv.'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(term => [
        `"${term.searchTerm}"`,
        `"${term.adGroup}"`,
        term.impressions,
        term.interactions,
        term.interactionRate,
        term.avgCost,
        term.cost,
        term.campaignType,
        term.convRate,
        term.conversions,
        term.costPerConv
      ].join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'search-terms-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredData = searchTermsData.filter(term =>
    term.searchTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.adGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.campaign.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals
  const totals = filteredData.reduce((acc, term) => ({
    impressions: acc.impressions + term.impressions,
    interactions: acc.interactions + term.interactions,
    cost: acc.cost + parseFloat(term.cost.replace('₹', ''))
  }), { impressions: 0, interactions: 0, cost: 0 });

  const totalInteractionRate = totals.impressions > 0 
    ? ((totals.interactions / totals.impressions) * 100).toFixed(2) 
    : '0.00';
  const totalAvgCost = totals.interactions > 0 
    ? (totals.cost / totals.interactions).toFixed(2) 
    : '0.00';

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
      {/* Header with Title and Date Range */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-normal text-gray-800">Search terms</h1>
              <button className="text-gray-400 hover:text-gray-600">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">This month</span>
              
              <select className="px-3 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 cursor-pointer">
                <option>Nov 1 – 29, 2025</option>
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
      <div className="bg-white px-6 pt-6">
        {/* Chart Controls */}
        <div className="flex items-center justify-end gap-3 mb-4">
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 cursor-pointer"
          >
            <option value="clicks">▬ Clicks</option>
            <option value="impressions">▬ Impressions</option>
            <option value="cost">▬ Cost</option>
            <option value="interactionRate">▬ Interaction rate</option>
          </select>
          
          <select 
            value={selectedComparison}
            onChange={(e) => setSelectedComparison(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 cursor-pointer"
          >
            <option value="none">▬ None</option>
            <option value="previous">Compare to: Previous period</option>
            <option value="lastYear">Compare to: Last year</option>
          </select>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
            <BarChart3 className="w-4 h-4" />
            Chart type
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
            <Maximize2 className="w-4 h-4" />
            Expand
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
            <Settings className="w-4 h-4" />
            Adjust
          </button>
        </div>

        {/* Chart */}
        <div className="pb-6">
          <div className="h-64 bg-white relative border-l border-b border-gray-200">
            <svg className="w-full h-full" viewBox="0 0 1400 256" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="51" x2="1400" y2="51" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="128" x2="1400" y2="128" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="205" x2="1400" y2="205" stroke="#e5e7eb" strokeWidth="1" />
              
              {/* Weekend shading */}
              <rect x="200" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.6" />
              <rect x="550" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.6" />
              <rect x="900" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.6" />
              <rect x="1250" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.6" />
              
              {/* Line graph - matching Google Ads curve */}
              <path
                d="M 0,210 L 50,200 L 100,180 L 150,160 L 200,140 L 250,105 L 300,85 L 350,230 L 400,235 L 450,238 L 500,237 L 550,236 L 600,237 L 650,235 L 700,234 L 750,236 L 800,235 L 850,237 L 900,236 L 950,233 L 1000,235 L 1050,232 L 1100,230 L 1150,232 L 1200,228 L 1250,230 L 1300,232 L 1350,230 L 1400,232"
                fill="none"
                stroke="#1a73e8"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            
            {/* Y-axis labels */}
            <div className="absolute -left-8 top-8 text-xs text-gray-600">40</div>
            <div className="absolute -left-8 top-[120px] text-xs text-gray-600">20</div>
            <div className="absolute -left-6 bottom-2 text-xs text-gray-600">0</div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-600 pl-2">
            <span>Nov 1, 2025</span>
            <span className="pr-4">Nov 29, 2025</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border-t border-b border-gray-200 px-6 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative" ref={filterMenuRef}>
              <button 
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 px-2 py-1.5 rounded"
              >
                <Filter className="w-4 h-4" />
                Add filter
              </button>
              
              {showFilterMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg w-64 z-20">
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Search filters..."
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                    />
                    <div className="max-h-64 overflow-y-auto">
                      <button
                        onClick={() => addFilter('Match type')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        Match type
                      </button>
                      <button
                        onClick={() => addFilter('Added/Excluded')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        Added/Excluded
                      </button>
                      <button
                        onClick={() => addFilter('Campaign')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        Campaign
                      </button>
                      <button
                        onClick={() => addFilter('Impressions')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        Impressions
                      </button>
                      <button
                        onClick={() => addFilter('Interactions')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        Interactions
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-2">
                Search terms
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search in table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-300 rounded text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Active Filters */}
            {activeFilters.map((filter, index) => (
              <div key={index} className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded px-2 py-1">
                <span className="text-sm text-blue-900">{filter}</span>
                <button
                  onClick={() => removeFilter(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={segmentMenuRef}>
              <button 
                onClick={() => setShowSegmentMenu(!showSegmentMenu)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                <Menu className="w-4 h-4" />
                Segment
              </button>
              
              {showSegmentMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg w-56 z-20">
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
                      Time
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
                      Click type
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
                      Device
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
                      Network
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                </svg>
                Columns
              </button>
              
              {showColumnsMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg w-64 z-20">
                  <div className="p-3">
                    <div className="text-xs font-semibold text-gray-700 mb-2 uppercase">Performance</div>
                    <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleColumns.impressions}
                        onChange={() => toggleColumn('impressions')}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Impressions</span>
                    </label>
                    <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleColumns.interactions}
                        onChange={() => toggleColumn('interactions')}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Interactions</span>
                    </label>
                    <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleColumns.interactionRate}
                        onChange={() => toggleColumn('interactionRate')}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Interaction rate</span>
                    </label>
                    <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleColumns.avgCost}
                        onChange={() => toggleColumn('avgCost')}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Avg. cost</span>
                    </label>
                    <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleColumns.cost}
                        onChange={() => toggleColumn('cost')}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Cost</span>
                    </label>
                    
                    <div className="text-xs font-semibold text-gray-700 mb-2 mt-3 uppercase">Conversions</div>
                    <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleColumns.convRate}
                        onChange={() => toggleColumn('convRate')}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Conv. rate</span>
                    </label>
                    <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleColumns.conversions}
                        onChange={() => toggleColumn('conversions')}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Conversions</span>
                    </label>
                    <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleColumns.costPerConv}
                        onChange={() => toggleColumn('costPerConv')}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Cost / conv.</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
              <Maximize2 className="w-4 h-4" />
              Expand
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="px-6 pb-6 bg-white">
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-10 sticky left-0 bg-gray-50 z-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  {visibleColumns.searchTerm && (
                    <th className="px-4 py-3 text-left font-medium text-gray-700 sticky left-10 bg-gray-50 z-10">
                      Search term
                    </th>
                  )}
                  {visibleColumns.adGroup && (
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Ad group</th>
                  )}
                  {visibleColumns.impressions && (
                    <th className="px-4 py-3 text-right font-medium text-gray-700">
                      <div className="flex items-center justify-end gap-1">
                        Impr.
                      </div>
                    </th>
                  )}
                  {visibleColumns.interactions && (
                    <th className="px-4 py-3 text-right font-medium text-gray-700">
                      <div className="flex items-center justify-end gap-1">
                        <ChevronDown className="w-3 h-3" />
                        Interacti.
                      </div>
                    </th>
                  )}
                  {visibleColumns.interactionRate && (
                    <th className="px-4 py-3 text-right font-medium text-gray-700">
                      Interaction rate
                    </th>
                  )}
                  {visibleColumns.avgCost && (
                    <th className="px-4 py-3 text-right font-medium text-gray-700">Avg. cost</th>
                  )}
                  {visibleColumns.cost && (
                    <th className="px-4 py-3 text-right font-medium text-gray-700">Cost</th>
                  )}
                  {visibleColumns.campaignType && (
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Campaign type
                    </th>
                  )}
                  {visibleColumns.convRate && (
                    <th className="px-4 py-3 text-right font-medium text-gray-700 border-l-2 border-dashed border-gray-300">
                      Conv. rate
                    </th>
                  )}
                  {visibleColumns.conversions && (
                    <th className="px-4 py-3 text-right font-medium text-gray-700 border-l-2 border-dashed border-gray-300">
                      Conversions
                    </th>
                  )}
                  {visibleColumns.costPerConv && (
                    <th className="px-4 py-3 text-right font-medium text-gray-700 border-l-2 border-dashed border-gray-300">
                      Cost / conv.
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white">
                {/* Total Row */}
                <tr className="bg-gray-50 font-medium border-b border-gray-200">
                  <td className="px-4 py-3 sticky left-0 bg-gray-50"></td>
                  {visibleColumns.searchTerm && (
                    <td className="px-4 py-3 flex items-center gap-2 text-gray-900 sticky left-10 bg-gray-50">
                      Total: Search te...
                      <button className="text-gray-400 hover:text-gray-600">
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                  {visibleColumns.adGroup && <td className="px-4 py-3"></td>}
                  {visibleColumns.impressions && (
                    <td className="px-4 py-3 text-right text-gray-900">{totals.impressions}</td>
                  )}
                  {visibleColumns.interactions && (
                    <td className="px-4 py-3 text-right text-gray-900">
                      {totals.interactions}
                      <div className="text-xs text-gray-500">clicks</div>
                    </td>
                  )}
                  {visibleColumns.interactionRate && (
                    <td className="px-4 py-3 text-right text-gray-900">{totalInteractionRate}%</td>
                  )}
                  {visibleColumns.avgCost && (
                    <td className="px-4 py-3 text-right text-gray-900">₹{totalAvgCost}</td>
                  )}
                  {visibleColumns.cost && (
                    <td className="px-4 py-3 text-right text-gray-900">₹{totals.cost.toFixed(2)}</td>
                  )}
                  {visibleColumns.campaignType && <td className="px-4 py-3"></td>}
                  {visibleColumns.convRate && (
                    <td className="px-4 py-3 text-right text-gray-900 border-l-2 border-dashed border-gray-300">0.00%</td>
                  )}
                  {visibleColumns.conversions && (
                    <td className="px-4 py-3 text-right text-gray-900 border-l-2 border-dashed border-gray-300">0.00</td>
                  )}
                  {visibleColumns.costPerConv && (
                    <td className="px-4 py-3 text-right text-gray-900 border-l-2 border-dashed border-gray-300">₹0.00</td>
                  )}
                </tr>
                
                {/* Data Rows */}
                {filteredData.map((term) => (
                  <tr key={term.id} className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer group">
                    <td className="px-4 py-3 sticky left-0 bg-white group-hover:bg-blue-50">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 cursor-pointer"
                        checked={selectedRows.has(term.id)}
                        onChange={() => toggleRowSelection(term.id)}
                      />
                    </td>
                    {visibleColumns.searchTerm && (
                      <td className="px-4 py-3 text-gray-900 sticky left-10 bg-white group-hover:bg-blue-50">
                        {term.searchTerm}
                      </td>
                    )}
                    {visibleColumns.adGroup && (
                      <td className="px-4 py-3">
                        <a href="#" className="text-blue-600 hover:underline text-xs">
                          {term.adGroup}
                        </a>
                      </td>
                    )}
                    {visibleColumns.impressions && (
                      <td className="px-4 py-3 text-right text-gray-700">{term.impressions}</td>
                    )}
                    {visibleColumns.interactions && (
                      <td className="px-4 py-3 text-right text-gray-700">
                        {term.interactions}
                        <div className="text-xs text-gray-500">clicks</div>
                      </td>
                    )}
                    {visibleColumns.interactionRate && (
                      <td className="px-4 py-3 text-right text-gray-700">{term.interactionRate}</td>
                    )}
                    {visibleColumns.avgCost && (
                      <td className="px-4 py-3 text-right text-gray-700">{term.avgCost}</td>
                    )}
                    {visibleColumns.cost && (
                      <td className="px-4 py-3 text-right text-gray-700">{term.cost}</td>
                    )}
                    {visibleColumns.campaignType && (
                      <td className="px-4 py-3 text-gray-700">{term.campaignType}</td>
                    )}
                    {visibleColumns.convRate && (
                      <td className="px-4 py-3 text-right text-gray-700 border-l-2 border-dashed border-gray-300">
                        {term.convRate}
                      </td>
                    )}
                    {visibleColumns.conversions && (
                      <td className="px-4 py-3 text-right text-gray-700 border-l-2 border-dashed border-gray-300">
                        {term.conversions}
                      </td>
                    )}
                    {visibleColumns.costPerConv && (
                      <td className="px-4 py-3 text-right text-gray-700 border-l-2 border-dashed border-gray-300">
                        {term.costPerConv}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 border-t border-blue-200 px-6 py-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Optimize with search terms:</span> Review your search terms report 
            regularly to identify high-performing keywords to add to your campaigns and irrelevant terms to 
            exclude as negative keywords. This helps improve your targeting and reduce wasted spend.{' '}
            <a href="#" className="underline hover:text-blue-700 font-medium">
              Learn more about search terms best practices
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
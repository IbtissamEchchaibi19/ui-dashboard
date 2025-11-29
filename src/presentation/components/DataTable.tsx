import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Filter, Download, Maximize2, Search, Menu, X } from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
export interface Column {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  width?: string;
  sticky?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
  category?: string; // For grouping in columns menu
  hidden?: boolean; // Default hidden state
}

export interface DataTableProps {
  data: any[];
  columns: Column[];
  title?: string;
  enableSearch?: boolean;
  enableFilters?: boolean;
  enableColumns?: boolean;
  enableSegment?: boolean;
  enableDownload?: boolean;
  enableExpand?: boolean;
  enableRowSelection?: boolean;
  searchPlaceholder?: string;
  filterOptions?: string[];
  segmentOptions?: string[];
  onRowSelect?: (selectedRows: Set<string>) => void;
  onDownload?: (data: any[]) => void;
  rowKey?: string; // Key to use as unique identifier for rows
  showTotal?: boolean;
  totalLabel?: string;
  calculateTotal?: (data: any[], column: Column) => any;
  emptyMessage?: string;
  rowClassName?: (row: any) => string;
  stickyHeader?: boolean;
}

// ──────────────────────────────────────────────────────────────
// Main DataTable Component
// ──────────────────────────────────────────────────────────────
export default function DataTable({
  data,
  columns,
  title,
  enableSearch = true,
  enableFilters = true,
  enableColumns = true,
  enableSegment = true,
  enableDownload = true,
  enableExpand = true,
  enableRowSelection = true,
  searchPlaceholder = 'Search in table...',
  filterOptions = ['Match type', 'Campaign', 'Impressions', 'Interactions'],
  segmentOptions = ['Time', 'Click type', 'Device', 'Network'],
  onRowSelect,
  onDownload,
  rowKey = 'id',
  showTotal = true,
  totalLabel = 'Total',
  calculateTotal,
  emptyMessage = 'No data available',
  rowClassName,
  stickyHeader = true
}: DataTableProps) {
  // ──────────────────────────────────────────────────────────────
  // State Management
  // ──────────────────────────────────────────────────────────────
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [showSegmentMenu, setShowSegmentMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // Initialize visible columns from column definitions
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    columns.forEach(col => {
      initial[col.key] = !col.hidden;
    });
    return initial;
  });

  // Refs for click outside detection
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const columnsMenuRef = useRef<HTMLDivElement>(null);
  const segmentMenuRef = useRef<HTMLDivElement>(null);

  // ──────────────────────────────────────────────────────────────
  // Close menus when clicking outside
  // ──────────────────────────────────────────────────────────────
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

  // ──────────────────────────────────────────────────────────────
  // Handlers
  // ──────────────────────────────────────────────────────────────
  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      if (onRowSelect) onRowSelect(newSet);
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
      if (onRowSelect) onRowSelect(new Set());
    } else {
      const allIds = new Set(filteredData.map(r => r[rowKey]));
      setSelectedRows(allIds);
      if (onRowSelect) onRowSelect(allIds);
    }
  };

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const addFilter = (filterType: string) => {
    setActiveFilters(prev => [...prev, filterType]);
    setShowFilterMenu(false);
  };

  const removeFilter = (index: number) => {
    setActiveFilters(prev => prev.filter((_, i) => i !== index));
  };

  const handleSort = (columnKey: string) => {
    setSortConfig(prev => {
      if (prev?.key === columnKey) {
        return prev.direction === 'asc' 
          ? { key: columnKey, direction: 'desc' }
          : null;
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(filteredData);
    } else {
      // Default CSV download
      const visibleCols = columns.filter(col => visibleColumns[col.key]);
      const headers = visibleCols.map(col => col.label).join(',');
      const csvContent = [
        headers,
        ...filteredData.map(row => 
          visibleCols.map(col => {
            const value = row[col.key];
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'data'}-export.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  // ──────────────────────────────────────────────────────────────
  // Data Processing
  // ──────────────────────────────────────────────────────────────
  const filteredData = data.filter(row => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return columns.some(col => {
      const value = row[col.key];
      return value && String(value).toLowerCase().includes(searchLower);
    });
  });

  // Apply sorting
  const sortedData = sortConfig 
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal === bVal) return 0;
        
        const comparison = aVal > bVal ? 1 : -1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      })
    : filteredData;

  // Get visible columns
  const visibleCols = columns.filter(col => visibleColumns[col.key]);

  // Group columns by category for the columns menu
  const columnsByCategory = columns.reduce((acc, col) => {
    const category = col.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(col);
    return acc;
  }, {} as Record<string, Column[]>);

  // ──────────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      {/* Action Bar */}
      <div className={`bg-white border-t border-b border-gray-200 px-6 py-3 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Filter Button */}
            {enableFilters && (
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
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="max-h-64 overflow-y-auto">
                        {filterOptions.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => addFilter(option)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Search Input */}
            {enableSearch && (
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-8 py-2 border border-gray-300 rounded text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            )}

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
            {/* Segment Button */}
            {enableSegment && (
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
                      {segmentOptions.map((option, idx) => (
                        <button 
                          key={idx}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Columns Button */}
            {enableColumns && (
              <div className="relative" ref={columnsMenuRef}>
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
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg w-64 z-20 max-h-96 overflow-y-auto">
                    <div className="p-3">
                      {Object.entries(columnsByCategory).map(([category, cols]) => (
                        <div key={category}>
                          <div className="text-xs font-semibold text-gray-700 mb-2 mt-3 first:mt-0 uppercase">
                            {category}
                          </div>
                          {cols.map(col => (
                            <label 
                              key={col.key}
                              className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={visibleColumns[col.key]}
                                onChange={() => toggleColumn(col.key)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{col.label}</span>
                            </label>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Download Button */}
            {enableDownload && (
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
            
            {/* Expand Button */}
            {enableExpand && (
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <Maximize2 className="w-4 h-4" />
                Expand
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 border-t-0 rounded-b overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {enableRowSelection && (
                  <th className="px-4 py-3 text-left w-10 sticky left-0 bg-gray-50 z-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                )}
                {visibleCols.map((col, idx) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 font-medium text-gray-700 ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    } ${col.sticky ? 'sticky left-10 bg-gray-50 z-10' : ''} ${col.width || ''}`}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        {sortConfig?.key === col.key && (
                          <ChevronDown className={`w-3 h-3 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                        {col.label}
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {/* Total Row */}
              {showTotal && (
                <tr className="bg-gray-50 font-medium border-b border-gray-200">
                  {enableRowSelection && <td className="px-4 py-3 sticky left-0 bg-gray-50"></td>}
                  {visibleCols.map((col, idx) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      } text-gray-900 ${col.sticky ? 'sticky left-10 bg-gray-50' : ''}`}
                    >
                      {idx === 0 ? totalLabel : calculateTotal ? calculateTotal(filteredData, col) : ''}
                    </td>
                  ))}
                </tr>
              )}
              
              {/* Data Rows */}
              {sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleCols.length + (enableRowSelection ? 1 : 0)}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                sortedData.map((row) => (
                  <tr
                    key={row[rowKey]}
                    className={`border-b border-gray-100 hover:bg-blue-50 cursor-pointer group ${
                      rowClassName ? rowClassName(row) : ''
                    }`}
                  >
                    {enableRowSelection && (
                      <td className="px-4 py-3 sticky left-0 bg-white group-hover:bg-blue-50">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 cursor-pointer"
                          checked={selectedRows.has(row[rowKey])}
                          onChange={() => toggleRowSelection(row[rowKey])}
                        />
                      </td>
                    )}
                    {visibleCols.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 ${
                          col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                        } text-gray-700 ${col.sticky ? 'sticky left-10 bg-white group-hover:bg-blue-50' : ''}`}
                      >
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
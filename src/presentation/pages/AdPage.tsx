// presentation/pages/AdsPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useAds, useDateRange, useAdTimeSeries } from '@application/hooks';
import { AdService } from '@application/services';
import { 
  AdStatusUI, 
  AdTypeUI, 
  AdAdStrengthUI,
  AdUI,
  AdMetricColumn,
} from '@application/dto';

// UI library imports (external dependencies)
import { 
  ChartComponent, 
  SeriesCollectionDirective, 
  SeriesDirective, 
  Inject, 
  LineSeries, 
  DateTime, 
  Legend, 
  Tooltip
} from '@syncfusion/ej2-react-charts';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { DialogComponent } from '@syncfusion/ej2-react-popups';

// Column configuration with labels and keys
const COLUMN_CONFIG: { key: AdMetricColumn; label: string; align: 'left' | 'right' | 'center' }[] = [
  { key: 'impressions', label: 'Impr.', align: 'right' },
  { key: 'clicks', label: 'Clicks', align: 'right' },
  { key: 'interactions', label: 'Interactions', align: 'right' },
  { key: 'interactionRate', label: 'Interaction rate', align: 'right' },
  { key: 'averageCost', label: 'Avg. cost', align: 'right' },
  { key: 'cost', label: 'Cost', align: 'right' },
  { key: 'conversions', label: 'Conversions', align: 'right' },
  { key: 'conversionRate', label: 'Conv. rate', align: 'right' },
  { key: 'ctr', label: 'CTR', align: 'right' },
  { key: 'averageCpc', label: 'Avg. CPC', align: 'right' },
  { key: 'averageCpm', label: 'Avg. CPM', align: 'right' },
];

export const AdsPage: React.FC = () => {
  // Backend filters state (what gets sent to hooks)
  const [backendFilters, setBackendFilters] = useState<any>({});
  
  // Local filters state (UI state before applying)
  const [localFilters, setLocalFilters] = useState<{
    adStatus: AdStatusUI[];
    adType: AdTypeUI[];
    adStrength: AdAdStrengthUI[];
    approvalStatus: string[];
  }>({
    adStatus: [],
    adType: [],
    adStrength: [],
    approvalStatus: []
  });
  
  // Use existing hooks - error is now string | null
  const { ads, loading, error, updateFilters, refetch } = useAds(backendFilters);
  const { dateRange, preset, setPreset, formatDisplay } = useDateRange('allTime');
  
  // UI State
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [topSearchText, setTopSearchText] = useState('');
  const [tableSearchText, setTableSearchText] = useState('');
  const [showTableSearchDialog, setShowTableSearchDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showColumnDialog, setShowColumnDialog] = useState(false);
  const [showSegmentDialog, setShowSegmentDialog] = useState(false);
  const [showReportsMenu, setShowReportsMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // Visible columns state - these are the columns that will be shown in the table
  const [visibleColumns, setVisibleColumns] = useState<AdMetricColumn[]>([
    'impressions', 
    'clicks', 
    'interactions',
    'interactionRate',
    'averageCost',
    'cost',
    'conversions',
    'conversionRate',
  ]);

  // Get time series data - handle null adId properly
  const activeAdId = selectedAdId || (ads.length > 0 ? ads[0]?.id : null);
  const { data: timeSeriesData, loading: chartLoading, setDateRange: updateTimeSeriesDateRange } = useAdTimeSeries(
    activeAdId,
    dateRange
  );

  // Update time series when date range changes
  useEffect(() => {
    updateTimeSeriesDateRange(dateRange);
  }, [dateRange, updateTimeSeriesDateRange]);

  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setShowReportsMenu(false);
        setShowMoreMenu(false);
      }
    };

    if (showReportsMenu || showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReportsMenu, showMoreMenu]);

  // Date range presets for dropdown
  const dateRangePresets = [
    { text: 'Today', value: 'today' },
    { text: 'Yesterday', value: 'yesterday' },
    { text: 'Last 7 days', value: 'last7days' },
    { text: 'Last 14 days', value: 'last14days' },
    { text: 'Last 30 days', value: 'last30days' },
    { text: 'This month', value: 'thisMonth' },
    { text: 'Last month', value: 'lastMonth' },
    { text: 'All time', value: 'allTime' }
  ];

  // Filter and sort ads
  const filteredAds = useMemo(() => {
    let filtered = [...ads];

    // TOP SEARCH BAR - Search ad names and headlines
    if (topSearchText.trim()) {
      const search = topSearchText.toLowerCase().trim();
      filtered = filtered.filter(ad => 
        ad.name.toLowerCase().includes(search) ||
        ad.primaryHeadline.toLowerCase().includes(search)
      );
    }

    // TABLE KEYWORD SEARCH - Searches EVERYTHING
    if (tableSearchText.trim()) {
      const search = tableSearchText.toLowerCase().trim();
      filtered = filtered.filter(ad => {
        return (
          ad.name.toLowerCase().includes(search) ||
          ad.id.toLowerCase().includes(search) ||
          ad.status.toLowerCase().includes(search) ||
          ad.type.toLowerCase().includes(search) ||
          ad.primaryHeadline.toLowerCase().includes(search) ||
          ad.primaryDescription.toLowerCase().includes(search) ||
          ad.finalUrl.toLowerCase().includes(search) ||
          ad.adGroupName.toLowerCase().includes(search) ||
          ad.campaignName.toLowerCase().includes(search)
        );
      });
    }

    // Status filter (local)
    if (localFilters.adStatus.length > 0) {
      filtered = filtered.filter(ad => 
        localFilters.adStatus.includes(ad.status)
      );
    }

    // Type filter (local)
    if (localFilters.adType.length > 0) {
      filtered = filtered.filter(ad => 
        localFilters.adType.includes(ad.type)
      );
    }

    // Ad Strength filter
    if (localFilters.adStrength.length > 0) {
      filtered = filtered.filter(ad => 
        localFilters.adStrength.includes(ad.adStrength)
      );
    }

    // Approval Status filter
    if (localFilters.approvalStatus.length > 0) {
      filtered = filtered.filter(ad => 
        localFilters.approvalStatus.includes(ad.approvalStatus)
      );
    }

    // Sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: string;
        let bValue: string;

        switch (sortConfig.key) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'type':
            aValue = a.type;
            bValue = b.type;
            break;
          case 'adStrength':
            aValue = a.adStrength;
            bValue = b.adStrength;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [ads, topSearchText, tableSearchText, localFilters, sortConfig]);

  // Calculate aggregated metrics based on date range
  const aggregatedMetrics = useMemo(() => {
    if (timeSeriesData.length === 0) {
      return {
        totalImpressions: 0,
        totalClicks: 0,
        totalConversions: 0,
        totalCost: 0,
        avgCtr: 0,
        conversionRate: 0,
        avgCpc: 0
      };
    }

    const totals = timeSeriesData.reduce((acc, item) => ({
      impressions: acc.impressions + item.impressions,
      clicks: acc.clicks + item.clicks,
      conversions: acc.conversions + item.conversions,
      cost: acc.cost + item.cost
    }), { impressions: 0, clicks: 0, conversions: 0, cost: 0 });

    return {
      totalImpressions: totals.impressions,
      totalClicks: totals.clicks,
      totalConversions: totals.conversions,
      totalCost: totals.cost,
      avgCtr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
      conversionRate: totals.clicks > 0 ? (totals.conversions / totals.clicks) * 100 : 0,
      avgCpc: totals.clicks > 0 ? totals.cost / totals.clicks : 0
    };
  }, [timeSeriesData]);

  // Get visible column configs
  const visibleColumnConfigs = useMemo(() => {
    return COLUMN_CONFIG.filter(col => visibleColumns.includes(col.key));
  }, [visibleColumns]);

  // Helper function to get metric value for a column
  const getMetricValue = (ad: AdUI, columnKey: AdMetricColumn): string => {
    const metrics = ad.metrics;
    switch (columnKey) {
      case 'impressions':
        return metrics.impressions.toLocaleString();
      case 'clicks':
        return metrics.clicks.toLocaleString();
      case 'interactions':
        return metrics.interactions.toLocaleString();
      case 'interactionRate':
        return metrics.interactionRate;
      case 'averageCost':
        return metrics.averageCost.format();
      case 'cost':
        return metrics.cost.format();
      case 'conversions':
        return metrics.conversions.toFixed(2);
      case 'conversionRate':
        return metrics.conversionRate;
      case 'ctr':
        return metrics.ctr + '%';
      case 'averageCpc':
        return metrics.averageCpc.format();
      case 'averageCpm':
        return metrics.averageCpm.format();
      default:
        return '-';
    }
  };

  // Event Handlers
  const toggleRowExpansion = (adId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(adId)) {
        newSet.delete(adId);
      } else {
        newSet.add(adId);
      }
      return newSet;
    });
  };

  const toggleRowSelection = (adId: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(adId)) {
        newSet.delete(adId);
      } else {
        newSet.add(adId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredAds.length && filteredAds.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredAds.map(a => a.id)));
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'desc' };
      }
      if (current.direction === 'desc') {
        return { key, direction: 'asc' };
      }
      return null;
    });
  };

  const handleTopSearchChange = (e: any) => {
    const value = e.value || '';
    setTopSearchText(value);
  };

  const handleTableSearchChange = (e: any) => {
    const value = e.value || '';
    setTableSearchText(value);
  };

  // Handle date range change
  const handleDateRangeChange = (e: any) => {
    const value = e.value;
    if (value) {
      setPreset(value);
    }
  };

  // Apply filters
  const applyFilters = () => {
    const newBackendFilters: any = {};
    
    if (localFilters.adStatus.length > 0) {
      newBackendFilters.status = localFilters.adStatus;
    }
    
    if (localFilters.adType.length > 0) {
      newBackendFilters.type = localFilters.adType;
    }

    if (localFilters.adStrength.length > 0) {
      newBackendFilters.adStrength = localFilters.adStrength;
    }

    if (localFilters.approvalStatus.length > 0) {
      newBackendFilters.approvalStatus = localFilters.approvalStatus;
    }
    
    setBackendFilters(newBackendFilters);
    updateFilters(newBackendFilters);
    setShowFilterDialog(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setLocalFilters({
      adStatus: [],
      adType: [],
      adStrength: [],
      approvalStatus: []
    });
    setTopSearchText('');
    setTableSearchText('');
    setBackendFilters({});
    updateFilters({});
  };

  const handleAdAction = async (action: 'pause' | 'enable' | 'delete', adIds: string[]) => {
    try {
      if (action === 'pause') {
        await AdService.bulkPauseAds(adIds);
      } else if (action === 'enable') {
        await AdService.bulkEnableAds(adIds);
      } else if (action === 'delete') {
        await AdService.bulkDeleteAds(adIds);
      }
      await refetch();
      setSelectedRows(new Set());
    } catch (err) {
      console.error('Ad action failed:', err);
    }
  };

  const downloadReport = () => {
    const headers = ['Ad', 'Ad Group', 'Campaign', 'Status', 'Type', 'Ad Strength', ...visibleColumnConfigs.map(c => c.label)];
    const rows = filteredAds.map(ad => [
      ad.primaryHeadline,
      ad.adGroupName,
      ad.campaignName,
      ad.status,
      ad.type,
      ad.adStrength,
      ...visibleColumnConfigs.map(col => getMetricValue(ad, col.key))
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const expandCollapseAll = () => {
    if (expandedRows.size === filteredAds.length) {
      setExpandedRows(new Set());
    } else {
      setExpandedRows(new Set(filteredAds.map(a => a.id)));
    }
  };

  const handleReportsClick = () => {
    setShowReportsMenu(!showReportsMenu);
  };

  const handleMoreClick = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  const handleGenerateReport = (reportType: string) => {
    console.log('Generating report:', reportType);
    alert(`Generating ${reportType} report...`);
    setShowReportsMenu(false);
  };

  const handleMoreAction = (action: string) => {
    console.log('More action:', action);
    alert(`Action: ${action}`);
    setShowMoreMenu(false);
  };

  const handleTableSearchIconClick = () => {
    setShowTableSearchDialog(true);
  };

  // Toggle column visibility
  const toggleColumnVisibility = (columnKey: AdMetricColumn) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnKey)) {
        return prev.filter(c => c !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  // Active filter count
  const activeFilterCount = 
    localFilters.adStatus.length +
    localFilters.adType.length +
    localFilters.adStrength.length +
    localFilters.approvalStatus.length;

  // Calculate total columns for colspan (fixed columns + dynamic metric columns)
  const totalColumns = 7 + visibleColumnConfigs.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-500 text-lg">Loading ads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
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
      {/* TOP BAR - Date Range & Navigation */}
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-normal text-gray-900">Ads</h1>
          
          {/* Date Range Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{formatDisplay()}</span>
            <DropDownListComponent
              dataSource={dateRangePresets}
              fields={{ text: 'text', value: 'value' }}
              value={preset}
              change={handleDateRangeChange}
              placeholder="Select date range"
              cssClass="w-44"
            />
            <ButtonComponent 
              cssClass="e-link e-small text-blue-600"
              onClick={() => setPreset('last30days')}
            >
              Show last 30 days
            </ButtonComponent>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="px-4 py-4">
        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-500 rounded p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">Impr.</span>
              <ButtonComponent iconCss="e-icons e-more-vert" cssClass="e-flat e-small text-white" />
            </div>
            <div className="text-2xl font-normal mb-1">
              {aggregatedMetrics.totalImpressions.toLocaleString()}
            </div>
            <div className="text-xs opacity-80">{formatDisplay()}</div>
          </div>

          <div className="bg-white rounded p-4 border border-gray-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-700">Cost</span>
              <ButtonComponent iconCss="e-icons e-more-vert" cssClass="e-flat e-small" />
            </div>
            <div className="text-2xl font-normal text-gray-900 mb-1">
              ₹{aggregatedMetrics.totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500">{formatDisplay()}</div>
          </div>

          <div className="bg-white rounded p-4 border border-gray-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-700">Conversions</span>
              <ButtonComponent iconCss="e-icons e-more-vert" cssClass="e-flat e-small" />
            </div>
            <div className="text-2xl font-normal text-gray-900 mb-1">
              {aggregatedMetrics.totalConversions.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">{formatDisplay()}</div>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="bg-white border border-gray-200 rounded mb-4">
          <div className="px-4 py-2 border-b border-gray-100">
            <span className="text-xs text-gray-500">Performance: {formatDisplay()}</span>
          </div>
          {chartLoading ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              Loading chart data...
            </div>
          ) : timeSeriesData.length > 0 ? (
            <ChartComponent
              id="ads-chart"
              primaryXAxis={{ 
                valueType: 'DateTime',
                labelFormat: 'MMM dd, yyyy',
                majorGridLines: { width: 0 },
                intervalType: 'Days'
              }}
              primaryYAxis={{
                labelFormat: '{value}',
                majorGridLines: { width: 1, color: '#e5e7eb' },
                minimum: 0
              }}
              height="280px"
              chartArea={{ border: { width: 0 } }}
              background="transparent"
              legendSettings={{ visible: true, position: 'Bottom' }}
              tooltip={{ enable: true }}
            >
              <Inject services={[LineSeries, DateTime, Legend, Tooltip]} />
              <SeriesCollectionDirective>
                <SeriesDirective
                  dataSource={timeSeriesData}
                  xName="date"
                  yName="impressions"
                  name="Impressions"
                  type="Line"
                  width={2}
                  marker={{ visible: true, width: 6, height: 6 }}
                  fill="#3b82f6"
                />
                <SeriesDirective
                  dataSource={timeSeriesData}
                  xName="date"
                  yName="clicks"
                  name="Clicks"
                  type="Line"
                  width={2}
                  marker={{ visible: true, width: 6, height: 6 }}
                  fill="#ef4444"
                />
                <SeriesDirective
                  dataSource={timeSeriesData}
                  xName="date"
                  yName="conversions"
                  name="Conversions"
                  type="Line"
                  width={2}
                  marker={{ visible: true, width: 6, height: 6 }}
                  fill="#f59e0b"
                />
              </SeriesCollectionDirective>
            </ChartComponent>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No data available for selected date range
            </div>
          )}
        </div>

        {/* FILTER BAR */}
        <div className="bg-gray-50 border border-gray-200 rounded px-4 py-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center px-2 py-1 bg-white border border-gray-300 rounded text-xs">
                <span className="text-blue-600 mr-1">📊</span>
                {activeFilterCount || 1}
              </span>
              <span className="text-xs text-gray-600">Ad status: Enabled, Paused</span>
            </div>
            <ButtonComponent 
              cssClass="e-link e-small text-blue-600"
              onClick={() => setShowFilterDialog(true)}
            >
              Add filter
            </ButtonComponent>
            {activeFilterCount > 0 && (
              <ButtonComponent 
                cssClass="e-link e-small text-red-600"
                onClick={clearAllFilters}
              >
                Clear all
              </ButtonComponent>
            )}
          </div>
        </div>

        {/* TABLE TOOLBAR */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {filteredAds.length} ad{filteredAds.length !== 1 ? 's' : ''} • {visibleColumnConfigs.length} columns shown
            </span>
          </div>

          <div className="flex items-center gap-2 relative">
            <ButtonComponent 
              iconCss="e-icons e-search" 
              cssClass="e-flat e-small" 
              onClick={handleTableSearchIconClick}
              title="Search table"
            >
              {tableSearchText && <span className="ml-1 text-blue-600">●</span>}
            </ButtonComponent>
            <ButtonComponent 
              iconCss="e-icons e-list-view" 
              cssClass="e-flat e-small"
              onClick={() => setShowSegmentDialog(true)}
            >
              Segment
            </ButtonComponent>
            <ButtonComponent 
              iconCss="e-icons e-table" 
              cssClass="e-flat e-small"
              onClick={() => setShowColumnDialog(true)}
            >
              Columns ({visibleColumns.length})
            </ButtonComponent>
            
            {/* Reports Dropdown */}
            <div className="relative">
              <ButtonComponent 
                iconCss="e-icons e-print" 
                cssClass="e-flat e-small"
                onClick={handleReportsClick}
              >
                Reports
              </ButtonComponent>
              {showReportsMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 w-56">
                  <button 
                    onClick={() => handleGenerateReport('Performance Report')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Performance Report
                  </button>
                  <button 
                    onClick={() => handleGenerateReport('Ad Report')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Ad Report
                  </button>
                </div>
              )}
            </div>

            <ButtonComponent iconCss="e-icons e-download" cssClass="e-flat e-small" onClick={downloadReport}>
              Download
            </ButtonComponent>
            <ButtonComponent iconCss="e-icons e-expand" cssClass="e-flat e-small" onClick={expandCollapseAll}>
              Expand
            </ButtonComponent>
            
            {/* More Dropdown */}
            <div className="relative">
              <ButtonComponent 
                iconCss="e-icons e-more-vert" 
                cssClass="e-flat e-small"
                onClick={handleMoreClick}
              >
                More
              </ButtonComponent>
              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 w-48">
                  <button 
                    onClick={() => handleMoreAction('Export to Excel')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Export to Excel
                  </button>
                  <button 
                    onClick={() => handleMoreAction('Export to CSV')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Export to CSV
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Table Search Indicator */}
        {tableSearchText && (
          <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3 flex items-center justify-between text-sm">
            <span className="text-blue-900">
              🔍 Searching for: <strong>{tableSearchText}</strong>
            </span>
            <button 
              onClick={() => setTableSearchText('')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Bulk Actions Bar */}
        {selectedRows.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3 flex items-center justify-between">
            <span className="text-sm text-blue-900 font-medium">
              {selectedRows.size} ad{selectedRows.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <ButtonComponent 
                cssClass="e-small e-success"
                onClick={() => handleAdAction('enable', Array.from(selectedRows))}
              >
                Enable
              </ButtonComponent>
              <ButtonComponent 
                cssClass="e-small e-warning"
                onClick={() => handleAdAction('pause', Array.from(selectedRows))}
              >
                Pause
              </ButtonComponent>
              <ButtonComponent 
                cssClass="e-small e-danger"
                onClick={() => handleAdAction('delete', Array.from(selectedRows))}
              >
                Delete
              </ButtonComponent>
              <ButtonComponent 
                cssClass="e-small"
                onClick={() => setSelectedRows(new Set())}
              >
                Cancel
              </ButtonComponent>
            </div>
          </div>
        )}

        {/* DATA TABLE */}
        <div className="bg-white border border-gray-200 rounded overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left w-8 sticky left-0 bg-gray-50">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 cursor-pointer"
                    checked={selectedRows.size === filteredAds.length && filteredAds.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-3 py-2 text-left w-8"></th>
                <th 
                  className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 min-w-[300px]" 
                  onClick={() => handleSort('name')}
                >
                  Ad {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 min-w-[120px]">Ad group</th>
                <th 
                  className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 min-w-[100px]" 
                  onClick={() => handleSort('status')}
                >
                  Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-3 py-2 text-center font-medium text-gray-700 cursor-pointer hover:bg-gray-100 min-w-[80px]" 
                  onClick={() => handleSort('adStrength')}
                >
                  Ad strength {sortConfig?.key === 'adStrength' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 min-w-[120px]" 
                  onClick={() => handleSort('type')}
                >
                  Ad type {sortConfig?.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                {/* Dynamic metric columns based on visibility */}
                {visibleColumnConfigs.map(col => (
                  <th 
                    key={col.key}
                    className={`px-3 py-2 font-medium text-gray-700 min-w-[90px] ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredAds.length === 0 ? (
                <tr>
                  <td colSpan={totalColumns} className="px-3 py-8 text-center">
                    <div className="text-gray-500">
                      <p className="text-base mb-1">No ads found</p>
                      {(topSearchText || tableSearchText || activeFilterCount > 0) && (
                        <p className="text-xs">Try adjusting your search or filters</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAds.map((ad) => {
                  const isExpanded = expandedRows.has(ad.id);
                  const assetRows = ad.getAssetRows();
                  
                  return (
                    <React.Fragment key={ad.id}>
                      {/* Main Ad Row */}
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 sticky left-0 bg-white">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 cursor-pointer"
                            checked={selectedRows.has(ad.id)}
                            onChange={() => toggleRowSelection(ad.id)}
                          />
                        </td>
                        <td className="px-3 py-2">
                          {assetRows.length > 0 && (
                            <button 
                              onClick={() => toggleRowExpansion(ad.id)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {isExpanded ? '▼' : '▶'}
                            </button>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-col gap-1">
                            <a href="#" className="text-blue-600 hover:underline font-medium">
                              {ad.primaryHeadline}
                            </a>
                            <span className="text-gray-600 text-xs">{ad.primaryDescription}</span>
                            <a href={ad.finalUrl} className="text-green-700 text-xs hover:underline" target="_blank" rel="noopener noreferrer">
                              {ad.displayUrl}
                            </a>
                            {ad.hasPolicyIssues() && (
                              <div className="flex items-center gap-1 text-xs text-red-600">
                                <span>⚠️ Policy issues</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-xs">
                              <a href="#" className="text-blue-600 hover:underline">View assets details</a>
                              <span>·</span>
                              <a href="#" className="text-blue-600 hover:underline">Preview ads</a>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <a href="#" className="text-blue-600 hover:underline">
                            {ad.adGroupName}
                          </a>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded text-xs whitespace-nowrap ${
                            ad.status === AdStatusUI.ENABLED 
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : ad.status === AdStatusUI.PAUSED
                              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              : ad.status === AdStatusUI.DISAPPROVED
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-gray-50 text-gray-700 border border-gray-200'
                          }`}>
                            {ad.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`font-medium ${
                            ad.adStrength === AdAdStrengthUI.EXCELLENT ? 'text-green-600' :
                            ad.adStrength === AdAdStrengthUI.GOOD ? 'text-blue-600' :
                            ad.adStrength === AdAdStrengthUI.AVERAGE ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {ad.adStrength}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-gray-700">{ad.type}</span>
                        </td>
                        {/* Dynamic metric columns */}
                        {visibleColumnConfigs.map(col => (
                          <td 
                            key={col.key}
                            className={`px-3 py-2 ${
                              col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                            }`}
                          >
                            {getMetricValue(ad, col.key)}
                          </td>
                        ))}
                      </tr>

                      {/* Asset Sub-rows (expanded view) */}
                      {isExpanded && assetRows.map((asset, idx) => (
                        <tr key={`${ad.id}-asset-${idx}`} className="bg-gray-50 border-b border-gray-100">
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5 pl-8">
                            <div className="flex flex-col">
                              <span className="text-gray-600 font-medium">{asset.name}</span>
                              <span className="text-gray-700">{asset.text}</span>
                              {asset.pinning && (
                                <span className="text-xs text-blue-600">Pinned: {asset.pinning}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5"></td>
                          {/* Empty cells for dynamic columns in expanded rows */}
                          {visibleColumnConfigs.map((col, colIdx) => (
                            <td key={col.key} className="px-3 py-1.5 text-right text-gray-500">
                              {colIdx === 0 ? asset.impressions : 
                               colIdx === 1 ? asset.clicks :
                               colIdx === 2 ? '-' :
                               colIdx === 3 ? asset.interactionRate + '%' :
                               colIdx === 4 ? '₹' + asset.avgCost :
                               colIdx === 5 ? '₹' + asset.cost :
                               colIdx === 6 ? asset.conversions :
                               colIdx === 7 ? asset.conversionRate + '%' :
                               '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIALOGS */}

      {/* Table Search Dialog */}
      <DialogComponent
        width="480px"
        isModal={true}
        visible={showTableSearchDialog}
        close={() => setShowTableSearchDialog(false)}
        header="Search Table"
        showCloseIcon={true}
      >
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">
            Search across all table fields: ad name, headline, description, URL, etc.
          </p>
          <TextBoxComponent
            placeholder="Enter keyword to search..."
            showClearButton={true}
            value={tableSearchText}
            input={handleTableSearchChange}
            change={handleTableSearchChange}
            cssClass="w-full"
          />
        </div>
      </DialogComponent>

      {/* Filter Dialog */}
      <DialogComponent
        width="480px"
        isModal={true}
        visible={showFilterDialog}
        close={() => setShowFilterDialog(false)}
        header="Add Filter"
        showCloseIcon={true}
      >
        <div className="p-4 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Status</label>
            <div className="space-y-2">
              {Object.values(AdStatusUI).map((status) => (
                <div key={status} className="flex items-center">
                  <CheckBoxComponent
                    label={status}
                    checked={localFilters.adStatus.includes(status)}
                    change={(e) => {
                      setLocalFilters(prev => ({
                        ...prev,
                        adStatus: e.checked
                          ? [...prev.adStatus, status]
                          : prev.adStatus.filter(s => s !== status)
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Type</label>
            <div className="space-y-2">
              {Object.values(AdTypeUI).map((type) => (
                <div key={type} className="flex items-center">
                  <CheckBoxComponent
                    label={type}
                    checked={localFilters.adType.includes(type)}
                    change={(e) => {
                      setLocalFilters(prev => ({
                        ...prev,
                        adType: e.checked
                          ? [...prev.adType, type]
                          : prev.adType.filter(t => t !== type)
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Strength</label>
            <div className="space-y-2">
              {Object.values(AdAdStrengthUI).map((strength) => (
                <div key={strength} className="flex items-center">
                  <CheckBoxComponent
                    label={strength}
                    checked={localFilters.adStrength.includes(strength)}
                    change={(e) => {
                      setLocalFilters(prev => ({
                        ...prev,
                        adStrength: e.checked
                          ? [...prev.adStrength, strength]
                          : prev.adStrength.filter(s => s !== strength)
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogComponent>

      {/* Column Selection Dialog - FIXED */}
      <DialogComponent
        width="420px"
        isModal={true}
        visible={showColumnDialog}
        close={() => setShowColumnDialog(false)}
        header="Select Columns"
        showCloseIcon={true}
      >
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">
            Choose which metric columns to display in the table. 
            <span className="font-medium"> {visibleColumns.length} selected</span>
          </p>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {COLUMN_CONFIG.map((col) => (
              <div key={col.key} className="flex items-center py-1 hover:bg-gray-50 rounded px-2">
                <CheckBoxComponent
                  label={col.label}
                  checked={visibleColumns.includes(col.key)}
                  change={() => toggleColumnVisibility(col.key)}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4 border-t mt-4">
            <ButtonComponent 
              cssClass="e-link"
              onClick={() => setVisibleColumns(COLUMN_CONFIG.map(c => c.key))}
            >
              Select All
            </ButtonComponent>
          </div>
        </div>
      </DialogComponent>

      {/* Segment Dialog */}
      <DialogComponent
        width="450px"
        isModal={true}
        visible={showSegmentDialog}
        close={() => setShowSegmentDialog(false)}
        header="Segment Data"
        showCloseIcon={true}
      >
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">Select how you want to segment your ad data</p>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Time &gt; Day</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Time &gt; Week</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Device</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Ad type</button>
          </div>
        </div>
      </DialogComponent>

      {/* FAB Button */}
      <button 
        className="fixed bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-50 transition-all"
        title="New ad"
        aria-label="Create new ad"
      >
        <span className="text-xl">+</span>
      </button>

      {/* Scroll to Top Button */}
      <button 
        className="fixed bottom-6 right-6 bg-white hover:bg-gray-50 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-md z-50 transition-all"
        title="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <span className="text-gray-600 text-xs">▲</span>
      </button>
    </div>
  );
};
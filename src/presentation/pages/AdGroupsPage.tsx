// presentation/pages/AdGroupsPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useAdGroups, useDateRange, useAdGroupTimeSeries } from '@application/hooks';
import { AdGroupService } from '@application/services';
import { 
  AdGroupStatusUI, 
  AdGroupTypeUI, 
  AdGroupUI,
  AdGroupMetricColumn,
  AdRow,
  KeywordRow
} from '@application/dto';

// UI library imports
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

// Column configuration with labels and alignment
const COLUMN_CONFIG: { key: AdGroupMetricColumn; label: string; align: 'left' | 'right' | 'center' }[] = [
  { key: 'impressions', label: 'Impr.', align: 'right' },
  { key: 'clicks', label: 'Clicks', align: 'right' },
  { key: 'interactions', label: 'Interactions', align: 'right' },
  { key: 'interactionRate', label: 'Interaction rate', align: 'right' },
  { key: 'averageCpc', label: 'Avg. CPC', align: 'right' },
  { key: 'cost', label: 'Cost', align: 'right' },
  { key: 'conversions', label: 'Conversions', align: 'right' },
  { key: 'conversionRate', label: 'Conv. rate', align: 'right' },
  { key: 'ctr', label: 'CTR', align: 'right' },
  { key: 'costPerConversion', label: 'Cost/conv.', align: 'right' },
];

export const AdGroupsPage: React.FC = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Backend filters state (sent to hooks)
  const [backendFilters, setBackendFilters] = useState<any>({});
  
  // Local filters state (UI state before applying)
  const [localFilters, setLocalFilters] = useState<{
    adGroupStatus: AdGroupStatusUI[];
    adGroupType: AdGroupTypeUI[];
    campaignId: string[];
  }>({
    adGroupStatus: [],
    adGroupType: [],
    campaignId: []
  });
  
  // Hooks - use existing hooks pattern
  const { adGroups, loading, error, updateFilters, refetch } = useAdGroups(backendFilters);
  const { dateRange, preset, setPreset, formatDisplay } = useDateRange('allTime');
  
  // UI State
  const [selectedAdGroupId, setSelectedAdGroupId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expandedView, setExpandedView] = useState<'ads' | 'keywords'>('ads');
  const [topSearchText, setTopSearchText] = useState('');
  const [tableSearchText, setTableSearchText] = useState('');
  const [showTableSearchDialog, setShowTableSearchDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showColumnDialog, setShowColumnDialog] = useState(false);
  const [showSegmentDialog, setShowSegmentDialog] = useState(false);
  const [showReportsMenu, setShowReportsMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState<AdGroupMetricColumn[]>([
    'impressions', 
    'clicks', 
    'interactions',
    'interactionRate',
    'averageCpc',
    'cost',
    'conversions',
    'conversionRate',
  ]);

  // Time series data hook
  const activeAdGroupId = selectedAdGroupId || (adGroups.length > 0 ? adGroups[0]?.id : null);
  const { data: timeSeriesData, loading: chartLoading, setDateRange: updateTimeSeriesDateRange } = useAdGroupTimeSeries(
    activeAdGroupId,
    dateRange
  );

  // ============================================
  // EFFECTS
  // ============================================

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

  // ============================================
  // CONSTANTS
  // ============================================

  // Date range presets
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

  // ============================================
  // MEMOIZED VALUES
  // ============================================

  // Get unique campaigns for filter dropdown
  const uniqueCampaigns = useMemo(() => {
    const campaigns = new Map<string, string>();
    adGroups.forEach(ag => {
      campaigns.set(ag.campaignId, ag.campaignName);
    });
    return Array.from(campaigns.entries()).map(([id, name]) => ({ id, name }));
  }, [adGroups]);

  // Filter and sort ad groups
  const filteredAdGroups = useMemo(() => {
    let filtered = [...adGroups];

    // TOP SEARCH BAR - Search names and campaign
    if (topSearchText.trim()) {
      const search = topSearchText.toLowerCase().trim();
      filtered = filtered.filter(ag => 
        ag.name.toLowerCase().includes(search) ||
        ag.campaignName.toLowerCase().includes(search)
      );
    }

    // TABLE KEYWORD SEARCH - Searches all fields
    if (tableSearchText.trim()) {
      const search = tableSearchText.toLowerCase().trim();
      filtered = filtered.filter(ag => {
        return (
          ag.name.toLowerCase().includes(search) ||
          ag.id.toLowerCase().includes(search) ||
          ag.status.toLowerCase().includes(search) ||
          ag.type.toLowerCase().includes(search) ||
          ag.campaignName.toLowerCase().includes(search) ||
          ag.campaignId.toLowerCase().includes(search)
        );
      });
    }

    // Status filter
    if (localFilters.adGroupStatus.length > 0) {
      filtered = filtered.filter(ag => 
        localFilters.adGroupStatus.includes(ag.status)
      );
    }

    // Type filter
    if (localFilters.adGroupType.length > 0) {
      filtered = filtered.filter(ag => 
        localFilters.adGroupType.includes(ag.type)
      );
    }

    // Campaign filter
    if (localFilters.campaignId.length > 0) {
      filtered = filtered.filter(ag => 
        localFilters.campaignId.includes(ag.campaignId)
      );
    }

    // Sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

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
          case 'campaign':
            aValue = a.campaignName.toLowerCase();
            bValue = b.campaignName.toLowerCase();
            break;
          case 'defaultBid':
            aValue = a.defaultBid?.amount || 0;
            bValue = b.defaultBid?.amount || 0;
            break;
          case 'ads':
            aValue = a.adCount;
            bValue = b.adCount;
            break;
          case 'keywords':
            aValue = a.keywordCount;
            bValue = b.keywordCount;
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
  }, [adGroups, topSearchText, tableSearchText, localFilters, sortConfig]);

  // Calculate aggregated metrics from time series
  const aggregatedMetrics = useMemo(() => {
    if (timeSeriesData.length === 0) {
      return {
        totalImpressions: 0,
        totalClicks: 0,
        totalInteractions: 0,
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
      interactions: acc.interactions + item.interactions,
      conversions: acc.conversions + item.conversions,
      cost: acc.cost + item.cost
    }), { impressions: 0, clicks: 0, interactions: 0, conversions: 0, cost: 0 });

    return {
      totalImpressions: totals.impressions,
      totalClicks: totals.clicks,
      totalInteractions: totals.interactions,
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

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  // Get metric value for a column
  const getMetricValue = (adGroup: AdGroupUI, columnKey: AdGroupMetricColumn): string => {
    const metrics = adGroup.metrics;
    switch (columnKey) {
      case 'impressions':
        return metrics.impressions.toLocaleString();
      case 'clicks':
        return metrics.clicks.toLocaleString();
      case 'interactions':
        return metrics.interactions.toLocaleString();
      case 'interactionRate':
        return metrics.interactionRate;
      case 'averageCpc':
        return metrics.averageCpc.format();
      case 'cost':
        return metrics.cost.format();
      case 'conversions':
        return metrics.conversions.toFixed(2);
      case 'conversionRate':
        return metrics.conversionRate;
      case 'ctr':
        return metrics.ctr + '%';
      case 'costPerConversion':
        return metrics.costPerConversion.format();
      default:
        return '-';
    }
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const toggleRowExpansion = (adGroupId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(adGroupId)) {
        newSet.delete(adGroupId);
      } else {
        newSet.add(adGroupId);
      }
      return newSet;
    });
  };

  const toggleRowSelection = (adGroupId: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(adGroupId)) {
        newSet.delete(adGroupId);
      } else {
        newSet.add(adGroupId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredAdGroups.length && filteredAdGroups.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredAdGroups.map(ag => ag.id)));
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

  const handleDateRangeChange = (e: any) => {
    if (e.value) {
      setPreset(e.value);
    }
  };

  // Apply filters to backend
  const applyFilters = () => {
    const newBackendFilters: any = {};
    
    if (localFilters.adGroupStatus.length > 0) {
      newBackendFilters.status = localFilters.adGroupStatus;
    }
    
    if (localFilters.adGroupType.length > 0) {
      newBackendFilters.type = localFilters.adGroupType;
    }

    if (localFilters.campaignId.length > 0) {
      newBackendFilters.campaignId = localFilters.campaignId;
    }
    
    setBackendFilters(newBackendFilters);
    updateFilters(newBackendFilters);
    setShowFilterDialog(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setLocalFilters({
      adGroupStatus: [],
      adGroupType: [],
      campaignId: []
    });
    setTopSearchText('');
    setTableSearchText('');
    setBackendFilters({});
    updateFilters({});
  };

  // Handle ad group actions (pause, enable, delete)
  const handleAdGroupAction = async (action: 'pause' | 'enable' | 'delete', ids: string[]) => {
    try {
      if (action === 'pause') {
        await AdGroupService.bulkPauseAdGroups(ids);
      } else if (action === 'enable') {
        await AdGroupService.bulkEnableAdGroups(ids);
      } else if (action === 'delete') {
        await AdGroupService.bulkDeleteAdGroups(ids);
      }
      await refetch();
      setSelectedRows(new Set());
    } catch (err) {
      console.error('Ad group action failed:', err);
    }
  };

  // Download CSV report
  const downloadReport = () => {
    const headers = ['Ad Group', 'Campaign', 'Status', 'Type', 'Default Bid', 'Ads', 'Keywords', ...visibleColumnConfigs.map(c => c.label)];
    const rows = filteredAdGroups.map(ag => [
      ag.name,
      ag.campaignName,
      ag.status,
      ag.type,
      ag.getFormattedBid(),
      ag.adCount.toString(),
      ag.keywordCount.toString(),
      ...visibleColumnConfigs.map(col => getMetricValue(ag, col.key))
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ad_groups_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Expand/Collapse all rows
  const expandCollapseAll = () => {
    if (expandedRows.size === filteredAdGroups.length) {
      setExpandedRows(new Set());
    } else {
      setExpandedRows(new Set(filteredAdGroups.map(ag => ag.id)));
    }
  };

  // Toggle column visibility
  const toggleColumnVisibility = (columnKey: AdGroupMetricColumn) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnKey)) {
        return prev.filter(c => c !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  // Remove individual filter chip
  const removeFilter = (filterType: 'status' | 'type' | 'campaign', value: string) => {
    if (filterType === 'status') {
      setLocalFilters(prev => ({
        ...prev,
        adGroupStatus: prev.adGroupStatus.filter(s => s !== value)
      }));
    } else if (filterType === 'type') {
      setLocalFilters(prev => ({
        ...prev,
        adGroupType: prev.adGroupType.filter(t => t !== value)
      }));
    } else if (filterType === 'campaign') {
      setLocalFilters(prev => ({
        ...prev,
        campaignId: prev.campaignId.filter(c => c !== value)
      }));
    }
  };

  // Active filter count
  const activeFilterCount = 
    localFilters.adGroupStatus.length +
    localFilters.adGroupType.length +
    localFilters.campaignId.length;

  // Total columns for colspan
  const totalColumns = 8 + visibleColumnConfigs.length;

  // ============================================
  // LOADING AND ERROR STATES
  // ============================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-500 text-lg">Loading ad groups...</div>
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

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="bg-white min-h-screen">
      {/* ============================================ */}
      {/* TOP BAR - Page Title & Date Range */}
      {/* ============================================ */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-4 py-2 flex items-center justify-between gap-4">
          {/* Left: Search Bar */}
          <div className="flex-1 max-w-xs">
            <TextBoxComponent
              placeholder="Search for ad groups or campaigns"
              showClearButton={true}
              value={topSearchText}
              input={handleTopSearchChange}
              change={handleTopSearchChange}
              cssClass="w-full"
            />
          </div>

          {/* Right: User actions */}
          <div className="flex items-center gap-3">
            <ButtonComponent iconCss="e-icons e-refresh" cssClass="e-flat e-small" title="Refresh" onClick={refetch} />
            <ButtonComponent iconCss="e-icons e-help" cssClass="e-flat e-small" title="Help" />
            <span className="text-xs text-gray-600">Account</span>
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
              A
            </div>
          </div>
        </div>

        {/* Page Title and Date Range */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
          <h1 className="text-2xl font-normal text-gray-900">Ad groups</h1>
          
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
            <ButtonComponent iconCss="e-icons e-chevron-left" cssClass="e-flat e-small" />
            <ButtonComponent iconCss="e-icons e-chevron-right" cssClass="e-flat e-small" />
            <ButtonComponent 
              cssClass="e-link e-small text-blue-600"
              onClick={() => setPreset('last30days')}
            >
              Show last 30 days
            </ButtonComponent>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* FILTER CHIPS BAR */}
      {/* ============================================ */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <span className="text-gray-700 font-medium">Filters</span>
          
          {/* Status Filter Chips */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Status:</span>
            {localFilters.adGroupStatus.length > 0 ? (
              localFilters.adGroupStatus.map(status => (
                <span key={status} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-gray-700">
                  {status}
                  <button 
                    onClick={() => removeFilter('status', status)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-500">All</span>
            )}
          </div>

          {/* Type Filter Chips */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Type:</span>
            {localFilters.adGroupType.length > 0 ? (
              localFilters.adGroupType.map(type => (
                <span key={type} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-gray-700">
                  {type}
                  <button 
                    onClick={() => removeFilter('type', type)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-500">All</span>
            )}
          </div>

          {/* Campaign Filter Chips */}
          {localFilters.campaignId.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Campaign:</span>
              {localFilters.campaignId.map(campId => {
                const camp = uniqueCampaigns.find(c => c.id === campId);
                return (
                  <span key={campId} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-gray-700">
                    {camp?.name || campId}
                    <button 
                      onClick={() => removeFilter('campaign', campId)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}

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

      {/* ============================================ */}
      {/* MAIN CONTENT AREA */}
      {/* ============================================ */}
      <div className="px-4 py-4">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-4">
          <button className="pb-2 border-b-2 border-blue-600 text-blue-600 font-medium text-sm">
            Ad groups
          </button>
        </div>

        {/* ============================================ */}
        {/* METRICS CARDS */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
              <span className="text-xs text-gray-700">Clicks</span>
              <ButtonComponent iconCss="e-icons e-more-vert" cssClass="e-flat e-small" />
            </div>
            <div className="text-2xl font-normal text-gray-900 mb-1">
              {aggregatedMetrics.totalClicks.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">{formatDisplay()}</div>
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

        {/* ============================================ */}
        {/* CHART SECTION */}
        {/* ============================================ */}
        <div className="bg-white border border-gray-200 rounded mb-4">
          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Performance: {formatDisplay()}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-600">● Impressions</span>
              <span className="text-xs text-green-600">● Clicks</span>
              <span className="text-xs text-amber-600">● Conversions</span>
            </div>
          </div>
          {chartLoading ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              Loading chart data...
            </div>
          ) : timeSeriesData.length > 0 ? (
            <ChartComponent
              id="adgroups-chart"
              primaryXAxis={{ 
                valueType: 'DateTime',
                labelFormat: 'MMM dd',
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
                  marker={{ visible: false }}
                  fill="#3b82f6"
                />
                <SeriesDirective
                  dataSource={timeSeriesData}
                  xName="date"
                  yName="clicks"
                  name="Clicks"
                  type="Line"
                  width={2}
                  marker={{ visible: false }}
                  fill="#10b981"
                />
                <SeriesDirective
                  dataSource={timeSeriesData}
                  xName="date"
                  yName="conversions"
                  name="Conversions"
                  type="Line"
                  width={2}
                  marker={{ visible: false }}
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

        {/* ============================================ */}
        {/* TABLE TOOLBAR */}
        {/* ============================================ */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {filteredAdGroups.length} ad group{filteredAdGroups.length !== 1 ? 's' : ''} • {visibleColumnConfigs.length} columns shown
            </span>
          </div>

          <div className="flex items-center gap-2 relative">
            <ButtonComponent 
              iconCss="e-icons e-search" 
              cssClass="e-flat e-small" 
              onClick={() => setShowTableSearchDialog(true)}
              title="Search table (all fields)"
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
                onClick={() => setShowReportsMenu(!showReportsMenu)}
              >
                Reports
              </ButtonComponent>
              {showReportsMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 w-56">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Performance Report
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Ad Group Report
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Keyword Report
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Create Custom Report
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
                onClick={() => setShowMoreMenu(!showMoreMenu)}
              >
                More
              </ButtonComponent>
              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 w-48">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Export to Excel
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Export to CSV
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Schedule Report
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
              {selectedRows.size} ad group{selectedRows.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <ButtonComponent 
                cssClass="e-small e-success"
                onClick={() => handleAdGroupAction('enable', Array.from(selectedRows))}
              >
                Enable
              </ButtonComponent>
              <ButtonComponent 
                cssClass="e-small e-warning"
                onClick={() => handleAdGroupAction('pause', Array.from(selectedRows))}
              >
                Pause
              </ButtonComponent>
              <ButtonComponent 
                cssClass="e-small e-danger"
                onClick={() => handleAdGroupAction('delete', Array.from(selectedRows))}
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

        {/* Expanded View Toggle */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-600">Show in expanded rows:</span>
          <button 
            className={`px-2 py-1 text-xs rounded ${expandedView === 'ads' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setExpandedView('ads')}
          >
            Ads
          </button>
          <button 
            className={`px-2 py-1 text-xs rounded ${expandedView === 'keywords' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setExpandedView('keywords')}
          >
            Keywords
          </button>
        </div>

        {/* ============================================ */}
        {/* DATA TABLE */}
        {/* ============================================ */}
        <div className="bg-white border border-gray-200 rounded overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left w-8 sticky left-0 bg-gray-50">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 cursor-pointer"
                    checked={selectedRows.size === filteredAdGroups.length && filteredAdGroups.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-3 py-2 text-left w-8"></th>
                <th 
                  className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 min-w-[200px]" 
                  onClick={() => handleSort('name')}
                >
                  Ad group {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 min-w-[150px]" 
                  onClick={() => handleSort('campaign')}
                >
                  Campaign {sortConfig?.key === 'campaign' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 min-w-[100px]" 
                  onClick={() => handleSort('status')}
                >
                  Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 min-w-[100px]" 
                  onClick={() => handleSort('type')}
                >
                  Type {sortConfig?.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-3 py-2 text-right font-medium text-gray-700 cursor-pointer hover:bg-gray-100 min-w-[100px]" 
                  onClick={() => handleSort('defaultBid')}
                >
                  Default bid {sortConfig?.key === 'defaultBid' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-3 py-2 text-center font-medium text-gray-700 cursor-pointer hover:bg-gray-100 min-w-[60px]" 
                  onClick={() => handleSort('ads')}
                >
                  Ads {sortConfig?.key === 'ads' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                {/* Dynamic metric columns */}
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
              {filteredAdGroups.length === 0 ? (
                <tr>
                  <td colSpan={totalColumns} className="px-3 py-8 text-center">
                    <div className="text-gray-500">
                      <p className="text-base mb-1">No ad groups found</p>
                      {(topSearchText || tableSearchText || activeFilterCount > 0) && (
                        <p className="text-xs">Try adjusting your search or filters</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAdGroups.map((adGroup) => {
                  const isExpanded = expandedRows.has(adGroup.id);
                  const adRows = adGroup.getAdRows();
                  const keywordRows = adGroup.getKeywordRows();
                  const subRows = expandedView === 'ads' ? adRows : keywordRows;
                  
                  return (
                    <React.Fragment key={adGroup.id}>
                      {/* Main Ad Group Row */}
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 sticky left-0 bg-white">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 cursor-pointer"
                            checked={selectedRows.has(adGroup.id)}
                            onChange={() => toggleRowSelection(adGroup.id)}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button 
                            onClick={() => toggleRowExpansion(adGroup.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {isExpanded ? '▼' : '▶'}
                          </button>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              adGroup.status === AdGroupStatusUI.ENABLED ? 'bg-green-500' : 
                              adGroup.status === AdGroupStatusUI.PAUSED ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></span>
                            <a href="#" className="text-blue-600 hover:underline font-medium">
                              {adGroup.name}
                            </a>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {adGroup.keywordCount} keywords
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <a href="#" className="text-blue-600 hover:underline">
                            {adGroup.campaignName}
                          </a>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded text-xs whitespace-nowrap ${
                            adGroup.status === AdGroupStatusUI.ENABLED 
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : adGroup.status === AdGroupStatusUI.PAUSED
                              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              : 'bg-gray-50 text-gray-700 border border-gray-200'
                          }`}>
                            {adGroup.status}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-gray-700">{adGroup.type}</span>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <span>{adGroup.getFormattedBid()}</span>
                            <button className="text-gray-400 hover:text-gray-600 text-xs">✏️</button>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <a href="#" className="text-blue-600 hover:underline">
                            {adGroup.adCount}
                          </a>
                        </td>
                        {/* Dynamic metric columns */}
                        {visibleColumnConfigs.map(col => (
                          <td 
                            key={col.key}
                            className={`px-3 py-2 ${
                              col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                            }`}
                          >
                            {getMetricValue(adGroup, col.key)}
                          </td>
                        ))}
                      </tr>

                      {/* Expanded Sub-rows (Ads or Keywords) */}
                      {isExpanded && expandedView === 'ads' && adRows.map((ad, idx) => (
                        <tr key={`${adGroup.id}-ad-${idx}`} className="bg-gray-50 border-b border-gray-100">
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5 pl-8" colSpan={2}>
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${ad.status === 'Enabled' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                              <span className="text-gray-700">{ad.headline}</span>
                            </div>
                          </td>
                          <td className="px-3 py-1.5">
                            <span className="text-xs text-gray-500">{ad.status}</span>
                          </td>
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5"></td>
                          {visibleColumnConfigs.map((col, colIdx) => (
                            <td key={col.key} className="px-3 py-1.5 text-right text-gray-500">
                              {colIdx === 0 ? ad.impressions.toLocaleString() : 
                               colIdx === 1 ? ad.clicks.toLocaleString() :
                               colIdx === 2 ? ad.clicks.toLocaleString() :
                               colIdx === 3 ? ad.ctr + '%' :
                               colIdx === 4 ? '₹' + (parseFloat(ad.cost) / ad.clicks).toFixed(2) :
                               colIdx === 5 ? '₹' + ad.cost :
                               colIdx === 6 ? ad.conversions :
                               colIdx === 7 ? ad.conversionRate + '%' :
                               '-'}
                            </td>
                          ))}
                        </tr>
                      ))}

                      {isExpanded && expandedView === 'keywords' && keywordRows.map((kw, idx) => (
                        <tr key={`${adGroup.id}-kw-${idx}`} className="bg-gray-50 border-b border-gray-100">
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5 pl-8" colSpan={2}>
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${kw.status === 'Enabled' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                              <span className="text-gray-700">{kw.keyword}</span>
                              <span className="text-xs text-gray-400">[{kw.matchType}]</span>
                            </div>
                          </td>
                          <td className="px-3 py-1.5">
                            <span className="text-xs text-gray-500">{kw.status}</span>
                          </td>
                          <td className="px-3 py-1.5">
                            {kw.qualityScore && (
                              <span className={`text-xs font-medium ${
                                kw.qualityScore >= 8 ? 'text-green-600' : 
                                kw.qualityScore >= 5 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                QS: {kw.qualityScore}/10
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-1.5 text-right">₹{kw.maxCpc}</td>
                          <td className="px-3 py-1.5"></td>
                          {visibleColumnConfigs.map((col, colIdx) => (
                            <td key={col.key} className="px-3 py-1.5 text-right text-gray-500">
                              {colIdx === 0 ? kw.impressions.toLocaleString() : 
                               colIdx === 1 ? kw.clicks.toLocaleString() :
                               colIdx === 2 ? kw.clicks.toLocaleString() :
                               colIdx === 3 ? kw.ctr + '%' :
                               colIdx === 4 ? '₹' + (parseFloat(kw.cost) / kw.clicks).toFixed(2) :
                               colIdx === 5 ? '₹' + kw.cost :
                               colIdx === 6 ? kw.conversions :
                               colIdx === 7 ? '-' :
                               '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })
              )}

              {/* Total Rows */}
              {filteredAdGroups.length > 0 && (
                <>
                  <tr className="border-b border-gray-200 bg-gray-50 font-medium">
                    <td className="px-3 py-2"></td>
                    <td className="px-3 py-2">
                      <button className="text-gray-500">▶</button>
                    </td>
                    <td className="px-3 py-2" colSpan={6}>
                      <div className="flex items-center gap-2">
                        <span>Total: Ad groups in current view</span>
                        <span className="text-gray-400 cursor-help" title="Total for filtered ad groups">ℹ️</span>
                      </div>
                    </td>
                    {visibleColumnConfigs.map((col, idx) => (
                      <td key={col.key} className="px-3 py-2 text-right">
                        {idx === 0 ? aggregatedMetrics.totalImpressions.toLocaleString() :
                         idx === 1 ? aggregatedMetrics.totalClicks.toLocaleString() :
                         idx === 2 ? aggregatedMetrics.totalInteractions.toLocaleString() :
                         idx === 3 ? aggregatedMetrics.avgCtr.toFixed(2) + '%' :
                         idx === 4 ? '₹' + aggregatedMetrics.avgCpc.toFixed(2) :
                         idx === 5 ? '₹' + aggregatedMetrics.totalCost.toFixed(2) :
                         idx === 6 ? aggregatedMetrics.totalConversions.toFixed(2) :
                         idx === 7 ? aggregatedMetrics.conversionRate.toFixed(2) + '%' :
                         '-'}
                      </td>
                    ))}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================ */}
      {/* DIALOGS */}
      {/* ============================================ */}

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
            Search across all table fields: ad group name, campaign, status, type, etc.
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
        width="520px"
        isModal={true}
        visible={showFilterDialog}
        close={() => setShowFilterDialog(false)}
        header="Add Filter"
        showCloseIcon={true}
      >
        <div className="p-4 space-y-5 max-h-[500px] overflow-y-auto">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Group Status</label>
            <div className="space-y-2">
              {Object.values(AdGroupStatusUI).map((status) => (
                <div key={status} className="flex items-center">
                  <CheckBoxComponent
                    label={status}
                    checked={localFilters.adGroupStatus.includes(status)}
                    change={(e) => {
                      setLocalFilters(prev => ({
                        ...prev,
                        adGroupStatus: e.checked
                          ? [...prev.adGroupStatus, status]
                          : prev.adGroupStatus.filter(s => s !== status)
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Group Type</label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {Object.values(AdGroupTypeUI).slice(0, 10).map((type) => (
                <div key={type} className="flex items-center">
                  <CheckBoxComponent
                    label={type}
                    checked={localFilters.adGroupType.includes(type)}
                    change={(e) => {
                      setLocalFilters(prev => ({
                        ...prev,
                        adGroupType: e.checked
                          ? [...prev.adGroupType, type]
                          : prev.adGroupType.filter(t => t !== type)
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign</label>
            <div className="space-y-2">
              {uniqueCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center">
                  <CheckBoxComponent
                    label={campaign.name}
                    checked={localFilters.campaignId.includes(campaign.id)}
                    change={(e) => {
                      setLocalFilters(prev => ({
                        ...prev,
                        campaignId: e.checked
                          ? [...prev.campaignId, campaign.id]
                          : prev.campaignId.filter(c => c !== campaign.id)
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogComponent>

      {/* Column Selection Dialog */}
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
            <ButtonComponent 
              cssClass="e-link text-red-600"
              onClick={() => setVisibleColumns([])}
            >
              Clear All
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
          <p className="text-sm text-gray-600 mb-3">Select how you want to segment your ad group data</p>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Time &gt; Day</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Time &gt; Week</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Time &gt; Month</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Device</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Network</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Click type</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Conversion action</button>
          </div>
        </div>
      </DialogComponent>

      {/* FAB Button - Create New Ad Group */}
      <button 
        className="fixed bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-50 transition-all"
        title="New ad group"
        aria-label="Create new ad group"
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
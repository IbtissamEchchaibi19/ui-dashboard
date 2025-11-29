// presentation/pages/AssetGroupsPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useAssetGroups, useDateRange, useAssetGroupTimeSeries } from '@application/hooks';

import { AssetGroupService } from '@application/services';
import { 
  AssetGroupStatusUI, 
  AssetGroupPrimaryStatusUI,
  AssetGroupAdStrengthUI,
  AssetGroupUI,
  AssetGroupMetricColumn,
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

// Column configuration
const COLUMN_CONFIG: { key: AssetGroupMetricColumn; label: string; align: 'left' | 'right' | 'center' }[] = [
  { key: 'impressions', label: 'Impr.', align: 'right' },
  { key: 'clicks', label: 'Clicks', align: 'right' },
  { key: 'ctr', label: 'CTR', align: 'right' },
  { key: 'interactions', label: 'Interactions', align: 'right' },
  { key: 'conversions', label: 'Conversions', align: 'right' },
  { key: 'conversionRate', label: 'Conv. rate', align: 'right' },
  { key: 'conversionsValue', label: 'Conv. value', align: 'right' },
  { key: 'cost', label: 'Cost', align: 'right' },
  { key: 'averageCpc', label: 'Avg. CPC', align: 'right' },
  { key: 'costPerConversion', label: 'Cost/conv.', align: 'right' },
  { key: 'roas', label: 'ROAS', align: 'right' },
];

export const AssetGroupsPage: React.FC = () => {
  // Backend filters state
  const [backendFilters, setBackendFilters] = useState<any>({});
  
  // Local filters state
  const [localFilters, setLocalFilters] = useState<{
    status: AssetGroupStatusUI[];
    primaryStatus: AssetGroupPrimaryStatusUI[];
    adStrength: AssetGroupAdStrengthUI[];
    campaignId: string[];
  }>({
    status: [],
    primaryStatus: [],
    adStrength: [],
    campaignId: []
  });
  
  // Hooks
  const { assetGroups, loading, error, updateFilters, refetch } = useAssetGroups(backendFilters);
  const { dateRange, preset, setPreset, formatDisplay } = useDateRange('allTime');
  
  // UI State
  const [selectedAssetGroupId, setSelectedAssetGroupId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [topSearchText, setTopSearchText] = useState('');
  const [tableSearchText, setTableSearchText] = useState('');
  const [showTableSearchDialog, setShowTableSearchDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showColumnDialog, setShowColumnDialog] = useState(false);
  const [showSegmentDialog, setShowSegmentDialog] = useState(false);
  const [showAssetDetailsDialog, setShowAssetDetailsDialog] = useState(false);
  const [selectedAssetGroupForDetails, setSelectedAssetGroupForDetails] = useState<AssetGroupUI | null>(null);
  const [showReportsMenu, setShowReportsMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState<AssetGroupMetricColumn[]>([
    'impressions', 
    'clicks', 
    'ctr',
    'conversions',
    'conversionRate',
    'cost',
    'averageCpc',
    'roas',
  ]);

  // Time series data hook
  const activeAssetGroupId = selectedAssetGroupId || (assetGroups.length > 0 ? assetGroups[0]?.id : null);
  const { data: timeSeriesData, loading: chartLoading, setDateRange: updateTimeSeriesDateRange } = useAssetGroupTimeSeries(
    activeAssetGroupId,
    dateRange
  );

  // Update time series when date range changes
  useEffect(() => {
    updateTimeSeriesDateRange(dateRange);
  }, [dateRange, updateTimeSeriesDateRange]);

  // Close dropdown menus
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

  // Get unique campaigns for filter
  const uniqueCampaigns = useMemo(() => {
    const campaigns = new Map<string, string>();
    assetGroups.forEach(ag => {
      campaigns.set(ag.campaignId, ag.campaignName);
    });
    return Array.from(campaigns.entries()).map(([id, name]) => ({ id, name }));
  }, [assetGroups]);

  // Filter and sort asset groups
  const filteredAssetGroups = useMemo(() => {
    let filtered = [...assetGroups];

    // Top search bar
    if (topSearchText.trim()) {
      const search = topSearchText.toLowerCase().trim();
      filtered = filtered.filter(ag => 
        ag.name.toLowerCase().includes(search) ||
        ag.campaignName.toLowerCase().includes(search) ||
        ag.businessName.toLowerCase().includes(search)
      );
    }

    // Table keyword search
    if (tableSearchText.trim()) {
      const search = tableSearchText.toLowerCase().trim();
      filtered = filtered.filter(ag => {
        return (
          ag.name.toLowerCase().includes(search) ||
          ag.id.toLowerCase().includes(search) ||
          ag.status.toLowerCase().includes(search) ||
          ag.primaryStatus.toLowerCase().includes(search) ||
          ag.adStrength.toLowerCase().includes(search) ||
          ag.campaignName.toLowerCase().includes(search) ||
          ag.finalUrl.toLowerCase().includes(search)
        );
      });
    }

    // Status filter
    if (localFilters.status.length > 0) {
      filtered = filtered.filter(ag => 
        localFilters.status.includes(ag.status)
      );
    }

    // Primary status filter
    if (localFilters.primaryStatus.length > 0) {
      filtered = filtered.filter(ag => 
        localFilters.primaryStatus.includes(ag.primaryStatus)
      );
    }

    // Ad strength filter
    if (localFilters.adStrength.length > 0) {
      filtered = filtered.filter(ag => 
        localFilters.adStrength.includes(ag.adStrength)
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
          case 'primaryStatus':
            aValue = a.primaryStatus;
            bValue = b.primaryStatus;
            break;
          case 'adStrength':
            aValue = a.adStrength;
            bValue = b.adStrength;
            break;
          case 'campaign':
            aValue = a.campaignName.toLowerCase();
            bValue = b.campaignName.toLowerCase();
            break;
          case 'assets':
            aValue = a.assetSummary.total;
            bValue = b.assetSummary.total;
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
  }, [assetGroups, topSearchText, tableSearchText, localFilters, sortConfig]);

  // Calculate aggregated metrics
  const aggregatedMetrics = useMemo(() => {
    if (timeSeriesData.length === 0) {
      return {
        totalImpressions: 0,
        totalClicks: 0,
        totalConversions: 0,
        totalConversionsValue: 0,
        totalCost: 0,
        avgCtr: 0,
        conversionRate: 0,
        avgCpc: 0,
        roas: 0
      };
    }

    const totals = timeSeriesData.reduce((acc, item) => ({
      impressions: acc.impressions + item.impressions,
      clicks: acc.clicks + item.clicks,
      conversions: acc.conversions + item.conversions,
      conversionsValue: acc.conversionsValue + item.conversionsValue,
      cost: acc.cost + item.cost
    }), { impressions: 0, clicks: 0, conversions: 0, conversionsValue: 0, cost: 0 });

    return {
      totalImpressions: totals.impressions,
      totalClicks: totals.clicks,
      totalConversions: totals.conversions,
      totalConversionsValue: totals.conversionsValue,
      totalCost: totals.cost,
      avgCtr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
      conversionRate: totals.clicks > 0 ? (totals.conversions / totals.clicks) * 100 : 0,
      avgCpc: totals.clicks > 0 ? totals.cost / totals.clicks : 0,
      roas: totals.cost > 0 ? totals.conversionsValue / totals.cost : 0
    };
  }, [timeSeriesData]);

  // Get visible column configs
  const visibleColumnConfigs = useMemo(() => {
    return COLUMN_CONFIG.filter(col => visibleColumns.includes(col.key));
  }, [visibleColumns]);

  // Helper to get metric value
  const getMetricValue = (assetGroup: AssetGroupUI, columnKey: AssetGroupMetricColumn): string => {
    const metrics = assetGroup.metrics;
    switch (columnKey) {
      case 'impressions':
        return metrics.impressions.toLocaleString();
      case 'clicks':
        return metrics.clicks.toLocaleString();
      case 'ctr':
        return metrics.ctr;
      case 'interactions':
        return metrics.interactions.toLocaleString();
      case 'interactionRate':
        return metrics.interactionRate;
      case 'conversions':
        return metrics.conversions.toFixed(2);
      case 'conversionRate':
        return metrics.conversionRate;
      case 'conversionsValue':
        return metrics.conversionsValue.format();
      case 'cost':
        return metrics.cost.format();
      case 'averageCpc':
        return metrics.averageCpc.format();
      case 'costPerConversion':
        return metrics.costPerConversion.format();
      case 'roas':
        return metrics.roas;
      default:
        return '-';
    }
  };

  // Event Handlers
  const toggleRowExpansion = (assetGroupId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assetGroupId)) {
        newSet.delete(assetGroupId);
      } else {
        newSet.add(assetGroupId);
      }
      return newSet;
    });
  };

  const toggleRowSelection = (assetGroupId: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assetGroupId)) {
        newSet.delete(assetGroupId);
      } else {
        newSet.add(assetGroupId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredAssetGroups.length && filteredAssetGroups.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredAssetGroups.map(ag => ag.id)));
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

  const handleDateRangeChange = (e: any) => {
    if (e.value) {
      setPreset(e.value);
    }
  };

  const handleTopSearchChange = (e: any) => {
    setTopSearchText(e.value || '');
  };

  const handleTableSearchChange = (e: any) => {
    setTableSearchText(e.value || '');
  };

  const applyFilters = () => {
    const newBackendFilters: any = {};
    
    if (localFilters.status.length > 0) {
      newBackendFilters.status = localFilters.status;
    }
    
    if (localFilters.primaryStatus.length > 0) {
      newBackendFilters.primaryStatus = localFilters.primaryStatus;
    }

    if (localFilters.adStrength.length > 0) {
      newBackendFilters.adStrength = localFilters.adStrength;
    }

    if (localFilters.campaignId.length > 0) {
      newBackendFilters.campaignId = localFilters.campaignId;
    }
    
    setBackendFilters(newBackendFilters);
    updateFilters(newBackendFilters);
    setShowFilterDialog(false);
  };

  const clearAllFilters = () => {
    setLocalFilters({
      status: [],
      primaryStatus: [],
      adStrength: [],
      campaignId: []
    });
    setTopSearchText('');
    setTableSearchText('');
    setBackendFilters({});
    updateFilters({});
  };

  const handleAssetGroupAction = async (action: 'pause' | 'enable' | 'delete', ids: string[]) => {
    try {
      if (action === 'pause') {
        await AssetGroupService.bulkPauseAssetGroups(ids);
      } else if (action === 'enable') {
        await AssetGroupService.bulkEnableAssetGroups(ids);
      } else if (action === 'delete') {
        await AssetGroupService.bulkDeleteAssetGroups(ids);
      }
      await refetch();
      setSelectedRows(new Set());
    } catch (err) {
      console.error('Asset group action failed:', err);
    }
  };

  const downloadReport = () => {
    const headers = ['Asset Group', 'Campaign', 'Status', 'Primary Status', 'Ad Strength', 'Assets', ...visibleColumnConfigs.map(c => c.label)];
    const rows = filteredAssetGroups.map(ag => [
      ag.name,
      ag.campaignName,
      ag.status,
      ag.primaryStatus,
      ag.adStrength,
      ag.assetSummary.total.toString(),
      ...visibleColumnConfigs.map(col => getMetricValue(ag, col.key))
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `asset_groups_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleColumnVisibility = (columnKey: AssetGroupMetricColumn) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnKey)) {
        return prev.filter(c => c !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  const openAssetDetails = (assetGroup: AssetGroupUI) => {
    setSelectedAssetGroupForDetails(assetGroup);
    setShowAssetDetailsDialog(true);
  };

  const activeFilterCount = 
    localFilters.status.length +
    localFilters.primaryStatus.length +
    localFilters.adStrength.length +
    localFilters.campaignId.length;

  const totalColumns = 8 + visibleColumnConfigs.length;

  // Ad Strength Progress Bar Component
  const AdStrengthBar: React.FC<{ strength: AssetGroupAdStrengthUI }> = ({ strength }) => {
    const progress = strength === AssetGroupAdStrengthUI.EXCELLENT ? 100 :
                     strength === AssetGroupAdStrengthUI.GOOD ? 75 :
                     strength === AssetGroupAdStrengthUI.AVERAGE ? 50 :
                     strength ===AssetGroupAdStrengthUI.POOR ? 25 : 0;
    
    const color = strength === AssetGroupAdStrengthUI.EXCELLENT ? 'bg-green-500' :
                  strength === AssetGroupAdStrengthUI.GOOD ? 'bg-blue-500' :
                  strength === AssetGroupAdStrengthUI.AVERAGE ? 'bg-yellow-500' :
                  strength ===AssetGroupAdStrengthUI.POOR ? 'bg-red-500' : 'bg-gray-300';
    
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${color} transition-all`} style={{ width: `${progress}%` }}></div>
        </div>
        <span className={`text-xs font-medium ${
          strength === AssetGroupAdStrengthUI.EXCELLENT ? 'text-green-600' :
          strength ===AssetGroupAdStrengthUI.GOOD ? 'text-blue-600' :
          strength === AssetGroupAdStrengthUI.AVERAGE ? 'text-yellow-600' :
          strength === AssetGroupAdStrengthUI.POOR ? 'text-red-600' : 'text-gray-500'
        }`}>
          {strength}
        </span>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-500 text-lg">Loading asset groups...</div>
      </div>
    );
  }

  // Error state
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
      {/* TOP BAR */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-4 py-2 flex items-center justify-between gap-4">
          {/* Left: Search Bar */}
          <div className="flex-1 max-w-xs">
            <TextBoxComponent
              placeholder="Search asset groups or campaigns"
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
            <span className="text-xs text-gray-600">Performance Max</span>
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm">
              P
            </div>
          </div>
        </div>

        {/* Page Title and Date Range */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
          <div>
            <h1 className="text-2xl font-normal text-gray-900">Asset groups</h1>
            <p className="text-xs text-gray-500 mt-1">Performance Max campaigns</p>
          </div>
          
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

      {/* FILTER CHIPS BAR */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <span className="text-gray-700 font-medium">Filters</span>
          
          {/* Status chips */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Status:</span>
            {localFilters.status.length > 0 ? (
              localFilters.status.map(status => (
                <span key={status} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-gray-700">
                  {status}
                  <button 
                    onClick={() => setLocalFilters(prev => ({ ...prev, status: prev.status.filter(s => s !== status) }))}
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

          {/* Ad Strength chips */}
          {localFilters.adStrength.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Ad strength:</span>
              {localFilters.adStrength.map(strength => (
                <span key={strength} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-gray-700">
                  {strength}
                  <button 
                    onClick={() => setLocalFilters(prev => ({ ...prev, adStrength: prev.adStrength.filter(s => s !== strength) }))}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </span>
              ))}
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

      {/* MAIN CONTENT */}
      <div className="px-4 py-4">
        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="bg-purple-500 rounded p-4 text-white">
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

          <div className="bg-white rounded p-4 border border-gray-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-700">ROAS</span>
              <ButtonComponent iconCss="e-icons e-more-vert" cssClass="e-flat e-small" />
            </div>
            <div className="text-2xl font-normal text-gray-900 mb-1">
              {aggregatedMetrics.roas.toFixed(2)}x
            </div>
            <div className="text-xs text-gray-500">{formatDisplay()}</div>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="bg-white border border-gray-200 rounded mb-4">
          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Performance: {formatDisplay()}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-purple-600">● Impressions</span>
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
              id="assetgroups-chart"
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
                  fill="#9333ea"
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

        {/* TABLE TOOLBAR */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {filteredAssetGroups.length} asset group{filteredAssetGroups.length !== 1 ? 's' : ''} • {visibleColumnConfigs.length} columns
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ButtonComponent 
              iconCss="e-icons e-search" 
              cssClass="e-flat e-small" 
              onClick={() => setShowTableSearchDialog(true)}
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
                    Asset Group Report
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Asset Performance Report
                  </button>
                </div>
              )}
            </div>

            <ButtonComponent iconCss="e-icons e-download" cssClass="e-flat e-small" onClick={downloadReport}>
              Download
            </ButtonComponent>
            
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
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search indicator */}
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

        {/* Bulk Actions */}
        {selectedRows.size > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded p-3 mb-3 flex items-center justify-between">
            <span className="text-sm text-purple-900 font-medium">
              {selectedRows.size} asset group{selectedRows.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <ButtonComponent 
                cssClass="e-small e-success"
                onClick={() => handleAssetGroupAction('enable', Array.from(selectedRows))}
              >
                Enable
              </ButtonComponent>
              <ButtonComponent 
                cssClass="e-small e-warning"
                onClick={() => handleAssetGroupAction('pause', Array.from(selectedRows))}
              >
                Pause
              </ButtonComponent>
              <ButtonComponent 
                cssClass="e-small e-danger"
                onClick={() => handleAssetGroupAction('delete', Array.from(selectedRows))}
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
                    checked={selectedRows.size === filteredAssetGroups.length && filteredAssetGroups.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-3 py-2 text-left w-8"></th>
                <th 
                  className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 min-w-[200px]" 
                  onClick={() => handleSort('name')}
                >
                  Asset group {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 min-w-[150px]" 
                  onClick={() => handleSort('campaign')}
                >
                  Campaign {sortConfig?.key === 'campaign' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 min-w-[100px]" 
                  onClick={() => handleSort('primaryStatus')}
                >
                  Status {sortConfig?.key === 'primaryStatus' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100 min-w-[130px]" 
                  onClick={() => handleSort('adStrength')}
                >
                  Ad strength {sortConfig?.key === 'adStrength' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-3 py-2 text-center font-medium text-gray-700 cursor-pointer hover:bg-gray-100 min-w-[70px]" 
                  onClick={() => handleSort('assets')}
                >
                  Assets {sortConfig?.key === 'assets' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 min-w-[70px]">
                  Signals
                </th>
                {visibleColumnConfigs.map(col => (
                  <th 
                    key={col.key}
                    className={`px-3 py-2 font-medium text-gray-700 min-w-[90px] ${
                      col.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredAssetGroups.length === 0 ? (
                <tr>
                  <td colSpan={totalColumns} className="px-3 py-8 text-center">
                    <div className="text-gray-500">
                      <p className="text-base mb-1">No asset groups found</p>
                      {(topSearchText || tableSearchText || activeFilterCount > 0) && (
                        <p className="text-xs">Try adjusting your search or filters</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssetGroups.map((assetGroup) => {
                  const isExpanded = expandedRows.has(assetGroup.id);
                  const assetRows = assetGroup.getAssetRows();
                  
                  return (
                    <React.Fragment key={assetGroup.id}>
                      {/* Main Row */}
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 sticky left-0 bg-white">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 cursor-pointer"
                            checked={selectedRows.has(assetGroup.id)}
                            onChange={() => toggleRowSelection(assetGroup.id)}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button 
                            onClick={() => toggleRowExpansion(assetGroup.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {isExpanded ? '▼' : '▶'}
                          </button>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                assetGroup.status === AssetGroupStatusUI.ENABLED ? 'bg-green-500' : 
                                assetGroup.status === AssetGroupStatusUI.PAUSED ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></span>
                              <a href="#" className="text-blue-600 hover:underline font-medium">
                                {assetGroup.name}
                              </a>
                            </div>
                            <span className="text-gray-500 text-xs truncate max-w-[200px]" title={assetGroup.displayUrl}>
                              {assetGroup.displayUrl}
                            </span>
                            {assetGroup.hasIssues() && (
                              <div className="flex items-center gap-1 text-xs text-amber-600">
                                <span>⚠️</span>
                                <span>{assetGroup.assetCoverage.actionItems.length} improvement{assetGroup.assetCoverage.actionItems.length !== 1 ? 's' : ''}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-xs">
                              <button 
                                onClick={() => openAssetDetails(assetGroup)}
                                className="text-blue-600 hover:underline"
                              >
                                View details
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <a href="#" className="text-blue-600 hover:underline">
                            {assetGroup.campaignName}
                          </a>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded text-xs whitespace-nowrap border ${assetGroup.getStatusColor()}`}>
                            {assetGroup.primaryStatus}
                          </span>
                          {assetGroup.primaryStatusReasons.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {assetGroup.primaryStatusReasons[0]}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <AdStrengthBar strength={assetGroup.adStrength} />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-medium">{assetGroup.assetSummary.total}</span>
                            <span className="text-xs text-gray-500">
                              {assetGroup.assetSummary.headlines}H • {assetGroup.assetSummary.descriptions}D • {assetGroup.assetSummary.images}I
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center">
                          {assetGroup.audienceSignals.length > 0 ? (
                            <span className="text-blue-600">{assetGroup.audienceSignals.length}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        {/* Dynamic metric columns */}
                        {visibleColumnConfigs.map(col => (
                          <td 
                            key={col.key}
                            className={`px-3 py-2 ${
                              col.align === 'right' ? 'text-right' : 'text-left'
                            }`}
                          >
                            {getMetricValue(assetGroup, col.key)}
                          </td>
                        ))}
                      </tr>

                      {/* Expanded Asset Rows */}
                      {isExpanded && assetRows.map((asset, idx) => (
                        <tr key={`${assetGroup.id}-asset-${idx}`} className="bg-gray-50 border-b border-gray-100">
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5 pl-8" colSpan={2}>
                            <div className="flex items-center gap-2">
                              <span className={`px-1.5 py-0.5 text-xs rounded ${
                                asset.type.includes('Headline') ? 'bg-blue-100 text-blue-700' :
                                asset.type.includes('Description') ? 'bg-green-100 text-green-700' :
                                asset.type.includes('image') ? 'bg-purple-100 text-purple-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {asset.type}
                              </span>
                              <span className="text-gray-700 truncate max-w-[300px]">{asset.content}</span>
                            </div>
                          </td>
                          <td className="px-3 py-1.5">
                            <span className={`text-xs font-medium ${
                              asset.performanceLabel === 'Best' ? 'text-green-600' :
                              asset.performanceLabel === 'Good' ? 'text-blue-600' :
                              asset.performanceLabel === 'Learning' ? 'text-gray-500' :
                              'text-yellow-600'
                            }`}>
                              {asset.performanceLabel}
                            </span>
                          </td>
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5"></td>
                          {visibleColumnConfigs.map((col, colIdx) => (
                            <td key={col.key} className="px-3 py-1.5 text-right text-gray-500">
                              {colIdx === 0 ? asset.impressions.toLocaleString() : 
                               colIdx === 1 ? asset.clicks.toLocaleString() :
                               colIdx === 2 ? asset.ctr + '%' :
                               '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })
              )}

              {/* Total Row */}
              {filteredAssetGroups.length > 0 && (
                <tr className="border-b border-gray-200 bg-gray-50 font-medium">
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2" colSpan={6}>
                    <span>Total: Asset groups in current view</span>
                  </td>
                  {visibleColumnConfigs.map((col, idx) => (
                    <td key={col.key} className="px-3 py-2 text-right">
                      {idx === 0 ? aggregatedMetrics.totalImpressions.toLocaleString() :
                       idx === 1 ? aggregatedMetrics.totalClicks.toLocaleString() :
                       idx === 2 ? aggregatedMetrics.avgCtr.toFixed(2) + '%' :
                       idx === 3 ? aggregatedMetrics.totalConversions.toFixed(2) :
                       idx === 4 ? aggregatedMetrics.conversionRate.toFixed(2) + '%' :
                       idx === 5 ? '₹' + aggregatedMetrics.totalCost.toFixed(2) :
                       idx === 6 ? '₹' + aggregatedMetrics.avgCpc.toFixed(2) :
                       idx === 7 ? aggregatedMetrics.roas.toFixed(2) + 'x' :
                       '-'}
                    </td>
                  ))}
                </tr>
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
            Search across all table fields: asset group name, campaign, status, URL, etc.
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="space-y-2">
              {Object.values(AssetGroupStatusUI).map((status) => (
                <div key={status} className="flex items-center">
                  <CheckBoxComponent
                    label={status}
                    checked={localFilters.status.includes(status)}
                    change={(e) => {
                      setLocalFilters(prev => ({
                        ...prev,
                        status: e.checked
                          ? [...prev.status, status]
                          : prev.status.filter(s => s !== status)
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Primary Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Status</label>
            <div className="space-y-2">
              {Object.values(AssetGroupPrimaryStatusUI).map((status) => (
                <div key={status} className="flex items-center">
                  <CheckBoxComponent
                    label={status}
                    checked={localFilters.primaryStatus.includes(status)}
                    change={(e) => {
                      setLocalFilters(prev => ({
                        ...prev,
                        primaryStatus: e.checked
                          ? [...prev.primaryStatus, status]
                          : prev.primaryStatus.filter(s => s !== status)
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Ad Strength Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Strength</label>
            <div className="space-y-2">
              {Object.values(AssetGroupAdStrengthUI).map((strength) => (
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

          {/* Apply Button */}
          <div className="pt-4 border-t flex justify-end gap-2">
            <ButtonComponent cssClass="e-flat" onClick={() => setShowFilterDialog(false)}>
              Cancel
            </ButtonComponent>
            <ButtonComponent cssClass="e-primary" onClick={applyFilters}>
              Apply Filters
            </ButtonComponent>
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
            Choose which metric columns to display. 
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
          <p className="text-sm text-gray-600 mb-3">Select how you want to segment your asset group data</p>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Time &gt; Day</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Time &gt; Week</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Time &gt; Month</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Network</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Device</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Asset type</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Conversion action</button>
          </div>
        </div>
      </DialogComponent>

      {/* Asset Details Dialog */}
      <DialogComponent
        width="700px"
        isModal={true}
        visible={showAssetDetailsDialog}
        close={() => setShowAssetDetailsDialog(false)}
        header={selectedAssetGroupForDetails ? `Asset Details: ${selectedAssetGroupForDetails.name}` : 'Asset Details'}
        showCloseIcon={true}
      >
        {selectedAssetGroupForDetails && (
          <div className="p-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded p-3">
                <div className="text-xs text-gray-500">Ad Strength</div>
                <div className={`text-lg font-medium ${selectedAssetGroupForDetails.getAdStrengthColor()}`}>
                  {selectedAssetGroupForDetails.adStrength}
                </div>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <div className="text-xs text-gray-500">Total Assets</div>
                <div className="text-lg font-medium">{selectedAssetGroupForDetails.assetSummary.total}</div>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <div className="text-xs text-gray-500">Audience Signals</div>
                <div className="text-lg font-medium">{selectedAssetGroupForDetails.audienceSignals.length}</div>
              </div>
            </div>

            {/* Asset Breakdown */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Asset Breakdown</h4>
              <div className="grid grid-cols-6 gap-2 text-xs">
                <div className="bg-blue-50 rounded p-2 text-center">
                  <div className="font-medium text-blue-700">{selectedAssetGroupForDetails.assetSummary.headlines}</div>
                  <div className="text-blue-600">Headlines</div>
                </div>
                <div className="bg-blue-50 rounded p-2 text-center">
                  <div className="font-medium text-blue-700">{selectedAssetGroupForDetails.assetSummary.longHeadlines}</div>
                  <div className="text-blue-600">Long Headlines</div>
                </div>
                <div className="bg-green-50 rounded p-2 text-center">
                  <div className="font-medium text-green-700">{selectedAssetGroupForDetails.assetSummary.descriptions}</div>
                  <div className="text-green-600">Descriptions</div>
                </div>
                <div className="bg-purple-50 rounded p-2 text-center">
                  <div className="font-medium text-purple-700">{selectedAssetGroupForDetails.assetSummary.images}</div>
                  <div className="text-purple-600">Images</div>
                </div>
                <div className="bg-gray-50 rounded p-2 text-center">
                  <div className="font-medium text-gray-700">{selectedAssetGroupForDetails.assetSummary.logos}</div>
                  <div className="text-gray-600">Logos</div>
                </div>
                <div className="bg-red-50 rounded p-2 text-center">
                  <div className="font-medium text-red-700">{selectedAssetGroupForDetails.assetSummary.videos}</div>
                  <div className="text-red-600">Videos</div>
                </div>
              </div>
            </div>

            {/* Improvement Suggestions */}
            {selectedAssetGroupForDetails.assetCoverage.actionItems.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Improvement Suggestions</h4>
                <ul className="space-y-1">
                  {selectedAssetGroupForDetails.assetCoverage.actionItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 rounded p-2">
                      <span>💡</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Audience Signals */}
            {selectedAssetGroupForDetails.audienceSignals.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Audience Signals</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAssetGroupForDetails.audienceSignals.map((signal) => (
                    <span key={signal.id} className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {signal.name} ({signal.type})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogComponent>

      {/* FAB Button */}
      <button 
        className="fixed bottom-6 left-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-50 transition-all"
        title="New asset group"
        aria-label="Create new asset group"
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
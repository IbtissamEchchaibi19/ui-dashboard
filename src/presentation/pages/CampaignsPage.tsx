import React, { useState, useMemo, useEffect } from 'react';
// ✅ ONLY import from application hooks - NO domain imports
import { useCampaigns, useDateRange, useCampaignTimeSeries } from '@application/hooks';
import { campaignService } from '@application/services';
import { 
  CampaignStatusUI, 
  CampaignTypeUI, 
  CampaignUI,
  MetricColumn,
  AdGroupRow
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

export const CampaignsPage: React.FC = () => {
  // Backend filters state (what gets sent to hooks)
  const [backendFilters, setBackendFilters] = useState<any>({});
  
  // Local filters state (UI state before applying)
  const [localFilters, setLocalFilters] = useState<{
    campaignStatus: CampaignStatusUI[];
    campaignType: CampaignTypeUI[];
    minBudget?: number;
    maxBudget?: number;
  }>({
    campaignStatus: [],
    campaignType: []
  });
  
  // ✅ Use existing hooks EXACTLY as they were - NO changes
  const { campaigns, loading, error, updateFilters,refetch } = useCampaigns(backendFilters);
  const { dateRange, preset, setPreset, formatDisplay } = useDateRange('last7days');
  
  // UI State
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [topSearchText, setTopSearchText] = useState(''); // Top bar search (name/page only)
  const [tableSearchText, setTableSearchText] = useState(''); // Table keyword search (all fields)
  const [showTableSearchDialog, setShowTableSearchDialog] = useState(false); // Dialog for table search
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showColumnDialog, setShowColumnDialog] = useState(false);
  const [showSegmentDialog, setShowSegmentDialog] = useState(false);
  const [showReportsMenu, setShowReportsMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<MetricColumn[]>([
    'impressions', 
    'clicks', 
    'conversions', 
    'cost'
  ]);

  // Get time series data using existing hook
  const activeCampaignId = selectedCampaignId || (campaigns.length > 0 ? campaigns[0]?.id : null);
  const { data: timeSeriesData, loading: chartLoading } = useCampaignTimeSeries(
    activeCampaignId,
    dateRange
  );

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

  // Filter and sort campaigns
  const filteredCampaigns = useMemo(() => {
    let filtered = [...campaigns];

    // TOP SEARCH BAR - Search campaign NAMES only (and page names if you add them)
    if (topSearchText.trim()) {
      const search = topSearchText.toLowerCase().trim();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(search)
        // Add page name search here if you have page field: || c.pageName.toLowerCase().includes(search)
      );
    }

    // TABLE KEYWORD SEARCH - Searches EVERYTHING in the table!
    if (tableSearchText.trim()) {
      const search = tableSearchText.toLowerCase().trim();
      filtered = filtered.filter(c => {
        // Search in: name, ID, status, type, budget, and any other visible field
        return (
          c.name.toLowerCase().includes(search) ||
          c.id.toLowerCase().includes(search) ||
          c.status.toLowerCase().includes(search) ||
          c.type.toLowerCase().includes(search) ||
          c.budget.amount.toString().includes(search) ||
          c.budget.format().toLowerCase().includes(search)
        );
      });
    }

    // Status filter (local)
    if (localFilters.campaignStatus.length > 0) {
      filtered = filtered.filter(c => 
        localFilters.campaignStatus.includes(c.status)
      );
    }

    // Type filter (local)
    if (localFilters.campaignType.length > 0) {
      filtered = filtered.filter(c => 
        localFilters.campaignType.includes(c.type)
      );
    }

    // Budget filter (local only)
    if (localFilters.minBudget !== undefined) {
      filtered = filtered.filter(c => c.budget.amount >= localFilters.minBudget!);
    }
    if (localFilters.maxBudget !== undefined) {
      filtered = filtered.filter(c => c.budget.amount <= localFilters.maxBudget!);
    }

    // Sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'budget':
            aValue = a.budget.amount;
            bValue = b.budget.amount;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'type':
            aValue = a.type;
            bValue = b.type;
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
  }, [campaigns, topSearchText, tableSearchText, localFilters, sortConfig]);

  // Calculate aggregated metrics
  const aggregatedMetrics = useMemo(() => {
    if (timeSeriesData.length === 0) {
      return {
        totalImpressions: 0,
        totalClicks: 0,
        totalConversions: 0,
        totalCost: 0,
        avgCpa: 0,
        ctr: 0,
        conversionRate: 0,
        avgCpc: 0
      };
    }

    const totals = timeSeriesData.reduce((acc, item) => ({
      clicks: acc.clicks + item.clicks,
      conversions: acc.conversions + item.conversions,
      cost: acc.cost + item.cost
    }), { clicks: 0, conversions: 0, cost: 0 });

    const impressions = totals.clicks > 0 ? totals.clicks * 10 : 0;

    return {
      totalImpressions: impressions,
      totalClicks: totals.clicks,
      totalConversions: totals.conversions,
      totalCost: totals.cost,
      avgCpa: totals.conversions > 0 ? totals.cost / totals.conversions : 0,
      ctr: impressions > 0 ? (totals.clicks / impressions) * 100 : 0,
      conversionRate: totals.clicks > 0 ? (totals.conversions / totals.clicks) * 100 : 0,
      avgCpc: totals.clicks > 0 ? totals.cost / totals.clicks : 0
    };
  }, [timeSeriesData]);

  // Generate ad group sub-rows
  const getCampaignSubRows = (campaign: CampaignUI): AdGroupRow[] => {
    const baseImpressions = Math.floor(Math.random() * 2000) + 500;
    const baseClicks = Math.floor(Math.random() * 100) + 20;
    
    return [
      { 
        name: 'Headline', 
        impressions: baseImpressions,
        clicks: baseClicks,
        interactionRate: ((baseClicks / baseImpressions) * 100).toFixed(2),
        avgCost: (Math.random() * 50 + 10).toFixed(2),
        cost: (baseClicks * (Math.random() * 50 + 10)).toFixed(2),
        conversions: Math.floor(Math.random() * 20),
        conversionRate: (Math.random() * 10).toFixed(2)
      },
      { 
        name: 'Sitelink', 
        impressions: Math.floor(baseImpressions * 0.3),
        clicks: Math.floor(baseClicks * 0.2),
        interactionRate: ((Math.floor(baseClicks * 0.2) / Math.floor(baseImpressions * 0.3)) * 100).toFixed(2),
        avgCost: (Math.random() * 10 + 2).toFixed(2),
        cost: (Math.floor(baseClicks * 0.2) * (Math.random() * 10 + 2)).toFixed(2),
        conversions: Math.floor(Math.random() * 5),
        conversionRate: (Math.random() * 5).toFixed(2)
      },
      { 
        name: 'Image', 
        impressions: Math.floor(baseImpressions * 0.5),
        clicks: Math.floor(baseClicks * 0.3),
        interactionRate: ((Math.floor(baseClicks * 0.3) / Math.floor(baseImpressions * 0.5)) * 100).toFixed(2),
        avgCost: (Math.random() * 20 + 5).toFixed(2),
        cost: (Math.floor(baseClicks * 0.3) * (Math.random() * 20 + 5)).toFixed(2),
        conversions: Math.floor(Math.random() * 10),
        conversionRate: (Math.random() * 7).toFixed(2)
      }
    ];
  };

  // Event Handlers
  const toggleRowExpansion = (campaignId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
  };

  const toggleRowSelection = (campaignId: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredCampaigns.length && filteredCampaigns.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredCampaigns.map(c => c.id)));
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

  // Apply filters
  const applyFilters = () => {
    const newBackendFilters: any = {};
    
    if (localFilters.campaignStatus.length > 0) {
      newBackendFilters.status = localFilters.campaignStatus;
    }
    
    if (localFilters.campaignType.length > 0) {
      newBackendFilters.type = localFilters.campaignType;
    }
    
    setBackendFilters(newBackendFilters);
    updateFilters(newBackendFilters);
    setShowFilterDialog(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setLocalFilters({
      campaignStatus: [],
      campaignType: []
    });
    setTopSearchText('');
    setTableSearchText('');
    setBackendFilters({});
    updateFilters({});
  };

  const handleCampaignAction = async (action: 'pause' | 'enable' | 'delete', campaignIds: string[]) => {
    try {
      for (const id of campaignIds) {
        if (action === 'pause') {
          await campaignService.pauseCampaign(id);
        } else if (action === 'enable') {
          await campaignService.enableCampaign(id);
        } else if (action === 'delete') {
          await campaignService.deleteCampaign(id);
        }
      }
      await refetch();
      setSelectedRows(new Set());
    } catch (err) {
      console.error('Campaign action failed:', err);
    }
  };

  const downloadReport = () => {
    const headers = ['Campaign', 'Status', 'Type', 'Budget', 'Impressions', 'Clicks', 'Conversions', 'Cost', 'CTR', 'Conversion Rate'];
    const rows = filteredCampaigns.map(c => [
      c.name,
      c.status,
      c.type,
      c.budget.format(),
      '0', '0', '0', '0', '0%', '0%'
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campaigns_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const expandCollapseAll = () => {
    if (expandedRows.size === filteredCampaigns.length) {
      setExpandedRows(new Set());
    } else {
      setExpandedRows(new Set(filteredCampaigns.map(c => c.id)));
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

  const removeFilter = (filterType: 'status' | 'type', value: string) => {
    if (filterType === 'status') {
      setLocalFilters(prev => ({
        ...prev,
        campaignStatus: prev.campaignStatus.filter(s => s !== value)
      }));
    } else if (filterType === 'type') {
      setLocalFilters(prev => ({
        ...prev,
        campaignType: prev.campaignType.filter(t => t !== value)
      }));
    }
  };

  // Active filter count
  const activeFilterCount = 
    localFilters.campaignStatus.length +
    localFilters.campaignType.length +
    (localFilters.minBudget !== undefined ? 1 : 0) +
    (localFilters.maxBudget !== undefined ? 1 : 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-500 text-lg">Loading campaigns...</div>
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
      {/* ============================================ */}
      {/* TOP BAR - Search + Navigation (Google Ads Style) */}
      {/* ============================================ */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-4 py-2 flex items-center justify-between gap-4">
          {/* Left: Search Bar - SEARCHES CAMPAIGN NAMES ONLY */}
          <div className="flex-1 max-w-xs">
            <TextBoxComponent
              placeholder="Search for a page or campaign"
              showClearButton={true}
              value={topSearchText}
              input={handleTopSearchChange}
              change={handleTopSearchChange}
              cssClass="w-full"
            />
          </div>

          {/* Right: User actions */}
          <div className="flex items-center gap-3">
            <ButtonComponent iconCss="e-icons e-appearance" cssClass="e-flat e-small" title="Appearance" />
            <ButtonComponent iconCss="e-icons e-refresh" cssClass="e-flat e-small" title="Refresh" onClick={refetch} />
            <ButtonComponent iconCss="e-icons e-help" cssClass="e-flat e-small" title="Help" />
            <div className="relative">
              <ButtonComponent iconCss="e-icons e-notification" cssClass="e-flat e-small" title="Notifications">
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </ButtonComponent>
            </div>
            <span className="text-xs text-gray-600">237-721-4676 Mockito</span>
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
              A
            </div>
          </div>
        </div>

        {/* Navigation Bar with Dropdowns */}
        <div className="px-4 py-2 flex items-center gap-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Back to</span>
            <DropDownListComponent
              dataSource={[{ text: 'All campaigns', value: 'all' }]}
              fields={{ text: 'text', value: 'value' }}
              value="all"
              cssClass="w-32"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">View ({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''})</span>
            <DropDownListComponent
              dataSource={[{ text: 'Search campaigns', value: 'search' }]}
              fields={{ text: 'text', value: 'value' }}
              value="search"
              cssClass="w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Campaigns ({filteredCampaigns.length})</span>
            <DropDownListComponent
              dataSource={filteredCampaigns.map(c => ({ text: c.name, value: c.id }))}
              fields={{ text: 'text', value: 'value' }}
              placeholder="Select a campaign"
              change={(e) => setSelectedCampaignId(e.value)}
              value={selectedCampaignId}
              cssClass="w-48"
            />
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* FILTER CHIPS BAR (Google Ads Style) */}
      {/* ============================================ */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <span className="text-gray-700 font-medium">Filters</span>
          
          {/* Campaign Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Campaign status:</span>
            {localFilters.campaignStatus.length > 0 ? (
              localFilters.campaignStatus.map(status => (
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
              <span className="text-gray-600">All</span>
            )}
          </div>

          {/* Ad Group Status (static for now) */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Ad group status:</span>
            <span className="text-gray-600">Enabled, Paused</span>
          </div>

          {/* Campaign Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Campaign type:</span>
            {localFilters.campaignType.length > 0 ? (
              localFilters.campaignType.map(type => (
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
              <span className="text-gray-600">Search</span>
            )}
          </div>

          <ButtonComponent 
            cssClass="e-link e-small text-blue-600"
            onClick={() => setShowFilterDialog(true)}
          >
            Add filter
          </ButtonComponent>
        </div>
      </div>

      {/* ============================================ */}
      {/* MAIN CONTENT AREA */}
      {/* ============================================ */}
      <div className="px-4 py-4">
        {/* Page Title and Date Range */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-normal text-gray-900">Campaigns</h1>
          
          {/* Date Range Selector (Google Ads Style) */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{formatDisplay()}</span>
            <DropDownListComponent
              dataSource={dateRangePresets}
              fields={{ text: 'text', value: 'value' }}
              value={preset}
              change={(e) => setPreset(e.value as any)}
              placeholder="Select date range"
              cssClass="w-44"
            />
            <ButtonComponent iconCss="e-icons e-chevron-left" cssClass="e-flat e-small" />
            <ButtonComponent iconCss="e-icons e-chevron-right" cssClass="e-flat e-small" />
            <ButtonComponent cssClass="e-link e-small text-blue-600">
              Show last 30 days
            </ButtonComponent>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-4">
          <button className="pb-2 border-b-2 border-blue-600 text-blue-600 font-medium text-sm">
            Campaigns
          </button>
          <button className="pb-2 text-gray-600 text-sm hover:text-gray-900">
            Drafts
          </button>
          <button className="pb-2 text-gray-600 text-sm hover:text-gray-900">
            Settings
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
            <div className="flex items-center gap-1 text-xs">
              <span className="text-red-300">↓ {Math.abs(Math.floor(aggregatedMetrics.totalImpressions * 0.416)).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white rounded p-4 border border-gray-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-700">Cost</span>
              <ButtonComponent iconCss="e-icons e-more-vert" cssClass="e-flat e-small" />
            </div>
            <div className="text-2xl font-normal text-gray-900 mb-1">
              ₹{aggregatedMetrics.totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <span>↑ ₹{(aggregatedMetrics.totalCost * 0.0103).toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white rounded p-4 border border-gray-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-700">Conversions</span>
              <ButtonComponent iconCss="e-icons e-more-vert" cssClass="e-flat e-small" />
            </div>
            <div className="text-2xl font-normal text-gray-900 mb-1">
              {aggregatedMetrics.totalConversions.toFixed(2)}
            </div>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <span>↓ {(aggregatedMetrics.totalConversions * 0.643).toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white rounded p-4 border border-gray-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-700">Avg. target CPA</span>
              <ButtonComponent iconCss="e-icons e-more-vert" cssClass="e-flat e-small" />
            </div>
            <div className="text-2xl font-normal text-gray-900 mb-1">
              ₹{aggregatedMetrics.avgCpa.toFixed(2)}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <span>↑ ₹{(aggregatedMetrics.avgCpa * 0.0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* CHART SECTION */}
        {/* ============================================ */}
        <div className="bg-white border border-gray-200 rounded mb-4">
          {chartLoading ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              Loading chart data...
            </div>
          ) : timeSeriesData.length > 0 ? (
            <ChartComponent
              id="campaigns-chart"
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
                  yName="clicks"
                  name="Headline"
                  type="Line"
                  width={2}
                  marker={{ visible: true, width: 6, height: 6 }}
                  fill="#3b82f6"
                />
                <SeriesDirective
                  dataSource={timeSeriesData}
                  xName="date"
                  yName="conversions"
                  name="Image"
                  type="Line"
                  width={2}
                  marker={{ visible: true, width: 6, height: 6 }}
                  fill="#ef4444"
                />
                <SeriesDirective
                  dataSource={timeSeriesData}
                  xName="date"
                  yName="cost"
                  name="Sitelink"
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


        {/* ============================================ */}
        {/* TABLE TOOLBAR - Above Table (Google Ads Style) */}
        {/* ============================================ */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ButtonComponent 
              iconCss="e-icons e-filter" 
              cssClass="e-flat e-small"
              onClick={() => setShowFilterDialog(true)}
            >
              Add filter
            </ButtonComponent>
          </div>

          <div className="flex items-center gap-2 relative">
            {/* TABLE SEARCH ICON - Opens dialog for keyword search */}
            <ButtonComponent 
              iconCss="e-icons e-search" 
              cssClass="e-flat e-small" 
              onClick={handleTableSearchIconClick}
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
              Columns
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
                    onClick={() => handleGenerateReport('Campaign Report')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Campaign Report
                  </button>
                  <button 
                    onClick={() => handleGenerateReport('Ad Group Report')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Ad Group Report
                  </button>
                  <button 
                    onClick={() => handleGenerateReport('Keyword Report')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Keyword Report
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button 
                    onClick={() => handleGenerateReport('Custom Report')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
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
                  <button 
                    onClick={() => handleMoreAction('Print View')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Print View
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button 
                    onClick={() => handleMoreAction('Schedule Report')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Schedule Report
                  </button>
                  <button 
                    onClick={() => handleMoreAction('Save View')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Save View
                  </button>
                  <button 
                    onClick={() => handleMoreAction('Share')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Share
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
              {selectedRows.size} campaign{selectedRows.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <ButtonComponent 
                cssClass="e-small e-success"
                onClick={() => handleCampaignAction('enable', Array.from(selectedRows))}
              >
                Enable
              </ButtonComponent>
              <ButtonComponent 
                cssClass="e-small e-warning"
                onClick={() => handleCampaignAction('pause', Array.from(selectedRows))}
              >
                Pause
              </ButtonComponent>
              <ButtonComponent 
                cssClass="e-small e-danger"
                onClick={() => handleCampaignAction('delete', Array.from(selectedRows))}
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

        {/* ============================================ */}
        {/* DATA TABLE */}
        {/* ============================================ */}
        <div className="bg-white border border-gray-200 rounded overflow-x-auto">
          <table className="w-full text-xs min-w-[1400px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left w-8">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 cursor-pointer"
                    checked={selectedRows.size === filteredCampaigns.length && filteredCampaigns.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-3 py-2 text-left w-8"></th>
                <th 
                  className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('name')}
                >
                  Campaign {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('budget')}
                >
                  Budget {sortConfig?.key === 'budget' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('status')}
                >
                  Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-3 py-2 text-center font-medium text-gray-700">
                  Optimization<br/>score
                </th>
                <th 
                  className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('type')}
                >
                  Campaign<br/>type {sortConfig?.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                {visibleColumns.includes('impressions') && (
                  <th className="px-3 py-2 text-right font-medium text-gray-700">Impr.</th>
                )}
                {visibleColumns.includes('clicks') && (
                  <th className="px-3 py-2 text-right font-medium text-gray-700">
                    ↓ Interactions
                  </th>
                )}
                <th className="px-3 py-2 text-right font-medium text-gray-700">
                  Interaction<br/>rate
                </th>
                {visibleColumns.includes('avgCost') && (
                  <th className="px-3 py-2 text-right font-medium text-gray-700">Avg. cost</th>
                )}
                {visibleColumns.includes('cost') && (
                  <th className="px-3 py-2 text-right font-medium text-gray-700">Cost</th>
                )}
                {visibleColumns.includes('conversions') && (
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Conv. rate</th>
                )}
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Bid strategy<br/>type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {/* Drafts Row */}
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span>
                </td>
                <td className="px-3 py-2">
                  <button 
                    onClick={() => toggleRowExpansion('drafts')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedRows.has('drafts') ? '▼' : '▶'}
                  </button>
                </td>
                <td className="px-3 py-2" colSpan={13}>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">📄</span>
                    <span className="text-gray-700">Drafts in progress: 0</span>
                  </div>
                </td>
              </tr>

              {/* Campaign Rows */}
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={15} className="px-3 py-8 text-center">
                    <div className="text-gray-500">
                      <p className="text-base mb-1">No campaigns found</p>
                      {(topSearchText || tableSearchText || activeFilterCount > 0) && (
                        <p className="text-xs">Try adjusting your search or filters</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => {
                  const subRows = getCampaignSubRows(campaign);
                  const isExpanded = expandedRows.has(campaign.id);
                  
                  return (
                    <React.Fragment key={campaign.id}>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 cursor-pointer"
                            checked={selectedRows.has(campaign.id)}
                            onChange={() => toggleRowSelection(campaign.id)}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button 
                            onClick={() => toggleRowExpansion(campaign.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {isExpanded ? '▼' : '▶'}
                          </button>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              campaign.status === CampaignStatusUI.ENABLED ? 'bg-green-500' : 
                              campaign.status === CampaignStatusUI.PAUSED ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></span>
                            <a href="#" className="text-blue-600 hover:underline">
                              {campaign.name}
                            </a>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            <span>{campaign.budget.format()}/day</span>
                            <button className="text-gray-400 hover:text-gray-600 text-xs">✏️</button>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded text-xs whitespace-nowrap inline-flex items-center gap-1 ${
                            campaign.status === CampaignStatusUI.ENABLED 
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : campaign.status === CampaignStatusUI.PAUSED
                              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              : 'bg-gray-50 text-gray-700 border border-gray-200'
                          }`}>
                            {campaign.status === CampaignStatusUI.ENABLED && '⚠️'}
                            {campaign.status === CampaignStatusUI.ENABLED ? 'Limited by budget' : campaign.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <a href="#" className="text-blue-600 hover:underline">58.9%</a>
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-gray-700">{campaign.type}</span>
                        </td>
                        {visibleColumns.includes('impressions') && (
                          <td className="px-3 py-2 text-right">
                            {subRows.reduce((sum, row) => sum + row.impressions, 0).toLocaleString()}
                          </td>
                        )}
                        {visibleColumns.includes('clicks') && (
                          <td className="px-3 py-2 text-right">
                            <span className="text-gray-700">{subRows.reduce((sum, row) => sum + row.clicks, 0)}</span>
                            <span className="text-gray-500 ml-1">clicks</span>
                          </td>
                        )}
                        <td className="px-3 py-2 text-right">
                          {(
                            (subRows.reduce((sum, row) => sum + row.clicks, 0) / 
                            subRows.reduce((sum, row) => sum + row.impressions, 0)) * 100
                          ).toFixed(2)}%
                        </td>
                        {visibleColumns.includes('avgCost') && (
                          <td className="px-3 py-2 text-right">
                            ₹{(
                              subRows.reduce((sum, row) => sum + parseFloat(row.avgCost), 0) / subRows.length
                            ).toFixed(2)}
                          </td>
                        )}
                        {visibleColumns.includes('cost') && (
                          <td className="px-3 py-2 text-right">
                            {campaign.budget.format()}
                          </td>
                        )}
                        {visibleColumns.includes('conversions') && (
                          <td className="px-3 py-2">
                            <a href="#" className="text-blue-600 hover:underline">
                              Maximize conversions
                            </a>
                          </td>
                        )}
                        <td className="px-3 py-2">
                          <span className="text-gray-600">Target CPA</span>
                        </td>
                      </tr>

                      {/* Sub-rows (expanded view) */}
                      {isExpanded && subRows.map((subRow, idx) => (
                        <tr key={`${campaign.id}-${idx}`} className="bg-gray-50 border-b border-gray-100">
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5 pl-8">
                            <span className="text-gray-700">{subRow.name}</span>
                          </td>
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5"></td>
                          <td className="px-3 py-1.5"></td>
                          {visibleColumns.includes('impressions') && (
                            <td className="px-3 py-1.5 text-right">{subRow.impressions.toLocaleString()}</td>
                          )}
                          {visibleColumns.includes('clicks') && (
                            <td className="px-3 py-1.5 text-right">
                              <span className="text-gray-700">{subRow.clicks}</span>
                              <span className="text-gray-500 ml-1">clicks</span>
                            </td>
                          )}
                          <td className="px-3 py-1.5 text-right">{subRow.interactionRate}%</td>
                          {visibleColumns.includes('avgCost') && (
                            <td className="px-3 py-1.5 text-right">₹{subRow.avgCost}</td>
                          )}
                          {visibleColumns.includes('cost') && (
                            <td className="px-3 py-1.5 text-right">₹{subRow.cost}</td>
                          )}
                          {visibleColumns.includes('conversions') && (
                            <td className="px-3 py-1.5">{subRow.conversionRate}%</td>
                          )}
                          <td className="px-3 py-1.5"></td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })
              )}

              {/* Total Rows */}
              {filteredCampaigns.length > 0 && (
                <>
                  <tr className="border-b border-gray-200 bg-gray-50 font-medium">
                    <td className="px-3 py-2"></td>
                    <td className="px-3 py-2">
                      <button className="text-gray-500">▶</button>
                    </td>
                    <td className="px-3 py-2" colSpan={5}>
                      <div className="flex items-center gap-2">
                        <span>Total: Campaigns in your current view</span>
                        <span className="text-gray-400 cursor-help" title="Total for filtered campaigns">ℹ️</span>
                      </div>
                    </td>
                    {visibleColumns.includes('impressions') && (
                      <td className="px-3 py-2 text-right">{aggregatedMetrics.totalImpressions.toLocaleString()}</td>
                    )}
                    {visibleColumns.includes('clicks') && (
                      <td className="px-3 py-2 text-right">
                        <span className="text-gray-700">{aggregatedMetrics.totalClicks}</span>
                        <span className="text-gray-500 ml-1">clicks</span>
                      </td>
                    )}
                    <td className="px-3 py-2 text-right">{aggregatedMetrics.ctr.toFixed(2)}%</td>
                    {visibleColumns.includes('avgCost') && (
                      <td className="px-3 py-2 text-right">₹{aggregatedMetrics.avgCpc.toFixed(2)}</td>
                    )}
                    {visibleColumns.includes('cost') && (
                      <td className="px-3 py-2 text-right">₹{aggregatedMetrics.totalCost.toFixed(2)}</td>
                    )}
                    {visibleColumns.includes('conversions') && (
                      <td className="px-3 py-2">{aggregatedMetrics.conversionRate.toFixed(2)}%</td>
                    )}
                    <td className="px-3 py-2"></td>
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="px-3 py-2"></td>
                    <td className="px-3 py-2">
                      <button className="text-gray-500">▶</button>
                    </td>
                    <td className="px-3 py-2" colSpan={2}>
                      <div className="flex items-center gap-2">
                        <span>Total: Account</span>
                        <span className="text-gray-400 cursor-help" title="Total for entire account">ℹ️</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      {campaigns.length > 0 && campaigns[0]?.budget.format()}/day
                    </td>
                    <td className="px-3 py-2" colSpan={2}>--</td>
                    {visibleColumns.includes('impressions') && (
                      <td className="px-3 py-2 text-right">{aggregatedMetrics.totalImpressions.toLocaleString()}</td>
                    )}
                    {visibleColumns.includes('clicks') && (
                      <td className="px-3 py-2 text-right">
                        <span className="text-gray-700">{aggregatedMetrics.totalClicks}</span>
                        <span className="text-gray-500 ml-1">clicks</span>
                      </td>
                    )}
                    <td className="px-3 py-2 text-right">{aggregatedMetrics.ctr.toFixed(2)}%</td>
                    {visibleColumns.includes('avgCost') && (
                      <td className="px-3 py-2 text-right">₹{aggregatedMetrics.avgCpc.toFixed(2)}</td>
                    )}
                    {visibleColumns.includes('cost') && (
                      <td className="px-3 py-2 text-right">₹{aggregatedMetrics.totalCost.toFixed(2)}</td>
                    )}
                    {visibleColumns.includes('conversions') && (
                      <td className="px-3 py-2">{aggregatedMetrics.conversionRate.toFixed(2)}%</td>
                    )}
                    <td className="px-3 py-2"></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Recommendation Card */}
      </div>

      {/* ============================================ */}
      {/* DIALOGS */}
      {/* ============================================ */}

      {/* Table Search Dialog - KEYWORD SEARCH ALL FIELDS */}
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
            Search across all table fields: campaign name, ID, status, type, budget, etc.
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Status</label>
            <div className="space-y-2">
              {Object.values(CampaignStatusUI).map((status) => (
                <div key={status} className="flex items-center">
                  <CheckBoxComponent
                    label={status}
                    checked={localFilters.campaignStatus.includes(status)}
                    change={(e) => {
                      setLocalFilters(prev => ({
                        ...prev,
                        campaignStatus: e.checked
                          ? [...prev.campaignStatus, status]
                          : prev.campaignStatus.filter(s => s !== status)
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
            <div className="space-y-2">
              {Object.values(CampaignTypeUI).map((type) => (
                <div key={type} className="flex items-center">
                  <CheckBoxComponent
                    label={type}
                    checked={localFilters.campaignType.includes(type)}
                    change={(e) => {
                      setLocalFilters(prev => ({
                        ...prev,
                        campaignType: e.checked
                          ? [...prev.campaignType, type]
                          : prev.campaignType.filter(t => t !== type)
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
        width="380px"
        isModal={true}
        visible={showColumnDialog}
        close={() => setShowColumnDialog(false)}
        header="Select Columns"
        showCloseIcon={true}
      >
        <div className="p-4 space-y-2">
          <p className="text-sm text-gray-600 mb-3">Choose which metrics to display in the table</p>
          {(['impressions', 'clicks', 'conversions', 'cost', 'ctr', 'conversionRate', 'avgCost'] as MetricColumn[]).map((metric) => (
            <div key={metric} className="flex items-center">
              <CheckBoxComponent
                label={metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1')}
                checked={visibleColumns.includes(metric)}
                change={(e) => {
                  setVisibleColumns(prev =>
                    e.checked
                      ? [...prev, metric]
                      : prev.filter(m => m !== metric)
                  );
                }}
              />
            </div>
          ))}
          
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
          <p className="text-sm text-gray-600 mb-3">Select how you want to segment your campaign data</p>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Time &gt; Day</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Time &gt; Week</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Time &gt; Month</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Device</button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Network</button>
          </div>
        </div>
      </DialogComponent>

      {/* FAB Button */}
      <button 
        className="fixed bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-50 transition-all"
        title="New campaign"
        aria-label="Create new campaign"
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
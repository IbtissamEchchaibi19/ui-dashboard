import React, { useState, useMemo } from 'react';
import { useCampaigns, useDateRange, useCampaignTimeSeries } from '@application/hooks';
import { Campaign } from '@domain/entities';
import { CampaignStatus, CampaignType } from '@domain/enums';
import { campaignService } from '@application/services';
import { CampaignFilters } from '@infrastructure/repositories';
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

interface AdGroupRow {
  name: string;
  impressions: number;
  clicks: number;
  interactionRate: string;
  avgCost: string;
  cost: string;
  conversions?: number;
  conversionRate?: string;
}

type MetricColumn = 'impressions' | 'clicks' | 'conversions' | 'cost' | 'ctr' | 'conversionRate' | 'avgCost';

export const CampaignsPage: React.FC = () => {
  // Hooks
  const [initialFilters] = useState<CampaignFilters>({});
  const { campaigns, loading, error, updateFilters, refetch } = useCampaigns(initialFilters);
  const { dateRange, preset, setPreset, formatDisplay } = useDateRange('last7days');
  
  // State
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState('');
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showColumnDialog, setShowColumnDialog] = useState(false);
  const [showSegmentDialog, setShowSegmentDialog] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<MetricColumn[]>([
    'impressions', 
    'clicks', 
    'conversions', 
    'cost'
  ]);
  
  const [activeFilters, setActiveFilters] = useState<{
    campaignStatus: CampaignStatus[];
    campaignType: CampaignType[];
    minBudget?: number;
    maxBudget?: number;
  }>({
    campaignStatus: [],
    campaignType: []
  });

  // Get time series data for selected campaign or first campaign
  const activeCampaignId = selectedCampaignId || (campaigns.length > 0 ? campaigns[0]?.id : null);
  const { data: timeSeriesData, loading: chartLoading } = useCampaignTimeSeries(
    activeCampaignId,
    dateRange
  );

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

  // Filter and sort campaigns
  const filteredCampaigns = useMemo(() => {
    let filtered = [...campaigns];

    // Text search
    if (searchText.trim()) {
      const search = searchText.toLowerCase().trim();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(search) ||
        c.id.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (activeFilters.campaignStatus.length > 0) {
      filtered = filtered.filter(c => 
        activeFilters.campaignStatus.includes(c.status)
      );
    }

    // Type filter
    if (activeFilters.campaignType.length > 0) {
      filtered = filtered.filter(c => 
        activeFilters.campaignType.includes(c.type)
      );
    }

    // Budget filter
    if (activeFilters.minBudget !== undefined) {
      filtered = filtered.filter(c => c.budget.amount >= activeFilters.minBudget!);
    }
    if (activeFilters.maxBudget !== undefined) {
      filtered = filtered.filter(c => c.budget.amount <= activeFilters.maxBudget!);
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
  }, [campaigns, searchText, activeFilters, sortConfig]);

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
  const getCampaignSubRows = (campaign: Campaign): AdGroupRow[] => {
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

  // Handlers
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

  const handleSearchChange = (e: any) => {
    setSearchText(e.value || '');
  };

  const applyFilters = () => {
    const newFilters: CampaignFilters = {};
    
    if (activeFilters.campaignStatus.length > 0) {
      newFilters.status = activeFilters.campaignStatus;
    }
    
    if (activeFilters.campaignType.length > 0) {
      newFilters.type = activeFilters.campaignType;
    }
    
    updateFilters(newFilters);
    setShowFilterDialog(false);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      campaignStatus: [],
      campaignType: []
    });
    setSearchText('');
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

  // Active filter count
  const activeFilterCount = 
    activeFilters.campaignStatus.length +
    activeFilters.campaignType.length +
    (activeFilters.minBudget !== undefined ? 1 : 0) +
    (activeFilters.maxBudget !== undefined ? 1 : 0);

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
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Back to</span>
            <ButtonComponent cssClass="e-flat e-small">All campaigns</ButtonComponent>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View ({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''})</span>
            <DropDownListComponent
              dataSource={[{ text: 'Search campaigns', value: 'search' }]}
              fields={{ text: 'text', value: 'value' }}
              value="search"
              cssClass="w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Campaigns ({filteredCampaigns.length})</span>
            <DropDownListComponent
              dataSource={filteredCampaigns.map(c => ({ text: c.name, value: c.id }))}
              fields={{ text: 'text', value: 'value' }}
              placeholder="Select a campaign"
              change={(e) => setSelectedCampaignId(e.value)}
              value={selectedCampaignId}
              cssClass="w-60"
            />
          </div>
        </div>
      </div>

      {/* Filters Summary Bar */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-2">
        <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
          <span className="font-medium">Filters</span>
          <span>Campaign status: {activeFilters.campaignStatus.length > 0 ? activeFilters.campaignStatus.join(', ') : 'All'}</span>
          <span>Ad group status: Enabled, Paused</span>
          <span>Campaign type: {activeFilters.campaignType.length > 0 ? activeFilters.campaignType.join(', ') : 'All'}</span>
          <ButtonComponent cssClass="e-link e-small" onClick={() => setShowFilterDialog(true)}>
            Add filter
          </ButtonComponent>
          {activeFilterCount > 0 && (
            <ButtonComponent cssClass="e-link e-small" onClick={clearAllFilters}>
              Clear all filters
            </ButtonComponent>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4">
        {/* Header with Title and Date Range */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <h1 className="text-2xl font-normal text-gray-900">Campaigns</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-600">{formatDisplay()}</span>
            <DropDownListComponent
              dataSource={dateRangePresets}
              fields={{ text: 'text', value: 'value' }}
              value={preset}
              change={(e) => setPreset(e.value as any)}
              placeholder="Select date range"
              cssClass="w-56"
            />
            <ButtonComponent iconCss="e-icons e-chevron-left" cssClass="e-flat e-small" />
            <ButtonComponent iconCss="e-icons e-chevron-right" cssClass="e-flat e-small" />
            <ButtonComponent cssClass="e-link e-small" onClick={() => setPreset('last30days')}>
              Show last 30 days
            </ButtonComponent>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-4">
          <button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-medium text-sm">
            Campaigns
          </button>
          <button className="pb-3 text-gray-600 text-sm hover:text-gray-900">
            Drafts
          </button>
          <button className="pb-3 text-gray-600 text-sm hover:text-gray-900">
            Settings
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-500 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-normal">Impr.</span>
              <ButtonComponent iconCss="e-icons e-more-vert" cssClass="e-flat e-small text-white" />
            </div>
            <div className="text-3xl font-normal mb-1">
              {aggregatedMetrics.totalImpressions.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span>↓ {Math.abs(Math.floor(aggregatedMetrics.totalImpressions * 0.416)).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Cost</span>
              <ButtonComponent iconCss="e-icons e-more-vert" cssClass="e-flat e-small" />
            </div>
            <div className="text-3xl font-normal text-gray-900 mb-1">
              ₹{aggregatedMetrics.totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <span>↑ ₹{(aggregatedMetrics.totalCost * 0.0103).toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Conversions</span>
              <ButtonComponent iconCss="e-icons e-more-vert" cssClass="e-flat e-small" />
            </div>
            <div className="text-3xl font-normal text-gray-900 mb-1">
              {aggregatedMetrics.totalConversions.toFixed(2)}
            </div>
            <div className="flex items-center gap-1 text-sm text-red-600">
              <span>↓ {(aggregatedMetrics.totalConversions * 0.643).toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Avg. target CPA</span>
              <ButtonComponent iconCss="e-icons e-more-vert" cssClass="e-flat e-small" />
            </div>
            <div className="text-3xl font-normal text-gray-900 mb-1">
              ₹{aggregatedMetrics.avgCpa.toFixed(2)}
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <span>↑ ₹{(aggregatedMetrics.avgCpa * 0.0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <ButtonComponent iconCss="e-icons e-chart" cssClass="e-flat e-small" onClick={() => setShowColumnDialog(true)}>
            Metrics
          </ButtonComponent>
          <ButtonComponent 
            iconCss="e-icons e-edit" 
            cssClass="e-flat e-small"
            disabled={selectedRows.size === 0}
          >
            Adjust
          </ButtonComponent>
          <ButtonComponent iconCss="e-icons e-download" cssClass="e-flat e-small" onClick={downloadReport}>
            Download
          </ButtonComponent>
          <ButtonComponent 
            iconCss="e-icons e-expand" 
            cssClass="e-flat e-small"
            onClick={expandCollapseAll}
          >
            {expandedRows.size === filteredCampaigns.length && filteredCampaigns.length > 0 ? 'Collapse all' : 'Expand all'}
          </ButtonComponent>
        </div>

        {/* Chart Section */}
        <div className="bg-white border border-gray-200 rounded mb-6 p-4">
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
                majorGridLines: { width: 1, color: '#e5e7eb' }
              }}
              height="300px"
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

        {/* Search and Actions Bar */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <ButtonComponent 
              iconCss="e-icons e-filter" 
              cssClass="e-flat e-small" 
              onClick={() => setShowFilterDialog(true)}
            >
              Add filter
            </ButtonComponent>
            <TextBoxComponent
              placeholder="Search campaigns..."
              showClearButton={true}
              value={searchText}
              input={handleSearchChange}
              cssClass="w-80"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ButtonComponent iconCss="e-icons e-search" cssClass="e-flat e-small">
              Search
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
            <ButtonComponent iconCss="e-icons e-print" cssClass="e-flat e-small">
              Reports
            </ButtonComponent>
            <ButtonComponent iconCss="e-icons e-download" cssClass="e-flat e-small" onClick={downloadReport}>
              Download
            </ButtonComponent>
            <ButtonComponent iconCss="e-icons e-expand" cssClass="e-flat e-small" onClick={expandCollapseAll}>
              Expand
            </ButtonComponent>
            <ButtonComponent iconCss="e-icons e-more-vert" cssClass="e-flat e-small">
              More
            </ButtonComponent>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedRows.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between flex-wrap gap-3">
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

        {/* Campaign Table */}
        <div className="bg-white border border-gray-200 rounded overflow-x-auto">
          <table className="w-full text-sm min-w-[1200px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 cursor-pointer"
                    checked={selectedRows.size === filteredCampaigns.length && filteredCampaigns.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left w-10"></th>
                <th 
                  className="px-4 py-3 text-left font-normal text-gray-700 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('name')}
                >
                  Campaign {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left font-normal text-gray-700 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('budget')}
                >
                  Budget {sortConfig?.key === 'budget' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left font-normal text-gray-700 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('status')}
                >
                  Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left font-normal text-gray-700">Optimization score</th>
                <th 
                  className="px-4 py-3 text-left font-normal text-gray-700 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('type')}
                >
                  Campaign type {sortConfig?.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                {visibleColumns.includes('impressions') && (
                  <th className="px-4 py-3 text-right font-normal text-gray-700">Impr.</th>
                )}
                {visibleColumns.includes('clicks') && (
                  <th className="px-4 py-3 text-right font-normal text-gray-700">↓ Interactions</th>
                )}
                <th className="px-4 py-3 text-right font-normal text-gray-700">Interaction rate</th>
                {visibleColumns.includes('avgCost') && (
                  <th className="px-4 py-3 text-right font-normal text-gray-700">Avg. cost</th>
                )}
                {visibleColumns.includes('cost') && (
                  <th className="px-4 py-3 text-right font-normal text-gray-700">Cost</th>
                )}
                {visibleColumns.includes('conversions') && (
                  <th className="px-4 py-3 text-left font-normal text-gray-700">Conv. rate</th>
                )}
                <th className="px-4 py-3 text-left font-normal text-gray-700">Bid strategy</th>
              </tr>
            </thead>
            <tbody>
              {/* Drafts Row */}
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => toggleRowExpansion('drafts')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {expandedRows.has('drafts') ? '▼' : '▶'}
                  </button>
                </td>
                <td className="px-4 py-3" colSpan={14}>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-200 rounded text-xs">📄</span>
                    <span className="text-gray-700">Drafts in progress: 0</span>
                  </div>
                </td>
              </tr>

              {/* Campaign Rows */}
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={15} className="px-4 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg mb-2">No campaigns found</p>
                      {searchText && (
                        <p className="text-sm">Try adjusting your search or filters</p>
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
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 cursor-pointer"
                            checked={selectedRows.has(campaign.id)}
                            onChange={() => toggleRowSelection(campaign.id)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => toggleRowExpansion(campaign.id)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            {isExpanded ? '▼' : '▶'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              campaign.status === CampaignStatus.ENABLED ? 'bg-green-500' : 
                              campaign.status === CampaignStatus.PAUSED ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></span>
                            <a href="#" className="text-blue-600 hover:underline">
                              {campaign.name}
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <span>{campaign.budget.format()}/day</span>
                            <span className="text-gray-400 cursor-pointer hover:text-gray-600">✏️</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                            campaign.status === CampaignStatus.ENABLED 
                              ? 'bg-red-100 text-red-800'
                              : campaign.status === CampaignStatus.PAUSED
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.status === CampaignStatus.ENABLED ? '⚠️ Limited by budget' : campaign.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-blue-600 cursor-pointer hover:underline">58.9%</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-700">{campaign.type}</span>
                        </td>
                        {visibleColumns.includes('impressions') && (
                          <td className="px-4 py-3 text-right">
                            {subRows.reduce((sum, row) => sum + row.impressions, 0).toLocaleString()}
                          </td>
                        )}
                        {visibleColumns.includes('clicks') && (
                          <td className="px-4 py-3 text-right">
                            {subRows.reduce((sum, row) => sum + row.clicks, 0)} clicks
                          </td>
                        )}
                        <td className="px-4 py-3 text-right">
                          {(
                            (subRows.reduce((sum, row) => sum + row.clicks, 0) / 
                            subRows.reduce((sum, row) => sum + row.impressions, 0)) * 100
                          ).toFixed(2)}%
                        </td>
                        {visibleColumns.includes('avgCost') && (
                          <td className="px-4 py-3 text-right">
                            ₹{(
                              subRows.reduce((sum, row) => sum + parseFloat(row.avgCost), 0) / subRows.length
                            ).toFixed(2)}
                          </td>
                        )}
                        {visibleColumns.includes('cost') && (
                          <td className="px-4 py-3 text-right">
                            {campaign.budget.format()}
                          </td>
                        )}
                        {visibleColumns.includes('conversions') && (
                          <td className="px-4 py-3">
                            <a href="#" className="text-blue-600 hover:underline text-xs">
                              Maximize conversions
                            </a>
                          </td>
                        )}
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-600">Target CPA</span>
                        </td>
                      </tr>

                      {/* Sub-rows */}
                      {isExpanded && subRows.map((subRow, idx) => (
                        <tr key={`${campaign.id}-${idx}`} className="bg-gray-50 border-b border-gray-100">
                          <td className="px-4 py-2"></td>
                          <td className="px-4 py-2"></td>
                          <td className="px-4 py-2 pl-12">
                            <span className="text-gray-700 text-sm">{subRow.name}</span>
                          </td>
                          <td className="px-4 py-2"></td>
                          <td className="px-4 py-2"></td>
                          <td className="px-4 py-2"></td>
                          <td className="px-4 py-2"></td>
                          {visibleColumns.includes('impressions') && (
                            <td className="px-4 py-2 text-right text-sm">{subRow.impressions.toLocaleString()}</td>
                          )}
                          {visibleColumns.includes('clicks') && (
                            <td className="px-4 py-2 text-right text-sm">{subRow.clicks} clicks</td>
                          )}
                          <td className="px-4 py-2 text-right text-sm">{subRow.interactionRate}%</td>
                          {visibleColumns.includes('avgCost') && (
                            <td className="px-4 py-2 text-right text-sm">₹{subRow.avgCost}</td>
                          )}
                          {visibleColumns.includes('cost') && (
                            <td className="px-4 py-2 text-right text-sm">₹{subRow.cost}</td>
                          )}
                          {visibleColumns.includes('conversions') && (
                            <td className="px-4 py-2 text-sm">{subRow.conversionRate}%</td>
                          )}
                          <td className="px-4 py-2"></td>
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
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3">
                      <button className="text-gray-600">▶</button>
                    </td>
                    <td className="px-4 py-3" colSpan={5}>
                      <div className="flex items-center gap-2">
                        <span>Total: Campaigns in your current view</span>
                        <span className="text-gray-400 cursor-pointer" title="Total for filtered campaigns">ℹ️</span>
                      </div>
                    </td>
                    {visibleColumns.includes('impressions') && (
                      <td className="px-4 py-3 text-right">{aggregatedMetrics.totalImpressions.toLocaleString()}</td>
                    )}
                    {visibleColumns.includes('clicks') && (
                      <td className="px-4 py-3 text-right">{aggregatedMetrics.totalClicks} clicks</td>
                    )}
                    <td className="px-4 py-3 text-right">{aggregatedMetrics.ctr.toFixed(2)}%</td>
                    {visibleColumns.includes('avgCost') && (
                      <td className="px-4 py-3 text-right">₹{aggregatedMetrics.avgCpc.toFixed(2)}</td>
                    )}
                    {visibleColumns.includes('cost') && (
                      <td className="px-4 py-3 text-right">₹{aggregatedMetrics.totalCost.toFixed(2)}</td>
                    )}
                    {visibleColumns.includes('conversions') && (
                      <td className="px-4 py-3">{aggregatedMetrics.conversionRate.toFixed(2)}%</td>
                    )}
                    <td className="px-4 py-3"></td>
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3">
                      <button className="text-gray-600">▶</button>
                    </td>
                    <td className="px-4 py-3" colSpan={2}>
                      <div className="flex items-center gap-2">
                        <span>Total: Account</span>
                        <span className="text-gray-400 cursor-pointer" title="Total for entire account">ℹ️</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {campaigns.length > 0 && campaigns[0]?.budget.format()}/day
                    </td>
                    <td className="px-4 py-3" colSpan={2}>--</td>
                    {visibleColumns.includes('impressions') && (
                      <td className="px-4 py-3 text-right">{aggregatedMetrics.totalImpressions.toLocaleString()}</td>
                    )}
                    {visibleColumns.includes('clicks') && (
                      <td className="px-4 py-3 text-right">{aggregatedMetrics.totalClicks} clicks</td>
                    )}
                    <td className="px-4 py-3 text-right">{aggregatedMetrics.ctr.toFixed(2)}%</td>
                    {visibleColumns.includes('avgCost') && (
                      <td className="px-4 py-3 text-right">₹{aggregatedMetrics.avgCpc.toFixed(2)}</td>
                    )}
                    {visibleColumns.includes('cost') && (
                      <td className="px-4 py-3 text-right">₹{aggregatedMetrics.totalCost.toFixed(2)}</td>
                    )}
                    {visibleColumns.includes('conversions') && (
                      <td className="px-4 py-3">{aggregatedMetrics.conversionRate.toFixed(2)}%</td>
                    )}
                    <td className="px-4 py-3"></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Recommendation Card */}
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 rounded-full p-3 text-white flex-shrink-0">
              <span className="text-xl">💡</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Optimize your budgets</h3>
                  <span className="text-green-600 text-sm font-medium">+11.2%</span>
                </div>
                <ButtonComponent iconCss="e-icons e-more-vert" cssClass="e-flat e-small" />
              </div>
              <p className="text-sm text-gray-600 mb-3">
                You missed conversions because you're limited by budget. Increasing your budget can result in more conversions, while staying within your target.
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Recommended because you missed out potential traffic last week based on data from the ad auctions you participated in
              </p>
              <div className="flex gap-2">
                <ButtonComponent cssClass="e-primary e-small">Apply</ButtonComponent>
                <ButtonComponent cssClass="e-flat e-small">View</ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Dialog */}
      <DialogComponent
        width="500px"
        isModal={true}
        visible={showFilterDialog}
        close={() => setShowFilterDialog(false)}
        header="Add Filter"
        showCloseIcon={true}
      >
        <div className="p-4 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Campaign Status</label>
            <div className="space-y-2">
              {Object.values(CampaignStatus).map((status) => (
                <div key={status} className="flex items-center">
                  <CheckBoxComponent
                    label={status}
                    checked={activeFilters.campaignStatus.includes(status)}
                    change={(e) => {
                      setActiveFilters(prev => ({
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
            <label className="block text-sm font-medium text-gray-700 mb-3">Campaign Type</label>
            <div className="space-y-2">
              {Object.values(CampaignType).map((type) => (
                <div key={type} className="flex items-center">
                  <CheckBoxComponent
                    label={type}
                    checked={activeFilters.campaignType.includes(type)}
                    change={(e) => {
                      setActiveFilters(prev => ({
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

          <div className="flex justify-end gap-2 pt-4 border-t">
            <ButtonComponent onClick={() => setShowFilterDialog(false)}>Cancel</ButtonComponent>
            <ButtonComponent cssClass="e-primary" onClick={applyFilters}>Apply Filters</ButtonComponent>
          </div>
        </div>
      </DialogComponent>

      {/* Column Selection Dialog */}
      <DialogComponent
        width="400px"
        isModal={true}
        visible={showColumnDialog}
        close={() => setShowColumnDialog(false)}
        header="Select Columns"
        showCloseIcon={true}
      >
        <div className="p-4 space-y-3">
          <p className="text-sm text-gray-600 mb-4">Choose which metrics to display in the table</p>
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
          <div className="flex justify-end gap-2 pt-4 border-t">
            <ButtonComponent onClick={() => setShowColumnDialog(false)}>Close</ButtonComponent>
          </div>
        </div>
      </DialogComponent>

      {/* Segment Dialog */}
      <DialogComponent
        width="500px"
        isModal={true}
        visible={showSegmentDialog}
        close={() => setShowSegmentDialog(false)}
        header="Segment Data"
        showCloseIcon={true}
      >
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">Select how you want to segment your campaign data</p>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">Time &gt; Day</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">Time &gt; Week</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">Time &gt; Month</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">Device</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">Network</button>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <ButtonComponent onClick={() => setShowSegmentDialog(false)}>Close</ButtonComponent>
          </div>
        </div>
      </DialogComponent>

      {/* FAB Button */}
      <button 
        className="fixed bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 transition-all"
        title="New campaign"
        aria-label="Create new campaign"
      >
        <span className="text-2xl">+</span>
      </button>

      {/* Scroll to Top Button */}
      <button 
        className="fixed bottom-6 right-6 bg-white hover:bg-gray-50 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-md z-50 transition-all"
        title="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <span className="text-gray-600">▲</span>
      </button>
    </div>
  );
};
import React from 'react';
import { useOverviewMetrics, useDateRange } from '@application/hooks';
import { MetricCard } from '@presentation/components/MetricCard';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, LineSeries, DateTime, Legend, Tooltip } from '@syncfusion/ej2-react-charts';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

export const OverviewPage: React.FC = () => {
  const { metrics, loading, error } = useOverviewMetrics();
  const { preset, setPreset } = useDateRange('last30days');

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

  // Mock time series data for chart
  const timeSeriesData = [
    { date: new Date(2020, 6, 1), clicks: 400, conversions: 150, cost: 1200 },
    { date: new Date(2020, 7, 1), clicks: 500, conversions: 180, cost: 1400 },
    { date: new Date(2020, 8, 1), clicks: 650, conversions: 200, cost: 1600 },
    { date: new Date(2020, 9, 1), clicks: 300, conversions: 120, cost: 900 },
    { date: new Date(2020, 10, 1), clicks: 550, conversions: 190, cost: 1500 },
    { date: new Date(2020, 11, 1), clicks: 700, conversions: 250, cost: 1800 },
    { date: new Date(2021, 0, 1), clicks: 800, conversions: 280, cost: 2000 },
    { date: new Date(2024, 0, 1), clicks: 650, conversions: 220, cost: 1700 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-gray-900">Overview</h1>
        <div className="flex items-center gap-4">
          <DropDownListComponent
            dataSource={dateRangePresets}
            fields={{ text: 'text', value: 'value' }}
            value={preset}
            change={(e) => setPreset(e.value as any)}
            placeholder="Select date range"
            cssClass="w-48"
          />
          <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
            Show last 30 days
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">View (2 filters)</span>
            <button className="text-sm text-blue-600 hover:underline">All campaigns</button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Campaigns (79)</span>
            <button className="text-sm text-blue-600 hover:underline">Select a campaign</button>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-sm text-gray-600 hover:text-gray-900">Filters</button>
            <span className="text-sm text-gray-500">Campaign status: All</span>
            <span className="text-sm text-gray-500">Ad group status: All</span>
            <button className="text-sm text-blue-600 hover:underline">Add filter</button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Clicks"
          value={metrics?.clicks?.toLocaleString() || '0'}
          color="blue"
        />
        <MetricCard
          title="Conversions"
          value={metrics?.conversions?.toLocaleString() || '0'}
          color="red"
        />
        <MetricCard
          title="Impressions"
          value={metrics?.impressions?.toLocaleString() || '0'}
          color="orange"
        />
        <MetricCard
          title="Cost"
          value={metrics?.cost?.format() || '$0.00'}
          color="green"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="CTR"
          value={metrics?.ctr ? `${(metrics.ctr * 100).toFixed(2)}%` : '0%'}
        />
        <MetricCard
          title="Average CPC"
          value={metrics?.averageCpc?.format() || '$0.00'}
        />
        <MetricCard
          title="Conversion Rate"
          value={metrics?.conversionRate ? `${(metrics.conversionRate * 100).toFixed(2)}%` : '0%'}
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ChartComponent
          id="overview-chart"
          primaryXAxis={{ valueType: 'DateTime', labelFormat: 'MMM yyyy' }}
          primaryYAxis={{ labelFormat: '{value}' }}
          title="Performance Over Time"
          height="400px"
        >
          <Inject services={[LineSeries, DateTime, Legend, Tooltip]} />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={timeSeriesData}
              xName="date"
              yName="clicks"
              name="Clicks"
              type="Line"
              marker={{ visible: true, width: 10, height: 10 }}
            />
            <SeriesDirective
              dataSource={timeSeriesData}
              xName="date"
              yName="conversions"
              name="Conversions"
              type="Line"
              marker={{ visible: true, width: 10, height: 10 }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">💡</span>
            <h3 className="text-lg font-medium">Recommendation</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">Try the new Google Ads mobile app</p>
          <p className="text-sm text-gray-500">Monitor performance and improve your account on the go</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🎬</span>
            <h3 className="text-lg font-medium">Video ads</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <p className="text-sm text-gray-600">Google ads training in-feed</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <p className="text-sm text-gray-600">Keyword campaign</p>
          </div>
        </div>
      </div>
    </div>
  );
};
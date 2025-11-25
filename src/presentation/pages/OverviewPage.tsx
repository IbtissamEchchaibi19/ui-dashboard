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
    <div className="bg-gray-50 min-h-screen">
      {/* Main Content Container */}
      <div className="p-6 space-y-6">
        {/* Filters Bar - Styled like Google Ads */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-6 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-gray-700">View (2 filters)</span>
              <button className="text-blue-600 hover:underline font-medium">
                All campaigns
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Campaigns (79)</span>
              <button className="text-blue-600 hover:underline font-medium">
                Select a campaign
              </button>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-gray-600">Filters</span>
              <span className="text-gray-500">Campaign status: All</span>
              <span className="text-gray-500">Ad group status: All</span>
              <button className="text-blue-600 hover:underline font-medium">
                Add filter
              </button>
            </div>
          </div>
        </div>

        {/* Header with Date Range */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-normal text-gray-900">Overview</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">All time</span>
            <DropDownListComponent
              dataSource={dateRangePresets}
              fields={{ text: 'text', value: 'value' }}
              value={preset}
              change={(e) => setPreset(e.value as any)}
              placeholder="Jul 9, 2020 – Jan 15, 2024"
              cssClass="w-64"
            />
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="text-sm text-blue-600 hover:underline font-medium">
              Show last 30 days
            </button>
          </div>
        </div>

        {/* New Campaign Button */}
        <div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 shadow-md">
            <span className="text-xl">+</span>
            New campaign
          </button>
        </div>

        {/* Metrics Cards - Google Ads Style with Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          <div className="bg-white border border-gray-300 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-700 font-normal">Clicks</h3>
              <button className="text-gray-400 hover:text-gray-600">⋮</button>
            </div>
            <div className="text-3xl font-normal text-gray-900">
              {metrics?.clicks?.toLocaleString() || '9.98K'}
            </div>
          </div>

          <div className="bg-red-600 border border-red-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-white font-normal">Conversions ▾</h3>
              <button className="text-white hover:text-red-100">⋮</button>
            </div>
            <div className="text-3xl font-normal text-white">
              {metrics?.conversions?.toLocaleString() || '312.00'}
            </div>
          </div>

          <div className="bg-orange-500 border border-orange-600 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-white font-normal">Clicks ▾</h3>
              <button className="text-white hover:text-orange-100">⋮</button>
            </div>
            <div className="text-3xl font-normal text-white">
              {metrics?.clicks?.toLocaleString() || '9.98K'}
            </div>
          </div>

          <div className="bg-green-700 border border-green-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-white font-normal">Conversions ▾</h3>
              <button className="text-white hover:text-green-100">⋮</button>
            </div>
            <div className="text-3xl font-normal text-white">
              {metrics?.conversions?.toLocaleString() || '312.00'}
            </div>
          </div>
        </div>

        {/* Chart with white background */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ChartComponent
            id="overview-chart"
            primaryXAxis={{ 
              valueType: 'DateTime', 
              labelFormat: 'MMM yyyy',
              majorGridLines: { width: 0 },
              minorGridLines: { width: 0 }
            }}
            primaryYAxis={{ 
              labelFormat: '{value}',
              majorGridLines: { width: 1, color: '#e5e7eb' },
              minorGridLines: { width: 0 }
            }}
            height="400px"
            chartArea={{ border: { width: 0 } }}
            background="transparent"
          >
            <Inject services={[LineSeries, DateTime, Legend, Tooltip]} />
            <SeriesCollectionDirective>
              <SeriesDirective
                dataSource={timeSeriesData}
                xName="date"
                yName="clicks"
                name="Clicks"
                type="Line"
                width={2}
                marker={{ visible: true, width: 8, height: 8 }}
                fill="#f59e0b"
              />
              <SeriesDirective
                dataSource={timeSeriesData}
                xName="date"
                yName="conversions"
                name="Conversions"
                type="Line"
                width={2}
                marker={{ visible: true, width: 8, height: 8 }}
                fill="#dc2626"
              />
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>

        {/* Bottom Cards - Recommendations and Video Ads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">💡</span>
                <h3 className="text-base font-medium text-gray-900">Recommendation</h3>
              </div>
              <button className="text-gray-400 hover:text-gray-600">⋮</button>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Try the new Google Ads mobile app
                </p>
                <p className="text-sm text-gray-600">
                  Monitor performance and improve your account on the go
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎬</span>
                <h3 className="text-base font-medium text-gray-900">Video ads</h3>
              </div>
              <button className="text-gray-400 hover:text-gray-600">⋮</button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <button className="text-sm text-blue-600 hover:underline">
                  Google ads training in-feed
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-800 rounded-full"></span>
                <button className="text-sm text-gray-900 hover:underline">
                  Keyword campaign
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons at Bottom */}
        <div className="flex items-center justify-between pt-4">
          <button className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          <button className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Feedback
          </button>
        </div>
      </div>
    </div>
  );
};
// src/presentation/pages/dashboard/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { KPICard } from '../../components/common/KPICard';
import { Card } from '../../components/common/Card';
import { LineChart, BarChart, PieChart } from '../../components/charts';
import { Loading } from '../../components/common/Loading';
import { AnalyticsRepository } from '../../../infrastructure/repositories/AnalyticsRepository';
import { DashboardKPI, DateRange } from '../../../domain/entities/Analytics';
import { format, subDays } from 'date-fns';

export const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState<DashboardKPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeSeriesData, setTimeSeriesData] = useState<Array<{ x: Date; y: number }>>([]);
  const [channelData, setChannelData] = useState<Array<{ x: string; y: number }>>([]);
  const [deviceData, setDeviceData] = useState<Array<{ x: string; y: number }>>([]);

  const analyticsRepo = new AnalyticsRepository();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, 30);
      const dateRange: DateRange = { startDate, endDate };

      // Load KPIs
      const kpiData = await analyticsRepo.getDashboardKPIs(dateRange);
      setKpis(kpiData);

      // Load time series data
      const series = Array.from({ length: 30 }, (_, i) => ({
        x: subDays(endDate, 29 - i),
        y: Math.floor(Math.random() * 10000) + 5000,
      }));
      setTimeSeriesData(series);

      // Load acquisition data
      const acquisition = await analyticsRepo.getAcquisitionOverview(dateRange);
      const channelChartData = acquisition.channels.slice(0, 6).map(ch => ({
        x: ch.channel,
        y: ch.users,
      }));
      setChannelData(channelChartData);

      // Load traffic data
      const traffic = await analyticsRepo.getTrafficOverview(dateRange);
      const deviceChartData = traffic.byDevice.map(d => ({
        x: d.category.charAt(0).toUpperCase() + d.category.slice(1),
        y: d.users,
      }));
      setDeviceData(deviceChartData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading size="lg" text="Loading dashboard..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 border border-gray-300 rounded-md text-sm">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button className="px-4 py-2 bg-primary-500 text-white rounded-md text-sm hover:bg-primary-600">
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.slice(0, 8).map((kpi) => (
          <KPICard
            key={kpi.id}
            title={kpi.name}
            value={kpi.currentValue}
            change={kpi.change}
            changePercentage={kpi.changePercentage}
            trend={kpi.trend}
            format={kpi.format}
            sparklineData={kpi.sparklineData}
          />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Traffic Trend (Last 30 Days)
          </h3>
          <LineChart
            data={timeSeriesData}
            xAxisLabel="Date"
            yAxisLabel="Sessions"
            seriesName="Sessions"
            height="300px"
          />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Users by Channel
          </h3>
          <BarChart
            data={channelData}
            xAxisLabel="Channel"
            yAxisLabel="Users"
            seriesName="Users"
            height="300px"
          />
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Device Distribution
          </h3>
          <PieChart data={deviceData} height="300px" />
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performing Campaigns
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Summer Sale 2024', impressions: 125420, clicks: 8234, ctr: 6.57 },
              { name: 'Brand Awareness', impressions: 98765, clicks: 6543, ctr: 6.63 },
              { name: 'Product Launch', impressions: 87654, clicks: 5432, ctr: 6.20 },
              { name: 'Holiday Special', impressions: 76543, clicks: 4321, ctr: 5.65 },
            ].map((campaign, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{campaign.name}</p>
                  <p className="text-sm text-gray-500">
                    {campaign.impressions.toLocaleString()} impressions · {campaign.clicks.toLocaleString()} clicks
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-primary-600">
                    {campaign.ctr.toFixed(2)}%
                  </p>
                  <p className="text-xs text-gray-500">CTR</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {[
            {
              action: 'Campaign status changed',
              detail: 'Summer Sale 2024 was enabled',
              time: '2 hours ago',
              user: 'John Doe',
            },
            {
              action: 'Budget updated',
              detail: 'Brand Awareness budget increased to $500',
              time: '5 hours ago',
              user: 'Jane Smith',
            },
            {
              action: 'New ad created',
              detail: 'Responsive search ad added to Product Launch',
              time: '1 day ago',
              user: 'John Doe',
            },
            {
              action: 'Keywords added',
              detail: '15 new keywords added to Holiday Special',
              time: '2 days ago',
              user: 'Mike Johnson',
            },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.detail}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {activity.time} · {activity.user}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
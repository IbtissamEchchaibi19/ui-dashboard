// src/presentation/pages/analytics/AcquisitionPage.tsx
import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { KPICard } from '../../components/common/KPICard';
import { DataTable, TableColumn } from '../../components/common/DataTable';
import { BarChart, PieChart } from '../../components/charts';
import { Loading } from '../../components/common/Loading';
import { AnalyticsRepository } from '../../../infrastructure/repositories/AnalyticsRepository';
import {
  AcquisitionOverview,
  ChannelData,
  SourceMediumData,
  DateRange,
} from '../../../domain/entities/Analytics';
import { subDays } from 'date-fns';

export const AcquisitionPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<AcquisitionOverview | null>(null);
  const [sourceMediumData, setSourceMediumData] = useState<SourceMediumData[]>([]);

  const analyticsRepo = new AnalyticsRepository();

  useEffect(() => {
    loadAcquisitionData();
  }, []);

  const loadAcquisitionData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, 30);
      const dateRange: DateRange = { startDate, endDate };

      const overviewData = await analyticsRepo.getAcquisitionOverview(dateRange);
      setOverview(overviewData);

      const sourceMedium = await analyticsRepo.getSourceMediumData(dateRange);
      setSourceMediumData(sourceMedium);
    } catch (error) {
      console.error('Error loading acquisition data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading size="lg" text="Loading acquisition data..." fullScreen />;
  }

  if (!overview) {
    return <div>No data available</div>;
  }

  const channelColumns: TableColumn[] = [
    {
      field: 'channel',
      headerText: 'Channel',
      width: '150',
    },
    {
      field: 'users',
      headerText: 'Users',
      width: '120',
      textAlign: 'Right',
      template: (props: ChannelData) => props.users.toLocaleString(),
    },
    {
      field: 'newUsers',
      headerText: 'New Users',
      width: '120',
      textAlign: 'Right',
      template: (props: ChannelData) => props.newUsers.toLocaleString(),
    },
    {
      field: 'sessions',
      headerText: 'Sessions',
      width: '120',
      textAlign: 'Right',
      template: (props: ChannelData) => props.sessions.toLocaleString(),
    },
    {
      field: 'bounceRate',
      headerText: 'Bounce Rate',
      width: '120',
      textAlign: 'Right',
      template: (props: ChannelData) => `${props.bounceRate.toFixed(2)}%`,
    },
    {
      field: 'pagesPerSession',
      headerText: 'Pages/Session',
      width: '130',
      textAlign: 'Right',
      template: (props: ChannelData) => props.pagesPerSession.toFixed(2),
    },
    {
      field: 'avgSessionDuration',
      headerText: 'Avg. Duration',
      width: '130',
      textAlign: 'Right',
      template: (props: ChannelData) => {
        const minutes = Math.floor(props.avgSessionDuration / 60);
        const seconds = Math.floor(props.avgSessionDuration % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      },
    },
    {
      field: 'goalCompletions',
      headerText: 'Goals',
      width: '100',
      textAlign: 'Right',
      template: (props: ChannelData) => props.goalCompletions.toLocaleString(),
    },
    {
      field: 'goalValue',
      headerText: 'Goal Value',
      width: '120',
      textAlign: 'Right',
      template: (props: ChannelData) => `$${props.goalValue.toLocaleString()}`,
    },
  ];

  const sourceMediumColumns: TableColumn[] = [
    {
      field: 'source',
      headerText: 'Source',
      width: '150',
    },
    {
      field: 'medium',
      headerText: 'Medium',
      width: '120',
    },
    {
      field: 'users',
      headerText: 'Users',
      width: '120',
      textAlign: 'Right',
      template: (props: SourceMediumData) => props.users.toLocaleString(),
    },
    {
      field: 'sessions',
      headerText: 'Sessions',
      width: '120',
      textAlign: 'Right',
      template: (props: SourceMediumData) => props.sessions.toLocaleString(),
    },
    {
      field: 'bounceRate',
      headerText: 'Bounce Rate',
      width: '120',
      textAlign: 'Right',
      template: (props: SourceMediumData) => `${props.bounceRate.toFixed(2)}%`,
    },
  ];

  const chartData = overview.channels.map((ch) => ({
    x: ch.channel,
    y: ch.users,
  }));

  const pieData = overview.channels.map((ch) => ({
    x: ch.channel,
    y: ch.sessions,
    text: ch.channel,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Acquisition Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            How users are finding your site
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 border border-gray-300 rounded-md text-sm">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="px-4 py-2 bg-primary-500 text-white rounded-md text-sm hover:bg-primary-600">
            Export
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Total Users"
          value={overview.totalUsers}
          format="NUMBER"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />
        <KPICard
          title="New Users"
          value={overview.totalNewUsers}
          format="NUMBER"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          }
        />
        <KPICard
          title="Total Sessions"
          value={overview.totalSessions}
          format="NUMBER"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Users by Channel
          </h3>
          <BarChart
            data={chartData}
            xAxisLabel="Channel"
            yAxisLabel="Users"
            seriesName="Users"
            height="300px"
          />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Session Distribution
          </h3>
          <PieChart data={pieData} height="300px" />
        </Card>
      </div>

      {/* Channel Performance Table */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Channel Performance
          </h3>
          <p className="text-sm text-gray-500">
            Detailed metrics for each acquisition channel
          </p>
        </div>
        <DataTable
          data={overview.channels}
          columns={channelColumns}
          pageSize={10}
          allowSorting={true}
          showToolbar={false}
        />
      </Card>

      {/* Source/Medium Table */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Source / Medium</h3>
          <p className="text-sm text-gray-500">
            Traffic breakdown by source and medium
          </p>
        </div>
        <DataTable
          data={sourceMediumData}
          columns={sourceMediumColumns}
          pageSize={10}
          allowSorting={true}
          allowFiltering={true}
          showToolbar={true}
        />
      </Card>

      {/* Insights */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="space-y-3">
          {overview.channels
            .sort((a, b) => b.users - a.users)
            .slice(0, 3)
            .map((channel, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-semibold">
                      #{idx + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{channel.channel}</p>
                    <p className="text-sm text-gray-500">
                      {channel.users.toLocaleString()} users ·{' '}
                      {channel.sessions.toLocaleString()} sessions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {channel.goalCompletions.toLocaleString()} goals
                  </p>
                  <p className="text-lg font-semibold text-primary-600">
                    ${channel.goalValue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};
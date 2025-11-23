// src/presentation/pages/analytics/TrafficPage.tsx
import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { KPICard } from '../../components/common/KPICard';
import { DataTable, TableColumn } from '../../components/common/DataTable';
import { PieChart, BarChart } from '../../components/charts';
import { Loading } from '../../components/common/Loading';
import { AnalyticsRepository } from '../../../infrastructure/repositories/AnalyticsRepository';
import { TrafficOverview, DeviceData, LocationData, DateRange } from '../../../domain/entities/Analytics';
import { subDays } from 'date-fns';

export const TrafficPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [traffic, setTraffic] = useState<TrafficOverview | null>(null);

  const analyticsRepo = new AnalyticsRepository();

  useEffect(() => {
    loadTrafficData();
  }, []);

  const loadTrafficData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, 30);
      const dateRange: DateRange = { startDate, endDate };
      const data = await analyticsRepo.getTrafficOverview(dateRange);
      setTraffic(data);
    } catch (error) {
      console.error('Error loading traffic data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading size="lg" text="Loading traffic data..." fullScreen />;
  }

  if (!traffic) return <div>No data available</div>;

  const deviceColumns: TableColumn[] = [
    { field: 'category', headerText: 'Device', width: '150' },
    {
      field: 'users',
      headerText: 'Users',
      width: '120',
      textAlign: 'Right',
      template: (props: DeviceData) => props.users.toLocaleString(),
    },
    {
      field: 'sessions',
      headerText: 'Sessions',
      width: '120',
      textAlign: 'Right',
      template: (props: DeviceData) => props.sessions.toLocaleString(),
    },
    {
      field: 'bounceRate',
      headerText: 'Bounce Rate',
      width: '120',
      textAlign: 'Right',
      template: (props: DeviceData) => `${props.bounceRate.toFixed(2)}%`,
    },
    {
      field: 'avgSessionDuration',
      headerText: 'Avg. Duration',
      width: '130',
      textAlign: 'Right',
      template: (props: DeviceData) => {
        const minutes = Math.floor(props.avgSessionDuration / 60);
        const seconds = Math.floor(props.avgSessionDuration % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      },
    },
  ];

  const locationColumns: TableColumn[] = [
    { field: 'country', headerText: 'Country', width: '150' },
    {
      field: 'users',
      headerText: 'Users',
      width: '120',
      textAlign: 'Right',
      template: (props: LocationData) => props.users.toLocaleString(),
    },
    {
      field: 'sessions',
      headerText: 'Sessions',
      width: '120',
      textAlign: 'Right',
      template: (props: LocationData) => props.sessions.toLocaleString(),
    },
    {
      field: 'bounceRate',
      headerText: 'Bounce Rate',
      width: '120',
      textAlign: 'Right',
      template: (props: LocationData) => `${props.bounceRate.toFixed(2)}%`,
    },
  ];

  const devicePieData = traffic.byDevice.map(d => ({
    x: d.category.charAt(0).toUpperCase() + d.category.slice(1),
    y: d.sessions,
    text: d.category.charAt(0).toUpperCase() + d.category.slice(1),
  }));

  const locationBarData = traffic.byLocation.map(l => ({
    x: l.country,
    y: l.users,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Traffic Overview</h1>
        <p className="mt-1 text-sm text-gray-500">Analyze visitor behavior</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Total Sessions"
          value={traffic.totalSessions}
          format="NUMBER"
        />
        <KPICard
          title="Total Pageviews"
          value={traffic.totalPageviews}
          format="NUMBER"
        />
        <KPICard
          title="Avg. Duration"
          value={traffic.avgSessionDuration}
          format="DURATION"
        />
        <KPICard
          title="Bounce Rate"
          value={traffic.bounceRate}
          format="PERCENTAGE"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Distribution</h3>
          <PieChart data={devicePieData} height="300px" />
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Location</h3>
          <BarChart data={locationBarData} xAxisLabel="Country" yAxisLabel="Users" height="300px" />
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Performance</h3>
        <DataTable data={traffic.byDevice} columns={deviceColumns} pageSize={10} showToolbar={false} />
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
        <DataTable data={traffic.byLocation} columns={locationColumns} pageSize={10} showToolbar={true} />
      </Card>
    </div>
  );
};

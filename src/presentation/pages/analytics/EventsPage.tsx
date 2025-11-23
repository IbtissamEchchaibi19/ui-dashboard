import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { DataTable, TableColumn } from '../../components/common/DataTable';
import { BarChart } from '../../components/charts';
import { Loading } from '../../components/common/Loading';
import { AnalyticsRepository } from '../../../infrastructure/repositories/AnalyticsRepository';
import { EventData, DateRange } from '../../../domain/entities/Analytics';
import { subDays } from 'date-fns';

export const EventsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventData[]>([]);

  const analyticsRepo = new AnalyticsRepository();

  useEffect(() => {
    loadEventsData();
  }, []);

  const loadEventsData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, 30);
      const dateRange: DateRange = { startDate, endDate };
      const data = await analyticsRepo.getEventData(dateRange);
      setEvents(data);
    } catch (error) {
      console.error('Error loading events data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn[] = [
    { field: 'eventCategory', headerText: 'Category', width: '150' },
    { field: 'eventAction', headerText: 'Action', width: '150' },
    {
      field: 'totalEvents',
      headerText: 'Total Events',
      width: '130',
      textAlign: 'Right',
      template: (props: EventData) => props.totalEvents.toLocaleString(),
    },
    {
      field: 'uniqueEvents',
      headerText: 'Unique Events',
      width: '130',
      textAlign: 'Right',
      template: (props: EventData) => props.uniqueEvents.toLocaleString(),
    },
    {
      field: 'eventValue',
      headerText: 'Event Value',
      width: '130',
      textAlign: 'Right',
      template: (props: EventData) => `$${props.eventValue.toLocaleString()}`,
    },
    {
      field: 'avgValue',
      headerText: 'Avg. Value',
      width: '120',
      textAlign: 'Right',
      template: (props: EventData) => `$${props.avgValue.toFixed(2)}`,
    },
  ];

  if (loading) {
    return <Loading size="lg" text="Loading events data..." fullScreen />;
  }

  const chartData = events.slice(0, 8).map(e => ({
    x: `${e.eventCategory} - ${e.eventAction}`,
    y: e.totalEvents,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <p className="mt-1 text-sm text-gray-500">Track user interactions</p>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Events</h3>
        <BarChart data={chartData} xAxisLabel="Event" yAxisLabel="Count" height="300px" />
      </Card>

      <Card>
        <DataTable
          data={events}
          columns={columns}
          pageSize={20}
          allowSorting={true}
          allowFiltering={true}
          showToolbar={true}
        />
      </Card>
    </div>
  );
};

// src/presentation/pages/analytics/ConversionsPage.tsx

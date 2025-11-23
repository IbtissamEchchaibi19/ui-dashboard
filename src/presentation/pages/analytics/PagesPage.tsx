import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { DataTable, TableColumn } from '../../components/common/DataTable';
import { Loading } from '../../components/common/Loading';
import { AnalyticsRepository } from '../../../infrastructure/repositories/AnalyticsRepository';
import { PagePerformance, DateRange } from '../../../domain/entities/Analytics';
import { subDays } from 'date-fns';

export const PagesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<PagePerformance[]>([]);

  const analyticsRepo = new AnalyticsRepository();

  useEffect(() => {
    loadPagesData();
  }, []);

  const loadPagesData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, 30);
      const dateRange: DateRange = { startDate, endDate };
      const data = await analyticsRepo.getPagePerformance(dateRange);
      setPages(data);
    } catch (error) {
      console.error('Error loading pages data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn[] = [
    { field: 'pageUrl', headerText: 'Page URL', width: '250' },
    { field: 'pageTitle', headerText: 'Page Title', width: '200' },
    {
      field: 'pageviews',
      headerText: 'Pageviews',
      width: '120',
      textAlign: 'Right',
      template: (props: PagePerformance) => props.pageviews.toLocaleString(),
    },
    {
      field: 'uniquePageviews',
      headerText: 'Unique Pageviews',
      width: '150',
      textAlign: 'Right',
      template: (props: PagePerformance) => props.uniquePageviews.toLocaleString(),
    },
    {
      field: 'avgTimeOnPage',
      headerText: 'Avg. Time on Page',
      width: '150',
      textAlign: 'Right',
      template: (props: PagePerformance) => {
        const minutes = Math.floor(props.avgTimeOnPage / 60);
        const seconds = Math.floor(props.avgTimeOnPage % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      },
    },
    {
      field: 'bounceRate',
      headerText: 'Bounce Rate',
      width: '120',
      textAlign: 'Right',
      template: (props: PagePerformance) => `${props.bounceRate.toFixed(2)}%`,
    },
    {
      field: 'exitRate',
      headerText: 'Exit Rate',
      width: '120',
      textAlign: 'Right',
      template: (props: PagePerformance) => `${props.exitRate.toFixed(2)}%`,
    },
  ];

  if (loading) {
    return <Loading size="lg" text="Loading pages data..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Page Performance</h1>
        <p className="mt-1 text-sm text-gray-500">Analyze individual page metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Pageviews',
            value: pages.reduce((sum, p) => sum + p.pageviews, 0).toLocaleString(),
          },
          {
            label: 'Unique Pageviews',
            value: pages.reduce((sum, p) => sum + p.uniquePageviews, 0).toLocaleString(),
          },
          {
            label: 'Avg. Time on Page',
            value: `${Math.floor(pages.reduce((sum, p) => sum + p.avgTimeOnPage, 0) / pages.length / 60)}m`,
          },
          {
            label: 'Avg. Bounce Rate',
            value: `${(pages.reduce((sum, p) => sum + p.bounceRate, 0) / pages.length).toFixed(1)}%`,
          },
        ].map((stat, idx) => (
          <Card key={idx}>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <DataTable
          data={pages}
          columns={columns}
          pageSize={20}
          allowSorting={true}
          allowFiltering={true}
          showToolbar={true}
          height="600px"
        />
      </Card>
    </div>
  );
};



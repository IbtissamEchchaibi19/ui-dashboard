import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { LineChart } from '../../components/charts';
import { Loading } from '../../components/common/Loading';
import { AnalyticsRepository } from '../../../infrastructure/repositories/AnalyticsRepository';
import { RealtimeData } from '../../../domain/entities/Analytics';

export const RealtimePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [realtime, setRealtime] = useState<RealtimeData | null>(null);

  const analyticsRepo = new AnalyticsRepository();

  useEffect(() => {
    loadRealtimeData();
    const interval = setInterval(loadRealtimeData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadRealtimeData = async () => {
    try {
      const data = await analyticsRepo.getRealtimeData();
      setRealtime(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading realtime data:', error);
      setLoading(false);
    }
  };

  if (loading || !realtime) {
    return <Loading size="lg" text="Loading realtime data..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Realtime</h1>
        <p className="mt-1 text-sm text-gray-500">Monitor activity as it happens</p>
      </div>

      <Card>
        <div className="text-center py-8">
          <p className="text-sm text-gray-600">Active Users Right Now</p>
          <p className="mt-2 text-6xl font-bold text-primary-600">{realtime.activeUsers}</p>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pageviews per Minute</h3>
        <LineChart
          data={realtime.pageviewsPerMinute.map(m => ({ x: m.timestamp, y: m.value }))}
          xAxisLabel="Time"
          yAxisLabel="Pageviews"
          height="250px"
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Active Pages</h3>
          <div className="space-y-3">
            {realtime.topActivePages.map((page, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm text-gray-700 truncate">{page.pageUrl}</span>
                <span className="text-sm font-semibold text-primary-600">{page.activeUsers}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Referrers</h3>
          <div className="space-y-3">
            {realtime.topReferrers.map((ref, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm text-gray-700 truncate">{ref.referrer}</span>
                <span className="text-sm font-semibold text-primary-600">{ref.activeUsers}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Locations</h3>
          <div className="space-y-3">
            {realtime.geoData.map((geo, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{geo.country}</span>
                <span className="text-sm font-semibold text-primary-600">{geo.activeUsers}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
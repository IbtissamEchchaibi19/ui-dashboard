import { useState, useEffect, useCallback } from 'react';
import { DateRange } from '@domain/value-objects';

export interface TimeSeriesDataPoint {
  date: Date;
  impressions: number;
  clicks: number;
  conversions: number;
  conversionsValue: number;
  cost: number;
}

export interface UseAssetGroupTimeSeriesReturn {
  data: TimeSeriesDataPoint[];
  loading: boolean;
  error: string | null;
  setDateRange: (dateRange: DateRange) => void;
}

export function useAssetGroupTimeSeries(
  assetGroupId: string | null,
  initialDateRange: DateRange
): UseAssetGroupTimeSeriesReturn {
  const [data, setData] = useState<TimeSeriesDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);

  const fetchTimeSeries = useCallback(async () => {
    if (!assetGroupId) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with your actual API call
      // const result = await assetGroupService.getTimeSeries(assetGroupId, dateRange);
      
      // Mock data for now
      const mockData: TimeSeriesDataPoint[] = [];
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        mockData.push({
          date: new Date(d),
          impressions: Math.floor(Math.random() * 10000),
          clicks: Math.floor(Math.random() * 500),
          conversions: Math.floor(Math.random() * 50),
          conversionsValue: Math.random() * 5000,
          cost: Math.random() * 1000,
        });
      }
      
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch time series data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [assetGroupId, dateRange]);

  useEffect(() => {
    fetchTimeSeries();
  }, [fetchTimeSeries]);

  return {
    data,
    loading,
    error,
    setDateRange,
  };
}
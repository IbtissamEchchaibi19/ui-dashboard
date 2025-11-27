// application/hooks/useAdTimeSeries.ts
import { useState, useEffect, useCallback } from 'react';
import { DateRange, DateRangeVO } from '@domain/value-objects';
import { AdTimeSeriesDataPoint } from '@infrastructure/repositories/IAdRepository';
import { AdService } from '../services/AdService';
import { MockAdRepository } from '@infrastructure/repositories/MockAdRepository';

interface UseAdTimeSeriesResult {
  data: AdTimeSeriesDataPoint[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setDateRange: (dateRange: DateRange) => void;
}

const adService = new AdService(new MockAdRepository());

export function useAdTimeSeries(
  adId: string | null,
  initialDateRange?: DateRange
): UseAdTimeSeriesResult {
  const [data, setData] = useState<AdTimeSeriesDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(
    initialDateRange || DateRangeVO.last30Days().toJSON()
  );

  const fetchTimeSeries = useCallback(async () => {
    if (!adId) {
      setData([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await adService.getTimeSeries(adId, dateRange);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch time series');
    } finally {
      setLoading(false);
    }
  }, [adId, dateRange]);

  useEffect(() => {
    fetchTimeSeries();
  }, [fetchTimeSeries]);

  return {
    data,
    loading,
    error,
    refetch: fetchTimeSeries,
    setDateRange
  };
}
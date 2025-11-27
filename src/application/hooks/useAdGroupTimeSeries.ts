// application/hooks/useAdGroupTimeSeries.ts
import { useState, useEffect, useCallback } from 'react';
import { DateRange, DateRangeVO } from '@domain/value-objects';
import { AdGroupTimeSeriesDataPoint } from '@infrastructure/repositories/IAdGroupRepository';
import { AdGroupService } from '../services/AdGroupService';
import { MockAdGroupRepository } from '@infrastructure/repositories/MockAdGroupRepository';

interface UseAdGroupTimeSeriesResult {
  data: AdGroupTimeSeriesDataPoint[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setDateRange: (dateRange: DateRange) => void;
}

const adGroupService = new AdGroupService(new MockAdGroupRepository());

export function useAdGroupTimeSeries(
  adGroupId: string | null,
  initialDateRange?: DateRange
): UseAdGroupTimeSeriesResult {
  const [data, setData] = useState<AdGroupTimeSeriesDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(
    initialDateRange || DateRangeVO.last30Days().toJSON()
  );

  const fetchTimeSeries = useCallback(async () => {
    if (!adGroupId) {
      setData([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await adGroupService.getTimeSeries(adGroupId, dateRange);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch time series');
    } finally {
      setLoading(false);
    }
  }, [adGroupId, dateRange]);

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
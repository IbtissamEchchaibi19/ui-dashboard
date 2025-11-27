// application/hooks/useKeywordTimeSeries.ts

import { useState, useEffect, useCallback } from 'react';
import { KeywordService, KeywordTimeSeriesDataPoint } from '../services/KeywordService';
import { DateRange } from '../../domain/value-objects/DateRange';
import { MockKeywordRepository } from '../../infrastructure/repositories/MockKeywordRepository';

/**
 * Hook for fetching keyword performance time series data
 */
export function useKeywordTimeSeries(
  keywordId: string,
  dateRange: DateRange = DateRange.lastNDays(30)
) {
  const [timeSeries, setTimeSeries] = useState<KeywordTimeSeriesDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const repository = new MockKeywordRepository();
  const service = new KeywordService(repository);

  const fetchTimeSeries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await service.getKeywordTimeSeries(keywordId, dateRange);
      setTimeSeries(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [keywordId, dateRange]);

  useEffect(() => {
    fetchTimeSeries();
  }, [fetchTimeSeries]);

  return {
    timeSeries,
    loading,
    error,
    refetch: fetchTimeSeries,
  };
}

/**
 * Hook for fetching multiple keywords time series (comparison)
 */
export function useKeywordsTimeSeriesComparison(
  keywordIds: string[],
  dateRange: DateRange = DateRange.lastNDays(30)
) {
  const [timeSeriesData, setTimeSeriesData] = useState<Record<string, KeywordTimeSeriesDataPoint[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const repository = new MockKeywordRepository();
  const service = new KeywordService(repository);

  const fetchComparison = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const dataMap: Record<string, KeywordTimeSeriesDataPoint[]> = {};

      await Promise.all(
        keywordIds.map(async (id) => {
          const data = await service.getKeywordTimeSeries(id, dateRange);
          dataMap[id] = data;
        })
      );

      setTimeSeriesData(dataMap);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [keywordIds, dateRange]);

  useEffect(() => {
    if (keywordIds.length > 0) {
      fetchComparison();
    }
  }, [fetchComparison]);

  return {
    timeSeriesData,
    loading,
    error,
    refetch: fetchComparison,
  };
}
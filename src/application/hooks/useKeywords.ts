import { useState, useEffect, useCallback } from 'react';
import { Keyword, KeywordMetrics } from '@domain/entities';
import { keywordService } from '@application/services';
import { KeywordFilters } from '@infrastructure/repositories';

export interface UseKeywordsReturn {
  keywords: Keyword[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateFilters: (filters: KeywordFilters) => void;
  filters: KeywordFilters;
}

export function useKeywords(initialFilters?: KeywordFilters): UseKeywordsReturn {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<KeywordFilters>(initialFilters || {});

  const fetchKeywords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await keywordService.getKeywords(filters);
      setKeywords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch keywords');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  const updateFilters = useCallback((newFilters: KeywordFilters) => {
    setFilters(newFilters);
  }, []);

  return {
    keywords,
    loading,
    error,
    refetch: fetchKeywords,
    updateFilters,
    filters,
  };
}

export interface UseKeywordsWithMetricsReturn {
  keywordsWithMetrics: Array<{ keyword: Keyword; metrics: KeywordMetrics }>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useKeywordsWithMetrics(
  filters?: KeywordFilters
): UseKeywordsWithMetricsReturn {
  const [keywordsWithMetrics, setKeywordsWithMetrics] = useState<
  Array<{ keyword: Keyword; metrics: KeywordMetrics }>
 >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await keywordService.getKeywordsWithMetrics(filters);
      setKeywordsWithMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch keywords with metrics');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    keywordsWithMetrics,
    loading,
    error,
    refetch: fetchData,
  };
}
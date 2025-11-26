//useMetrics
import { useState, useEffect, useCallback } from 'react';
import { metricsService } from '@application/services';
import { OverviewMetrics, RecommendationItem } from '@infrastructure/mock-data';

export interface UseOverviewMetricsReturn {
  metrics: OverviewMetrics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOverviewMetrics(): UseOverviewMetricsReturn {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await metricsService.getOverviewMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch overview metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
}

export interface UseRecommendationsReturn {
  recommendations: RecommendationItem[];
  loading: boolean;
  error: string | null;
  dismissRecommendation: (id: string) => void;
}

export function useRecommendations(): UseRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await metricsService.getRecommendations();
        setRecommendations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const dismissRecommendation = useCallback((id: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
  }, []);

  return {
    recommendations,
    loading,
    error,
    dismissRecommendation,
  };
}
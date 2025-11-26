// useAudience
import { useState, useEffect, useCallback } from 'react';
import { Audience } from '@domain/entities';
import { audienceService } from '@application/services';

export interface UseAudiencesReturn {
  audiences: Audience[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAudiences(): UseAudiencesReturn {
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAudiences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await audienceService.getAudiences();
      setAudiences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audiences');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAudiences();
  }, [fetchAudiences]);

  return {
    audiences,
    loading,
    error,
    refetch: fetchAudiences,
  };
}

export interface UseAudiencePerformanceReturn {
  data: Array<{ segment: string; clicks: number }>;
  loading: boolean;
  error: string | null;
}

export function useAudiencePerformance(audienceId: string | null): UseAudiencePerformanceReturn {
  const [data, setData] = useState<Array<{ segment: string; clicks: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!audienceId) {
      setData([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await audienceService.getAudiencePerformanceData(audienceId);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch audience performance');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [audienceId]);

  return { data, loading, error };
}
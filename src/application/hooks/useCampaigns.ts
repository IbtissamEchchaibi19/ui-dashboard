// usecompaign hook
import { useState, useEffect, useCallback } from 'react';
import { Campaign, CampaignMetrics } from '@domain/entities';
// import { CampaignStatus, CampaignType } from '@domain/enums';
import { DateRange } from '@domain/value-objects';
import { campaignService } from '@application/services';
import { CampaignFilters } from '@infrastructure/repositories';

export interface UseCampaignsReturn {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateFilters: (filters: CampaignFilters) => void;
  filters: CampaignFilters;
}

export function useCampaigns(initialFilters?: CampaignFilters): UseCampaignsReturn {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CampaignFilters>(initialFilters || {});

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await campaignService.getCampaigns(filters);
      setCampaigns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const updateFilters = useCallback((newFilters: CampaignFilters) => {
    setFilters(newFilters);
  }, []);

  return {
    campaigns,
    loading,
    error,
    refetch: fetchCampaigns,
    updateFilters,
    filters,
  };
}

export interface UseCampaignMetricsReturn {
  metrics: CampaignMetrics[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCampaignMetrics(
  campaignId: string | null,
  dateRange?: DateRange
): UseCampaignMetricsReturn {
  const [metrics, setMetrics] = useState<CampaignMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    if (!campaignId) {
      setMetrics([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await campaignService.getCampaignMetrics(campaignId, dateRange);
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, [campaignId, dateRange]);

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

export interface UseCampaignTimeSeriesReturn {
  data: Array<{ date: Date; clicks: number; conversions: number; cost: number }>;
  loading: boolean;
  error: string | null;
}

export function useCampaignTimeSeries(
  campaignId: string | null,
  dateRange?: DateRange
): UseCampaignTimeSeriesReturn {
  const [data, setData] = useState<Array<{ date: Date; clicks: number; conversions: number; cost: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignId) {
      setData([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await campaignService.getCampaignTimeSeriesMetrics(campaignId, dateRange);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch time series data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campaignId, dateRange]);

  return { data, loading, error };
}

export interface UseAggregatedMetricsReturn {
  metrics: {
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    totalCost: any;
    averageCtr: number;
    averageConversionRate: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export function useAggregatedMetrics(
  campaigns: Campaign[],
  dateRange?: DateRange
): UseAggregatedMetricsReturn {
  const [metrics, setMetrics] = useState<UseAggregatedMetricsReturn['metrics']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaigns || campaigns.length === 0) {
      setMetrics(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await campaignService.getAggregatedMetrics(campaigns, dateRange);
        setMetrics(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch aggregated metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campaigns, dateRange]);

  return { metrics, loading, error };
}
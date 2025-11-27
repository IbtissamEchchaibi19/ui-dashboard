// application/hooks/useAds.ts
import { useState, useEffect, useCallback } from 'react';
import { AdUI } from '../dto/AdDTO';
import { AdService } from '../services/AdService';
import { AdFilters } from '@infrastructure/repositories/IAdRepository';
import { MockAdRepository } from '@infrastructure/repositories/MockAdRepository';

interface UseAdsResult {
  ads: AdUI[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateFilters: (filters: AdFilters) => void;
  pauseAd: (id: string) => Promise<void>;
  enableAd: (id: string) => Promise<void>;
  deleteAd: (id: string) => Promise<void>;
  bulkPause: (ids: string[]) => Promise<void>;
  bulkEnable: (ids: string[]) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
}

const adService = new AdService(new MockAdRepository());

export function useAds(initialFilters?: AdFilters): UseAdsResult {
  const [ads, setAds] = useState<AdUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdFilters | undefined>(initialFilters);

  const fetchAds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adService.getAds(filters);
      setAds(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ads');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const updateFilters = useCallback((newFilters: AdFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const pauseAd = useCallback(async (id: string) => {
    await adService.pauseAd(id);
    await fetchAds();
  }, [fetchAds]);

  const enableAd = useCallback(async (id: string) => {
    await adService.enableAd(id);
    await fetchAds();
  }, [fetchAds]);

  const deleteAd = useCallback(async (id: string) => {
    await adService.deleteAd(id);
    await fetchAds();
  }, [fetchAds]);

  const bulkPause = useCallback(async (ids: string[]) => {
    await adService.bulkPause(ids);
    await fetchAds();
  }, [fetchAds]);

  const bulkEnable = useCallback(async (ids: string[]) => {
    await adService.bulkEnable(ids);
    await fetchAds();
  }, [fetchAds]);

  const bulkDelete = useCallback(async (ids: string[]) => {
    await adService.bulkDelete(ids);
    await fetchAds();
  }, [fetchAds]);

  return {
    ads,
    loading,
    error,
    refetch: fetchAds,
    updateFilters,
    pauseAd,
    enableAd,
    deleteAd,
    bulkPause,
    bulkEnable,
    bulkDelete
  };
}
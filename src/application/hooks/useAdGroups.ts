// application/hooks/useAdGroups.ts
import { useState, useEffect, useCallback } from 'react';
import { AdGroupUI } from '../dto/AdGroupDTO';
import { AdGroupService } from '../services/AdGroupService';
import { AdGroupFilters } from '@infrastructure/repositories/IAdGroupRepository';
import { MockAdGroupRepository } from '@infrastructure/repositories/MockAdGroupRepository';

interface UseAdGroupsResult {
  adGroups: AdGroupUI[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateFilters: (filters: AdGroupFilters) => void;
  pauseAdGroup: (id: string) => Promise<void>;
  enableAdGroup: (id: string) => Promise<void>;
  deleteAdGroup: (id: string) => Promise<void>;
  bulkPause: (ids: string[]) => Promise<void>;
  bulkEnable: (ids: string[]) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
}

const adGroupService = new AdGroupService(new MockAdGroupRepository());

export function useAdGroups(initialFilters?: AdGroupFilters): UseAdGroupsResult {
  const [adGroups, setAdGroups] = useState<AdGroupUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdGroupFilters | undefined>(initialFilters);

  const fetchAdGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adGroupService.getAdGroups(filters);
      setAdGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ad groups');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAdGroups();
  }, [fetchAdGroups]);

  const updateFilters = useCallback((newFilters: AdGroupFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const pauseAdGroup = useCallback(async (id: string) => {
    await adGroupService.pauseAdGroup(id);
    await fetchAdGroups();
  }, [fetchAdGroups]);

  const enableAdGroup = useCallback(async (id: string) => {
    await adGroupService.enableAdGroup(id);
    await fetchAdGroups();
  }, [fetchAdGroups]);

  const deleteAdGroup = useCallback(async (id: string) => {
    await adGroupService.deleteAdGroup(id);
    await fetchAdGroups();
  }, [fetchAdGroups]);

  const bulkPause = useCallback(async (ids: string[]) => {
    await adGroupService.bulkPause(ids);
    await fetchAdGroups();
  }, [fetchAdGroups]);

  const bulkEnable = useCallback(async (ids: string[]) => {
    await adGroupService.bulkEnable(ids);
    await fetchAdGroups();
  }, [fetchAdGroups]);

  const bulkDelete = useCallback(async (ids: string[]) => {
    await adGroupService.bulkDelete(ids);
    await fetchAdGroups();
  }, [fetchAdGroups]);

  return {
    adGroups,
    loading,
    error,
    refetch: fetchAdGroups,
    updateFilters,
    pauseAdGroup,
    enableAdGroup,
    deleteAdGroup,
    bulkPause,
    bulkEnable,
    bulkDelete
  };
}
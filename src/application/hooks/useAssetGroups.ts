// application/hooks/useAssetGroups.ts
import { useState, useEffect, useCallback } from 'react';
import { AssetGroupUI } from '../dto/AssetGroupDTO';
import { AssetGroupService } from '../services/AssetGroupService';
import { AssetGroupFilters } from '@infrastructure/repositories/IAssetGroupRepository';
import { MockAssetGroupRepository } from '@infrastructure/repositories/MockAssetGroupRepository';

interface UseAssetGroupsResult {
  assetGroups: AssetGroupUI[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateFilters: (filters: AssetGroupFilters) => void;
  pauseAssetGroup: (id: string) => Promise<void>;
  enableAssetGroup: (id: string) => Promise<void>;
  deleteAssetGroup: (id: string) => Promise<void>;
  bulkPause: (ids: string[]) => Promise<void>;
  bulkEnable: (ids: string[]) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
}

const assetGroupService = new AssetGroupService(new MockAssetGroupRepository());

export function useAssetGroups(initialFilters?: AssetGroupFilters): UseAssetGroupsResult {
  const [assetGroups, setAssetGroups] = useState<AssetGroupUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AssetGroupFilters | undefined>(initialFilters);

  const fetchAssetGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await assetGroupService.getAssetGroups(filters);
      setAssetGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch asset groups');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAssetGroups();
  }, [fetchAssetGroups]);

  const updateFilters = useCallback((newFilters: AssetGroupFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const pauseAssetGroup = useCallback(async (id: string) => {
    await assetGroupService.pauseAssetGroup(id);
    await fetchAssetGroups();
  }, [fetchAssetGroups]);

  const enableAssetGroup = useCallback(async (id: string) => {
    await assetGroupService.enableAssetGroup(id);
    await fetchAssetGroups();
  }, [fetchAssetGroups]);

  const deleteAssetGroup = useCallback(async (id: string) => {
    await assetGroupService.deleteAssetGroup(id);
    await fetchAssetGroups();
  }, [fetchAssetGroups]);

  const bulkPause = useCallback(async (ids: string[]) => {
    await assetGroupService.bulkPause(ids);
    await fetchAssetGroups();
  }, [fetchAssetGroups]);

  const bulkEnable = useCallback(async (ids: string[]) => {
    await assetGroupService.bulkEnable(ids);
    await fetchAssetGroups();
  }, [fetchAssetGroups]);

  const bulkDelete = useCallback(async (ids: string[]) => {
    await assetGroupService.bulkDelete(ids);
    await fetchAssetGroups();
  }, [fetchAssetGroups]);

  return {
    assetGroups,
    loading,
    error,
    refetch: fetchAssetGroups,
    updateFilters,
    pauseAssetGroup,
    enableAssetGroup,
    deleteAssetGroup,
    bulkPause,
    bulkEnable,
    bulkDelete
  };
}
// application/hooks/useKeywords.ts

import { useState, useEffect, useCallback } from 'react';
import { Keyword } from '../../domain/entities/Keyword';
import { KeywordService } from '../services/KeywordService';
import { KeywordFilters, KeywordSortBy, SortDirection, KeywordUI } from '../dto/KeywordDTO';
import { MockKeywordRepository } from '../../infrastructure/repositories/MockKeywordRepository';

/**
 * Hook for fetching and managing keywords
 */
export function useKeywords(initialFilters?: KeywordFilters) {
  const [keywords, setKeywords] = useState<KeywordUI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<KeywordFilters>(initialFilters ?? {});
  const [sortBy, setSortBy] = useState<KeywordSortBy>(KeywordSortBy.IMPRESSIONS);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  // Initialize service
  const repository = new MockKeywordRepository();
  const service = new KeywordService(repository);

  /**
   * Fetch keywords from service
   */
  const fetchKeywords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get filtered keywords
      const domainKeywords = await service.getKeywords(filters);

      // Sort keywords
      const sortedKeywords = service.sortKeywords(domainKeywords, sortBy, sortDirection);

      // Convert to UI representation
      const uiKeywords = sortedKeywords.map(k => KeywordUI.fromDomain(k));

      setKeywords(uiKeywords);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortDirection]);

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters: Partial<KeywordFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Clear filters
   */
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  /**
   * Update sort
   */
  const updateSort = useCallback((field: KeywordSortBy, direction?: SortDirection) => {
    setSortBy(field);
    if (direction) {
      setSortDirection(direction);
    } else {
      // Toggle direction if same field
      setSortDirection(prev => 
        sortBy === field ? (prev === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC) : SortDirection.DESC
      );
    }
  }, [sortBy]);

  /**
   * Refetch keywords
   */
  const refetch = useCallback(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  return {
    keywords,
    loading,
    error,
    filters,
    sortBy,
    sortDirection,
    updateFilters,
    clearFilters,
    updateSort,
    refetch,
  };
}

/**
 * Hook for fetching a single keyword
 */
export function useKeyword(keywordId: string) {
  const [keyword, setKeyword] = useState<KeywordUI | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const repository = new MockKeywordRepository();
  const service = new KeywordService(repository);

  useEffect(() => {
    const fetchKeyword = async () => {
      try {
        setLoading(true);
        setError(null);

        const domainKeyword = await service.getKeywordById(keywordId);
        
        if (domainKeyword) {
          setKeyword(KeywordUI.fromDomain(domainKeyword));
        } else {
          setKeyword(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchKeyword();
  }, [keywordId]);

  return { keyword, loading, error };
}

/**
 * Hook for fetching aggregate keyword statistics
 */
export function useKeywordStats(keywordFilters?: KeywordFilters) {
  const [stats, setStats] = useState<{
    totalImpressions: number;
    totalClicks: number;
    avgCtr: number;
    avgCpc: number;
    totalCost: number;
    totalConversions: number;
    avgConversionRate: number;
    avgQualityScore: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const repository = new MockKeywordRepository();
  const service = new KeywordService(repository);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const keywords = await service.getKeywords(keywordFilters);
        const aggregateStats = await service.getAggregateStats(keywords);

        setStats(aggregateStats);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [keywordFilters]);

  return { stats, loading, error };
}

/**
 * Hook for getting keyword suggestions
 */
export function useKeywordSuggestions(campaignId: string) {
  const [suggestions, setSuggestions] = useState<{
    pause: KeywordUI[];
    increaseBid: KeywordUI[];
    decreaseBid: KeywordUI[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const repository = new MockKeywordRepository();
  const service = new KeywordService(repository);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const domainSuggestions = await service.getKeywordSuggestions(campaignId);

        setSuggestions({
          pause: domainSuggestions.pause.map(k => KeywordUI.fromDomain(k)),
          increaseBid: domainSuggestions.increaseBid.map(k => KeywordUI.fromDomain(k)),
          decreaseBid: domainSuggestions.decreaseBid.map(k => KeywordUI.fromDomain(k)),
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [campaignId]);

  return { suggestions, loading, error };
}
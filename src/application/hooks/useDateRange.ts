import { useState, useCallback } from 'react';
import { DateRange, DateRangeVO } from '@domain/value-objects';

export type DateRangePreset = 
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last14days'
  | 'last30days'
  | 'thisMonth'
  | 'lastMonth'
  | 'allTime'
  | 'custom';

export interface UseDateRangeReturn {
  dateRange: DateRange;
  preset: DateRangePreset;
  setPreset: (preset: DateRangePreset) => void;
  setCustomRange: (start: Date, end: Date) => void;
  formatDisplay: () => string;
}

export function useDateRange(initialPreset: DateRangePreset = 'last30days'): UseDateRangeReturn {
  const [preset, setPresetState] = useState<DateRangePreset>(initialPreset);
  const [dateRange, setDateRange] = useState<DateRange>(getDateRangeFromPreset(initialPreset));

  const setPreset = useCallback((newPreset: DateRangePreset) => {
    setPresetState(newPreset);
    setDateRange(getDateRangeFromPreset(newPreset));
  }, []);

  const setCustomRange = useCallback((start: Date, end: Date) => {
    setPresetState('custom');
    setDateRange({ startDate: start, endDate: end });
  }, []);

  const formatDisplay = useCallback((): string => {
    if (preset !== 'custom') {
      return getPresetLabel(preset);
    }
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
    
    return `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`;
  }, [preset, dateRange]);

  return {
    dateRange,
    preset,
    setPreset,
    setCustomRange,
    formatDisplay,
  };
}

function getDateRangeFromPreset(preset: DateRangePreset): DateRange {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case 'today':
      return { startDate: today, endDate: now };
    
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { startDate: yesterday, endDate: yesterday };
    }
    
    case 'last7days':
      return DateRangeVO.fromDays(7).toJSON();
    
    case 'last14days':
      return DateRangeVO.fromDays(14).toJSON();
    
    case 'last30days':
      return DateRangeVO.fromDays(30).toJSON();
    
    case 'thisMonth':
      return DateRangeVO.thisMonth().toJSON();
    
    case 'lastMonth': {
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate: firstDayLastMonth, endDate: lastDayLastMonth };
    }
    
    case 'allTime': {
      const allTimeStart = new Date(now.getFullYear() - 2, 0, 1);
      return { startDate: allTimeStart, endDate: now };
    }
    
    default:
      return DateRangeVO.last30Days().toJSON();
  }
}

function getPresetLabel(preset: DateRangePreset): string {
  const labels: Record<DateRangePreset, string> = {
    today: 'Today',
    yesterday: 'Yesterday',
    last7days: 'Last 7 days',
    last14days: 'Last 14 days',
    last30days: 'Last 30 days',
    thisMonth: 'This month',
    lastMonth: 'Last month',
    allTime: 'All time',
    custom: 'Custom',
  };
  
  return labels[preset];
}
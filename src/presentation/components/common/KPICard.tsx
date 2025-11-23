// src/presentation/components/common/KPICard.tsx
import React from 'react';
import { Card } from './Card';
import { SparklineComponent, Inject, SparklineTooltip } from '@syncfusion/ej2-react-charts';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changePercentage?: number;
  trend?: 'UP' | 'DOWN' | 'STABLE';
  format?: 'NUMBER' | 'CURRENCY' | 'PERCENTAGE' | 'DURATION';
  sparklineData?: number[];
  icon?: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changePercentage,
  trend = 'STABLE',
  format = 'NUMBER',
  sparklineData,
  icon,
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;

    switch (format) {
      case 'CURRENCY':
        return `$${val.toLocaleString()}`;
      case 'PERCENTAGE':
        return `${val.toFixed(2)}%`;
      case 'DURATION':
        const minutes = Math.floor(val / 60);
        const seconds = val % 60;
        return `${minutes}m ${seconds}s`;
      case 'NUMBER':
      default:
        return val.toLocaleString();
    }
  };

  const getTrendColor = () => {
    if (trend === 'UP') return 'text-green-600';
    if (trend === 'DOWN') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = () => {
    if (trend === 'UP') {
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    }
    if (trend === 'DOWN') {
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            {icon && <div className="mr-3 text-primary-500">{icon}</div>}
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {formatValue(value)}
          </p>
          {(change !== undefined || changePercentage !== undefined) && (
            <div className={`mt-2 flex items-center text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="ml-1">
                {changePercentage !== undefined
                  ? `${changePercentage > 0 ? '+' : ''}${changePercentage.toFixed(2)}%`
                  : change !== undefined
                  ? `${change > 0 ? '+' : ''}${change.toLocaleString()}`
                  : ''}
              </span>
              <span className="ml-2 text-gray-500">vs previous period</span>
            </div>
          )}
        </div>
        {sparklineData && sparklineData.length > 0 && (
          <div className="ml-4">
            <SparklineComponent
              id={`sparkline-${title}`}
              height="60px"
              width="120px"
              lineWidth={2}
              type="Line"
              valueType="Numeric"
              fill={trend === 'UP' ? '#10b981' : trend === 'DOWN' ? '#ef4444' : '#6b7280'}
              dataSource={sparklineData.map((val, idx) => ({ x: idx, y: val }))}
              xName="x"
              yName="y"
            >
              <Inject services={[SparklineTooltip]} />
            </SparklineComponent>
          </div>
        )}
      </div>
    </Card>
  );
};
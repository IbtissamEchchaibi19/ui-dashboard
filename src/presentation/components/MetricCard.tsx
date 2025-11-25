import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  color?: 'blue' | 'red' | 'orange' | 'green';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    green: 'bg-green-600'
  };

  const textColorClasses = {
    blue: 'text-blue-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
    green: 'text-green-600'
  };

  return (
    <div className={`${colorClasses[color]} text-white p-6 rounded-lg shadow-sm`}>
      <div className="text-sm font-medium opacity-90 mb-2">{title}</div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      {change !== undefined && (
        <div className="text-sm opacity-90">
          <span className="font-medium">{change > 0 ? '+' : ''}{change}%</span>
          {changeLabel && <span className="ml-1">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
};
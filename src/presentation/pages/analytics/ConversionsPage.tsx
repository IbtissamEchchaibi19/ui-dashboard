import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { KPICard } from '../../components/common/KPICard';
import { DataTable, TableColumn } from '../../components/common/DataTable';
import { Loading } from '../../components/common/Loading';
import { AnalyticsRepository } from '../../../infrastructure/repositories/AnalyticsRepository';
import { ConversionGoal, DateRange } from '../../../domain/entities/Analytics';
import { subDays } from 'date-fns';

export const ConversionsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<ConversionGoal[]>([]);

  const analyticsRepo = new AnalyticsRepository();

  useEffect(() => {
    loadConversionsData();
  }, []);

  const loadConversionsData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, 30);
      const dateRange: DateRange = { startDate, endDate };
      const data = await analyticsRepo.getConversionGoals(dateRange);
      setGoals(data);
    } catch (error) {
      console.error('Error loading conversions data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn[] = [
    { field: 'name', headerText: 'Goal Name', width: '250' },
    { field: 'type', headerText: 'Type', width: '150' },
    {
      field: 'completions',
      headerText: 'Completions',
      width: '130',
      textAlign: 'Right',
      template: (props: ConversionGoal) => props.completions.toLocaleString(),
    },
    {
      field: 'conversionRate',
      headerText: 'Conversion Rate',
      width: '150',
      textAlign: 'Right',
      template: (props: ConversionGoal) => `${props.conversionRate.toFixed(2)}%`,
    },
    {
      field: 'goalValue',
      headerText: 'Goal Value',
      width: '130',
      textAlign: 'Right',
      template: (props: ConversionGoal) => `$${props.goalValue.toLocaleString()}`,
    },
    {
      field: 'value',
      headerText: 'Avg. Value',
      width: '130',
      textAlign: 'Right',
      template: (props: ConversionGoal) => `$${props.value.toFixed(2)}`,
    },
  ];

  if (loading) {
    return <Loading size="lg" text="Loading conversions data..." fullScreen />;
  }

  const totalCompletions = goals.reduce((sum, g) => sum + g.completions, 0);
  const totalValue = goals.reduce((sum, g) => sum + g.goalValue, 0);
  const avgConversionRate = goals.reduce((sum, g) => sum + g.conversionRate, 0) / goals.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Conversions</h1>
        <p className="mt-1 text-sm text-gray-500">Track goal completions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Total Completions" value={totalCompletions} format="NUMBER" />
        <KPICard title="Total Value" value={totalValue} format="CURRENCY" />
        <KPICard title="Avg. Conversion Rate" value={avgConversionRate} format="PERCENTAGE" />
      </div>

      <Card>
        <DataTable data={goals} columns={columns} pageSize={10} allowSorting={true} showToolbar={true} />
      </Card>
    </div>
  );
};


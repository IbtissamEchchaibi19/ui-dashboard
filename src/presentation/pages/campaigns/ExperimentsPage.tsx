import React, { useEffect, useState } from 'react';
import { DataTable, TableColumn } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Loading } from '../../components/common/Loading';
import { Card } from '../../components/common/Card';
import { CampaignRepository } from '../../../infrastructure/repositories/CampaignRepository';
import { Experiment } from '../../../domain/entities/Campaign';
import { format } from 'date-fns';

export const ExperimentsPage: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  const campaignRepo = new CampaignRepository();

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    setLoading(true);
    try {
      const data = await campaignRepo.getExperiments();
      setExperiments(data);
    } catch (error) {
      console.error('Error loading experiments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
      RUNNING: 'success',
      DRAFT: 'default',
      COMPLETED: 'info',
      PAUSED: 'warning',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const columns: TableColumn[] = [
    {
      field: 'name',
      headerText: 'Experiment Name',
      width: '250',
    },
    {
      field: 'status',
      headerText: 'Status',
      width: '120',
      template: (props: Experiment) => getStatusBadge(props.status),
    },
    {
      field: 'startDate',
      headerText: 'Start Date',
      width: '130',
      template: (props: Experiment) => format(props.startDate, 'MMM dd, yyyy'),
    },
    {
      field: 'trafficSplit',
      headerText: 'Traffic Split',
      width: '120',
      textAlign: 'Center',
      template: (props: Experiment) => `${props.trafficSplit}%`,
    },
    {
      field: 'control.metrics.conversions',
      headerText: 'Control Conv.',
      width: '130',
      textAlign: 'Right',
      template: (props: Experiment) => props.control.metrics.conversions.toLocaleString(),
    },
    {
      field: 'treatment.metrics.conversions',
      headerText: 'Treatment Conv.',
      width: '140',
      textAlign: 'Right',
      template: (props: Experiment) => props.treatment.metrics.conversions.toLocaleString(),
    },
    {
      field: 'results',
      headerText: 'Result',
      width: '150',
      template: (props: Experiment) => {
        if (!props.results) return '-';
        const diff = props.treatment.metrics.conversions - props.control.metrics.conversions;
        const improvement = ((diff / props.control.metrics.conversions) * 100).toFixed(1);
        return (
          <span className={diff > 0 ? 'text-green-600' : 'text-red-600'}>
            {diff > 0 ? '+' : ''}{improvement}%
          </span>
        );
      },
    },
  ];

  if (loading) {
    return <Loading size="lg" text="Loading experiments..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Experiments</h1>
          <p className="mt-1 text-sm text-gray-500">A/B test your campaigns</p>
        </div>
        <Button variant="primary">New Experiment</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: experiments.length },
          { label: 'Running', value: experiments.filter(e => e.status === 'RUNNING').length },
          { label: 'Completed', value: experiments.filter(e => e.status === 'COMPLETED').length },
          { label: 'Draft', value: experiments.filter(e => e.status === 'DRAFT').length },
        ].map((stat, idx) => (
          <Card key={idx}>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <DataTable
          data={experiments}
          columns={columns}
          pageSize={10}
          allowSorting={true}
          showToolbar={true}
        />
      </Card>
    </div>
  );
};

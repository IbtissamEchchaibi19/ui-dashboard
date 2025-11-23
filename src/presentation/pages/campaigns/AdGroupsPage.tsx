// src/presentation/pages/campaigns/AdGroupsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataTable, TableColumn } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Loading } from '../../components/common/Loading';
import { Card } from '../../components/common/Card';
import { CampaignRepository } from '../../../infrastructure/repositories/CampaignRepository';
import { AdGroup, CampaignStatus } from '../../../domain/entities/Campaign';

export const AdGroupsPage: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [adGroups, setAdGroups] = useState<AdGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignName, setCampaignName] = useState('');

  const campaignRepo = new CampaignRepository();

  useEffect(() => {
    loadAdGroups();
  }, [campaignId]);

  const loadAdGroups = async () => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const campaign = await campaignRepo.getCampaignById(campaignId);
      if (campaign) {
        setCampaignName(campaign.name);
        const adGroupData = await campaignRepo.getAdGroups(campaignId);
        setAdGroups(adGroupData);
      }
    } catch (error) {
      console.error('Error loading ad groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: CampaignStatus) => {
    const variants: Record<CampaignStatus, 'success' | 'warning' | 'danger' | 'default'> = {
      [CampaignStatus.ENABLED]: 'success',
      [CampaignStatus.PAUSED]: 'warning',
      [CampaignStatus.REMOVED]: 'danger',
      [CampaignStatus.PENDING]: 'default',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const columns: TableColumn[] = [
    {
      field: 'name',
      headerText: 'Ad Group Name',
      width: '200',
    },
    {
      field: 'status',
      headerText: 'Status',
      width: '120',
      template: (props: AdGroup) => getStatusBadge(props.status),
    },
    {
      field: 'defaultMaxCpc',
      headerText: 'Default Max CPC',
      width: '150',
      textAlign: 'Right',
      template: (props: AdGroup) => `$${props.defaultMaxCpc.toFixed(2)}`,
    },
    {
      field: 'ads',
      headerText: 'Ads',
      width: '100',
      textAlign: 'Center',
      template: (props: AdGroup) => props.ads.length,
    },
    {
      field: 'keywords',
      headerText: 'Keywords',
      width: '100',
      textAlign: 'Center',
      template: (props: AdGroup) => props.keywords.length,
    },
    {
      field: 'metrics.impressions',
      headerText: 'Impressions',
      width: '120',
      textAlign: 'Right',
      template: (props: AdGroup) => props.metrics.impressions.toLocaleString(),
    },
    {
      field: 'metrics.clicks',
      headerText: 'Clicks',
      width: '100',
      textAlign: 'Right',
      template: (props: AdGroup) => props.metrics.clicks.toLocaleString(),
    },
    {
      field: 'metrics.ctr',
      headerText: 'CTR',
      width: '100',
      textAlign: 'Right',
      template: (props: AdGroup) => `${props.metrics.ctr.toFixed(2)}%`,
    },
    {
      field: 'metrics.cost',
      headerText: 'Cost',
      width: '120',
      textAlign: 'Right',
      template: (props: AdGroup) => `$${props.metrics.cost.toLocaleString()}`,
    },
  ];

  if (loading) {
    return <Loading size="lg" text="Loading ad groups..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ad Groups</h1>
          <p className="mt-1 text-sm text-gray-500">Campaign: {campaignName}</p>
        </div>
        <Button variant="primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="ml-2">New Ad Group</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-600">Total Ad Groups</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{adGroups.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">Total Ads</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {adGroups.reduce((sum, ag) => sum + ag.ads.length, 0)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">Total Keywords</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {adGroups.reduce((sum, ag) => sum + ag.keywords.length, 0)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">Total Clicks</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {adGroups.reduce((sum, ag) => sum + ag.metrics.clicks, 0).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Ad Groups Table */}
      <Card>
        <DataTable
          data={adGroups}
          columns={columns}
          pageSize={10}
          allowSorting={true}
          showToolbar={true}
        />
      </Card>
    </div>
  );
};

// src/presentation/pages/campaigns/ExperimentsPage.tsx
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

// src/presentation/pages/campaigns/ChangeHistoryPage.tsx
import React, { useEffect, useState } from 'react';
import { DataTable, TableColumn } from '../../components/common/DataTable';
import { Loading } from '../../components/common/Loading';
import { Card } from '../../components/common/Card';
import { CampaignRepository } from '../../../infrastructure/repositories/CampaignRepository';
import { ChangeHistoryEntry } from '../../../domain/entities/Campaign';
import { format } from 'date-fns';

export const ChangeHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<ChangeHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const campaignRepo = new CampaignRepository();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await campaignRepo.getChangeHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error loading change history:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn[] = [
    {
      field: 'timestamp',
      headerText: 'Date & Time',
      width: '180',
      template: (props: ChangeHistoryEntry) => format(props.timestamp, 'MMM dd, yyyy HH:mm'),
    },
    {
      field: 'entityType',
      headerText: 'Entity Type',
      width: '130',
    },
    {
      field: 'entityName',
      headerText: 'Entity Name',
      width: '200',
    },
    {
      field: 'changeType',
      headerText: 'Change Type',
      width: '150',
    },
    {
      field: 'field',
      headerText: 'Field',
      width: '120',
    },
    {
      field: 'oldValue',
      headerText: 'Old Value',
      width: '150',
    },
    {
      field: 'newValue',
      headerText: 'New Value',
      width: '150',
    },
    {
      field: 'changedBy',
      headerText: 'Changed By',
      width: '200',
    },
  ];

  if (loading) {
    return <Loading size="lg" text="Loading change history..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Change History</h1>
        <p className="mt-1 text-sm text-gray-500">Track all changes to your campaigns</p>
      </div>

      <Card>
        <DataTable
          data={history}
          columns={columns}
          pageSize={20}
          allowSorting={true}
          allowFiltering={true}
          showToolbar={true}
          height="600px"
        />
      </Card>
    </div>
  );
};
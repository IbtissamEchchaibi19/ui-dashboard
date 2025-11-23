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


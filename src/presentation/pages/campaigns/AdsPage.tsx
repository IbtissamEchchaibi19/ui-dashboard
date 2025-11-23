// src/presentation/pages/campaigns/AdsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataTable, TableColumn } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Loading } from '../../components/common/Loading';
import { Card } from '../../components/common/Card';
import { CampaignRepository } from '../../../infrastructure/repositories/CampaignRepository';
import { Ad, CampaignStatus } from '../../../domain/entities/Campaign';

export const AdsPage: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  const campaignRepo = new CampaignRepository();

  useEffect(() => {
    loadAds();
  }, [campaignId]);

  const loadAds = async () => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const adGroups = await campaignRepo.getAdGroups(campaignId);
      const allAds: Ad[] = [];
      for (const ag of adGroups) {
        const adGroupAds = await campaignRepo.getAds(ag.id);
        allAds.push(...adGroupAds);
      }
      setAds(allAds);
    } catch (error) {
      console.error('Error loading ads:', error);
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
      field: 'type',
      headerText: 'Type',
      width: '150',
    },
    {
      field: 'status',
      headerText: 'Status',
      width: '120',
      template: (props: Ad) => getStatusBadge(props.status),
    },
    {
      field: 'headlines',
      headerText: 'Headlines',
      width: '300',
      template: (props: Ad) => (
        <div className="space-y-1">
          {props.headlines.slice(0, 2).map((h, idx) => (
            <p key={idx} className="text-sm text-gray-700">{h}</p>
          ))}
        </div>
      ),
    },
    {
      field: 'descriptions',
      headerText: 'Descriptions',
      width: '300',
      template: (props: Ad) => (
        <div className="space-y-1">
          {props.descriptions.map((d, idx) => (
            <p key={idx} className="text-sm text-gray-600">{d}</p>
          ))}
        </div>
      ),
    },
    {
      field: 'metrics.impressions',
      headerText: 'Impressions',
      width: '120',
      textAlign: 'Right',
      template: (props: Ad) => props.metrics.impressions.toLocaleString(),
    },
    {
      field: 'metrics.clicks',
      headerText: 'Clicks',
      width: '100',
      textAlign: 'Right',
      template: (props: Ad) => props.metrics.clicks.toLocaleString(),
    },
    {
      field: 'metrics.ctr',
      headerText: 'CTR',
      width: '100',
      textAlign: 'Right',
      template: (props: Ad) => `${props.metrics.ctr.toFixed(2)}%`,
    },
  ];

  if (loading) {
    return <Loading size="lg" text="Loading ads..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ads</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your ad creatives</p>
        </div>
        <Button variant="primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="ml-2">New Ad</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Ads', value: ads.length },
          { label: 'Active', value: ads.filter(a => a.status === CampaignStatus.ENABLED).length },
          { label: 'Total Impressions', value: ads.reduce((sum, a) => sum + a.metrics.impressions, 0).toLocaleString() },
          { label: 'Total Clicks', value: ads.reduce((sum, a) => sum + a.metrics.clicks, 0).toLocaleString() },
        ].map((stat, idx) => (
          <Card key={idx}>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <DataTable
          data={ads}
          columns={columns}
          pageSize={10}
          allowSorting={true}
          showToolbar={true}
        />
      </Card>
    </div>
  );
};
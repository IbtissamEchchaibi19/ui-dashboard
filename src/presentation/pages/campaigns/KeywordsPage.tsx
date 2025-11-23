// src/presentation/pages/campaigns/KeywordsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataTable, TableColumn } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Loading } from '../../components/common/Loading';
import { Card } from '../../components/common/Card';
import { CampaignRepository } from '../../../infrastructure/repositories/CampaignRepository';
import { Keyword, CampaignStatus } from '../../../domain/entities/Campaign';

export const KeywordsPage: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);

  const campaignRepo = new CampaignRepository();

  useEffect(() => {
    loadKeywords();
  }, [campaignId]);

  const loadKeywords = async () => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const adGroups = await campaignRepo.getAdGroups(campaignId);
      const allKeywords: Keyword[] = [];
      for (const ag of adGroups) {
        const agKeywords = await campaignRepo.getKeywords(ag.id);
        allKeywords.push(...agKeywords);
      }
      setKeywords(allKeywords);
    } catch (error) {
      console.error('Error loading keywords:', error);
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

  const getMatchTypeBadge = (matchType: string) => {
    const colors: Record<string, string> = {
      EXACT: 'bg-purple-100 text-purple-800',
      PHRASE: 'bg-blue-100 text-blue-800',
      BROAD: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[matchType]}`}>
        {matchType}
      </span>
    );
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const columns: TableColumn[] = [
    {
      field: 'text',
      headerText: 'Keyword',
      width: '250',
    },
    {
      field: 'matchType',
      headerText: 'Match Type',
      width: '120',
      template: (props: Keyword) => getMatchTypeBadge(props.matchType),
    },
    {
      field: 'status',
      headerText: 'Status',
      width: '120',
      template: (props: Keyword) => getStatusBadge(props.status),
    },
    {
      field: 'qualityScore',
      headerText: 'Quality Score',
      width: '130',
      textAlign: 'Center',
      template: (props: Keyword) => (
        <span className={`font-semibold ${getQualityScoreColor(props.qualityScore)}`}>
          {props.qualityScore}/10
        </span>
      ),
    },
    {
      field: 'maxCpc',
      headerText: 'Max CPC',
      width: '120',
      textAlign: 'Right',
      template: (props: Keyword) => props.maxCpc ? `$${props.maxCpc.toFixed(2)}` : '-',
    },
    {
      field: 'metrics.impressions',
      headerText: 'Impressions',
      width: '120',
      textAlign: 'Right',
      template: (props: Keyword) => props.metrics.impressions.toLocaleString(),
    },
    {
      field: 'metrics.clicks',
      headerText: 'Clicks',
      width: '100',
      textAlign: 'Right',
      template: (props: Keyword) => props.metrics.clicks.toLocaleString(),
    },
    {
      field: 'metrics.ctr',
      headerText: 'CTR',
      width: '100',
      textAlign: 'Right',
      template: (props: Keyword) => `${props.metrics.ctr.toFixed(2)}%`,
    },
    {
      field: 'metrics.cost',
      headerText: 'Cost',
      width: '120',
      textAlign: 'Right',
      template: (props: Keyword) => `$${props.metrics.cost.toLocaleString()}`,
    },
    {
      field: 'metrics.conversions',
      headerText: 'Conversions',
      width: '120',
      textAlign: 'Right',
      template: (props: Keyword) => props.metrics.conversions.toLocaleString(),
    },
  ];

  if (loading) {
    return <Loading size="lg" text="Loading keywords..." fullScreen />;
  }

  const avgQualityScore = keywords.reduce((sum, k) => sum + k.qualityScore, 0) / keywords.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Keywords</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your keyword targeting</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">Add Negative Keywords</Button>
          <Button variant="primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="ml-2">Add Keywords</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Keywords', value: keywords.length },
          { label: 'Active', value: keywords.filter(k => k.status === CampaignStatus.ENABLED).length },
          { label: 'Avg. Quality Score', value: avgQualityScore.toFixed(1) },
          { label: 'Total Clicks', value: keywords.reduce((sum, k) => sum + k.metrics.clicks, 0).toLocaleString() },
          { label: 'Total Cost', value: `$${keywords.reduce((sum, k) => sum + k.metrics.cost, 0).toLocaleString()}` },
        ].map((stat, idx) => (
          <Card key={idx}>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Keyword Performance</h3>
          <p className="text-sm text-gray-500">Monitor and optimize your keywords</p>
        </div>
        <DataTable
          data={keywords}
          columns={columns}
          pageSize={20}
          allowSorting={true}
          allowFiltering={true}
          showToolbar={true}
          height="600px"
        />
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyword Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700 font-medium">High Performers</p>
            <p className="mt-1 text-2xl font-bold text-green-900">
              {keywords.filter(k => k.qualityScore >= 8).length}
            </p>
            <p className="text-xs text-green-600 mt-1">Quality Score ≥ 8</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-700 font-medium">Needs Improvement</p>
            <p className="mt-1 text-2xl font-bold text-yellow-900">
              {keywords.filter(k => k.qualityScore >= 5 && k.qualityScore < 8).length}
            </p>
            <p className="text-xs text-yellow-600 mt-1">Quality Score 5-7</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700 font-medium">Low Performers</p>
            <p className="mt-1 text-2xl font-bold text-red-900">
              {keywords.filter(k => k.qualityScore < 5).length}
            </p>
            <p className="text-xs text-red-600 mt-1">Quality Score 5</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
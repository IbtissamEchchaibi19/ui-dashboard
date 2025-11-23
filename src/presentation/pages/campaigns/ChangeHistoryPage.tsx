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
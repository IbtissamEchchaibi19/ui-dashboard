// src/presentation/pages/campaigns/CampaignsPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, TableColumn } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Loading } from '../../components/common/Loading';
import { Modal } from '../../components/modals/Modal';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import { CampaignRepository } from '../../../infrastructure/repositories/CampaignRepository';
import { Campaign, CampaignStatus } from '../../../domain/entities/Campaign';

export const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const campaignRepo = new CampaignRepository();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await campaignRepo.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (campaignId: string, newStatus: CampaignStatus) => {
    try {
      await campaignRepo.updateCampaign(campaignId, { status: newStatus });
      await loadCampaigns();
    } catch (error) {
      console.error('Error updating campaign status:', error);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;
    try {
      await campaignRepo.deleteCampaign(campaignToDelete);
      await loadCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
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
      headerText: 'Campaign Name',
      width: '200',
      template: (props: Campaign) => (
        <button
          onClick={() => navigate(`/campaigns/${props.id}/ad-groups`)}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          {props.name}
        </button>
      ),
    },
    {
      field: 'status',
      headerText: 'Status',
      width: '120',
      template: (props: Campaign) => getStatusBadge(props.status),
    },
    {
      field: 'type',
      headerText: 'Type',
      width: '150',
    },
    {
      field: 'budget.amount',
      headerText: 'Budget',
      width: '120',
      textAlign: 'Right',
      template: (props: Campaign) => `$${props.budget.amount.toLocaleString()}`,
    },
    {
      field: 'metrics.impressions',
      headerText: 'Impressions',
      width: '120',
      textAlign: 'Right',
      template: (props: Campaign) => props.metrics.impressions.toLocaleString(),
    },
    {
      field: 'metrics.clicks',
      headerText: 'Clicks',
      width: '100',
      textAlign: 'Right',
      template: (props: Campaign) => props.metrics.clicks.toLocaleString(),
    },
    {
      field: 'metrics.ctr',
      headerText: 'CTR',
      width: '100',
      textAlign: 'Right',
      template: (props: Campaign) => `${props.metrics.ctr.toFixed(2)}%`,
    },
    {
      field: 'metrics.cost',
      headerText: 'Cost',
      width: '120',
      textAlign: 'Right',
      template: (props: Campaign) => `$${props.metrics.cost.toLocaleString()}`,
    },
    {
      field: 'metrics.conversions',
      headerText: 'Conversions',
      width: '120',
      textAlign: 'Right',
      template: (props: Campaign) => props.metrics.conversions.toLocaleString(),
    },
    {
      field: 'actions',
      headerText: 'Actions',
      width: '150',
      template: (props: Campaign) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedCampaign(props);
              setShowEditModal(true);
            }}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setCampaignToDelete(props.id);
              setShowDeleteDialog(true);
            }}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <Loading size="lg" text="Loading campaigns..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your advertising campaigns
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className="ml-2">Filters</span>
          </Button>
          <Button variant="primary">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="ml-2">New Campaign</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Campaigns',
            value: campaigns.length,
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            ),
          },
          {
            label: 'Active',
            value: campaigns.filter((c) => c.status === CampaignStatus.ENABLED).length,
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ),
          },
          {
            label: 'Paused',
            value: campaigns.filter((c) => c.status === CampaignStatus.PAUSED).length,
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ),
          },
          {
            label: 'Total Budget',
            value: `$${campaigns
              .reduce((sum, c) => sum + c.budget.amount, 0)
              .toLocaleString()}`,
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ),
          },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className="text-primary-500">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <DataTable
          data={campaigns}
          columns={columns}
          pageSize={10}
          allowPaging={true}
          allowSorting={true}
          allowFiltering={true}
          showToolbar={true}
        />
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedCampaign && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Campaign"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                defaultValue={selectedCampaign.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                defaultValue={selectedCampaign.status}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) =>
                  handleStatusChange(
                    selectedCampaign.id,
                    e.target.value as CampaignStatus
                  )
                }
              >
                <option value={CampaignStatus.ENABLED}>Enabled</option>
                <option value={CampaignStatus.PAUSED}>Paused</option>
                <option value={CampaignStatus.PENDING}>Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Budget
              </label>
              <input
                type="number"
                defaultValue={selectedCampaign.budget.amount}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowEditModal(false)}>
              Save Changes
            </Button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteCampaign}
        title="Delete Campaign"
        message="Are you sure you want to delete this campaign? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};
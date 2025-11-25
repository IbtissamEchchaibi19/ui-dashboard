import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { PageHeader } from '../components/PageHeader';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Sort, Filter, Toolbar, Selection, Inject } from '@syncfusion/ej2-react-grids';
import { ChipListComponent } from '@syncfusion/ej2-react-buttons';
import { useCampaigns, useDateRange } from '@application/hooks';
import { formatMoney, formatPercentage, formatNumber } from '../utils/formatters';
import { Campaign } from '@domain/entities';

export const CampaignsPage: React.FC = () => {
  const { dateRange, setCustomRange } = useDateRange('last30days');
  const { campaigns, loading, filters, updateFilters } = useCampaigns();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const statusTemplate = (props: Campaign) => {
    const statusColors: Record<string, string> = {
      ENABLED: 'bg-green-100 text-green-800',
      PAUSED: 'bg-yellow-100 text-yellow-800',
      REMOVED: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[props.status] || 'bg-gray-100 text-gray-800'}`}>
        {props.status}
      </span>
    );
  };

  const budgetTemplate = (props: Campaign) => {
    return (
      <div>
        <div className="font-medium">{formatMoney(props.budget)}</div>
        <div className="text-xs text-gray-500">{props.budgetType}</div>
      </div>
    );
  };

  const typeTemplate = (props: Campaign) => {
    const typeIcons: Record<string, string> = {
      SEARCH: 'e-search',
      DISPLAY: 'e-image',
      VIDEO: 'e-video',
      SHOPPING: 'e-shopping-cart',
    };

    return (
      <div className="flex items-center space-x-2">
        <i className={`e-icons ${typeIcons[props.type] || 'e-folder'} text-blue-600`}></i>
        <span>{props.type}</span>
      </div>
    );
  };

  const actionTemplate = (props: Campaign) => {
    return (
      <div className="flex items-center space-x-2">
        <button
          className="p-2 hover:bg-gray-100 rounded"
          onClick={() => setSelectedCampaign(props)}
        >
          <i className="e-icons e-edit text-gray-600"></i>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <i className="e-icons e-more-vertical text-gray-600"></i>
        </button>
      </div>
    );
  };

  const activeFilters = [
    { text: 'Campaign status: All', value: 'status' },
    { text: 'Ad group status: All', value: 'adgroup' },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Campaigns"
          dateRange={{ start: dateRange.startDate, end: dateRange.endDate }}
          onDateRangeChange={setCustomRange}
          actionButton={{
            text: 'New campaign',
            icon: 'e-icons e-plus',
            onClick: () => console.log('Create campaign'),
          }}
        />

        <div className="p-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Filters</span>
                <ChipListComponent
                  chips={activeFilters}
                  cssClass="e-outline"
                />
                <button className="text-sm text-blue-600 hover:underline">
                  + Add filter
                </button>
              </div>
              <button className="text-sm text-gray-600 hover:text-gray-800">
                Clear all
              </button>
            </div>
          </div>

          {/* Campaigns Table */}
          <div className="bg-white rounded-lg shadow-sm">
            <GridComponent
              dataSource={campaigns}
              allowPaging={true}
              allowSorting={true}
              allowFiltering={true}
              pageSettings={{ pageSize: 20, pageCount: 5 }}
              filterSettings={{ type: 'Excel' }}
              toolbar={['Search']}
              height={600}
            >
              <ColumnsDirective>
                <ColumnDirective
                  type="checkbox"
                  width="50"
                />
                <ColumnDirective
                  field="name"
                  headerText="Campaign"
                  width="250"
                  clipMode="EllipsisWithTooltip"
                />
                <ColumnDirective
                  field="status"
                  headerText="Status"
                  width="120"
                  template={statusTemplate}
                />
                <ColumnDirective
                  field="type"
                  headerText="Type"
                  width="150"
                  template={typeTemplate}
                />
                <ColumnDirective
                  field="budget"
                  headerText="Budget"
                  width="150"
                  template={budgetTemplate}
                />
                <ColumnDirective
                  field="biddingStrategy"
                  headerText="Bidding Strategy"
                  width="200"
                />
                <ColumnDirective
                  headerText="Actions"
                  width="100"
                  template={actionTemplate}
                  allowSorting={false}
                  allowFiltering={false}
                />
              </ColumnsDirective>
              <Inject services={[Page, Sort, Filter, Toolbar, Selection]} />
            </GridComponent>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-1">Total Campaigns</div>
              <div className="text-2xl font-bold text-gray-900">{campaigns.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-1">Active Campaigns</div>
              <div className="text-2xl font-bold text-green-600">
                {campaigns.filter(c => c.status === 'ENABLED').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-1">Paused Campaigns</div>
              <div className="text-2xl font-bold text-yellow-600">
                {campaigns.filter(c => c.status === 'PAUSED').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-1">Total Budget</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatMoney({
                  amount: campaigns.reduce((sum, c) => sum + c.budget.amount, 0),
                  currency: 'USD',
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { PageHeader } from '../components/PageHeader';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, ColumnSeries, Category, Legend, Tooltip, DataLabel } from '@syncfusion/ej2-react-charts';
import { ListViewComponent } from '@syncfusion/ej2-react-lists';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useAudiences, useAudiencePerformance, useDateRange } from '@application/hooks';
import { formatNumber, formatPercentage } from '../utils/formatters';
import { Audience } from '@domain/entities';

export const AudiencesPage: React.FC = () => {
  const { dateRange, setCustomRange } = useDateRange('last30days');
  const { audiences, loading } = useAudiences();
  const [selectedAudience, setSelectedAudience] = useState<string | null>(
    audiences.length > 0 ? audiences[0].id : null
  );
  const { data: performanceData } = useAudiencePerformance(selectedAudience);

  const getAudienceIcon = (type: string): string => {
    const icons: Record<string, string> = {
      AFFINITY: 'e-heart',
      IN_MARKET: 'e-shopping-cart',
      CUSTOM: 'e-people',
      REMARKETING: 'e-refresh',
      SIMILAR: 'e-copy',
      DEMOGRAPHIC: 'e-user',
    };
    return icons[type] || 'e-people';
  };

  const audienceTemplate = (audience: Audience) => {
    return (
      <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 cursor-pointer">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <i className={`e-icons ${getAudienceIcon(audience.type)} text-blue-600`}></i>
          </div>
          <div>
            <div className="font-medium text-gray-900">{audience.name}</div>
            <div className="text-sm text-gray-500">
              {audience.type} • {formatNumber(audience.size)} users
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            audience.status === 'ACTIVE' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {audience.status}
          </span>
          <ButtonComponent iconCss="e-icons e-more-vertical" cssClass="e-flat" />
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Audiences"
          dateRange={{ start: dateRange.startDate, end: dateRange.endDate }}
          onDateRangeChange={setCustomRange}
          filterLabel="View (2 filters)"
          filterValue="All campaigns"
        />

        <div className="p-6">
          {/* Information Banners */}
          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="e-icons e-info text-white text-xs"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-1">
                    Universal Analytics audiences are moving to Google Analytics 4
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Universal Analytics (UA) properties will stop processing data starting on July 1, 2023. Going forward, UA audiences will no longer add new users and audience sizes will decrease over time. After this date, you'll continue using Google Analytics 4 audiences which will be automatically configured for you. They will be used in your current campaigns and ad groups, in place of your UA audiences.
                  </p>
                  <button className="text-sm text-blue-600 hover:underline mt-2 font-medium">
                    Learn more about the change
                  </button>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <i className="e-icons e-close"></i>
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="e-icons e-info text-white text-xs"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-1">
                    Similar segments are removed
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Similar segments are being fully removed from Google Ads starting August 1, 2023. If your Display, Video & Discovery ad groups are opted into optimized targeting and audience expansion, there's no action required. If your ad groups used similar segments, some of them might be paused in your account. Please unpause them to continue reaching the right customers.
                  </p>
                  <button className="text-sm text-blue-600 hover:underline mt-2 font-medium">
                    Learn more about the change
                  </button>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <i className="e-icons e-close"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Audience Performance Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Audience performance</h3>
              <div className="flex items-center space-x-2">
                <DropDownListComponent
                  dataSource={[
                    { text: 'Clicks', value: 'clicks' },
                    { text: 'Impressions', value: 'impressions' },
                    { text: 'Conversions', value: 'conversions' },
                  ]}
                  fields={{ text: 'text', value: 'value' }}
                  value="clicks"
                  cssClass="w-40"
                />
                <ButtonComponent iconCss="e-icons e-chart-bar">Chart type</ButtonComponent>
                <ButtonComponent iconCss="e-icons e-expand">Expand</ButtonComponent>
              </div>
            </div>

            {performanceData.length > 0 ? (
              <ChartComponent
                id="audience-chart"
                height="400"
                primaryXAxis={{ valueType: 'Category', labelRotation: -45 }}
                primaryYAxis={{ labelFormat: '{value}' }}
                tooltip={{ enable: true }}
              >
                <Inject services={[ColumnSeries, Category, Legend, Tooltip, DataLabel]} />
                <SeriesCollectionDirective>
                  <SeriesDirective
                    dataSource={performanceData}
                    xName="segment"
                    yName="clicks"
                    name="Clicks"
                    type="Column"
                    fill="#1E88E5"
                  />
                </SeriesCollectionDirective>
              </ChartComponent>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <i className="e-icons e-chart text-4xl mb-2 text-gray-300"></i>
                  <p>No performance data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Audiences List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Your Audiences</h3>
              <div className="flex items-center space-x-2">
                <ButtonComponent iconCss="e-icons e-plus" cssClass="e-primary">
                  Add audience
                </ButtonComponent>
                <ButtonComponent iconCss="e-icons e-search">Search</ButtonComponent>
                <ButtonComponent iconCss="e-icons e-filter">Filter</ButtonComponent>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading audiences...</p>
                </div>
              </div>
            ) : audiences.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {audiences.map((audience) => (
                  <div
                    key={audience.id}
                    onClick={() => setSelectedAudience(audience.id)}
                    className={`${
                      selectedAudience === audience.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    {audienceTemplate(audience)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <i className="e-icons e-people text-4xl mb-2 text-gray-300"></i>
                  <p className="font-medium mb-1">No audiences yet</p>
                  <p className="text-sm">Create your first audience to get started</p>
                  <ButtonComponent
                    cssClass="e-primary mt-4"
                    iconCss="e-icons e-plus"
                  >
                    Add audience
                  </ButtonComponent>
                </div>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-1">Total Audiences</div>
              <div className="text-2xl font-bold text-gray-900">{audiences.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-1">Active Audiences</div>
              <div className="text-2xl font-bold text-green-600">
                {audiences.filter(a => a.status === 'ACTIVE').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-1">Total Reach</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(audiences.reduce((sum, a) => sum + a.size, 0))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-1">Average Size</div>
              <div className="text-2xl font-bold text-gray-900">
                {audiences.length > 0
                  ? formatNumber(audiences.reduce((sum, a) => sum + a.size, 0) / audiences.length)
                  : '0'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
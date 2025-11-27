// import React, { useState } from 'react';
// import { MainLayout } from '../layouts/MainLayout';
// import { PageHeader } from '../components/PageHeader';
// import { GridComponent, ColumnsDirective, ColumnDirective, Page, Sort, Filter, Toolbar, Selection, Inject } from '@syncfusion/ej2-react-grids';
// import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject as ChartInject, LineSeries, Legend, DateTime, Tooltip } from '@syncfusion/ej2-react-charts';
// import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
// import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
// import { useKeywordsWithMetrics, useDateRange } from '@application/hooks';
// import { formatMoney, formatPercentage, formatNumber } from '../utils/formatters';
// import { Keyword, KeywordMetrics } from '@domain/entities';

// export const KeywordsPage: React.FC = () => {
//   const { dateRange, setCustomRange } = useDateRange('last30days');
//   const { keywordsWithMetrics, loading } = useKeywordsWithMetrics();
//   const [selectedMetric, setSelectedMetric] = useState<string>('clicks');

//   // Mock time series data
//   const timeSeriesData = Array.from({ length: 180 }, (_, i) => {
//     const date = new Date(2020, 6, 1);
//     date.setDate(date.getDate() + i);
//     return {
//       date,
//       clicks: Math.floor(Math.random() * 60) + 40,
//     };
//   });

//   const statusTemplate = (props: { keyword: Keyword; metrics: KeywordMetrics }) => {
//     const statusColors: Record<string, string> = {
//       ENABLED: 'bg-green-100 text-green-800',
//       PAUSED: 'bg-yellow-100 text-yellow-800',
//       REMOVED: 'bg-red-100 text-red-800',
//     };

//     return (
//       <div>
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[props.keyword.status] || 'bg-gray-100 text-gray-800'}`}>
//           {props.keyword.status}
//         </span>
//         {props.keyword.status === 'ENABLED' && (
//           <div className="text-xs text-gray-500 mt-1">
//             Quality Score: {props.keyword.qualityScore}/10
//           </div>
//         )}
//       </div>
//     );
//   };

//   const matchTypeTemplate = (props: { keyword: Keyword; metrics: KeywordMetrics }) => {
//     const matchTypeColors: Record<string, string> = {
//       EXACT: 'text-purple-600',
//       PHRASE: 'text-blue-600',
//       BROAD: 'text-green-600',
//     };

//     return (
//       <span className={`font-medium ${matchTypeColors[props.keyword.matchType] || 'text-gray-600'}`}>
//         {props.keyword.matchType}
//       </span>
//     );
//   };

//   const metricsTemplate = (field: keyof KeywordMetrics) => {
//     return (props: { keyword: Keyword; metrics: KeywordMetrics }) => {
//       const value = props.metrics[field];
      
//       if (typeof value === 'object' && 'amount' in value) {
//         return formatMoney(value);
//       }
      
//       if (field === 'ctr' || field === 'conversionRate' || field === 'impressionShare') {
//         return formatPercentage(value as number);
//       }
      
//       return formatNumber(value as number);
//     };
//   };

//   const metricOptions = [
//     { text: 'Clicks', value: 'clicks' },
//     { text: 'Impressions', value: 'impressions' },
//     { text: 'Conversions', value: 'conversions' },
//     { text: 'Cost', value: 'cost' },
//   ];

//   return (
//     <MainLayout>
//       <div className="min-h-screen bg-gray-50">
//         <PageHeader
//           title="Search keywords"
//           dateRange={{ start: dateRange.startDate, end: dateRange.endDate }}
//           onDateRangeChange={setCustomRange}
//           actionButton={{
//             text: 'Add keyword',
//             icon: 'e-icons e-plus',
//             onClick: () => console.log('Add keyword'),
//           }}
//         />

//         <div className="p-6">
//           {/* Tabs */}
//           <div className="bg-white border-b border-gray-200 mb-6">
//             <div className="flex space-x-6 px-6">
//               <button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-medium">
//                 Search keywords
//               </button>
//               <button className="pb-3 border-b-2 border-transparent text-gray-600 hover:text-gray-900">
//                 Negative search keywords
//               </button>
//             </div>
//           </div>

//           {/* Performance Chart */}
//           <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-medium text-gray-900">Keyword Performance</h3>
//               <div className="flex items-center space-x-4">
//                 <DropDownListComponent
//                   dataSource={metricOptions}
//                   fields={{ text: 'text', value: 'value' }}
//                   value={selectedMetric}
//                   change={(e) => setSelectedMetric(e.value as string)}
//                   cssClass="w-40"
//                 />
//                 <div className="flex items-center space-x-2">
//                   <ButtonComponent iconCss="e-icons e-chart-line">Chart type</ButtonComponent>
//                   <ButtonComponent iconCss="e-icons e-expand">Expand</ButtonComponent>
//                   <ButtonComponent iconCss="e-icons e-adjust">Adjust</ButtonComponent>
//                 </div>
//               </div>
//             </div>
//             <ChartComponent
//               id="keyword-chart"
//               height="300"
//               primaryXAxis={{ valueType: 'DateTime', labelFormat: 'MMM yyyy' }}
//               primaryYAxis={{ labelFormat: '{value}' }}
//               tooltip={{ enable: true }}
//             >
//               <ChartInject services={[LineSeries, Legend, DateTime, Tooltip]} />
//               <SeriesCollectionDirective>
//                 <SeriesDirective
//                   dataSource={timeSeriesData}
//                   xName="date"
//                   yName="clicks"
//                   name="Clicks"
//                   type="Line"
//                   width={2}
//                   marker={{ visible: false }}
//                 />
//               </SeriesCollectionDirective>
//             </ChartComponent>
//           </div>

//           {/* Keywords Table */}
//           <div className="bg-white rounded-lg shadow-sm">
//             <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <ButtonComponent iconCss="e-icons e-plus" cssClass="e-primary e-round" />
//                 <ButtonComponent iconCss="e-icons e-filter">
//                   Keyword status: Enabled
//                 </ButtonComponent>
//                 <ButtonComponent iconCss="e-icons e-filter">
//                   Add filter
//                 </ButtonComponent>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <ButtonComponent iconCss="e-icons e-search">Search</ButtonComponent>
//                 <ButtonComponent iconCss="e-icons e-segment">Segment</ButtonComponent>
//                 <ButtonComponent iconCss="e-icons e-columns">Columns</ButtonComponent>
//                 <ButtonComponent iconCss="e-icons e-report">Reports</ButtonComponent>
//                 <ButtonComponent iconCss="e-icons e-download">Download</ButtonComponent>
//                 <ButtonComponent iconCss="e-icons e-expand">Expand</ButtonComponent>
//                 <ButtonComponent iconCss="e-icons e-more-vertical">More</ButtonComponent>
//               </div>
//             </div>

//             <GridComponent
//               dataSource={keywordsWithMetrics}
//               allowPaging={true}
//               allowSorting={true}
//               allowFiltering={true}
//               pageSettings={{ pageSize: 20 }}
//               filterSettings={{ type: 'Excel' }}
//               height={500}
//             >
//               <ColumnsDirective>
//                 <ColumnDirective type="checkbox" width="50" />
//                 <ColumnDirective
//                   field="keyword.text"
//                   headerText="Keyword"
//                   width="250"
//                   clipMode="EllipsisWithTooltip"
//                 />
//                 <ColumnDirective
//                   field="keyword.matchType"
//                   headerText="Match type"
//                   width="120"
//                   template={matchTypeTemplate}
//                 />
//                 <ColumnDirective
//                   field="keyword.adGroupId"
//                   headerText="Ad group"
//                   width="150"
//                 />
//                 <ColumnDirective
//                   field="keyword.status"
//                   headerText="Status"
//                   width="150"
//                   template={statusTemplate}
//                 />
//                 <ColumnDirective
//                   field="keyword.bid"
//                   headerText="Max. CPC"
//                   width="120"
//                   template={(props: { keyword: Keyword; metrics: KeywordMetrics }) => 
//                     formatMoney(props.keyword.bid)
//                   }
//                 />
//                 <ColumnDirective
//                   field="metrics.impressions"
//                   headerText="Impr."
//                   width="100"
//                   template={metricsTemplate('impressions')}
//                   textAlign="Right"
//                 />
//                 <ColumnDirective
//                   field="metrics.clicks"
//                   headerText="Clicks"
//                   width="100"
//                   template={metricsTemplate('clicks')}
//                   textAlign="Right"
//                 />
//                 <ColumnDirective
//                   field="metrics.ctr"
//                   headerText="CTR"
//                   width="100"
//                   template={metricsTemplate('ctr')}
//                   textAlign="Right"
//                 />
//                 <ColumnDirective
//                   field="metrics.conversions"
//                   headerText="Conv."
//                   width="100"
//                   template={metricsTemplate('conversions')}
//                   textAlign="Right"
//                 />
//                 <ColumnDirective
//                   field="metrics.conversionRate"
//                   headerText="Conv. rate"
//                   width="120"
//                   template={metricsTemplate('conversionRate')}
//                   textAlign="Right"
//                 />
//                 <ColumnDirective
//                   field="metrics.cost"
//                   headerText="Cost"
//                   width="120"
//                   template={metricsTemplate('cost')}
//                   textAlign="Right"
//                 />
//               </ColumnsDirective>
//               <Inject services={[Page, Sort, Filter, Toolbar, Selection]} />
//             </GridComponent>
//           </div>
//         </div>
//       </div>
//     </MainLayout>
//   );
// };
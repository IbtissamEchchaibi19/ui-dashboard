import React, { useState } from 'react';
import { 
  ChartComponent, 
  SeriesCollectionDirective, 
  SeriesDirective, 
  Inject, 
  LineSeries, 
  ColumnSeries,
  DateTime, 
  Category,
  Legend, 
  Tooltip,
  SplineSeries
} from '@syncfusion/ej2-react-charts';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';

// Icons as SVG components
const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
);

const FeedbackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 16v-4M12 8h.01"/>
  </svg>
);

const MoreVertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="1.5"/>
    <circle cx="12" cy="12" r="1.5"/>
    <circle cx="12" cy="19" r="1.5"/>
  </svg>
);

const LightbulbIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#FBBC04">
    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
  </svg>
);

const CampaignIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#5F6368">
    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#5F6368">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
);

const PeopleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#5F6368">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const DevicesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#5F6368">
    <path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z"/>
  </svg>
);

const NetworkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#5F6368">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

const KeywordsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#5F6368">
    <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/>
  </svg>
);

const BillingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#5F6368">
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#5F6368">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const ConversionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#5F6368">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
);

const ThumbUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
);

const ThumbDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

export const OverviewPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>('Nov 1 - 28, 2024');
  const [selectedPreset, setSelectedPreset] = useState<string>('last30days');

  const dateRangePresets = [
    { text: 'Today', value: 'today' },
    { text: 'Yesterday', value: 'yesterday' },
    { text: 'Last 7 days', value: 'last7days' },
    { text: 'Last 14 days', value: 'last14days' },
    { text: 'Last 30 days', value: 'last30days' },
    { text: 'This month', value: 'thisMonth' },
    { text: 'Last month', value: 'lastMonth' },
    { text: 'All time', value: 'allTime' }
  ];

  // Main chart time series data
  const mainChartData = [
    { date: new Date(2024, 10, 1), clicks: 30, impressions: 45 },
    { date: new Date(2024, 10, 3), clicks: 25, impressions: 40 },
    { date: new Date(2024, 10, 5), clicks: 35, impressions: 50 },
    { date: new Date(2024, 10, 7), clicks: 28, impressions: 42 },
    { date: new Date(2024, 10, 9), clicks: 32, impressions: 48 },
    { date: new Date(2024, 10, 11), clicks: 38, impressions: 55 },
    { date: new Date(2024, 10, 13), clicks: 30, impressions: 45 },
    { date: new Date(2024, 10, 15), clicks: 42, impressions: 60 },
    { date: new Date(2024, 10, 17), clicks: 35, impressions: 52 },
    { date: new Date(2024, 10, 19), clicks: 48, impressions: 68 },
    { date: new Date(2024, 10, 21), clicks: 40, impressions: 58 },
    { date: new Date(2024, 10, 23), clicks: 55, impressions: 75 },
    { date: new Date(2024, 10, 25), clicks: 50, impressions: 70 },
    { date: new Date(2024, 10, 27), clicks: 62, impressions: 85 },
    { date: new Date(2024, 10, 28), clicks: 58, impressions: 80 },
  ];

  // Campaign performance data
  const campaignData = [
    { name: 'Sales Performance Max (99 Sept_25)', cost: '₹29,619.16', clicks: '33,793', ctr: '6.50%' },
    { name: 'Now Search Q', cost: '₹1,807.76', clicks: '5,581', ctr: '32.74%' },
    { name: 'Demand Gen - 2023-11', cost: '₹6,814.07', clicks: '46,930', ctr: '13.09%' },
  ];

  // Demographics data
  const demographicsData = [
    { gender: 'Male', age18_24: 30, age25_34: 45, age35_44: 35, age45_54: 20, age55_64: 10, age65: 5 },
    { gender: 'Female', age18_24: 25, age25_34: 40, age35_44: 30, age45_54: 18, age55_64: 8, age65: 4 },
  ];

  // Network performance data
  const networkPerformanceData = [
    { network: 'Google search', value: 75, color: '#1a73e8' },
    { network: 'Search partners', value: 45, color: '#1a73e8' },
    { network: 'Display Network', value: 30, color: '#1a73e8' },
  ];

  // Day of week performance data
  const dayOfWeekData = [
    { day: 'Mon', value: 35 },
    { day: 'Tue', value: 42 },
    { day: 'Wed', value: 38 },
    { day: 'Thu', value: 45 },
    { day: 'Fri', value: 52 },
    { day: 'Sat', value: 28 },
    { day: 'Sun', value: 22 },
  ];

  // Time of day data
  const timeOfDayData = [
    { hour: '0', value: 5 }, { hour: '2', value: 3 }, { hour: '4', value: 2 },
    { hour: '6', value: 8 }, { hour: '8', value: 25 }, { hour: '10', value: 45 },
    { hour: '12', value: 55 }, { hour: '14', value: 48 }, { hour: '16', value: 42 },
    { hour: '18', value: 38 }, { hour: '20', value: 28 }, { hour: '22', value: 15 },
  ];

  // Keywords data
  const keywordsData = [
    { keyword: 'leather shoes for men', clicks: '71,883.19', impressions: '2,471', ctr: '30.73%' },
    { keyword: 'shoes', clicks: '₹1,943.15', impressions: '1,723', ctr: '40.31%' },
    { keyword: 'boys shoes', clicks: '₹1,420.62', impressions: '1,679', ctr: '31.47%' },
    { keyword: 'men casual shoes', clicks: 'Paused', impressions: '693', ctr: '55.69%' },
    { keyword: 'party leather men', clicks: 'Paused', impressions: '410', ctr: '58.06%' },
  ];

  // Search terms data
  const searchTermsData = [
    { term: 'cuero', words: 12654, impressions: 4316, ctr: '34.11%' },
  ];

  // Search term chips
  const searchChips = [
    'cuero', 'cuero shoes', 'piel cuero', 'piel cuero shoes',
    'cuero india', 'shoes', 'cuero footwear', 'cuero shoes india',
    'cuero footwear', 'cuero shoes for men', 'geli cuero',
    'india shoes', 'cuero handcrafted luxury', 'cuero shoes brand'
  ];

  // Footwear trend data
  const footwearTrendData = [
    { date: new Date(2024, 0, 1), value: 20 },
    { date: new Date(2024, 2, 1), value: 35 },
    { date: new Date(2024, 4, 1), value: 25 },
    { date: new Date(2024, 6, 1), value: 45 },
    { date: new Date(2024, 8, 1), value: 30 },
    { date: new Date(2024, 10, 1), value: 40 },
  ];

  // Conversion tracking data
  const conversionTrackingData = [
    { status: 'Tag inactive', count: 3, color: '#ea4335' },
    { status: 'Unverified', count: 4, color: '#5f6368' },
    { status: 'No recent conversions', count: 8, color: '#fbbc04' },
    { status: 'Recording', count: 11, color: '#34a853' },
  ];

  return (
    <div className="bg-white min-h-screen font-['Google_Sans','Roboto',sans-serif]">
      <div className="bg-[#f8f9fa] border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - View and Campaign Selectors */}
          <div className="flex items-center gap-3">
            {/* View Dropdown */}
            <div className="relative">
              <button className="bg-white border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 min-w-[200px]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <div className="flex-1 text-left">
                  <div className="text-xs text-gray-500">View (2 filters)</div>
                  <div className="text-sm font-medium text-gray-900">All campaigns</div>
                </div>
                <ChevronDownIcon />
              </button>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
            </div>

            {/* Campaign Dropdown */}
            <div className="relative">
              <button className="bg-white border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 min-w-[200px]">
                <div className="flex-1 text-left">
                  <div className="text-xs text-gray-500">Campaigns (2)</div>
                  <div className="text-sm font-medium text-gray-900">Select a campaign</div>
                </div>
                <ChevronDownIcon />
              </button>
            </div>
          </div>

          {/* Right Side - Save Button */}
          <button className="flex flex-col items-center gap-1 px-3 py-1 hover:bg-gray-200 rounded text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
            <span className="text-xs">Save</span>
          </button>
        </div>

        {/* Filter Tags Row */}
        <div className="flex items-center gap-3 mt-3">
          <span className="text-sm text-gray-600">Filters</span>
          <button className="bg-white border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1">
            Campaign status: Enabled, Paused
          </button>
          <button className="bg-white border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1">
            Ad group status: Enabled, Paused
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-900">
            Add filter
          </button>
        </div>
      </div>

      {/* Overview Header with Date Selector */}
      <div className="bg-white px-6 py-4 flex items-center justify-between">
        <h2 className="text-2xl text-gray-900">Overview</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">This month</span>
          <button className="border border-blue-600 rounded px-4 py-2 text-sm text-gray-900 hover:bg-blue-50 flex items-center gap-2">
            Nov 1 – 29, 2025
            <ChevronDownIcon />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <ChevronLeftIcon />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <ChevronRightIcon />
          </button>
          <button className="text-blue-600 text-sm font-medium hover:underline">
            Show last 30 days
          </button>
        </div>
      </div>

      {/* New Campaign Button */}
     <button className="bg-[#1967d2] hover:bg-[#1557b0] text-white px-6 py-2.5 rounded-full font-medium mb-6 shadow-sm flex items-center gap-2">
          <span className="text-xl font-light">+</span>
          <span>New campaign</span>
        </button>

        {/* AI Insights Banner */}
        <div className="bg-[#e8f0fe] border border-[#d2e3fc] rounded-lg p-5 mb-6">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Top insights for your account</strong> (Oct 31 - Nov 27 compared to Oct 3 - Oct 30)
              </p>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#1967d2] text-white text-xs px-3 py-1 rounded-full">
                  Conversion Value increased by 242,948.58
                </span>
                <span className="text-xs text-gray-600">Conversions increased by 45,019.91</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                The total conversion value across 2 enabled campaigns increased by 242,948.55
                <button className="inline-flex ml-1 text-gray-500 hover:text-gray-700">
                  <InfoIcon />
                </button>
              </p>
              <ul className="text-xs text-gray-600 space-y-1 mb-3">
                <li>• All 2 campaigns saw an increase in conversion value. Your campaign Sales Performance Max (99 Sept_25) was the top contributor, with an increase of 181,001.0K conversion value.</li>
                <li>• Potential reasons for this change: assets changed for 1 campaign, budget changed for 1 campaign, bid strategy target changed for 1 campaign, and keyword targeting changed for 1 campaign</li>
              </ul>
              <button className="text-[#1967d2] text-sm font-medium hover:underline">See details</button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#d2e3fc]">
            <button className="p-1.5 hover:bg-[#d2e3fc] rounded">
              <ThumbUpIcon />
            </button>
            <button className="p-1.5 hover:bg-[#d2e3fc] rounded">
              <ThumbDownIcon />
            </button>
            <button className="p-1.5 hover:bg-[#d2e3fc] rounded">
              <ShareIcon />
            </button>
            <span className="ml-auto text-xs text-gray-500">
              Google AI is experimental. <a href="#" className="text-[#1967d2]">Terms</a>
            </span>
          </div>
        </div>


      {/* Main Metrics Cards */}
      <div className="px-6 mb-4">
        <div className="flex gap-0 border border-gray-300 rounded-lg overflow-hidden">
          <div className="flex-1 p-4 bg-white border-r border-gray-300">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-sm text-gray-700">Clicks</span>
              <ChevronDownIcon />
            </div>
            <div className="text-3xl font-normal text-blue-600">87.7K</div>
          </div>
          <div className="flex-1 p-4 bg-red-600 border-r border-red-700">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-sm text-white">Impressions</span>
              <ChevronDownIcon />
            </div>
            <div className="text-3xl font-normal text-white">768K</div>
          </div>
          <div className="flex-1 p-4 bg-white border-r border-gray-300">
            <div className="text-sm text-gray-700 mb-1">Avg. CPC</div>
            <div className="text-3xl font-normal text-gray-900">₹0.39</div>
          </div>
          <div className="flex-1 p-4 bg-white">
            <div className="text-sm text-gray-700 mb-1">Cost</div>
            <div className="text-3xl font-normal text-gray-900">₹34.3K</div>
          </div>
        </div>
      </div>

      {/* Main Performance Chart */}
      <div className="px-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <ChartComponent
            id="main-performance-chart"
            primaryXAxis={{
              valueType: 'DateTime',
              labelFormat: 'MMM d',
              majorGridLines: { width: 0 },
              minorGridLines: { width: 0 },
              lineStyle: { width: 1, color: '#e0e0e0' },
              labelStyle: { color: '#5f6368', size: '11px' }
            }}
            primaryYAxis={{
              labelFormat: '{value}',
              majorGridLines: { width: 1, color: '#f0f0f0', dashArray: '3' },
              minorGridLines: { width: 0 },
              lineStyle: { width: 0 },
              labelStyle: { color: '#5f6368', size: '11px' }
            }}
            height="300px"
            chartArea={{ border: { width: 0 } }}
            background="transparent"
            legendSettings={{ visible: false }}
            tooltip={{ enable: true }}
          >
            <Inject services={[LineSeries, SplineSeries, DateTime, Legend, Tooltip]} />
            <SeriesCollectionDirective>
              <SeriesDirective
                dataSource={mainChartData}
                xName="date"
                yName="clicks"
                name="Clicks"
                type="Spline"
                width={2}
                fill="#1a73e8"
              />
              <SeriesDirective
                dataSource={mainChartData}
                xName="date"
                yName="impressions"
                name="Impressions"
                type="Spline"
                width={2}
                fill="#ea4335"
              />
            </SeriesCollectionDirective>
          </ChartComponent>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Nov 1, 2024</span>
            <span>Nov 28, 2024</span>
          </div>
        </div>
      </div>

      {/* Account Diagnostics */}
      <div className="px-6 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
          <span>📋</span>
          <span>Account diagnostics</span>
        </div>
      </div>

      {/* Campaigns Needing Attention */}
      <div className="px-6 mb-6">
  <h3 className="text-base font-normal text-gray-900 mb-4">A few recent campaigns need attention</h3>
  <div className="grid grid-cols-3 gap-4">
    {/* Campaign Card 1 */}
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <CampaignIcon />
        <span className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">
          Sales-Performance Max (9th Sept, 25)
        </span>
      </div>
      <div className="mb-2">
        <div className="text-xs text-red-600 font-medium mb-1">Eligible (Misconfigured)</div>
        <p className="text-xs text-gray-600">Payment method can't be charged. +1 more issue</p>
      </div>
      <button className="text-blue-600 text-xs font-medium hover:underline mt-2">View details</button>
    </div>

    {/* Campaign Card 2 */}
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <CampaignIcon />
        <span className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">
          Demand Gen - 2025-11-17
        </span>
      </div>
      <div className="mb-2">
        <div className="text-xs text-red-600 font-medium mb-1">Eligible (Misconfigured)</div>
        <p className="text-xs text-gray-600">Payment method can't be charged. +1 more issue</p>
      </div>
      <button className="text-blue-600 text-xs font-medium hover:underline mt-2">View details</button>
    </div>

    {/* Campaign Card 3 */}
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <CampaignIcon />
        <span className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">
          Sales-Search-3
        </span>
      </div>
      <div className="mb-2">
        <div className="text-xs text-red-600 font-medium mb-1">Eligible (Misconfigured)</div>
        <p className="text-xs text-gray-600">Payment method can't be charged</p>
      </div>
      <button className="text-blue-600 text-xs font-medium hover:underline mt-2">View details</button>
    </div>
  </div>
</div>

      {/* Main Dashboard Grid */}
      <div className="px-6">
        <div className="grid grid-cols-3 gap-4">
          {/* Column 1 - Recommendations */}
          <div className="space-y-4">
            {/* Recommendations Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <LightbulbIcon />
                  <span className="text-sm font-medium text-gray-900">Recommendation</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertIcon />
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-1">Try the new Google Ads mobile app</p>
                <p className="text-xs text-gray-500">
                  Monitor performance and improve your account on the go
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  (Mentioned because you haven't seen the Google Ads mobile app recently)
                </p>
              </div>
              <button className="text-blue-600 text-sm font-medium hover:underline">View</button>
            </div>

            {/* Day & Hour Performance */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">📅</span>
                  <span className="text-sm font-medium text-gray-900">Day & hour</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Impressions</span>
                  <ChevronDownIcon />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-3">Your performance by day of week and time of day</p>
              
              {/* Day/Time Toggle */}
              <div className="flex items-center gap-4 mb-3 text-xs">
                <span className="text-gray-700 font-medium">Day</span>
                <span className="text-gray-500">Day & time</span>
                <span className="text-gray-500">Hour</span>
                <div className="ml-auto flex items-center gap-1 text-gray-500">
                  <span>Biggest change</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">Sort ▼</span>
                </div>
              </div>

              {/* Day of Week Chart */}
              <ChartComponent
                id="day-chart"
                primaryXAxis={{
                  valueType: 'Category',
                  majorGridLines: { width: 0 },
                  labelStyle: { color: '#5f6368', size: '10px' }
                }}
                primaryYAxis={{
                  visible: false
                }}
                height="120px"
                chartArea={{ border: { width: 0 } }}
                background="transparent"
              >
                <Inject services={[ColumnSeries, Category]} />
                <SeriesCollectionDirective>
                  <SeriesDirective
                    dataSource={dayOfWeekData}
                    xName="day"
                    yName="value"
                    type="Column"
                    fill="#1a73e8"
                    cornerRadius={{ topLeft: 2, topRight: 2 }}
                    columnWidth={0.6}
                  />
                </SeriesCollectionDirective>
              </ChartComponent>

              {/* Time labels */}
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
              </div>
            </div>

            {/* Ad Schedule */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">⏰</span>
                  <span className="text-sm font-medium text-gray-900">Ad schedule</span>
                </div>
              </div>
            </div>

            {/* Optimization Score */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">📊</span>
                  <span className="text-sm font-medium text-gray-900">Optimization score</span>
                  <InfoIcon />
                </div>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="35" fill="none" stroke="#e8eaed" strokeWidth="6"/>
                    <circle cx="40" cy="40" r="35" fill="none" stroke="#1a73e8" strokeWidth="6"
                      strokeDasharray={`${93.5 * 2.2} ${220 - 93.5 * 2.2}`}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xl font-medium text-blue-600">93.5%</span>
                </div>
                <div className="text-xs text-gray-600">
                  <p className="font-medium">Your optimization score ⓘ</p>
                  <p>Increase your score by applying the recommendations in these</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-blue-600">84.2%</span>
                  <span className="text-gray-600">Sales Performance Max (99 Sept_25)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">19.4%</span>
                  <span className="text-gray-500">Demand Gen - 2023-11-17</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">100%</span>
                  <span className="text-gray-500">Sales Search Q</span>
                </div>
              </div>
              <button className="text-blue-600 text-xs font-medium hover:underline mt-3">All recommendations</button>
              <span className="text-xs text-gray-400 ml-2">1 / 1 ▸</span>
            </div>

            {/* Networks */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <NetworkIcon />
                  <span className="text-sm font-medium text-gray-900">Networks</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertIcon />
                </button>
              </div>
              <p className="text-xs text-gray-600 mb-3">Summary of how your ads are performing on these networks</p>
              
              <div className="flex items-center gap-4 mb-3 text-xs">
                <label className="flex items-center gap-1">
                  <CheckBoxComponent checked={true} cssClass="e-small" />
                  <span>Google search</span>
                </label>
                <label className="flex items-center gap-1">
                  <CheckBoxComponent checked={true} cssClass="e-small" />
                  <span>Search partners</span>
                </label>
                <label className="flex items-center gap-1">
                  <CheckBoxComponent cssClass="e-small" />
                  <span>Display network</span>
                </label>
              </div>

              {/* Network Bars */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-16 text-xs text-gray-600">Search</div>
                  <div className="flex-1 bg-gray-200 h-6 rounded overflow-hidden flex">
                    <div className="bg-blue-600 h-full" style={{ width: '75%' }}></div>
                    <div className="bg-red-500 h-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 text-xs text-gray-600">Partners</div>
                  <div className="flex-1 bg-gray-200 h-6 rounded overflow-hidden flex">
                    <div className="bg-blue-600 h-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                <span>▹ 24.1%</span>
                <span>₹2.7K</span>
                <span>₹2.1K</span>
                <span>₹0.41</span>
                <span>Aug 12%</span>
              </div>
            </div>

            {/* Networks Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <span className="text-sm font-medium text-gray-900">Networks</span>
            </div>

            {/* Top Bidding Segment */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">Top bidding segment</span>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertIcon />
                </button>
              </div>
            </div>

            {/* Top Signals */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">Examples of top signals for your bid strategy</span>
              </div>
              <p className="text-xs text-blue-600 mb-2">
                Bid strategy: <span className="font-medium">Portfolio Maximum Conversions (Nov 21, 2024)</span>
                <span className="text-gray-400 ml-2">1 / 2 ▸</span>
              </p>
              <p className="text-xs text-gray-600 mb-2">
                Examples of top signals used to optimize your ads. An auction is matched as
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Smart Bidding smoothly optimizes for best results
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>📍 Location: Punjab and Sindh, and more</p>
                <p>⏰ Time: Weekdays, 12PM to 6PM • Location: Maharashtra</p>
                <p>🔗 Device: Remarketer • Every paid cuero shoes</p>
                <p>💻 Device: Desktops • Time: Weekends, 8AM to 8PM</p>
                <p>⏰ Time: Weekdays, after 10PM • Query: geli cuero</p>
              </div>
              <button className="text-blue-600 text-xs font-medium hover:underline mt-3">View report</button>
              <span className="text-xs text-gray-400 ml-2">1 / 1 ▸</span>
            </div>

            {/* Search Trends */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <SearchIcon />
                  <span className="text-sm font-medium text-gray-900">Search trends</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Clicks</span>
                  <ChevronDownIcon />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-medium">Footwear: cuero shoes</span> is trending compared to last year
              </p>
              <div className="flex items-center gap-4 mb-2">
                <div>
                  <p className="text-xs text-gray-500">Search interest (%)</p>
                  <p className="text-lg font-medium text-gray-900">+26%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Your Clicks</p>
                  <p className="text-lg font-medium text-gray-900">3.53K</p>
                </div>
              </div>
              <ChartComponent
                id="trend-chart"
                primaryXAxis={{
                  valueType: 'DateTime',
                  labelFormat: 'MMM',
                  majorGridLines: { width: 0 },
                  visible: false
                }}
                primaryYAxis={{ visible: false }}
                height="60px"
                chartArea={{ border: { width: 0 } }}
                background="transparent"
              >
                <Inject services={[SplineSeries, DateTime]} />
                <SeriesCollectionDirective>
                  <SeriesDirective
                    dataSource={footwearTrendData}
                    xName="date"
                    yName="value"
                    type="Spline"
                    width={2}
                    fill="#1a73e8"
                  />
                </SeriesCollectionDirective>
              </ChartComponent>
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Apr 03, 2024</span>
                <span>Nov 26, 2024</span>
              </div>
              <button className="text-blue-600 text-xs font-medium hover:underline mt-2">View trend</button>
            </div>
          </div>

          {/* Column 2 - Campaigns */}
          <div className="space-y-4">
            {/* Campaigns Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <CampaignIcon />
      <span className="text-sm font-medium text-gray-900">Campaigns</span>
    </div>
    <button className="text-gray-400 hover:text-gray-600">
      <MoreVertIcon />
    </button>
  </div>
  <p className="text-sm text-gray-900 mb-4">Summary of how your campaigns are performing</p>

  {/* Campaign Table */}
  <div className="border border-gray-200 rounded">
    {/* Table Header */}
    <div className="grid grid-cols-12 gap-2 bg-gray-50 border-b border-gray-200 px-3 py-2">
      <div className="col-span-5"></div>
      <div className="col-span-3 text-xs text-gray-700 font-medium flex items-center gap-1">
        Cost
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
      </div>
      <div className="col-span-2 text-xs text-gray-700 font-medium flex items-center gap-1">
        Clicks
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
      </div>
      <div className="col-span-2 text-xs text-gray-700 font-medium flex items-center gap-1">
        CTR
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
      </div>
    </div>

    {/* Table Rows */}
    <div className="grid grid-cols-12 gap-2 bg-blue-50 px-3 py-3 items-center">
      <div className="col-span-5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0"></span>
        <span className="text-xs text-blue-600 hover:underline cursor-pointer">
          Sales-Performance Max (9th Sept, 25)
        </span>
      </div>
      <div className="col-span-3 text-sm text-blue-900 font-medium">₹20,614.33</div>
      <div className="col-span-2 text-sm text-gray-900">33,783</div>
      <div className="col-span-2 text-sm text-gray-900">8.50%</div>
    </div>

    <div className="grid grid-cols-12 gap-2 bg-blue-100 px-3 py-3 items-center">
      <div className="col-span-5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0"></span>
        <span className="text-xs text-blue-600 hover:underline cursor-pointer">
          Sales-Search-3
        </span>
      </div>
      <div className="col-span-3 text-sm text-gray-900">₹7,897.76</div>
      <div className="col-span-2 text-sm text-gray-900">6,981</div>
      <div className="col-span-2 text-sm text-gray-900">33.74%</div>
    </div>

    <div className="grid grid-cols-12 gap-2 bg-gray-100 px-3 py-3 items-center">
      <div className="col-span-5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0"></span>
        <span className="text-xs text-blue-600 hover:underline cursor-pointer">
          Demand Gen - 2025-11-17
        </span>
      </div>
      <div className="col-span-3 text-sm text-gray-900">₹5,814.67</div>
      <div className="col-span-2 text-sm text-gray-900">46,950</div>
      <div className="col-span-2 text-sm text-gray-900">13.44%</div>
    </div>
  </div>

  <div className="flex items-center justify-between mt-3">
    <button className="text-blue-600 text-xs font-medium hover:underline">All campaigns</button>
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <button className="hover:text-gray-700">‹</button>
      <span>1 / 1</span>
      <button className="hover:text-gray-700">›</button>
    </div>
  </div>
</div>

            {/* Biggest Changes */}
           <div className="bg-white border border-gray-200 rounded-lg p-4">
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z"/>
      </svg>
      <span className="text-sm font-medium text-gray-900">Biggest changes</span>
    </div>
    <div className="flex items-center gap-2">
      <button className="text-xs text-gray-700 font-medium flex items-center gap-1">
        Cost
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
      </button>
      <button className="text-gray-400 hover:text-gray-600">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
        </svg>
      </button>
    </div>
  </div>

  <h3 className="text-sm font-normal text-gray-900 mb-2">
    Biggest changes to your campaigns and ad groups
  </h3>
  
  <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
    <span>Nov 1 – 28, 2025 compared to Oct 4 – 31, 2025</span>
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
    </svg>
  </div>
  
  {/* Chart Rows */}
  <div className="space-y-3">
    {/* Row 1 */}
    <div className="flex items-center gap-3">
      <span className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0"></span>
      <span className="text-xs text-blue-600 hover:underline cursor-pointer truncate" style={{width: '140px'}}>
        Demand Gen - 2025-11...
      </span>
      <div className="flex-1 bg-gray-100 h-6 rounded relative">
        <div className="absolute left-1/2 w-1/2 h-full bg-blue-600 rounded-r"></div>
      </div>
      <div className="text-right" style={{width: '70px'}}>
        <div className="text-sm font-medium text-gray-900">+₹5,815.51</div>
        <div className="text-xs text-gray-500">+∞</div>
      </div>
    </div>

    {/* Row 2 */}
    <div className="flex items-center gap-3">
      <span className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0"></span>
      <span className="text-xs text-blue-600 hover:underline cursor-pointer truncate" style={{width: '140px'}}>
        Sales-Search-3
      </span>
      <div className="flex-1 bg-gray-100 h-6 rounded relative">
        <div className="absolute left-1/2 w-1/2 h-full bg-blue-600 rounded-r"></div>
      </div>
      <div className="text-right" style={{width: '70px'}}>
        <div className="text-sm font-medium text-gray-900">+₹5,072.84</div>
        <div className="text-xs text-gray-500">+179.57%</div>
      </div>
    </div>

    {/* Row 3 */}
    <div className="flex items-center gap-3">
      <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
      <span className="text-xs text-gray-400 truncate" style={{width: '140px'}}>
        Demand Gen - 2025-10...
      </span>
      <div className="flex-1 bg-gray-100 h-6 rounded relative">
        <div className="absolute left-1/2 w-[15%] h-full bg-orange-500 rounded-r"></div>
      </div>
      <div className="text-right" style={{width: '70px'}}>
        <div className="text-sm font-medium text-gray-900">+₹2,153.44</div>
        <div className="text-xs text-gray-500">-10.00%</div>
      </div>
    </div>

    {/* Row 4 */}
    <div className="flex items-center gap-3">
      <span className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0"></span>
      <span className="text-xs text-blue-600 hover:underline cursor-pointer truncate" style={{width: '140px'}}>
        Sales-Performance Ma...
      </span>
      <div className="flex-1 bg-gray-100 h-6 rounded relative">
        <div className="absolute left-1/2 w-[12%] h-full bg-blue-600 rounded-r"></div>
      </div>
      <div className="text-right" style={{width: '70px'}}>
        <div className="text-sm font-medium text-gray-900">+₹1,577.21</div>
        <div className="text-xs text-gray-500">+8.28%</div>
      </div>
    </div>
  </div>

  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
    <button className="hover:text-gray-700">‹</button>
    <span>1 / 1</span>
    <button className="hover:text-gray-700">›</button>
  </div>
</div>

            {/* Devices */}

            {/* Billing */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BillingIcon />
                  <span className="text-sm font-medium text-gray-900">Billing</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Balance as of Nov 28, 2024</p>
                  <p className="text-lg font-medium text-gray-900">₹2,988.62</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment due</p>
                  <p className="text-lg font-medium text-gray-900">Dec 1, 2025</p>
                  <p className="text-xs text-gray-500">or when your balance</p>
                  <p className="text-xs text-gray-500">reaches ₹15,000.00</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs text-gray-600 mb-2">Payment methods</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-blue-600 font-medium">Primary:</span>
                  <span className="text-gray-600">Visa •••• 4891</span>
                  <span className="text-blue-600">Backup</span>
                  <span className="text-blue-600">Add a backup</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-blue-600">
                  <button className="hover:underline">View form of payment request</button>
                  <span>•</span>
                  <button className="hover:underline">Fix it</button>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <button className="text-blue-600 text-xs font-medium hover:underline">View billing</button>
                <button className="text-blue-600 text-xs font-medium hover:underline ml-4">View statements and tax documents</button>
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd"/>
      </svg>
      <span className="text-sm font-medium text-gray-900">Keywords</span>
    </div>
    <div className="flex items-center gap-3">
      <button className="flex items-center gap-1 text-blue-600 text-sm hover:underline">
        <span className="text-lg">+</span>
        <span>Add keyword</span>
      </button>
      <button className="text-gray-400 hover:text-gray-600">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
        </svg>
      </button>
    </div>
  </div>
  
  <p className="text-sm text-gray-900 mb-4">Summary of how your keywords are performing</p>
  
  {/* Keywords Table */}
  <div className="border border-gray-200 rounded overflow-hidden">
    {/* Table Header */}
    <div className="grid grid-cols-12 gap-0 bg-gray-50 border-b border-gray-200">
      <div className="col-span-5 px-3 py-2"></div>
      <div className="col-span-3 px-3 py-2 text-xs text-gray-700 font-medium flex items-center gap-1">
        Cost
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
      </div>
      <div className="col-span-2 px-3 py-2 text-xs text-gray-700 font-medium flex items-center gap-1">
        Clicks
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
      </div>
      <div className="col-span-2 px-3 py-2 text-xs text-gray-700 font-medium flex items-center gap-1">
        CTR
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
      </div>
    </div>

    {/* Table Rows */}
    <div className="grid grid-cols-12 gap-0 border-b border-gray-200">
      <div className="col-span-5 px-3 py-3 flex items-center gap-2 bg-white">
        <span className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0"></span>
        <span className="text-xs text-blue-600 hover:underline cursor-pointer">
          leather shoes for men
        </span>
      </div>
      <div className="col-span-3 px-3 py-3 bg-blue-100 text-sm text-blue-900 font-medium">₹2,885.98</div>
      <div className="col-span-2 px-3 py-3 bg-gray-50 text-sm text-gray-900">2,471</div>
      <div className="col-span-2 px-3 py-3 bg-gray-50 text-sm text-gray-900">30.73%</div>
    </div>

    <div className="grid grid-cols-12 gap-0 border-b border-gray-200">
      <div className="col-span-5 px-3 py-3 flex items-center gap-2 bg-white">
        <span className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0"></span>
        <span className="text-xs text-blue-600 hover:underline cursor-pointer">
          piel cuero
        </span>
      </div>
      <div className="col-span-3 px-3 py-3 bg-blue-100 text-sm text-gray-900">₹1,949.19</div>
      <div className="col-span-2 px-3 py-3 bg-gray-50 text-sm text-gray-900">1,732</div>
      <div className="col-span-2 px-3 py-3 bg-gray-50 text-sm text-gray-900">40.31%</div>
    </div>

    <div className="grid grid-cols-12 gap-0 border-b border-gray-200">
      <div className="col-span-5 px-3 py-3 flex items-center gap-2 bg-white">
        <span className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0"></span>
        <span className="text-xs text-blue-600 hover:underline cursor-pointer">
          cuero shoes
        </span>
      </div>
      <div className="col-span-3 px-3 py-3 bg-blue-200 text-sm text-gray-900">₹1,429.20</div>
      <div className="col-span-2 px-3 py-3 bg-gray-50 text-sm text-gray-900">1,478</div>
      <div className="col-span-2 px-3 py-3 bg-gray-50 text-sm text-gray-900">31.94%</div>
    </div>

    <div className="grid grid-cols-12 gap-0 border-b border-gray-200">
      <div className="col-span-5 px-3 py-3 flex items-center gap-2 bg-white">
        <span className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0"></span>
        <span className="text-xs text-blue-600 hover:underline cursor-pointer">
          piel cuero shoes
        </span>
      </div>
      <div className="col-span-3 px-3 py-3 bg-blue-50 text-sm text-gray-900">₹568.44</div>
      <div className="col-span-2 px-3 py-3 bg-gray-50 text-sm text-gray-900">593</div>
      <div className="col-span-2 px-3 py-3 bg-gray-50 text-sm text-gray-900">55.89%</div>
    </div>

    <div className="grid grid-cols-12 gap-0">
      <div className="col-span-5 px-3 py-3 flex items-center gap-2 bg-white">
        <span className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0"></span>
        <span className="text-xs text-blue-600 hover:underline cursor-pointer">
          penny loafers men
        </span>
      </div>
      <div className="col-span-3 px-3 py-3 bg-blue-50 text-sm text-gray-900">₹508.50</div>
      <div className="col-span-2 px-3 py-3 bg-gray-50 text-sm text-gray-900">353</div>
      <div className="col-span-2 px-3 py-3 bg-gray-50 text-sm text-gray-900">28.06%</div>
    </div>
  </div>

  {/* Footer */}
  <div className="flex items-center justify-between mt-4 text-xs">
    <div className="flex items-center gap-4">
      <button className="text-blue-600 font-medium hover:underline">Keywords</button>
      <button className="text-blue-600 hover:underline">Negative keywords</button>
    </div>
    <div className="flex items-center gap-2 text-gray-500">
      <button className="hover:text-gray-700">‹</button>
      <span>1 / 10</span>
      <button className="hover:text-gray-700">›</button>
    </div>
  </div>
</div>
            {/* Save time with auto-apply */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-gray-900">Save time with auto-apply</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Auto-applying is available! Review and the AI apply these
              </p>
              <p className="text-xs text-gray-600 mb-3">
                recommendations automatically every time they're available, how we avoid costly
              </p>
              <div className="space-y-2 text-xs">
                <p className="text-gray-600">⚡ Ads-apply</p>
              </div>
              <button className="text-blue-600 text-xs font-medium hover:underline mt-3">Change auto-apply settings</button>
            </div>
             <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ConversionIcon />
                  <span className="text-sm font-medium text-gray-900">Conversion tracking status</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>All</span>
                  <ChevronDownIcon />
                </div>
              </div>
              
              {/* Status Bars */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-24">Tag inactive</span>
                  <div className="flex-1 bg-gray-200 h-4 rounded overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: '15%' }}></div>
                  </div>
                  <span className="text-xs text-gray-600">3</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-24">Unverified</span>
                  <div className="flex-1 bg-gray-200 h-4 rounded overflow-hidden">
                    <div className="bg-gray-500 h-full" style={{ width: '20%' }}></div>
                  </div>
                  <span className="text-xs text-gray-600">4</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-24">No recent conversions</span>
                  <div className="flex-1 bg-gray-200 h-4 rounded overflow-hidden">
                    <div className="bg-yellow-500 h-full" style={{ width: '40%' }}></div>
                  </div>
                  <span className="text-xs text-gray-600">8</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-24">Recording</span>
                  <div className="flex-1 bg-gray-200 h-4 rounded overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: '55%' }}></div>
                  </div>
                  <span className="text-xs text-gray-600">11</span>
                </div>
              </div>

              <button className="text-blue-600 text-xs font-medium hover:underline mt-3">Manage conversions</button>
            </div>
          </div>

          {/* Column 3 - Demographics */}
          <div className="space-y-4">
            {/* Demographics */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <PeopleIcon />
                  <span className="text-sm font-medium text-gray-900">Demographics</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Impressions</span>
                  <ChevronDownIcon />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-3">Summary of the demographic groups your ads are reaching by age and gender</p>

              {/* Gender Age Table */}
              <div className="mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span className="w-16">Gender</span>
                  <span className="flex-1 text-center">Gender & Age</span>
                  <span className="w-8 text-center">Age</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-xs text-gray-600">Male</span>
                    <div className="flex-1 flex items-center h-6">
                      <div className="bg-blue-200 h-full" style={{ width: '20%' }}></div>
                      <div className="bg-blue-400 h-full" style={{ width: '30%' }}></div>
                      <div className="bg-blue-500 h-full" style={{ width: '25%' }}></div>
                      <div className="bg-blue-600 h-full" style={{ width: '15%' }}></div>
                      <div className="bg-blue-700 h-full" style={{ width: '7%' }}></div>
                      <div className="bg-blue-800 h-full" style={{ width: '3%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-xs text-gray-600">Female</span>
                    <div className="flex-1 flex items-center h-6">
                      <div className="bg-blue-200  h-full" style={{ width: '18%' }}></div>
                      <div className="bg-blue-200  h-full" style={{ width: '28%' }}></div>
                      <div className="bg-blue-200  h-full" style={{ width: '22%' }}></div>
                      <div className="bg-blue-200  h-full" style={{ width: '18%' }}></div>
                      <div className="bg-blue-200  h-full" style={{ width: '10%' }}></div>
                      <div className="bg-blue-200  h-full" style={{ width: '4%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Age legend */}
              <div className="flex items-center justify-between text-[10px] text-gray-500 mb-3">
                <span>18-24</span>
                <span>25-34</span>
                <span>35-44</span>
                <span>45-54</span>
                <span>55-64</span>
                <span>65+</span>
              </div>

              <p className="text-xs text-gray-500 mb-3">
                Based on the 27% of your impressions with known gender and age. ⓘ
              </p>

              {/* Gender & Age Section */}
              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs text-gray-600 mb-2">Gender & Age</p>
              </div>
            </div>

            {/* Ad Performance Across Devices */}
           <div className="bg-white border border-gray-200 rounded-lg p-4">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
      </svg>
      <span className="text-sm font-medium text-gray-900">Devices</span>
    </div>
    <button className="text-gray-400 hover:text-gray-600">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
      </svg>
    </button>
  </div>

  <h3 className="text-sm font-normal text-gray-900 mb-4">Ad performance across devices</h3>

  {/* Device Type Filters */}
  <div className="flex items-center gap-4 mb-4 text-xs">
    <div className="flex items-center gap-1.5">
      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"/>
      </svg>
      <span className="text-gray-700">Mobile phones</span>
    </div>
    <div className="flex items-center gap-1.5">
      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"/>
      </svg>
      <span className="text-gray-700">Tablets</span>
    </div>
    <div className="flex items-center gap-1.5">
      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd"/>
      </svg>
      <span className="text-gray-700">Computers</span>
    </div>
    <div className="flex items-center gap-1.5">
      <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
      </svg>
      <span className="text-gray-700">TV screens</span>
    </div>
  </div>

  {/* Performance Chart Rows */}
  <div className="space-y-3">
    {/* Cost Row */}
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1 text-xs text-gray-700">
          <span>Cost</span>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
          </svg>
        </div>
      </div>
      <div className="flex h-6 rounded overflow-hidden">
        <div className="bg-blue-600" style={{width: '92.4%'}}></div>
        <div className="bg-red-600" style={{width: '1.1%'}}></div>
        <div className="bg-yellow-500" style={{width: '6.5%'}}></div>
        <div className="bg-teal-600" style={{width: '0.0%'}}></div>
      </div>
      <div className="flex items-center gap-4 mt-1 text-xs">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-600 rounded-sm"></span>
          <span className="text-gray-700">92.4%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-red-600 rounded-sm"></span>
          <span className="text-gray-700">1.1%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-yellow-500 rounded-sm"></span>
          <span className="text-gray-700">6.5%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-teal-600 rounded-sm"></span>
          <span className="text-gray-700">0.0%</span>
        </div>
      </div>
    </div>

    {/* Impressions Row */}
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1 text-xs text-gray-700">
          <span>Impressions</span>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
          </svg>
        </div>
      </div>
      <div className="flex h-6 rounded overflow-hidden">
        <div className="bg-blue-600" style={{width: '97.0%'}}></div>
        <div className="bg-red-600" style={{width: '1.6%'}}></div>
        <div className="bg-yellow-500" style={{width: '1.4%'}}></div>
        <div className="bg-teal-600" style={{width: '0.0%'}}></div>
      </div>
      <div className="flex items-center gap-4 mt-1 text-xs">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-600 rounded-sm"></span>
          <span className="text-gray-700">97.0%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-red-600 rounded-sm"></span>
          <span className="text-gray-700">1.6%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-yellow-500 rounded-sm"></span>
          <span className="text-gray-700">1.4%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-teal-600 rounded-sm"></span>
          <span className="text-gray-700">0.0%</span>
        </div>
      </div>
    </div>

    {/* Clicks Row */}
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1 text-xs text-gray-700">
          <span>Clicks</span>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
          </svg>
        </div>
      </div>
      <div className="flex h-6 rounded overflow-hidden">
        <div className="bg-blue-600" style={{width: '97.9%'}}></div>
        <div className="bg-red-600" style={{width: '1.4%'}}></div>
        <div className="bg-yellow-500" style={{width: '0.7%'}}></div>
        <div className="bg-teal-600" style={{width: '0.0%'}}></div>
      </div>
      <div className="flex items-center gap-4 mt-1 text-xs">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-600 rounded-sm"></span>
          <span className="text-gray-700">97.9%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-red-600 rounded-sm"></span>
          <span className="text-gray-700">1.4%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-yellow-500 rounded-sm"></span>
          <span className="text-gray-700">0.7%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-teal-600 rounded-sm"></span>
          <span className="text-gray-700">0.0%</span>
        </div>
      </div>
    </div>
  </div>

  <button className="text-blue-600 text-xs font-medium hover:underline mt-4">Devices</button>
</div>

            {/* Devices Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <span className="text-sm font-medium text-gray-900">Devices</span>
            </div>

            {/* Searches */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <SearchIcon />
                  <span className="text-sm font-medium text-gray-900">Searches</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Sort by:</span>
                  <span>Impressions ▼</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-3">Top searches and words within searches where people saw your</p>

              {/* Search Terms Header */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span className="flex-1">Searches</span>
                <span className="w-16 text-right">Words</span>
              </div>

              {/* Search Term Chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                {searchChips.slice(0, 8).map((chip, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {chip}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {searchChips.slice(8, 14).map((chip, index) => (
                  <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {chip}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-400 mt-2 block">1 / 1▸ ▸</span>
            </div>

            {/* Product Card */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-amber-50 p-4">
                <img 
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect fill='%23f5f0e6' width='200' height='150'/%3E%3Ctext fill='%238B7355' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14'%3EShoe Image%3C/text%3E%3C/svg%3E"
                  alt="Product"
                  className="w-full h-32 object-cover rounded"
                />
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  Flash Sale: Leather Shoes - Men's Shoes -
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  Limited Time | Handcrafted, Limited, Yours
                </p>
                <p className="text-xs text-blue-600 mb-2">Ad · www.cuero.co/men/flash-sale</p>
                <p className="text-xs text-gray-500 mb-3">
                  Premium handcrafted leather, without the premium price tag. Shop our limited collection of elegantly designed men's leather shoes. Limited-Edition. Premium Craftsmanship.
                </p>
                <div className="text-xs text-gray-600">
                  <p>Special Goodies · Flash Sale - Shop Now and More ▸</p>
                  <p className="mt-1">Men's Leather Loafers</p>
                  <p>Men's Formal Shoes</p>
                  <p>Leather Slippers for Men</p>
                  <p>Buy Sneakers</p>
                </div>
              </div>
            </div>

            {/* Search Metrics */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Ad Assets</span>
                <span>Interactions</span>
                <span>Clicks</span>
                <span>CTR</span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium text-gray-900">
                <span>Eligible</span>
                <span>12,654</span>
                <span>4,316</span>
                <span>34.11%</span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-blue-600">
                <button className="hover:underline">All search ads</button>
                <button className="hover:underline">All assets</button>
              </div>
              <span className="text-xs text-gray-400 mt-2 block">1 / 1▸ ▸</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="px-6 py-4 mt-6 border-t border-gray-200 text-xs text-gray-500">
        <p>
          Unless on no trail only. Time zone for all dates and times: (GMT+05:30) India Standard Time. <a href="#" className="text-blue-600">Learn more</a>
        </p>
        <p>
          Location reporting are mobile through Maps and other recommended apps.
        </p>
        <p>
          UK and US Media Rating Council (MRC) accreditation status in the column headers' learn list for accredited metrics.
        </p>
        <p className="text-gray-400 mt-1">Change limit</p>
      </div>
    </div>
  );
};
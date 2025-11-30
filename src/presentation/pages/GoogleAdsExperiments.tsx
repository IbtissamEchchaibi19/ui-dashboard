import { useState } from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Sort,
  Filter as GridFilterService, // ← renamed to avoid conflict
  Toolbar,
  Inject,
  Column,
} from '@syncfusion/ej2-react-grids';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import {performanceMaxData,adVariationsData,customExperimentsData, allExperimentsData} from '@infrastructure/mock-data'

export const GoogleAdsExperiments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  const tabs = [
    { id: 'all', label: 'All experiments' },
    { id: 'custom', label: 'Custom experiments' },
    { id: 'variations', label: 'Ad variations' },
    { id: 'performance', label: 'Performance Max experiments' }
  ];

  const renderWelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      
       <div className="bg-[#f8f9fa] border-b border-gray-300 px-6 py-4">

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
      <div className="mb-8">
        <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
          <rect x="80" y="60" width="140" height="100" fill="#f8f9fa" stroke="#dadce0" strokeWidth="2" rx="4"/>
          <rect x="83" y="63" width="25" height="3" fill="#dadce0" rx="1"/>
          <circle cx="88" cy="65" r="1.concat(1.5)" fill="#ea4335"/>
          <circle cx="92" cy="65" r="1.5" fill="#fbbc04"/>
          <circle cx="96" cy="65" r="1.5" fill="#34a853"/>
          <rect x="100" y="85" width="15" height="30" fill="#fbbc04" rx="2"/>
          <rect x="120" y="75" width="15" height="40" fill="#34a853" rx="2"/>
          <rect x="140" y="90" width="15" height="25" fill="#ea4335" rx="2"/>
          <circle cx="180" cy="95" r="20" fill="none" stroke="#4285f4" strokeWidth="8"/>
          <circle cx="180" cy="95" r="20" fill="none" stroke="#34a853" strokeWidth="8" strokeDasharray="40 100"/>
          <ellipse cx="50" cy="135" rx="15" ry="5" fill="#e8f0fe"/>
          <rect x="45" y="115" width="10" height="20" fill="#f1f3f4" rx="5"/>
          <circle cx="50" cy="105" r="8" fill="#f1f3f4"/>
          <circle cx="50" cy="102" r="6" fill="#5f6368"/>
          <circle cx="150" cy="45" r="8" fill="#f1f3f4"/>
          <circle cx="150" cy="42" r="6" fill="#5f6368"/>
          <circle cx="145" cy="55" r="15" fill="#4285f4" opacity="0.8"/>
          <ellipse cx="240" cy="130" rx="12" ry="4" fill="#e8f0fe"/>
          <rect x="235" y="100" width="10" height="30" fill="#e8f0fe" rx="5"/>
          <circle cx="240" cy="90" r="8" fill="#f1f3f4"/>
          <circle cx="240" cy="87" r="6" fill="#a94438"/>
        </svg>
      </div>
      <h2 className="text-2xl font-normal text-gray-800 mb-4">Welcome to Experiments</h2>
      <p className="text-center text-gray-600 max-w-2xl leading-relaxed">
        Google Ads experiments can help you continuously improve the performance of your campaigns. 
        When you test different campaign settings, you reach more customers and drive better results 
        quickly and efficiently for your business.
      </p>
    </div>
  );

  const renderEmptyState = (message: string, buttonText: string) => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-6">
        {/* Syncfusion Filter Icon */}
        <i className="e-icons e-filter" style={{ fontSize: '48px', color: '#9aa0a6' }} />
      </div>
      <p className="text-gray-600 mb-4">{message}</p>
      <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
        <i className="e-icons e-plus" style={{ fontSize: '18px' }} />
        {buttonText}
      </button>
    </div>
  );

  // ... (keep all your render functions exactly the same: renderAllExperiments, renderCustomExperiments, etc.)
  // I'm keeping them unchanged — they are perfect

  const renderAllExperiments = () => {
    if (allExperimentsData.length === 0) {
      return renderWelcomeScreen();
    }

    if (viewMode === 'card') {
      return (
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {allExperimentsData.map((exp) => (
              <div key={exp.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{exp.name}</h3>
                    <span className="text-sm text-gray-600">{exp.type}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    exp.status === 'Running' ? 'bg-green-100 text-green-800' :
                    exp.status === 'Creating' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {exp.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Split</p>
                    <p className="font-medium">{exp.split}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Base Campaign</p>
                    <p className="font-medium truncate">{exp.baseCampaign}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Start Date</p>
                    <p className="font-medium">{exp.startDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">End Date</p>
                    <p className="font-medium">{exp.endDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Split</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allExperimentsData.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exp.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      exp.status === 'Running' ? 'bg-green-100 text-green-800' :
                      exp.status === 'Creating' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.split}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.baseCampaign}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCustomExperiments = () => {
    if (customExperimentsData.length === 0) {
      return renderEmptyState('No experiments match your filters', 'New experiment');
    }
    
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Split</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Split Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sync Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customExperimentsData.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exp.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      {exp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.split}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.splitType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.baseCampaign}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.treatmentCampaign}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.syncStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAdVariations = () => {
    if (adVariationsData.length === 0) {
      return renderEmptyState("You don't have any ad variations yet", 'New ad variation');
    }

    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Text Changes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affected Ads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impr.</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adVariationsData.map((variation) => (
                <tr key={variation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{variation.variation}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      {variation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{variation.adTextChanges}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{variation.actions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{variation.affectedAds}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{variation.clicks.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{variation.impressions.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPerformanceMax = () => {
    if (performanceMaxData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <div className="mb-8">
            <svg width="200" height="150" viewBox="0 0 200 150">
              <rect x="40" y="40" width="120" height="80" fill="#f8f9fa" stroke="#dadce0" strokeWidth="2" rx="4"/>
              <rect x="60" y="60" width="15" height="35" fill="#fbbc04" rx="2"/>
              <rect x="80" y="50" width="15" height="45" fill="#34a853" rx="2"/>
              <rect x="100" y="65" width="15" height="30" fill="#ea4335" rx="2"/>
              <circle cx="70" cy="40" r="15" fill="#4285f4" opacity="0.8"/>
              <circle cx="130" cy="40" r="15" fill="#34a853" opacity="0.8"/>
            </svg>
          </div>
          <h3 className="text-xl font-normal text-gray-800 mb-3">Measure impact with a Performance Max campaign</h3>
          <ul className="text-gray-600 space-y-2 mb-6">
            <li>• Run an experiment with your existing campaign types and Performance Max</li>
            <li>• Monitor results before applying any changes to your account</li>
          </ul>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            New experiment
          </button>
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Split</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performanceMaxData.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exp.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      {exp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.split}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.baseCampaign}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.treatmentCampaign}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{exp.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'all': return renderAllExperiments();
      case 'custom': return renderCustomExperiments();
      case 'variations': return renderAdVariations();
      case 'performance': return renderPerformanceMax();
      default: return renderAllExperiments();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-normal text-gray-900">Experiments</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded ${viewMode === 'card' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Card view"
              >
                <i className="e-icons e-grid-view" style={{ fontSize: '20px' }} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Table view"
              >
                <i className="e-icons e-table" style={{ fontSize: '20px' }} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md">
            <i className="e-icons e-plus" style={{ fontSize: '20px' }} />
          </button>

          {activeTab === 'all' && (
            <button className="flex items-center justify-center w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-full relative">
              <i className="e-icons e-filter" style={{ fontSize: '20px' }} />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                1
              </span>
            </button>
          )}

          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">
            <span>Status: Setup, Creating..., + 11 more</span>
          </div>

          <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2">
            Add filter
          </button>

          {(activeTab === 'variations' || activeTab === 'custom') && (
            <div className="ml-auto flex items-center gap-2">
              <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
                <i className="e-icons e-filter" style={{ fontSize: '16px' }} />
                Segment
              </button>
              <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
                <i className="e-icons e-table" style={{ fontSize: '16px' }} />
                Columns
              </button>
              <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
                <i className="e-icons e-expand" style={{ fontSize: '16px' }} />
                Expand
              </button>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="ml-auto">
              <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
                <i className="e-icons e-expand" style={{ fontSize: '16px' }} />
                Expand
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 text-xs text-gray-600">
        <p>
          <span className="text-blue-600 hover:underline cursor-pointer">Reporting is not real-time.</span> Time zone for all dates and times: (GMT+05:30) India Standard Time. <span className="text-blue-600 hover:underline cursor-pointer">Learn more</span>
        </p>
        <p className="mt-1">Some inventory may be provided through third party intermediaries.</p>
      </div>
    </div>
  );
};
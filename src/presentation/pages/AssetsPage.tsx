import { useState } from 'react';
import { assetsData, assetTypeFilters, tabs, Asset } from '@infrastructure/mock-data/Assersmockdata';


export const  AssetsPage: React.FC = ()=> {
  const [selectedTab, setSelectedTab] = useState('associations');
  const [selectedAssetType, setSelectedAssetType] = useState('all');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['account']));
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);



  // Group assets by level
  const accountAssets = assetsData.filter(a => a.level === 'Account');
  const campaignAssets = assetsData.filter(a => a.level === 'Campaign');

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === assetsData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(assetsData.map(a => a.id)));
    }
  };

  const toggleGroupExpansion = (group: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(group)) {
        newSet.delete(group);
      } else {
        newSet.add(group);
      }
      return newSet;
    });
  };

  // Filter assets based on selected type
  const getFilteredAssets = (assets: Asset[]) => {
    if (selectedAssetType === 'all') return assets;
    
    const filterMap: Record<string, string[]> = {
      image: ['Image'],
      businessName: ['Business name'],
      businessLogo: ['Business logo'],
      sitelink: ['Sitelink'],
      headline: ['Headline'],
      description: ['Description'],
      callout: ['Callout'],
      structuredSnippet: ['Structured snippet'],
      call: ['Call'],
      leadForm: ['Lead form'],
      message: ['Message'],
      location: ['Location'],
      price: ['Price'],
      app: ['App'],
      promotion: ['Promotion']
    };
    
    const allowedTypes = filterMap[selectedAssetType] || [];
    return assets.filter(asset => allowedTypes.includes(asset.assetType));
  };

  const filteredAccountAssets = getFilteredAssets(accountAssets);
  const filteredCampaignAssets = getFilteredAssets(campaignAssets);

  return (
    <div className="min-h-screen bg-white">
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
      <div className="border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <button className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">
                  <i className="e-icons e-filter" style={{ fontSize: '12px' }} />
                  <span>View (2 filters)</span>
                </button>
                <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded">
                  <i className="e-icons e-home" style={{ fontSize: '12px' }} />
                  <span>All campaigns</span>
                </button>
              </div>
              <h1 className="text-2xl font-normal text-gray-900">Assets</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">This month</span>
              <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                <option>Nov 1 – 28, 2025</option>
              </select>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <i className="e-icons e-chevron-left" style={{ fontSize: '16px' }} />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <i className="e-icons e-chevron-right" style={{ fontSize: '16px' }} />
              </button>
              <button className="text-blue-600 text-sm font-medium hover:underline">
                Show last 30 days
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === tab.id
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

      {/* Asset Type Filters */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {assetTypeFilters.map((filter) => (
            <button
              key={filter.id}
              onMouseEnter={() => setSelectedAssetType(filter.id)}
              onClick={() => setSelectedAssetType(filter.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-colors ${
                selectedAssetType === filter.id
                  ? 'bg-blue-50 text-blue-600 border-2 border-blue-600'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {selectedAssetType === filter.id && (
                <i className="e-icons e-check" style={{ fontSize: '14px' }} />
              )}
              <i className={`e-icons ${filter.icon}`} style={{ fontSize: '14px' }} />
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md">
              <i className="e-icons e-plus" style={{ fontSize: '20px' }} />
            </button>
            
            <button className="flex items-center justify-center w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-full relative">
              <i className="e-icons e-filter" style={{ fontSize: '20px' }} />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                Asset status: Enabled, Paused
              </span>
              <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                Asset type: All
              </span>
              <button className="text-blue-600 text-sm font-medium hover:underline">
                + 1 more
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1">
                Add filter
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <i className="e-icons e-filter" style={{ fontSize: '16px' }} />
              Segment
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <i className="e-icons e-table" style={{ fontSize: '16px' }} />
              Columns
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <i className="e-icons e-print" style={{ fontSize: '16px' }} />
              Reports
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <i className="e-icons e-download" style={{ fontSize: '16px' }} />
              Download
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <i className="e-icons e-expand" style={{ fontSize: '16px' }} />
              Expand
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <i className="e-icons e-more-vert" style={{ fontSize: '16px' }} />
                More
              </button>
              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 w-48">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Export to Excel</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Export to CSV</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 py-4">
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 cursor-pointer"
                    checked={selectedRows.size === assetsData.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left w-10"></th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Asset</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Asset type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Level</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Added by</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Last updated</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">
                  <button className="flex items-center gap-1 ml-auto">
                    <i className="e-icons e-arrow-down" style={{ fontSize: '12px' }} />
                    Impr.
                  </button>
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Interactions</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Interaction rate</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Avg. cost</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Cost</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {/* Account Group */}
              {filteredAccountAssets.length > 0 && (
                <>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td colSpan={13} className="px-4 py-2">
                      <button 
                        onClick={() => toggleGroupExpansion('account')}
                        className="flex items-center gap-2 text-sm font-medium text-gray-900"
                      >
                        {expandedGroups.has('account') ? '▼' : '▶'}
                        <span>Account</span>
                      </button>
                    </td>
                  </tr>
                  
                  {expandedGroups.has('account') && filteredAccountAssets.map((asset) => (
                    <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 cursor-pointer"
                          checked={selectedRows.has(asset.id)}
                          onChange={() => toggleRowSelection(asset.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`w-2 h-2 rounded-full inline-block ${
                          asset.status === 'Enabled' ? 'bg-green-500' : 
                          asset.status === 'Paused' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {asset.imageUrl && (
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-lg">
                              {asset.imageUrl}
                            </div>
                          )}
                          <a href="#" className="text-blue-600 hover:underline">
                            {asset.name}
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{asset.assetType}</td>
                      <td className="px-4 py-3 text-gray-700">{asset.level}</td>
                      <td className="px-4 py-3 text-gray-700">{asset.status}</td>
                      <td className="px-4 py-3">
                        <a href="#" className="text-blue-600 hover:underline">{asset.addedBy}</a>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{asset.lastUpdated}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{asset.impressions.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {asset.interactions > 0 ? (
                          <>
                            {asset.interactions.toLocaleString()}
                            <div className="text-xs text-gray-500">clicks</div>
                          </>
                        ) : (
                          asset.interactions
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">{asset.interactionRate}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{asset.avgCost}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{asset.cost}</td>
                    </tr>
                  ))}
                </>
              )}

              {/* Campaign Group */}
              {filteredCampaignAssets.length > 0 && (
                <>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td colSpan={13} className="px-4 py-2">
                      <button 
                        onClick={() => toggleGroupExpansion('campaign')}
                        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                      >
                        {expandedGroups.has('campaign') ? '▼' : '▶'}
                        <span>Campaign #1</span>
                      </button>
                    </td>
                  </tr>
                  
                  {expandedGroups.has('campaign') && filteredCampaignAssets.map((asset) => (
                    <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 cursor-pointer"
                          checked={selectedRows.has(asset.id)}
                          onChange={() => toggleRowSelection(asset.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`w-2 h-2 rounded-full inline-block ${
                          asset.status === 'Enabled' ? 'bg-green-500' : 
                          asset.status === 'Paused' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {asset.imageUrl && (
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-lg">
                              {asset.imageUrl}
                            </div>
                          )}
                          <a href="#" className="text-blue-600 hover:underline">
                            {asset.name}
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{asset.assetType}</td>
                      <td className="px-4 py-3 text-gray-700">{asset.level}</td>
                      <td className="px-4 py-3 text-gray-700">{asset.status}</td>
                      <td className="px-4 py-3">
                        <a href="#" className="text-blue-600 hover:underline">{asset.addedBy}</a>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{asset.lastUpdated}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{asset.impressions.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {asset.interactions > 0 ? (
                          <>
                            {asset.interactions.toLocaleString()}
                            <div className="text-xs text-gray-500">clicks</div>
                          </>
                        ) : (
                          asset.interactions
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">{asset.interactionRate}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{asset.avgCost}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{asset.cost}</td>
                    </tr>
                  ))}
                </>
              )}

              {/* No Results Message */}
              {filteredAccountAssets.length === 0 && filteredCampaignAssets.length === 0 && (
                <tr>
                  <td colSpan={13} className="px-4 py-8 text-center text-gray-500">
                    No assets found for the selected filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 text-xs text-gray-600">
        <p>
          <span className="text-blue-600 hover:underline cursor-pointer">Reporting is not real-time.</span> Time zone for all dates and times: (GMT+05:30) India Standard Time.{' '}
          <span className="text-blue-600 hover:underline cursor-pointer">Learn more</span>
        </p>
        <p className="mt-1">Some inventory may be provided through third party intermediaries.</p>
      </div>
    </div>
  );
}
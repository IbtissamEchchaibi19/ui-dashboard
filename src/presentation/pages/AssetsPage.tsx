import { useState } from 'react';

// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
interface Asset {
  id: string;
  name: string;
  assetType: string;
  level: 'Account' | 'Campaign';
  status: 'Enabled' | 'Paused' | 'Eligible';
  addedBy: string;
  lastUpdated: string;
  impressions: number;
  interactions: number;
  interactionRate: string;
  avgCost: string;
  cost: string;
  imageUrl?: string;
  parentName?: string;
}

// ──────────────────────────────────────────────────────────────
// Sample Data
// ──────────────────────────────────────────────────────────────
const assetsData: Asset[] = [
  {
    id: '07888513249',
    name: '07888513249',
    assetType: 'Call',
    level: 'Account',
    status: 'Eligible',
    addedBy: 'Advertiser',
    lastUpdated: 'Oct 9, 2025, 8:25 AM',
    impressions: 481,
    interactions: 95,
    interactionRate: '19.75%',
    avgCost: '₹4.87',
    cost: '₹462.34'
  },
  {
    id: 'aidfox-logo',
    name: 'AidFox Logo',
    assetType: 'Business logo',
    level: 'Account',
    status: 'Eligible',
    addedBy: 'Advertiser',
    lastUpdated: 'Oct 13, 2025, 6:46 AM',
    impressions: 455,
    interactions: 90,
    interactionRate: '19.78%',
    avgCost: '₹4.03',
    cost: '₹362.91',
    imageUrl: '🦊'
  },
  {
    id: '07888513249-campaign',
    name: '07888513249',
    assetType: 'Call',
    level: 'Campaign',
    status: 'Eligible',
    addedBy: 'Advertiser',
    lastUpdated: 'Oct 9, 2025, 8:51 AM',
    impressions: 0,
    interactions: 0,
    interactionRate: '—',
    avgCost: '—',
    cost: '₹0.00',
    parentName: 'Campaign #1'
  },
  {
    id: '40i-logo',
    name: '40i Logo',
    assetType: 'Logo',
    level: 'Campaign',
    status: 'Eligible',
    addedBy: 'Advertiser',
    lastUpdated: 'Nov 7, 2025, 1:46 PM',
    impressions: 0,
    interactions: 0,
    interactionRate: '—',
    avgCost: '—',
    cost: '₹0.00',
    imageUrl: '🦊',
    parentName: 'Campaign #1'
  }
];

const assetTypeFilters = [
  { id: 'all', label: 'All', icon: 'e-check' },
  { id: 'image', label: 'Image', icon: 'e-image' },
  { id: 'businessName', label: 'Business name', icon: 'e-home' },
  { id: 'businessLogo', label: 'Business logo', icon: 'e-image' },
  { id: 'sitelink', label: 'Sitelink', icon: 'e-link' },
  { id: 'headline', label: 'Headline', icon: 'e-text' },
  { id: 'description', label: 'Description', icon: 'e-text' },
  { id: 'callout', label: 'Callout', icon: 'e-comment' },
  { id: 'structuredSnippet', label: 'Structured snippet', icon: 'e-list' },
  { id: 'call', label: 'Call', icon: 'e-phone' },
  { id: 'leadForm', label: 'Lead form', icon: 'e-form' },
  { id: 'message', label: 'Message', icon: 'e-message' },
  { id: 'location', label: 'Location', icon: 'e-location' },
  { id: 'price', label: 'Price', icon: 'e-tag' },
  { id: 'app', label: 'App', icon: 'e-mobile' },
  { id: 'promotion', label: 'Promotion', icon: 'e-gift' }
];

// ──────────────────────────────────────────────────────────────
// Main Component

// ──────────────────────────────────────────────────────────────
export const  AssetsPage: React.FC = () =>  {
  const [selectedTab, setSelectedTab] = useState('associations');
  const [selectedAssetType, setSelectedAssetType] = useState('all');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['account']));
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const tabs = [
    { id: 'associations', label: 'Associations' },
    { id: 'performance', label: 'Performance' },
    { id: 'assetCoverage', label: 'Asset coverage' },
    { id: 'expandedUrl', label: 'Expanded final URL assets' }
  ];

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

  return (
    <div className="min-h-screen bg-white">
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
              
              {expandedGroups.has('account') && accountAssets.map((asset) => (
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

              {/* Campaign Group */}
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
              
              {expandedGroups.has('campaign') && campaignAssets.map((asset) => (
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
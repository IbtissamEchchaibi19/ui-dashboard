import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Download, Maximize2 } from 'lucide-react';
import {devicesData,whenAdsShowedData,matchedLocationsData} from '@infrastructure/mock-data'

const chartDataPoints = [
  { x: 100, y: 180 }, { x: 200, y: 150 }, { x: 300, y: 250 }, { x: 400, y: 305 },
  { x: 500, y: 280 }, { x: 600, y: 290 }, { x: 700, y: 305 }, { x: 800, y: 315 },
  { x: 900, y: 345 }, { x: 1000, y: 365 }, { x: 1100, y: 360 }, { x: 1200, y: 362 },
  { x: 1300, y: 365 }, { x: 1400, y: 362 }, { x: 1500, y: 360 }, { x: 1600, y: 362 },
  { x: 1700, y: 365 }
];
export const WhenWhereAdsShowedPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'devices' | 'when' | 'where' | 'matched'>('devices');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedMetric, setSelectedMetric] = useState('clicks');
  const [selectedComparison, setSelectedComparison] = useState('none');
  const [levelFilter, setLevelFilter] = useState('campaign');

  const tabs = [
    { id: 'devices' as const, label: 'Devices' },
    { id: 'when' as const, label: 'When ads showed' },
    { id: 'where' as const, label: 'Where ads showed' },
    { id: 'matched' as const, label: 'Matched locations' }
  ];

  // Get current data based on selected tab
  const getCurrentData = () => {
    switch (selectedTab) {
      case 'devices':
        return devicesData;
      case 'when':
        return whenAdsShowedData;
      case 'matched':
        return matchedLocationsData;
      default:
        return devicesData;
    }
  };

  const currentData = getCurrentData();

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
    if (selectedRows.size === currentData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(currentData.map((r: any) => r.id)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedTab(tab.id);
                setSelectedRows(new Set());
              }}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Section */}
       <div className="bg-white px-6 pt-6">
        {/* Chart Controls */}
        <div className="flex items-center justify-end gap-3 mb-4">
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 cursor-pointer"
          >
            <option value="clicks">▬ Clicks</option>
            <option value="impressions">▬ Impressions</option>
            <option value="cost">▬ Cost</option>
            <option value="interactionRate">▬ Interaction rate</option>
          </select>
          
          <select 
            value={selectedComparison}
            onChange={(e) => setSelectedComparison(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 cursor-pointer"
          >
            <option value="none">▬ None</option>
            <option value="previous">Compare to: Previous period</option>
            <option value="lastYear">Compare to: Last year</option>
          </select>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
            Chart type
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
            <Maximize2 className="w-4 h-4" />
            Expand
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
            Adjust
          </button>
        </div>

        {/* Chart */}
        <div className="pb-6">
          <div className="h-64 bg-white relative border-l border-b border-gray-200">
            <svg className="w-full h-full" viewBox="0 0 1400 256" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="51" x2="1400" y2="51" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="128" x2="1400" y2="128" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="205" x2="1400" y2="205" stroke="#e5e7eb" strokeWidth="1" />
              
              {/* Weekend shading */}
              <rect x="200" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.6" />
              <rect x="550" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.6" />
              <rect x="900" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.6" />
              <rect x="1250" y="0" width="100" height="256" fill="#f3f4f6" opacity="0.6" />
              
              {/* Line graph - matching Google Ads curve */}
              <path
                d="M 0,210 L 50,200 L 100,180 L 150,160 L 200,140 L 250,105 L 300,85 L 350,230 L 400,235 L 450,238 L 500,237 L 550,236 L 600,237 L 650,235 L 700,234 L 750,236 L 800,235 L 850,237 L 900,236 L 950,233 L 1000,235 L 1050,232 L 1100,230 L 1150,232 L 1200,228 L 1250,230 L 1300,232 L 1350,230 L 1400,232"
                fill="none"
                stroke="#1a73e8"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            
            {/* Y-axis labels */}
            <div className="absolute -left-8 top-8 text-xs text-gray-600">40</div>
            <div className="absolute -left-8 top-[120px] text-xs text-gray-600">20</div>
            <div className="absolute -left-6 bottom-2 text-xs text-gray-600">0</div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-600 pl-2">
            <span>Nov 1, 2025</span>
            <span className="pr-4">Nov 29, 2025</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 mx-6 mt-6 border-t border-x">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedTab === 'devices' && (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-blue-900 font-medium">1</span>
                </div>
                
                <button className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50">
                  Level: Campaign
                </button>
              </>
            )}
            
            {selectedTab === 'when' && (
              <button className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-2">
                Day & hour
                <ChevronDown className="w-4 h-4" />
              </button>
            )}

            {selectedTab === 'matched' && (
              <button className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-2">
                Account view
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <Filter className="w-4 h-4" />
              Add filter
            </button>
          </div>

          <div className="flex items-center gap-4">
            {selectedTab === 'matched' && (
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Segment
              </button>
            )}

            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              Columns
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <Download className="w-4 h-4" />
              Download
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <Maximize2 className="w-4 h-4" />
              Expand
            </button>
            
            {selectedTab !== 'matched' && (
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <ChevronUp className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="px-6 pb-4 bg-gray-50">
        <div className="bg-white border border-gray-200 border-t-0 rounded-b overflow-x-auto">
          {selectedTab === 'devices' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.size === currentData.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Device</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Level</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Added to</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Bid adj.</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Ad group bid adj.</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Impr.</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">
                    <div className="flex items-center justify-end gap-1">
                      <ChevronDown className="w-4 h-4" />
                      Interacti.
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Interaction rate</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Avg. cost</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Cost</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Conv. rate</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Conversions</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Cost / conv.</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {devicesData.map((device) => (
                  <tr key={device.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 cursor-pointer"
                        checked={selectedRows.has(device.id)}
                        onChange={() => toggleRowSelection(device.id)}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-900">{device.device}</td>
                    <td className="px-4 py-3 text-gray-700">{device.level}</td>
                    <td className="px-4 py-3">
                      <a href="#" className="text-blue-600 hover:underline">{device.addedTo}</a>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{device.bidAdj || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{device.adGroupBidAdj}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{device.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {device.interactions > 0 ? (
                        <>
                          {device.interactions}
                          <div className="text-xs text-gray-500">clicks</div>
                        </>
                      ) : (
                        device.interactions
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{device.interactionRate}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{device.avgCost}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{device.cost}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{device.convRate}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{device.conversions}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{device.costPerConv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTab === 'when' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.size === currentData.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Day</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Hour</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Campaign</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Impr.</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">
                    <div className="flex items-center justify-end gap-1">
                      <ChevronDown className="w-4 h-4" />
                      Interaction
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Interaction rate</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Avg. cost</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Cost</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Conv. rate</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Conversions</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Cost / conv.</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {/* Total Row */}
                <tr className="bg-gray-50 font-medium border-b border-gray-200">
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 flex items-center gap-2 text-gray-900">
                    Total: Day...
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right text-gray-900">1,994</td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    239
                    <div className="text-xs text-gray-500">clicks</div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">11.99%</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹7.09</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹1,695.56</td>
                  <td className="px-4 py-3 text-right text-gray-900">6.28%</td>
                  <td className="px-4 py-3 text-right text-gray-900">15.00</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹113.04</td>
                </tr>

                {whenAdsShowedData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 cursor-pointer"
                        checked={selectedRows.has(item.id)}
                        onChange={() => toggleRowSelection(item.id)}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-900">{item.day}</td>
                    <td className="px-4 py-3 text-gray-700">{item.hour}</td>
                    <td className="px-4 py-3">
                      <a href="#" className="text-blue-600 hover:underline">{item.campaign}</a>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.impressions}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {item.interactions}
                      <div className="text-xs text-gray-500">clicks</div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.interactionRate}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.avgCost}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.cost}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.convRate}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.conversions}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.costPerConv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTab === 'matched' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 cursor-pointer"
                      checked={selectedRows.size === currentData.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Matched location</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">
                    <div className="flex items-center justify-end gap-1">
                      <ChevronDown className="w-4 h-4" />
                      Clicks
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Impr.</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">CTR</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Avg. CPC</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Cost</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Conv. rate</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Conversions</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Cost / conv.</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {matchedLocationsData.map((location) => (
                  <tr key={location.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 cursor-pointer"
                        checked={selectedRows.has(location.id)}
                        onChange={() => toggleRowSelection(location.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <a href="#" className="text-blue-600 hover:underline">{location.matchedLocation}</a>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.clicks}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.ctr}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.avgCpc}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.cost}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.convRate}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.conversions}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{location.costPerConv}</td>
                  </tr>
                ))}

                {/* Total: Locations Row */}
                <tr className="bg-gray-50 font-medium border-b border-gray-200">
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 flex items-center gap-2 text-gray-900">
                    Total: Locations
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">239</td>
                  <td className="px-4 py-3 text-right text-gray-900">1,994</td>
                  <td className="px-4 py-3 text-right text-gray-900">11.99%</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹7.09</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹1,695.56</td>
                  <td className="px-4 py-3 text-right text-gray-900">6.28%</td>
                  <td className="px-4 py-3 text-right text-gray-900">15.00</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹113.04</td>
                </tr>

                {/* Total: Account Row */}
                <tr className="bg-gray-50 font-medium border-b border-gray-200">
                  <td className="px-4 py-3">
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2 text-gray-900">
                    Total: Acco...
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">239</td>
                  <td className="px-4 py-3 text-right text-gray-900">1,994</td>
                  <td className="px-4 py-3 text-right text-gray-900">11.99%</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹7.09</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹1,695.56</td>
                  <td className="px-4 py-3 text-right text-gray-900">6.28%</td>
                  <td className="px-4 py-3 text-right text-gray-900">15.00</td>
                  <td className="px-4 py-3 text-right text-gray-900">₹113.04</td>
                </tr>
              </tbody>
            </table>
          )}

          {selectedTab === 'where' && (
            <div className="p-12 text-center text-gray-500">
              <p>Where ads showed data will be displayed here</p>
            </div>
          )}
        </div>

        {/* Pagination for Matched locations tab */}
        {selectedTab === 'matched' && (
          <div className="mt-4 flex justify-end">
            <span className="text-sm text-gray-600">1 - 1 of 1</span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 border-t border-blue-100 px-6 py-3 mt-6">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-900">
            <span className="font-medium">Optimize device performance:</span> Review which devices are 
            driving the most conversions and adjust your bids accordingly. Consider setting bid adjustments 
            to increase or decrease bids for specific devices. Mobile phones often have different conversion 
            patterns than desktops, so tailor your strategy to each device type. Learn more about{' '}
            <a href="#" className="underline hover:text-blue-700">device targeting and bid adjustments</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
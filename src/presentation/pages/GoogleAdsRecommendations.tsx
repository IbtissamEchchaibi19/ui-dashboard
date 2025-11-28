import { useState } from 'react';

// ──────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ──────────────────────────────────────────────────────────────
interface Recommendation {
  id: number;
  title: string;
  description: string;
  reason: string;
  impact: string;
  category: 'all' | 'keywords' | 'ai';
  icon: string;
  isNew?: boolean;
  isAIEssential?: boolean;
  hasActions?: boolean;
  additionalInfo?: string[];
}

// ──────────────────────────────────────────────────────────────
// Sample Data
// ──────────────────────────────────────────────────────────────
const recommendationsData: Recommendation[] = [
  {
    id: 1,
    title: 'Create a Performance Max campaign',
    description: 'Get more conversions at a similar cost with a Performance Max campaign. It uses Google AI to show ads across Search, YouTube, Display, Discover, Gmail, and Maps to driver better results.',
    reason: 'Recommended because advertisers who adopt Performance Max (PMax) see +27% more conversion/value uplift at a similar cost per action/return on ad spend (CPA/ROAS) regardless of their level of Broad Match adoption',
    impact: '+10.3%',
    category: 'all',
    icon: 'e-trending-up',
    hasActions: true
  },
  {
    id: 2,
    title: 'Upload Customer Match lists',
    description: 'Show impactful and personalized ads to your existing customers by using the contact information they share with you',
    reason: 'Recommended because you are eligible to use Customer Match features',
    impact: '+2.7%',
    category: 'keywords',
    icon: 'e-search',
    isAIEssential: true
  },
  {
    id: 3,
    title: 'Use Display Expansion',
    description: 'Get more conversions at a similar CPA using unspent budget with the revamped Google Display Network Expansion feature',
    reason: 'Recommended because some of your Search campaigns have unspent budget that can benefit from Display Expansion',
    impact: '+1%',
    category: 'ai',
    icon: 'e-search',
    isNew: true,
    hasActions: true
  },
  {
    id: 4,
    title: 'Use your conversion data for Customer Match',
    description: 'Show impactful and personalized ads to existing and potential customers using recent conversion data',
    reason: 'Recommended because you are eligible to use your conversion data to create Customer Match lists',
    impact: '+0.7%',
    category: 'keywords',
    icon: 'e-search'
  },
  {
    id: 5,
    title: 'Remove redundant keywords',
    description: 'Make your account easier to manage by removing redundant keywords',
    reason: 'Recommended because you have redundant keywords with the same ad group, destination, and bidding strategy',
    impact: '+0.7%',
    category: 'keywords',
    icon: 'e-search',
    additionalInfo: ['[ai classes]', '[artificial intelligence course]', '[artificial intelligence classes]', '[ai certificate programs]', '+ more']
  }
];

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────
export const  GoogleAdsRecommendations:  React.FC = () =>  {
  const [activeFilter, setActiveFilter] = useState<'all' | 'keywords' | 'ai'>('all');
  const [view, setView] = useState<'cards' | 'list'>('cards');

  const filters = [
    { id: 'all', label: 'All', badge: null },
    { id: 'keywords', label: 'Keywords & targeting', badge: '+4%' },
    { id: 'ai', label: 'AI Essentials', badge: '+13%' }
  ];

  const filteredRecommendations = activeFilter === 'all' 
    ? recommendationsData 
    : recommendationsData.filter(rec => rec.category === activeFilter);

  const performanceImages = [
    { label: 'YouTube', color: '#FF0000' },
    { label: 'Display', color: '#4285F4' },
    { label: 'Search', color: '#34A853' },
    { label: 'Discover', color: '#EA4335' },
    { label: 'Gmail', color: '#FBBC04' },
    { label: 'Maps', color: '#1A73E8' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <i className="e-icons e-home" style={{ fontSize: '14px' }} />
                <span>All campaigns</span>
              </div>
              <h1 className="text-2xl font-normal text-gray-900">Recommendations</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView('cards')}
                className={`p-2 rounded ${view === 'cards' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                title="View cards"
              >
                <i className="e-icons e-grid-view" style={{ fontSize: '20px' }} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded ${view === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                title="View list"
              >
                <i className="e-icons e-table" style={{ fontSize: '20px' }} />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Export">
                <i className="e-icons e-export" style={{ fontSize: '20px' }} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200">
            <button className="px-4 py-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600">
              Recommendations
            </button>
            <button className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 flex items-center gap-1">
              Investment strategy
              <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">NEW</span>
            </button>
            <button className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300">
              Auto-apply settings
            </button>
          </div>
        </div>
      </div>

      {/* Optimization Score Section */}
      <div className="bg-white mx-6 mt-6 rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-8">
          <div className="flex-shrink-0">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-normal text-gray-900">85.2%</span>
              <span className="text-red-600 text-sm flex items-center gap-1">
                <i className="e-icons e-arrow-down" style={{ fontSize: '12px' }} />
                1%
              </span>
            </div>
            <div className="mt-3 w-80 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '85.2%' }}></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <h3 className="text-lg text-gray-900 mb-2 flex items-center gap-2">
                Your optimization score
                <i className="e-icons e-info" style={{ fontSize: '16px', color: '#5f6368' }} />
              </h3>
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <i className="e-icons e-check-circle" style={{ fontSize: '18px', color: '#34a853' }} />
              Your campaigns are focused on <span className="font-medium text-gray-900">conversions</span>, based on your bid strategy settings
            </p>
          </div>
        </div>
      </div>

      {/* Top Recommendation */}
      <div className="mx-6 mt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top recommendation for you</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              <i className="e-icons e-trending-up" style={{ fontSize: '24px', color: '#5f6368' }} />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Create a Performance Max campaign
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Get more conversions at a similar cost with a Performance Max campaign. It uses Google AI to show ads across Search, YouTube, Display, Discover, Gmail, and Maps to driver better results.
                </p>
                <p className="text-xs text-gray-600 mb-4">
                  Recommended because advertisers who adopt Performance Max (PMax) see{' '}
                  <span className="font-medium">+27% more conversion/value uplift</span> at a similar cost per action/return on ad spend (CPA/ROAS) regardless of their level of Broad Match adoption{' '}
                  <i className="e-icons e-info" style={{ fontSize: '12px', color: '#5f6368' }} />
                </p>

                {/* Performance Max Visual */}
                <div className="flex items-center gap-3 mb-6">
                  {performanceImages.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="text-xs text-gray-600 mb-2">{item.label}</div>
                      <div className="w-16 h-20 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                        <div className="w-10 h-10 rounded" style={{ backgroundColor: item.color, opacity: 0.3 }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">
                    Create campaign
                  </button>
                  <button className="text-blue-600 text-sm font-medium hover:underline">
                    See how it works
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-blue-600 text-lg font-medium">+10.3%</span>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <i className="e-icons e-more-vertical" style={{ fontSize: '20px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* More Recommendations */}
      <div className="mx-6 mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">More recommendations</h2>
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <i className="e-icons e-check-circle" style={{ fontSize: '20px', color: '#34a853' }} />
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-blue-50 text-blue-600 border-2 border-blue-600'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter.label}
              {filter.badge && (
                <span className="ml-1 text-green-600 font-medium">{filter.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredRecommendations.slice(1).map((rec) => (
            <div key={rec.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <i className={`e-icons ${rec.icon}`} style={{ fontSize: '24px', color: '#5f6368' }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-medium text-gray-900">{rec.title}</h3>
                      {rec.isNew && (
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded font-medium">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {rec.description}
                    </p>
                    <p className="text-xs text-gray-600 mb-3">
                      {rec.reason}
                    </p>
                    
                    {rec.additionalInfo && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {rec.additionalInfo.map((info, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {info}
                          </span>
                        ))}
                      </div>
                    )}

                    {rec.isAIEssential && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-4 p-3 bg-blue-50 rounded">
                        <i className="e-icons e-info" style={{ fontSize: '14px', color: '#1a73e8' }} />
                        <span className="underline">This recommendation is an AI Essential</span>
                      </div>
                    )}

                    {rec.hasActions && (
                      <div className="flex items-center gap-3">
                        <button className="text-blue-600 text-sm font-medium hover:underline">
                          View recommendation
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700">
                          Apply
                        </button>
                      </div>
                    )}
                    {!rec.hasActions && (
                      <button className="text-blue-600 text-sm font-medium hover:underline">
                        View recommendation
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-blue-600 text-base font-medium">{rec.impact}</span>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                    <i className="e-icons e-more-vertical" style={{ fontSize: '18px' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from '@presentation/components/PageHeader';

interface MainLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  id: string;
  text: string;
  route: string;
  subItems?: MenuItem[];
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    campaigns: false,
    insights: false,
    assets: false,
    audiences: false,
  });

const menuItems: MenuItem[] = [
  { id: 'overview', text: 'Overview', route: '/Overview' },
  { id: 'recommendations', text: 'Recommendations', route: '/recommendations' },

  {
    id: 'insights',
    text: 'Insights and reports',
    route: '#',
    subItems: [
      { id: 'insights-main', text: 'Insights', route: '/insights' },
      { id: 'auction-insights', text: 'Auction insights', route: '/auction-insights' },
      { id: 'search-terms', text: 'Search terms', route: '/search-terms' },
      { id: 'when-where', text: 'When and where ads showed', route: '/when-where-ads-showed' },
      { id: 'channel-performance', text: 'Channel performance', route: '/channel-performance' },
      { id: 'landing-pages', text: 'Landing pages', route: '/landing-pages' },
      { id: 'stores', text: 'Stores', route: '/stores' },
      { id: 'report-editor', text: 'Report editor', route: '/report-editor' },
      { id: 'dashboards', text: 'Dashboards', route: '/dashboards' },
    ]
  },

  {
    id: 'campaigns',
    text: 'Campaigns',
    route: '#',
    subItems: [
      { id: 'campaigns-main', text: 'Campaigns', route: '/campaigns' },
      { id: 'adgroups', text: 'Ad groups', route: '/AdGroupsPage' },
      { id: 'ads', text: 'Ads', route: '/Adspage' },
      { id: 'assetgroups', text: 'Asset groups', route: '/AssetGroup' },
      { id: 'experiments', text: 'Experiments', route: '/experiments' },
      { id: 'campaigngroups', text: 'Campaign groups', route: '/campaign-groups' },
    ]
  },

  {
    id: 'assets',
    text: 'Assets',
    route: '#',
    subItems: [
      { id: 'asset', text: 'Asset', route: '/Asset' },
    ]
  },

  {
    id: 'audiences',
    text: 'Audiences, keywords, and content',
    route: '#',
    subItems: [
      { id: 'keywords', text: 'Keywords', route: '/keywords' },
      { id: 'audiences-main', text: 'Audiences', route: '/audiences' },
      { id: 'locations', text: 'Locations', route: '/locations' },
      { id: 'content', text: 'Content', route: '/content' },
      { id: 'ad-schedule', text: 'Ad schedule', route: '/ad-schedule' },
      { id: 'advanced-bid', text: 'Advanced bid adjustments', route: '/advanced-bid-adjustments' },
    ]
  },

  { id: 'history', text: 'Change history', route: '/change-history' },
];


  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleMenuClick = (item: MenuItem): void => {
    if (item.subItems && item.subItems.length > 0) {
      toggleSection(item.id);
    } else if (item.route !== '#') {
      navigate(item.route);
    }
  };

  const isActiveRoute = (route: string): boolean => {
    return location.pathname === route;
  };

  const isParentActive = (item: MenuItem): boolean => {
    if (item.subItems) {
      return item.subItems.some(subItem => location.pathname === subItem.route);
    }
    return false;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col overflow-y-auto">
        {/* Navigation Menu */}
        <nav className="flex-1 py-4 px-3">
          {menuItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedSections[item.id];
            const isActive = item.route !== '#' && isActiveRoute(item.route);
            const hasActiveChild = isParentActive(item);

            return (
              <div key={item.id} className="mb-1">
                {/* Main Menu Item */}
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-full transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : hasActiveChild
                      ? 'bg-white text-gray-900'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-sm font-medium">{item.text}</span>
                  {hasSubItems && (
                    <svg
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                {/* Sub Menu Items */}
                {hasSubItems && isExpanded && (
                  <div className="mt-1 ml-2 bg-white rounded-2xl shadow-sm overflow-hidden">
                    {item.subItems!.map((subItem) => {
                      const isSubActive = isActiveRoute(subItem.route);
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => navigate(subItem.route)}
                          className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                            isSubActive
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-sm">{subItem.text}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <PageHeader />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
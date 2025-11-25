import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from '@presentation/components/PageHeader';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const menuItems = [
    { id: 'overview', text: 'Overview', icon: 'e-icons e-home', route: '/overview' },
    { id: 'campaigns', text: 'Campaigns', icon: 'e-icons e-broadcast', route: '/campaigns' },
    { id: 'keywords', text: 'Search keywords', icon: 'e-icons e-search', route: '/keywords' },
    { id: 'audiences', text: 'Audiences', icon: 'e-icons e-people', route: '/audiences' },
  ];

  const handleMenuClick = (route: string): void => {
    navigate(route);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Logo Header */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          {/* <div className="flex items-center gap-2">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isSidebarOpen && <span className="text-xl font-medium text-gray-700">Google Ads</span>}
          </div> */}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.route;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.route)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className={`text-xl ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                  {item.icon === 'e-icons e-home' && '🏠'}
                  {item.icon === 'e-icons e-broadcast' && '📢'}
                  {item.icon === 'e-icons e-search' && '🔍'}
                  {item.icon === 'e-icons e-people' && '👥'}
                </span>
                {isSidebarOpen && <span className="text-sm font-medium">{item.text}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Toggle */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>
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
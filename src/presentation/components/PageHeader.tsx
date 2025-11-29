import React from 'react';
import { Menu, Search, Lightbulb, Eye, RefreshCw, HelpCircle, Bell } from 'lucide-react';

interface PageHeaderProps {
  onToggleSidebar?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-3 gap-3 shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-3 flex-1">
        {/* Hamburger Menu */}
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        {/* Google Ads Logo */}
        <div className="flex items-center gap-2">
            <img
            src="/logo.png"   // replace with your logo path
            alt="Logo"
           className="w-24 h-24 object-contain"
            />
          <span className="text-xl text-gray-700 font-normal"></span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="What are my biggest opportunities for growth right now?"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1">
        {/* Ads Advisor with BETA badge */}
        <div className="relative">
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-gray-700 text-sm">
            <Lightbulb className="w-5 h-5" />
            Ads Advisor
          </button>
          <span className="absolute -top-1 right-0 text-[9px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
            BETA
          </span>
        </div>

        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-gray-700 text-sm">
          <Eye className="w-5 h-5" />
          Appearance
        </button>

        <button className="p-2 hover:bg-gray-100 rounded text-gray-700">
          <RefreshCw className="w-5 h-5" />
        </button>

        <button className="p-2 hover:bg-gray-100 rounded text-gray-700">
          <HelpCircle className="w-5 h-5" />
        </button>

        <button className="p-2 hover:bg-gray-100 rounded text-gray-700 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Account Info */}
        <div className="ml-2 flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
          <div className="text-right">
            <div className="text-xs text-gray-700 font-medium">645-329-9247 AI Infox Pvt Ltd</div>
            <div className="text-xs text-gray-500">ibtissamechaibi.work@gmai...</div>
          </div>
          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
            I
          </div>
        </div>
      </div>
    </header>
  );
};
import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { PageHeader } from '../components/PageHeader';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

export const AssetsPage: React.FC = () => {
  const assetTypes = [
    { icon: 'e-image', title: 'Images', count: 0, color: 'blue' },
    { icon: 'e-video', title: 'Videos', count: 0, color: 'purple' },
    { icon: 'e-text', title: 'Text', count: 0, color: 'green' },
    { icon: 'e-link', title: 'Sitelinks', count: 0, color: 'orange' },
    { icon: 'e-phone', title: 'Call Extensions', count: 0, color: 'red' },
    { icon: 'e-location', title: 'Location Extensions', count: 0, color: 'teal' },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <PageHeader />

        {/* Page Title and Action Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Assets</h1>
            <ButtonComponent cssClass="e-primary" iconCss="e-icons e-plus">
              Add asset
            </ButtonComponent>
          </div>
        </div>

        <div className="p-6">
          {/* Assets Overview */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {assetTypes.map((asset, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-${asset.color}-100 rounded-lg flex items-center justify-center`}>
                    <i className={`e-icons ${asset.icon} text-${asset.color}-600 text-2xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{asset.title}</h3>
                    <p className="text-2xl font-bold text-gray-700">{asset.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="e-icons e-image text-blue-600 text-4xl"></i>
              </div>
              <h2 className="text-2xl font-medium text-gray-900 mb-3">
                Start adding assets to your campaigns
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Assets are additional pieces of information about your business, such as images, videos, 
                sitelinks, and call extensions. They help your ads stand out and give customers more reasons 
                to choose your business.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <ButtonComponent cssClass="e-primary" iconCss="e-icons e-plus">
                  Add your first asset
                </ButtonComponent>
                <ButtonComponent iconCss="e-icons e-info">
                  Learn more
                </ButtonComponent>
              </div>
            </div>
          </div>

          {/* Asset Performance Tips */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="e-icons e-lightbulb text-green-600"></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Best Practices</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Use high-quality images that represent your products or services</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Add multiple assets to give Google Ads more options to optimize</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Test different asset combinations to find what works best</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="e-icons e-star text-blue-600"></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Asset Types</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Images: Square and landscape formats recommended</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Videos: 6-15 seconds for best performance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Sitelinks: Direct users to specific pages on your site</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
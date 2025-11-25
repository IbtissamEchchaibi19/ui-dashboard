import React from 'react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

export const PageHeader: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search for a page or campaign"
          className="w-96 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <ButtonComponent cssClass="e-flat" iconCss="e-icons e-help">
          Help
        </ButtonComponent>
        <ButtonComponent cssClass="e-flat" iconCss="e-icons e-settings">
          Appearance
        </ButtonComponent>
        <ButtonComponent cssClass="e-flat" iconCss="e-icons e-refresh">
          Refresh
        </ButtonComponent>
        <ButtonComponent cssClass="e-flat" iconCss="e-icons e-notification">
          Notifications
        </ButtonComponent>
      </div>
    </header>
  );
};
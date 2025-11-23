// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './presentation/components/layouts/MainLayout';

// Pages - will be created
import { Dashboard } from './presentation/pages/dashboard/Dashboard';
import { CampaignsPage } from './presentation/pages/campaigns/CampaignsPage';
import { AdGroupsPage } from './presentation/pages/campaigns/AdGroupsPage';
import { AdsPage } from './presentation/pages/campaigns/AdsPage';
import { KeywordsPage } from './presentation/pages/campaigns/KeywordsPage';
import { ExperimentsPage } from './presentation/pages/campaigns/ExperimentsPage';
import { ChangeHistoryPage } from './presentation/pages/campaigns/ChangeHistoryPage';

import { AcquisitionPage } from './presentation/pages/analytics/AcquisitionPage';
import { TrafficPage } from './presentation/pages/analytics/TrafficPage';
import { PagesPage } from './presentation/pages/analytics/PagesPage';
import { EventsPage } from './presentation/pages/analytics/EventsPage';
import { ConversionsPage } from './presentation/pages/analytics/ConversionsPage';
import { RealtimePage } from './presentation/pages/analytics/RealtimePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Campaigns */}
          <Route path="campaigns">
            <Route index element={<CampaignsPage />} />
            <Route path=":campaignId/ad-groups" element={<AdGroupsPage />} />
            <Route path=":campaignId/ads" element={<AdsPage />} />
            <Route path=":campaignId/keywords" element={<KeywordsPage />} />
          </Route>

          {/* Experiments */}
          <Route path="experiments" element={<ExperimentsPage />} />
          
          {/* Change History */}
          <Route path="change-history" element={<ChangeHistoryPage />} />

          {/* Analytics - Acquisition */}
          <Route path="analytics/acquisition">
            <Route index element={<AcquisitionPage />} />
          </Route>

          {/* Analytics - Traffic */}
          <Route path="analytics/traffic" element={<TrafficPage />} />

          {/* Analytics - Pages */}
          <Route path="analytics/pages" element={<PagesPage />} />

          {/* Analytics - Events */}
          <Route path="analytics/events" element={<EventsPage />} />

          {/* Analytics - Conversions */}
          <Route path="analytics/conversions" element={<ConversionsPage />} />

          {/* Analytics - Realtime */}
          <Route path="analytics/realtime" element={<RealtimePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

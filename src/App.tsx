import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@presentation/layouts/MainLayout';
import { OverviewPage } from '@presentation/pages/OverviewPage';
import { CampaignsPage } from '@presentation/pages/CampaignsPage';
import { KeywordsPage } from '@presentation/pages/KeywordsPage';
import { AudiencesPage } from '@presentation/pages/AudiencesPage';

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/keywords" element={<KeywordsPage />} />
          <Route path="/audiences" element={<AudiencesPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
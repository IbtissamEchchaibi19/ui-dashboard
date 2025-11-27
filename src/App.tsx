import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@presentation/layouts/MainLayout';
import { CampaignsPage } from '@presentation/pages/CampaignsPage';
import { KeywordsPage } from '@presentation/pages/KeywordsPage';
import { OverviewPage } from '@presentation/pages/OverviewPage';
import { AudiencesPage } from '@presentation/pages/AudiencesPage';
import {AdsPage} from '@presentation/pages/AdPage'

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/Overview" replace />} />
           <Route path="/Overview" element={<OverviewPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/Adspage" element={<AdsPage/>} />
          <Route path="/keywords" element={<KeywordsPage />} />
          <Route path="/audiences" element={<AudiencesPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
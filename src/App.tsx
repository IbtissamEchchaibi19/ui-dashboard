import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@presentation/layouts/MainLayout';
import { CampaignsPage } from '@presentation/pages/CampaignsPage';
// import { KeywordsPage } from '@presentation/pages/KeywordsPage';
import { OverviewPage } from '@presentation/pages/OverviewPage';
import { AdGroupsPage } from '@presentation/pages/AdGroupsPage';
import { AssetGroupsPage } from '@presentation/pages/AssetGroupsPage';
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
          <Route path="/AdGroupsPage" element={<AdGroupsPage/>} />
          <Route path="/AssetGroup" element={<AssetGroupsPage/>} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
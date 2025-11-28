import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@presentation/layouts/MainLayout';
import { CampaignsPage } from '@presentation/pages/CampaignsPage';
import { KeywordsPage } from '@presentation/pages/KeywordsPage';
import {AssetsPage} from '@presentation/pages/AssetsPage'
import { OverviewPage } from '@presentation/pages/OverviewPage';
import { AdGroupsPage } from '@presentation/pages/AdGroupsPage';
import { AssetGroupsPage } from '@presentation/pages/AssetGroupsPage';
import {AdsPage} from '@presentation/pages/AdPage'
import { GoogleAdsExperiments} from '@presentation/pages/GoogleAdsExperiments'
import { GoogleAdsCampaignGroups} from '@presentation/pages/GoogleAdsCampaignGroups'
import {GoogleAdsRecommendations} from '@presentation/pages/GoogleAdsRecommendations'
import {ChangeHistoryPage} from '@presentation/pages/ChangeHistoryPage'
import { AudiencesPage } from '@presentation/pages/AudiencesPage';
import { LocationsPage } from '@presentation/pages/LocationsPage';
import { AdSchedulePage } from '@presentation/pages/Adschedulepage';
import { ContentPage } from '@presentation/pages/Contentpage';
import { AdvancedBidAdjustmentsPage } from '@presentation/pages/Advancedbidadjustmentspage';


const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/Overview" replace />} />
          <Route path="/Overview" element={<OverviewPage />} />
          <Route path="/recommendations" element={<GoogleAdsRecommendations/>} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/Adspage" element={<AdsPage/>} />
          <Route path="/AdGroupsPage" element={<AdGroupsPage/>} />
          <Route path="/Asset" element={<AssetsPage/>} />
          <Route path="/AssetGroup" element={<AssetGroupsPage/>} />
          <Route path="/experiments" element={<GoogleAdsExperiments/>} />
          <Route path="/campaign-groups" element={<GoogleAdsCampaignGroups/>} />
          <Route path="/change-history" element={<ChangeHistoryPage/>} />
          <Route path="/keywords" element={<KeywordsPage/>} />
          <Route path="/audiences" element={<AudiencesPage/>} />
          <Route path="/locations" element={<LocationsPage/>} />
          <Route path="/content" element={<ContentPage/>} />
          <Route path="/ad-schedule" element={<AdSchedulePage/>} />
          <Route path="/advanced-bid-adjustments" element={<AdvancedBidAdjustmentsPage/>} />
          
          
          
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
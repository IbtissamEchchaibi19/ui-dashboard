export * from './CampaignDTO'
// application/dto/index.ts

// Export AssetGroup-related AdStrengthUI with a specific alias
export {
  AssetGroupUI,
  AssetGroupStatusUI,
  AssetGroupPrimaryStatusUI,
  AdStrengthUI as AssetGroupAdStrengthUI, // ← Renamed for asset groups
  AssetPerformanceLabelUI,
} from './AssetGroupDTO';

export type {
  AssetGroupMetricColumn,
  AssetGroupMetricsUI,
  AssetSummaryUI,
  AssetRowUI,
  AudienceSignalUI,
  ListingGroupSummaryUI,
  AssetCoverageUI,
} from './AssetGroupDTO';

// Export AdGroup-related exports
export * from './AdGroupDTO';

// Export Ad-related AdStrengthUI with a different alias
export {
  AdUI,
  AdStatusUI,
  AdTypeUI,
  AdStrengthUI as AdAdStrengthUI, // ← Renamed for ads
  // ... other exports from AdDTO
} from './AdDTO';

export type {
  AdMetricColumn,
  AdMetricsUI,
  // ... other type exports
} from './AdDTO';
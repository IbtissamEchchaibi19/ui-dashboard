
export interface ChangeRecord {
  id: string;
  user: string;
  dateTime: string;
  tool: string;
  change: string;
  campaign?: string;
  adGroup?: string;
  assetGroup?: string;
  canUndo: boolean;
  isUndone?: boolean;
  expandable?: boolean;
  expanded?: boolean;
}

export interface CampaignSummary {
  name: string;
  changes: number;
  summary: string;
}

export const changeRecordsData: ChangeRecord[] = [   
  {
    id: '1',
    user: 'ibtissamehchaibi.work@gmail.com',
    dateTime: 'Nov 26, 2025, 8:37:44 PM',
    tool: 'Web client (manual)',
    change: 'Access is activated for "ibtissamehchaibi.work@gmail.com" (Google Ads reports only)\n\nGranted access to "ibtissamehchaibi.work@gmail.com"',
    canUndo: false
  },
  {
    id: '2',
    user: 'aiinfoxseo@gmail.com',
    dateTime: 'Nov 26, 2025, 8:36:42 PM',
    tool: 'Web client (manual)',
    change: 'Sent invitation to access account with "Reports access" to "ibtissamehchaibi.work@gmail.com"',
    canUndo: false
  },
  {
    id: '3',
    user: 'aiinfoxseo@gmail.com',
    dateTime: 'Nov 21, 2025, 4:41:38 PM',
    tool: 'Web client (manual)',
    change: 'Campaign changed',
    campaign: 'Search 9th Oct',
    canUndo: true,
    expandable: true,
    expanded: false
  },
  {
    id: '4',
    user: 'aiinfoxseo@gmail.com',
    dateTime: 'Nov 20, 2025, 3:22:15 PM',
    tool: 'Web client (manual)',
    change: 'Budget changed from ₹500.00 to ₹750.00',
    campaign: 'Search 9th Oct',
    canUndo: true
  },
  {
    id: '5',
    user: 'aiinfoxseo@gmail.com',
    dateTime: 'Nov 19, 2025, 2:10:30 PM',
    tool: 'Web client (manual)',
    change: 'Status changed from "Paused" to "Enabled"',
    campaign: 'Search 9th Oct',
    canUndo: true
  }
];

export const campaignSummaryData: CampaignSummary[] = [
  {
    name: 'Search 9th Oct',
    changes: 2,
    summary: 'Status changes and budget changes'
  }
];

export const changeTypeFilters = [
  { id: 'all', label: 'All changes', active: true },
  { id: 'budget', label: 'Budget' },
  { id: 'bidding', label: 'Bidding' },
  { id: 'audience', label: 'Audience' },
  { id: 'location', label: 'Location' },
  { id: 'language', label: 'Language' },
  { id: 'conversion', label: 'Conversion' },
  { id: 'asset', label: 'Asset' },
  { id: 'status', label: 'Status' },
  { id: 'feed', label: 'Feed' },
  { id: 'other', label: 'Other' }
];

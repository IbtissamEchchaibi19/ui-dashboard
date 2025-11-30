
export interface SavedReport {
  id: string;
  name: string;
  type: string;
  lastModified: string;
  createdBy: string;
  scheduled: boolean;
}

export interface PredefinedReport {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const savedReports: SavedReport[] = [
  {
    id: '1',
    name: 'Campaign Performance Overview',
    type: 'Table',
    lastModified: 'Nov 27, 2025',
    createdBy: 'You',
    scheduled: true
  },
  {
    id: '2',
    name: 'Keyword Analysis Report',
    type: 'Line chart',
    lastModified: 'Nov 25, 2025',
    createdBy: 'You',
    scheduled: false
  },
  {
    id: '3',
    name: 'Monthly Conversion Trends',
    type: 'Column chart',
    lastModified: 'Nov 20, 2025',
    createdBy: 'Team Member',
    scheduled: true
  }
];

export const predefinedReports: PredefinedReport[] = [
  {
    id: 'campaign',
    name: 'Campaign',
    description: 'View performance data for your campaigns',
    category: 'Basic'
  },
  {
    id: 'adgroup',
    name: 'Ad group',
    description: 'View performance data for your ad groups',
    category: 'Basic'
  },
  {
    id: 'keyword',
    name: 'Search keyword',
    description: 'View performance data for your keywords',
    category: 'Basic'
  },
  {
    id: 'searchterm',
    name: 'Search term',
    description: 'View the search terms that triggered your ads',
    category: 'Basic'
  },
  {
    id: 'age',
    name: 'Age',
    description: 'View performance by age demographic',
    category: 'Demographics'
  },
  {
    id: 'gender',
    name: 'Gender',
    description: 'View performance by gender demographic',
    category: 'Demographics'
  },
  {
    id: 'location',
    name: 'Geographic',
    description: 'View performance by location',
    category: 'Geographic'
  },
  {
    id: 'time',
    name: 'Time',
    description: 'View performance by time of day and day of week',
    category: 'Time'
  }
];

export const chartTypes = [
  { id: 'table', name: 'Table', icon: '▦' },
  { id: 'tree', name: 'Tree table', icon: '≡' },
  { id: 'line', name: 'Line', icon: '📈' },
  { id: 'column', name: 'Column', icon: '📊' },
  { id: 'bar', name: 'Bar', icon: '▬' },
  { id: 'scatter', name: 'Scatter', icon: '⋯' },
  { id: 'pie', name: 'Pie', icon: '◐' }
];

export const availableDimensions = [
  'Campaign', 'Ad group', 'Search keyword', 'Search term', 'Ad type', 
  'Device', 'Location', 'Age', 'Gender', 'Day of week', 'Hour of day'
];

export const availableMetrics = [
  'Clicks', 'Impressions', 'CTR', 'Avg. CPC', 'Cost', 
  'Conversions', 'Conv. rate', 'Cost / conv.', 'Impr. share'
];


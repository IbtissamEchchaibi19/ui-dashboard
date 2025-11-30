
export interface Recommendation {
  id: number;
  title: string;
  description: string;
  reason: string;
  impact: string;
  category: 'all' | 'keywords' | 'ai';
  icon: string;
  isNew?: boolean;
  isAIEssential?: boolean;
  hasActions?: boolean;
  additionalInfo?: string[];
}


export const recommendationsData: Recommendation[] = [
  {
    id: 1,
    title: 'Create a Performance Max campaign',
    description: 'Get more conversions at a similar cost with a Performance Max campaign. It uses Google AI to show ads across Search, YouTube, Display, Discover, Gmail, and Maps to driver better results.',
    reason: 'Recommended because advertisers who adopt Performance Max (PMax) see +27% more conversion/value uplift at a similar cost per action/return on ad spend (CPA/ROAS) regardless of their level of Broad Match adoption',
    impact: '+10.3%',
    category: 'all',
    icon: 'e-trending-up',
    hasActions: true
  },
  {
    id: 2,
    title: 'Upload Customer Match lists',
    description: 'Show impactful and personalized ads to your existing customers by using the contact information they share with you',
    reason: 'Recommended because you are eligible to use Customer Match features',
    impact: '+2.7%',
    category: 'keywords',
    icon: 'e-search',
    isAIEssential: true
  },
  {
    id: 3,
    title: 'Use Display Expansion',
    description: 'Get more conversions at a similar CPA using unspent budget with the revamped Google Display Network Expansion feature',
    reason: 'Recommended because some of your Search campaigns have unspent budget that can benefit from Display Expansion',
    impact: '+1%',
    category: 'ai',
    icon: 'e-search',
    isNew: true,
    hasActions: true
  },
  {
    id: 4,
    title: 'Use your conversion data for Customer Match',
    description: 'Show impactful and personalized ads to existing and potential customers using recent conversion data',
    reason: 'Recommended because you are eligible to use your conversion data to create Customer Match lists',
    impact: '+0.7%',
    category: 'keywords',
    icon: 'e-search'
  },
  {
    id: 5,
    title: 'Remove redundant keywords',
    description: 'Make your account easier to manage by removing redundant keywords',
    reason: 'Recommended because you have redundant keywords with the same ad group, destination, and bidding strategy',
    impact: '+0.7%',
    category: 'keywords',
    icon: 'e-search',
    additionalInfo: ['[ai classes]', '[artificial intelligence course]', '[artificial intelligence classes]', '[ai certificate programs]', '+ more']
  }
];

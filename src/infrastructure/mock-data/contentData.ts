export interface ContentExclusion {
  id: string;
  content: string;
  type: 'Keyword' | 'Placement' | 'Topic';
  excludedFrom: string;
  level: 'Campaign' | 'Ad group' | 'Ad Group';
}

export const contentExclusionsData: ContentExclusion[] = [ 
  {
    id: '1',
    content: '[5 day gen ai intensive course with google]',
    type: 'Keyword',
    excludedFrom: 'Search 9th Oct › AI Courses in Chandigarh | Learn Artificial Intelligence',
    level: 'Ad Group'
  },
  {
    id: '2',
    content: '[ai tutorial]',
    type: 'Keyword',
    excludedFrom: 'Search 9th Oct › AI Courses in Chandigarh | Learn Artificial Intelligence',
    level: 'Ad Group'
  },
  {
    id: '3',
    content: 'arduino',
    type: 'Keyword',
    excludedFrom: 'Search 9th Oct',
    level: 'Campaign'
  },
  {
    id: '4',
    content: 'class 10/12',
    type: 'Keyword',
    excludedFrom: 'Search 9th Oct',
    level: 'Campaign'
  },
  {
    id: '5',
    content: '[cognitive class ai]',
    type: 'Keyword',
    excludedFrom: 'Search 9th Oct › AI Courses in Chandigarh | Learn Artificial Intelligence',
    level: 'Ad Group'
  },
  {
    id: '6',
    content: 'coursera',
    type: 'Keyword',
    excludedFrom: 'Search 9th Oct',
    level: 'Campaign'
  },
  {
    id: '7',
    content: 'crack',
    type: 'Keyword',
    excludedFrom: 'Search 9th Oct',
    level: 'Campaign'
  }
];

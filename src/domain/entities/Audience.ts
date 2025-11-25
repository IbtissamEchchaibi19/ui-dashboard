export interface Audience {
  id: string;
  name: string;
  type: AudienceType;
  size: number;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export enum AudienceType {
  AFFINITY = 'AFFINITY',
  IN_MARKET = 'IN_MARKET',
  CUSTOM = 'CUSTOM',
  REMARKETING = 'REMARKETING',
  SIMILAR = 'SIMILAR',
  DEMOGRAPHIC = 'DEMOGRAPHIC',
}

export interface AudienceMetrics {
  audienceId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
}
import { IAnalyticsRepository } from '../../domain/repositories/IAnalyticsRepository';
import {
  DashboardKPI,
  DateRange,
  AcquisitionOverview,
  TrafficOverview,
  PagePerformance,
  EventData,
  ConversionGoal,
  RealtimeData,
  ChannelData,
  SourceMediumData,
//   MetricType,
} from '../../domain/entities/Analytics';
import { generateDashboardKPIs } from '../mock/dataGenerator';
// generateTimeSeriesData

const randomInt = (min: number, max: number): number => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min: number, max: number, decimals: number = 2): number =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

export class AnalyticsRepository implements IAnalyticsRepository {
  async getDashboardKPIs(dateRange: DateRange): Promise<DashboardKPI[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateDashboardKPIs());
      }, 300);
    });
  }

  async getAcquisitionOverview(dateRange: DateRange): Promise<AcquisitionOverview> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const channels: ChannelData[] = [
          {
            channel: 'Organic Search',
            users: randomInt(10000, 50000),
            newUsers: randomInt(8000, 40000),
            sessions: randomInt(12000, 60000),
            bounceRate: randomFloat(30, 60),
            pagesPerSession: randomFloat(2, 5),
            avgSessionDuration: randomFloat(120, 300),
            goalCompletions: randomInt(500, 2000),
            goalValue: randomFloat(5000, 20000),
          },
          {
            channel: 'Paid Search',
            users: randomInt(5000, 25000),
            newUsers: randomInt(4000, 20000),
            sessions: randomInt(6000, 30000),
            bounceRate: randomFloat(25, 55),
            pagesPerSession: randomFloat(2.5, 6),
            avgSessionDuration: randomFloat(150, 350),
            goalCompletions: randomInt(300, 1500),
            goalValue: randomFloat(3000, 15000),
          },
          {
            channel: 'Social',
            users: randomInt(8000, 40000),
            newUsers: randomInt(6000, 35000),
            sessions: randomInt(10000, 50000),
            bounceRate: randomFloat(40, 70),
            pagesPerSession: randomFloat(1.5, 4),
            avgSessionDuration: randomFloat(90, 250),
            goalCompletions: randomInt(200, 1000),
            goalValue: randomFloat(2000, 10000),
          },
          {
            channel: 'Direct',
            users: randomInt(15000, 60000),
            newUsers: randomInt(10000, 50000),
            sessions: randomInt(18000, 70000),
            bounceRate: randomFloat(20, 50),
            pagesPerSession: randomFloat(3, 7),
            avgSessionDuration: randomFloat(180, 400),
            goalCompletions: randomInt(800, 3000),
            goalValue: randomFloat(8000, 30000),
          },
          {
            channel: 'Referral',
            users: randomInt(3000, 15000),
            newUsers: randomInt(2500, 12000),
            sessions: randomInt(4000, 20000),
            bounceRate: randomFloat(35, 65),
            pagesPerSession: randomFloat(2, 5),
            avgSessionDuration: randomFloat(100, 280),
            goalCompletions: randomInt(150, 800),
            goalValue: randomFloat(1500, 8000),
          },
          {
            channel: 'Email',
            users: randomInt(4000, 20000),
            newUsers: randomInt(3000, 15000),
            sessions: randomInt(5000, 25000),
            bounceRate: randomFloat(30, 60),
            pagesPerSession: randomFloat(2.5, 6),
            avgSessionDuration: randomFloat(140, 320),
            goalCompletions: randomInt(250, 1200),
            goalValue: randomFloat(2500, 12000),
          },
        ];

        const totalUsers = channels.reduce((sum, ch) => sum + ch.users, 0);
        const totalNewUsers = channels.reduce((sum, ch) => sum + ch.newUsers, 0);
        const totalSessions = channels.reduce((sum, ch) => sum + ch.sessions, 0);

        resolve({
          dateRange,
          channels,
          totalUsers,
          totalNewUsers,
          totalSessions,
        });
      }, 400);
    });
  }

  async getTrafficOverview(dateRange: DateRange): Promise<TrafficOverview> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          dateRange,
          totalSessions: randomInt(50000, 200000),
          totalPageviews: randomInt(150000, 600000),
          avgSessionDuration: randomFloat(180, 350),
          bounceRate: randomFloat(35, 55),
          byDevice: [
            {
              category: 'desktop',
              users: randomInt(20000, 80000),
              sessions: randomInt(25000, 100000),
              bounceRate: randomFloat(30, 50),
              avgSessionDuration: randomFloat(200, 400),
            },
            {
              category: 'mobile',
              users: randomInt(15000, 60000),
              sessions: randomInt(18000, 70000),
              bounceRate: randomFloat(40, 60),
              avgSessionDuration: randomFloat(150, 300),
            },
            {
              category: 'tablet',
              users: randomInt(5000, 20000),
              sessions: randomInt(7000, 30000),
              bounceRate: randomFloat(35, 55),
              avgSessionDuration: randomFloat(170, 350),
            },
          ],
          byLocation: [
            {
              country: 'United States',
              users: randomInt(30000, 100000),
              sessions: randomInt(40000, 130000),
              bounceRate: randomFloat(35, 55),
              avgSessionDuration: randomFloat(180, 350),
            },
            {
              country: 'United Kingdom',
              users: randomInt(8000, 30000),
              sessions: randomInt(10000, 40000),
              bounceRate: randomFloat(30, 50),
              avgSessionDuration: randomFloat(190, 360),
            },
            {
              country: 'Canada',
              users: randomInt(5000, 20000),
              sessions: randomInt(7000, 25000),
              bounceRate: randomFloat(32, 52),
              avgSessionDuration: randomFloat(185, 355),
            },
          ],
        });
      }, 400);
    });
  }

  async getPagePerformance(dateRange: DateRange): Promise<PagePerformance[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const pages: PagePerformance[] = [
          '/home',
          '/products',
          '/about',
          '/contact',
          '/blog',
          '/pricing',
          '/features',
          '/support',
        ].map(url => ({
          pageUrl: url,
          pageTitle: url.slice(1).charAt(0).toUpperCase() + url.slice(2),
          pageviews: randomInt(1000, 50000),
          uniquePageviews: randomInt(800, 40000),
          avgTimeOnPage: randomFloat(60, 300),
          entrances: randomInt(500, 30000),
          bounceRate: randomFloat(30, 70),
          exitRate: randomFloat(20, 60),
          pageValue: randomFloat(0, 10),
        }));

        resolve(pages);
      }, 300);
    });
  }

  async getEventData(dateRange: DateRange): Promise<EventData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const events: EventData[] = [
          { category: 'Video', action: 'Play' },
          { category: 'Video', action: 'Pause' },
          { category: 'Form', action: 'Submit' },
          { category: 'Form', action: 'Error' },
          { category: 'Button', action: 'Click' },
          { category: 'Download', action: 'PDF' },
          { category: 'Social', action: 'Share' },
          { category: 'Engagement', action: 'Scroll' },
        ].map(e => ({
          eventCategory: e.category,
          eventAction: e.action,
          eventLabel: 'Main CTA',
          totalEvents: randomInt(100, 10000),
          uniqueEvents: randomInt(80, 8000),
          eventValue: randomFloat(0, 1000),
          avgValue: randomFloat(0, 10),
          sessionsWithEvent: randomInt(50, 5000),
        }));

        resolve(events);
      }, 300);
    });
  }

  async getConversionGoals(dateRange: DateRange): Promise<ConversionGoal[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const goals: ConversionGoal[] = [
          { name: 'Purchase Completed', type: 'DESTINATION' as const },
          { name: 'Newsletter Signup', type: 'DESTINATION' as const },
          { name: 'Contact Form Submit', type: 'DESTINATION' as const },
          { name: 'Time on Site > 5 min', type: 'DURATION' as const },
          { name: 'Pages per Session > 3', type: 'PAGES_PER_SESSION' as const },
          { name: 'Video Watched', type: 'EVENT' as const },
        ].map((g, i) => ({
          id: `goal_${i + 1}`,
          name: g.name,
          type: g.type,
          value: randomFloat(10, 100),
          completions: randomInt(100, 5000),
          conversionRate: randomFloat(1, 15),
          goalValue: randomFloat(1000, 50000),
        }));

        resolve(goals);
      }, 300);
    });
  }

  async getRealtimeData(): Promise<RealtimeData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          activeUsers: randomInt(50, 500),
          activeUsersNow: randomInt(50, 500),
          pageviewsPerMinute: Array.from({ length: 30 }, (_, i) => ({
            timestamp: new Date(Date.now() - (29 - i) * 60000),
            value: randomInt(10, 100),
          })),
          topActivePages: [
            { pageUrl: '/home', pageTitle: 'Home', activeUsers: randomInt(10, 50) },
            { pageUrl: '/products', pageTitle: 'Products', activeUsers: randomInt(5, 30) },
            { pageUrl: '/pricing', pageTitle: 'Pricing', activeUsers: randomInt(3, 20) },
          ],
          topReferrers: [
            { referrer: 'google.com', activeUsers: randomInt(10, 40) },
            { referrer: 'facebook.com', activeUsers: randomInt(5, 25) },
            { referrer: 'direct', activeUsers: randomInt(8, 35) },
          ],
          topKeywords: [
            { keyword: 'best products', activeUsers: randomInt(5, 20) },
            { keyword: 'buy online', activeUsers: randomInt(3, 15) },
          ],
          geoData: [
            { country: 'United States', activeUsers: randomInt(20, 100), latitude: 37.7749, longitude: -122.4194 },
            { country: 'United Kingdom', activeUsers: randomInt(10, 50), latitude: 51.5074, longitude: -0.1278 },
            { country: 'Canada', activeUsers: randomInt(5, 30), latitude: 43.6532, longitude: -79.3832 },
          ],
        });
      }, 200);
    });
  }

  async getSourceMediumData(dateRange: DateRange): Promise<SourceMediumData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sources: SourceMediumData[] = [
          { source: 'google', medium: 'organic' },
          { source: 'google', medium: 'cpc' },
          { source: 'facebook', medium: 'social' },
          { source: 'direct', medium: '(none)' },
          { source: 'newsletter', medium: 'email' },
          { source: 'bing', medium: 'organic' },
        ].map(s => ({
          source: s.source,
          medium: s.medium,
          users: randomInt(1000, 30000),
          newUsers: randomInt(800, 25000),
          sessions: randomInt(1200, 35000),
          bounceRate: randomFloat(30, 60),
          pagesPerSession: randomFloat(2, 6),
          avgSessionDuration: randomFloat(120, 300),
        }));

        resolve(sources);
      }, 300);
    });
  }
}
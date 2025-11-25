import { generateOverviewMetrics, generateRecommendations } from '@infrastructure/mock-data';

export class MetricsService {
  async getOverviewMetrics() {
    await this.simulateDelay();
    return generateOverviewMetrics();
  }

  async getRecommendations() {
    await this.simulateDelay();
    return generateRecommendations();
  }

  private async simulateDelay(): Promise<void> {
    const delay = 200 + Math.random() * 300;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

export const metricsService = new MetricsService();
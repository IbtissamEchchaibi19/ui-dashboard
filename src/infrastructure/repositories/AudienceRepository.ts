import { Audience, AudienceMetrics } from '@domain/entities';
import { generateAudiences, generateAudienceMetrics, generateAudiencePerformanceData } from '../mock-data';

export class AudienceRepository {
  private audiences: Audience[] = generateAudiences(10);

  async findAll(): Promise<Audience[]> {
    await this.simulateDelay();
    return [...this.audiences];
  }

  async findById(id: string): Promise<Audience | null> {
    await this.simulateDelay();
    return this.audiences.find(a => a.id === id) || null;
  }

  async getMetrics(audienceId: string): Promise<AudienceMetrics> {
    await this.simulateDelay();
    return generateAudienceMetrics(audienceId);
  }

  async getPerformanceData(audienceId: string) {
    await this.simulateDelay();
    return generateAudiencePerformanceData(audienceId, 15);
  }

  private async simulateDelay(): Promise<void> {
    const delay = 200 + Math.random() * 300;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

export const audienceRepository = new AudienceRepository();
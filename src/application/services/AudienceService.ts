import { Audience, AudienceMetrics } from '@domain/entities';
import { audienceRepository } from '@infrastructure/repositories';

export class AudienceService {
  async getAudiences(): Promise<Audience[]> {
    return audienceRepository.findAll();
  }

  async getAudienceById(id: string): Promise<Audience | null> {
    return audienceRepository.findById(id);
  }

  async getAudienceMetrics(audienceId: string): Promise<AudienceMetrics> {
    return audienceRepository.getMetrics(audienceId);
  }

  async getAudiencePerformanceData(audienceId: string) {
    return audienceRepository.getPerformanceData(audienceId);
  }

  async getAudiencesWithMetrics(): Promise<Array<{ audience: Audience; metrics: AudienceMetrics }>> {
    const audiences = await this.getAudiences();
    
    const audiencesWithMetrics = await Promise.all(
      audiences.map(async audience => ({
        audience,
        metrics: await this.getAudienceMetrics(audience.id),
      }))
    );
    
    return audiencesWithMetrics;
  }

  getActiveAudiences(audiences: Audience[]): Audience[] {
    return audiences.filter(a => a.status === 'ACTIVE');
  }
}

export const audienceService = new AudienceService();
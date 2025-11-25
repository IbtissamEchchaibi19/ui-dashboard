import { DateRange } from '@domain/value-objects';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface QueryParams {
  dateRange?: DateRange;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export class MockApiClient {
  private baseDelay = 300; // Base delay in ms to simulate network latency
  private randomDelay = 200; // Random additional delay

  private async simulateDelay(): Promise<void> {
    const delay = this.baseDelay + Math.random() * this.randomDelay;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  async get<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
    await this.simulateDelay();
    
    console.log(`[MockAPI GET] ${endpoint}`, params);
    
    // In a real implementation, this would make an actual HTTP request
    // For now, we'll return mock data through repositories
    
    return {
      data: {} as T,
      status: 200,
    };
  }

  async post<T, D = unknown>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    await this.simulateDelay();
    
    console.log(`[MockAPI POST] ${endpoint}`, data);
    
    return {
      data: {} as T,
      status: 201,
    };
  }

  async put<T, D = unknown>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    await this.simulateDelay();
    
    console.log(`[MockAPI PUT] ${endpoint}`, data);
    
    return {
      data: {} as T,
      status: 200,
    };
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    await this.simulateDelay();
    
    console.log(`[MockAPI DELETE] ${endpoint}`);
    
    return {
      data: {} as T,
      status: 204,
    };
  }

  buildQueryString(params?: QueryParams): string {
    if (!params) return '';
    
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'dateRange' && value) {
          const dateRange = value as DateRange;
          searchParams.append('startDate', dateRange.startDate.toISOString());
          searchParams.append('endDate', dateRange.endDate.toISOString());
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }
}

export const mockApiClient = new MockApiClient();
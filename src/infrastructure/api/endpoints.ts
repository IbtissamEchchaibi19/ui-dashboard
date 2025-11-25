export const API_BASE_URL = '/api/v1';

export const endpoints = {
  campaigns: {
    list: () => `${API_BASE_URL}/campaigns`,
    get: (id: string) => `${API_BASE_URL}/campaigns/${id}`,
    metrics: (id: string) => `${API_BASE_URL}/campaigns/${id}/metrics`,
    create: () => `${API_BASE_URL}/campaigns`,
    update: (id: string) => `${API_BASE_URL}/campaigns/${id}`,
    delete: (id: string) => `${API_BASE_URL}/campaigns/${id}`,
  },
  adGroups: {
    list: (campaignId: string) => `${API_BASE_URL}/campaigns/${campaignId}/ad-groups`,
    get: (campaignId: string, id: string) => `${API_BASE_URL}/campaigns/${campaignId}/ad-groups/${id}`,
    metrics: (campaignId: string, id: string) => `${API_BASE_URL}/campaigns/${campaignId}/ad-groups/${id}/metrics`,
  },
  keywords: {
    list: (campaignId: string, adGroupId?: string) => 
      adGroupId 
        ? `${API_BASE_URL}/campaigns/${campaignId}/ad-groups/${adGroupId}/keywords`
        : `${API_BASE_URL}/campaigns/${campaignId}/keywords`,
    get: (campaignId: string, adGroupId: string, id: string) => 
      `${API_BASE_URL}/campaigns/${campaignId}/ad-groups/${adGroupId}/keywords/${id}`,
    metrics: (id: string) => `${API_BASE_URL}/keywords/${id}/metrics`,
  },
  audiences: {
    list: () => `${API_BASE_URL}/audiences`,
    get: (id: string) => `${API_BASE_URL}/audiences/${id}`,
    metrics: (id: string) => `${API_BASE_URL}/audiences/${id}/metrics`,
    performance: (id: string) => `${API_BASE_URL}/audiences/${id}/performance`,
  },
  metrics: {
    overview: () => `${API_BASE_URL}/metrics/overview`,
    timeSeries: () => `${API_BASE_URL}/metrics/time-series`,
  },
  recommendations: {
    list: () => `${API_BASE_URL}/recommendations`,
  },
};
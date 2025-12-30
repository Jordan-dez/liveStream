import { apiClient } from './api';
import type { StreamAccessResponse, EmbedUrlResponse } from '@/types';

export const streamService = {
  async requestAccess(concertId: string): Promise<StreamAccessResponse> {
    return await apiClient.post<StreamAccessResponse>('/stream/access', {
      concertId,
    });
  },

  async getEmbedUrl(token: string): Promise<EmbedUrlResponse> {
    return await apiClient.get<EmbedUrlResponse>(`/stream/embed-url?token=${encodeURIComponent(token)}`);
  },

  async validateToken(token: string): Promise<{
    valid: boolean;
    userId?: string;
    concertId?: string;
    expiresAt?: string;
  }> {
    return await apiClient.get(`/stream/validate?token=${encodeURIComponent(token)}`);
  },
};


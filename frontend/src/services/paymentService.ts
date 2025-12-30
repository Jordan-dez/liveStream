import { apiClient } from './api';
import type { CheckoutResponse } from '@/types';

export const paymentService = {
  async createCheckout(concertId: string): Promise<CheckoutResponse> {
    return await apiClient.post<CheckoutResponse>('/payment/create-checkout', {
      concertId,
    });
  },

  async verifyPayment(sessionId: string, concertId: string): Promise<{
    success: boolean;
    concertId?: string;
    purchaseDate?: string;
    status?: string;
    message?: string;
  }> {
    return await apiClient.post('/payment/verify', {
      sessionId,
      concertId,
    });
  },
};


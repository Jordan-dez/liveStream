import { apiClient } from './api';
import type { Concert } from '@/types';
import { mockConcerts, getConcertById } from '@/data/mockConcerts';

// Utiliser pour peupler DynamoDB ou pour les tests

export const concertService = {
  async listConcerts(status?: string): Promise<Concert[]> {
    const url = status ? `/concerts?status=${status}` : '/concerts';
    return  new Promise((resolve) => {
      resolve(mockConcerts);
    });
      // Utiliser pour peupler DynamoDB ou pour les tests).then(response => response.json());
    return await apiClient.get<Concert[]>(url);
  },

  async getConcert(concertId: string): Promise<Concert> {
    return getConcertById(concertId) as Concert;
  
    return await apiClient.get<Concert>(`/concerts/${concertId}`);
  },
};


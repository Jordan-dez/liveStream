import React, { useEffect, useState } from 'react';
import { concertService } from '@/services/concertService';
import { ConcertCard } from '@/components/ConcertCard';
import type { Concert } from '@/types';

export const Concerts: React.FC = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const loadConcerts = async () => {
      console.log('loadConcerts');
      try {
        setLoading(true);
        const status = filter === 'all' ? undefined : filter;
        const data = await concertService.listConcerts(status);
        console.log('data concerts',   data);
        setConcerts(data);
      } catch (error) {
        console.error('Error loading concerts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConcerts();
  }, [filter]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tous les Concerts</h1>
      
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Tous
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'upcoming' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          À venir
        </button>
        <button
          onClick={() => setFilter('live')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'live' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          En direct
        </button>
        <button
          onClick={() => setFilter('ended')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'ended' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Terminés
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : concerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concerts && concerts.length > 0 && concerts.map((concert) => (
            <ConcertCard key={concert.concertId} concert={concert} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">Aucun concert trouvé.</p>
        </div>
      )}
    </div>
  );
};


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { concertService } from '@/services/concertService';
import { ConcertCard } from '@/components/ConcertCard';
import type { Concert } from '@/types';

export const Home: React.FC = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConcerts = async () => {
      try {
        const data = await concertService.listConcerts('upcoming');
        setConcerts(data.slice(0, 6)); // Afficher les 6 prochains concerts
      } catch (error) {
        console.error('Error loading concerts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConcerts();
  }, []);

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Concerts en Direct
        </h1>
        <p className="text-xl text-gray-600">
          Accédez aux meilleurs concerts en direct depuis chez vous
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : concerts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {concerts.map((concert) => (
              <ConcertCard key={concert.concertId} concert={concert} />
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/concerts"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Voir tous les concerts
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">Aucun concert disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
};


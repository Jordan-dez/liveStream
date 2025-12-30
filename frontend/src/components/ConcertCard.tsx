import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Concert } from '@/types';

interface ConcertCardProps {
  concert: Concert;
}

export const ConcertCard: React.FC<ConcertCardProps> = ({ concert }) => {
  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2) + ' €';
  };

  const getStatusBadge = (status: Concert['status']) => {
    const badges = {
      upcoming: 'bg-blue-100 text-blue-800',
      live: 'bg-green-100 text-green-800',
      ended: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    const labels = {
      upcoming: 'À venir',
      live: 'En direct',
      ended: 'Terminé',
      cancelled: 'Annulé',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <Link
      to={`/concerts/${concert.concertId}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{concert.title}</h3>
          {getStatusBadge(concert.status)}
        </div>
        <p className="text-primary-600 font-semibold mb-2">{concert.artist}</p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{concert.description}</p>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {format(new Date(concert.scheduledDate), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
          </div>
          <div className="text-lg font-bold text-primary-600">
            {formatPrice(concert.price)}
          </div>
        </div>
      </div>
    </Link>
  );
};


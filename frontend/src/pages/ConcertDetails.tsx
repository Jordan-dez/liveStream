import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { concertService } from '@/services/concertService';
import { paymentService } from '@/services/paymentService';
import { Button } from '@/components/Button';
import type { Concert } from '@/types';

export const ConcertDetails: React.FC = () => {
  const { concertId } = useParams<{ concertId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [concert, setConcert] = useState<Concert | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadConcert = async () => {
      if (!concertId) return;
      
      try {
        const data = await concertService.getConcert(concertId);
        setConcert(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement du concert');
      } finally {
        setLoading(false);
      }
    };

    loadConcert();
  }, [concertId]);

  const handlePurchase = async () => {
    if (!user || !concertId) {
      navigate('/login');
      return;
    }

    setPurchasing(true);
    setError('');

    try {
      // Stocker le concertId pour la page de succès
      localStorage.setItem('pending_concert_id', concertId);
      const checkout = await paymentService.createCheckout(concertId);
      // Rediriger vers Stripe Checkout
      window.location.href = checkout.url;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du paiement');
      setPurchasing(false);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2) + ' €';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!concert) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Concert non trouvé.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{concert.title}</h1>
        <p className="text-primary-600 text-xl font-semibold mb-4">{concert.artist}</p>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">{concert.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>
              📅 {format(new Date(concert.scheduledDate), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
            </span>
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(concert.price)}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {user ? (
          <Button
            onClick={handlePurchase}
            isLoading={purchasing}
            disabled={concert.status !== 'upcoming' && concert.status !== 'live'}
            className="w-full"
          >
            {concert.status === 'upcoming' || concert.status === 'live'
              ? 'Acheter l\'accès'
              : 'Concert non disponible'}
          </Button>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Vous devez être connecté pour acheter l'accès.</p>
            <Button onClick={() => navigate('/login')}>
              Se connecter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};


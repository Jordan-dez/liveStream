import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentService } from '@/services/paymentService';
import { streamService } from '@/services/streamService';
import { Button } from '@/components/Button';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [concertId, setConcertId] = useState<string | null>(null);
  const [streamToken, setStreamToken] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('Session ID manquant');
        setLoading(false);
        return;
      }

      // Extraire le concertId de l'URL ou le stocker dans le state
      // Pour MVP, on peut le passer en paramètre ou le récupérer depuis la session Stripe
      // Ici, on suppose qu'on peut le récupérer depuis localStorage ou l'URL
      const storedConcertId = localStorage.getItem('pending_concert_id');
      if (!storedConcertId) {
        setError('Concert ID non trouvé');
        setLoading(false);
        return;
      }

      try {
        // Vérifier le paiement
        const result = await paymentService.verifyPayment(sessionId, storedConcertId);
        
        if (result.success && result.concertId) {
          setConcertId(result.concertId);
          
          // Demander l'accès au stream
          const access = await streamService.requestAccess(result.concertId);
          setStreamToken(access.streamToken);
          localStorage.removeItem('pending_concert_id');
        } else {
          setError(result.message || 'Paiement en cours de traitement');
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la vérification du paiement');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const handleWatch = () => {
    if (streamToken && concertId) {
      navigate(`/stream/${concertId}?token=${encodeURIComponent(streamToken)}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Vérification du paiement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/concerts')}>
            Retour aux concerts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-green-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement réussi !</h2>
        <p className="text-gray-600 mb-6">
          Votre accès au concert a été activé. Vous pouvez maintenant regarder le stream.
        </p>
        {streamToken ? (
          <Button onClick={handleWatch} className="w-full">
            Accéder au concert
          </Button>
        ) : (
          <Button onClick={() => navigate('/concerts')}>
            Retour aux concerts
          </Button>
        )}
      </div>
    </div>
  );
};


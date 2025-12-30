import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { streamService } from '@/services/streamService';
import { Button } from '@/components/Button';

export const Stream: React.FC = () => {
  const { concertId } = useParams<{ concertId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    const loadStream = async () => {
      if (!token) {
        setError('Token d\'accès manquant');
        setLoading(false);
        return;
      }

      try {
        const response = await streamService.getEmbedUrl(token);
        setEmbedUrl(response.embedUrl);
        setExpiresAt(response.expiresAt);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement du stream');
      } finally {
        setLoading(false);
      }
    };

    loadStream();
  }, [token]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Chargement du stream...</p>
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
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <Button variant="outline" onClick={() => navigate('/concerts')}>
          ← Retour
        </Button>
      </div>
      
      {expiresAt && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded mb-4">
          <p className="text-sm">
            ⏰ Votre accès expire le {new Date(expiresAt).toLocaleString('fr-FR')}
          </p>
        </div>
      )}

      {embedUrl && (
        <div className="bg-black rounded-lg overflow-hidden shadow-lg">
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Concert Stream"
            />
          </div>
        </div>
      )}
    </div>
  );
};


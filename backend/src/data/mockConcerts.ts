import type { Concert } from '../types';

export const mockConcerts: Concert[] = [
  {
    concertId: '1',
    title: 'Rock Legends Live',
    description: 'Un concert épique avec les plus grandes légendes du rock. Venez vivre une expérience musicale inoubliable avec des performances live exceptionnelles.',
    artist: 'The Rock Legends',
    scheduledDate: '2024-12-31T20:00:00Z',
    youtubeVideoId: 'dQw4w9WgXcQ', // Exemple - remplacez par un vrai ID YouTube
    price: 2999, // 29.99 € en centimes
    status: 'upcoming',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    concertId: '2',
    title: 'Jazz Night Special',
    description: 'Une soirée jazz intime avec des musiciens de renommée internationale. Ambiance feutrée et performances exceptionnelles.',
    artist: 'Jazz Masters Quartet',
    scheduledDate: '2024-12-25T19:30:00Z',
    youtubeVideoId: 'dQw4w9WgXcQ',
    price: 1999, // 19.99 €
    status: 'upcoming',
    createdAt: '2024-01-10T14:30:00Z',
  },
  {
    concertId: '3',
    title: 'Electronic Music Festival',
    description: 'Le plus grand festival de musique électronique de l\'année. DJ sets, performances live et une production visuelle à couper le souffle.',
    artist: 'Various Artists',
    scheduledDate: '2024-12-20T18:00:00Z',
    youtubeVideoId: 'dQw4w9WgXcQ',
    price: 3999, // 39.99 €
    status: 'live',
    createdAt: '2024-01-05T09:00:00Z',
  },
  {
    concertId: '4',
    title: 'Classical Symphony',
    description: 'Un concert de musique classique avec un orchestre symphonique complet. Œuvres de Mozart, Beethoven et Bach.',
    artist: 'Symphony Orchestra',
    scheduledDate: '2024-12-15T20:00:00Z',
    youtubeVideoId: 'dQw4w9WgXcQ',
    price: 2499, // 24.99 €
    status: 'ended',
    createdAt: '2024-01-01T12:00:00Z',
  },
  {
    concertId: '5',
    title: 'Pop Stars Unplugged',
    description: 'Vos artistes pop préférés dans une version acoustique exclusive. Des performances intimes et émotionnelles.',
    artist: 'Pop Stars Collective',
    scheduledDate: '2025-01-05T21:00:00Z',
    youtubeVideoId: 'dQw4w9WgXcQ',
    price: 3499, // 34.99 €
    status: 'upcoming',
    createdAt: '2024-01-20T15:45:00Z',
  },
  {
    concertId: '6',
    title: 'Blues & Soul Experience',
    description: 'Plongez dans l\'univers du blues et du soul avec des artistes légendaires. Une soirée remplie d\'émotions et de groove.',
    artist: 'Blues Legends',
    scheduledDate: '2025-01-10T19:00:00Z',
    youtubeVideoId: 'dQw4w9WgXcQ',
    price: 2299, // 22.99 €
    status: 'upcoming',
    createdAt: '2024-01-18T11:20:00Z',
  },
  {
    concertId: '7',
    title: 'Hip-Hop Showcase',
    description: 'Les meilleurs rappeurs du moment sur une seule scène. Battles, freestyles et performances exclusives.',
    artist: 'Hip-Hop All Stars',
    scheduledDate: '2025-01-15T20:30:00Z',
    youtubeVideoId: 'dQw4w9WgXcQ',
    price: 2799, // 27.99 €
    status: 'upcoming',
    createdAt: '2024-01-22T13:10:00Z',
  },
  {
    concertId: '8',
    title: 'Folk & Acoustic Evening',
    description: 'Une soirée chaleureuse avec des artistes folk et acoustique. Guitares, violons et voix cristallines.',
    artist: 'Folk Collective',
    scheduledDate: '2024-12-18T19:30:00Z',
    youtubeVideoId: 'dQw4w9WgXcQ',
    price: 1799, // 17.99 €
    status: 'cancelled',
    createdAt: '2024-01-08T16:00:00Z',
  },
  {
    concertId: '9',
    title: 'Metal Mayhem',
    description: 'Le concert metal de l\'année ! Guitares saturées, batteries explosives et une énergie à son comble.',
    artist: 'Metal Titans',
    scheduledDate: '2025-01-20T20:00:00Z',
    youtubeVideoId: 'dQw4w9WgXcQ',
    price: 3199, // 31.99 €
    status: 'upcoming',
    createdAt: '2024-01-25T10:30:00Z',
  },
  {
    concertId: '10',
    title: 'World Music Fusion',
    description: 'Un voyage musical à travers les continents. Fusion de styles du monde entier pour une expérience unique.',
    artist: 'World Fusion Band',
    scheduledDate: '2025-01-25T19:00:00Z',
    youtubeVideoId: 'dQw4w9WgXcQ',
    price: 2199, // 21.99 €
    status: 'upcoming',
    createdAt: '2024-01-28T14:15:00Z',
  },
];


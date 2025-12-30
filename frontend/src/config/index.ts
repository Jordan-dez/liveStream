export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'livestream_auth_token',
  USER: 'livestream_user',
} as const;


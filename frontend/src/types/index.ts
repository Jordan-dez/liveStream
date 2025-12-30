export interface User {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Concert {
  concertId: string;
  title: string;
  description: string;
  artist: string;
  scheduledDate: string;
  price: number; // en centimes
  status: 'upcoming' | 'live' | 'ended' | 'cancelled';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CheckoutResponse {
  checkoutSessionId: string;
  url: string;
}

export interface StreamAccessResponse {
  streamToken: string;
  expiresAt: string;
}

export interface EmbedUrlResponse {
  embedUrl: string;
  expiresAt: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: any;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;


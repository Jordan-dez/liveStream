/// <reference types="node" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      JWT_EXPIRES_IN?: string;
      STREAM_TOKEN_EXPIRES_IN?: string;
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
      FRONTEND_URL?: string;
      CORS_ORIGIN?: string;
      USERS_TABLE: string;
      CONCERTS_TABLE: string;
      PURCHASES_TABLE: string;
      STREAM_TOKENS_TABLE: string;
      NODE_ENV?: 'development' | 'production';
    }
  }
}

export {};


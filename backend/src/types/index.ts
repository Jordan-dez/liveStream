export interface User {
  userId: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  role: 'user' | 'admin';
}

export interface Concert {
  concertId: string;
  title: string;
  description: string;
  artist: string;
  scheduledDate: string; // ISO 8601
  youtubeVideoId: string;
  price: number; // en centimes
  status: 'upcoming' | 'live' | 'ended' | 'cancelled';
  createdAt: string;
}

export interface Purchase {
  purchaseId: string;
  userId: string;
  concertId: string;
  stripeSessionId: string;
  status: 'pending' | 'completed' | 'failed';
  purchaseDate: string;
  expiresAt: string; // ISO 8601
}

export interface StreamToken {
  tokenId: string;
  userId: string;
  concertId: string;
  expiresAt: number; // Unix timestamp pour TTL DynamoDB
  createdAt: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

export interface APIGatewayEvent {
  httpMethod: string;
  path: string;
  pathParameters: { [key: string]: string } | null;
  queryStringParameters: { [key: string]: string } | null;
  headers: { [key: string]: string };
  body: string | null;
  requestContext: {
    requestId: string;
    identity: {
      sourceIp: string;
    };
  };
}

export interface APIGatewayResponse {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
}

export interface LambdaContext {
  awsRequestId: string;
  functionName: string;
  functionVersion: string;
  invokedFunctionArn: string;
  memoryLimitInMB: string;
  getRemainingTimeInMillis(): number;
}


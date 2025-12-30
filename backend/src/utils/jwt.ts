import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

// Type assertion pour TypeScript
const JWT_SECRET_STRING: string = JWT_SECRET;

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as any,
  };
  return jwt.sign(payload, JWT_SECRET_STRING, options);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_STRING) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const generateStreamToken = (userId: string, concertId: string): string => {
  // Token court pour l'accès au stream (expire dans 2h par défaut)
  const expiresIn = process.env.STREAM_TOKEN_EXPIRES_IN || '2h';
  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };
  return jwt.sign({ userId, concertId, type: 'stream' }, JWT_SECRET_STRING, options);
};

export const verifyStreamToken = (token: string): { userId: string; concertId: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_STRING) as any;
    if (decoded.type !== 'stream') {
      throw new Error('Invalid token type');
    }
    return { userId: decoded.userId, concertId: decoded.concertId };
  } catch (error) {
    throw new Error('Invalid or expired stream token');
  }
};

export const extractTokenFromHeader = (headers: { [key: string]: string }): string | null => {
  const authHeader = headers.Authorization || headers.authorization;
  if (!authHeader) {
    return null;
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};


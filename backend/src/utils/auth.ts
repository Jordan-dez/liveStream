import bcrypt from 'bcryptjs';
import { extractTokenFromHeader, verifyToken } from './jwt';
import { getUserById } from './dynamodb';
import { APIGatewayEvent, JWTPayload } from '../types';
import { unauthorizedResponse } from './response';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const authenticateRequest = async (
  event: APIGatewayEvent
): Promise<JWTPayload> => {
  const token = extractTokenFromHeader(event.headers);
  if (!token) {
    throw new Error('No authorization token provided');
  }

  const payload = verifyToken(token);
  const user = await getUserById(payload.userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  return payload;
};

export const requireAuth = async (event: APIGatewayEvent): Promise<JWTPayload> => {
  try {
    return await authenticateRequest(event);
  } catch (error) {
    throw unauthorizedResponse((error as Error).message);
  }
};

export const requireAdmin = async (event: APIGatewayEvent): Promise<JWTPayload> => {
  const payload = await requireAuth(event);
  if (payload.role !== 'admin') {
    throw unauthorizedResponse('Admin access required');
  }
  return payload;
};


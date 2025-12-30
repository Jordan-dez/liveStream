import { APIGatewayResponse } from '../types';

export const createResponse = (
  statusCode: number,
  body: any,
  headers: { [key: string]: string } = {}
): APIGatewayResponse => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    ...headers,
  };

  return {
    statusCode,
    headers: defaultHeaders,
    body: JSON.stringify(body),
  };
};

export const successResponse = (data: any, statusCode = 200): APIGatewayResponse => {
  return createResponse(statusCode, { success: true, data });
};

export const errorResponse = (
  message: string,
  statusCode = 400,
  error?: any
): APIGatewayResponse => {
  return createResponse(statusCode, {
    success: false,
    error: message,
    ...(error && process.env.NODE_ENV === 'development' && { details: error }),
  });
};

export const unauthorizedResponse = (message = 'Unauthorized'): APIGatewayResponse => {
  return errorResponse(message, 401);
};

export const forbiddenResponse = (message = 'Forbidden'): APIGatewayResponse => {
  return errorResponse(message, 403);
};

export const notFoundResponse = (message = 'Not found'): APIGatewayResponse => {
  return errorResponse(message, 404);
};


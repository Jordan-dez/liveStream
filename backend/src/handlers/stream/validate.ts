import { APIGatewayEvent, LambdaContext } from '../../types';
import { verifyStreamToken } from '../../utils/jwt';
import { getStreamToken } from '../../utils/dynamodb';
import { successResponse, errorResponse, unauthorizedResponse } from '../../utils/response';

export const handler = async (
  event: APIGatewayEvent,
  context: LambdaContext
) => {
  try {
    if (event.httpMethod !== 'GET') {
      return errorResponse('Method not allowed', 405);
    }

    const token = event.queryStringParameters?.token;
    if (!token) {
      return errorResponse('Stream token is required', 400);
    }

    // Vérifier le token JWT
    let tokenData;
    try {
      tokenData = verifyStreamToken(token);
    } catch (error) {
      return unauthorizedResponse('Invalid or expired stream token');
    }

    // Vérifier que le token existe dans DynamoDB
    const streamTokenRecord = await getStreamToken(token);
    if (!streamTokenRecord) {
      return unauthorizedResponse('Stream token not found');
    }

    // Vérifier l'expiration
    const now = Math.floor(Date.now() / 1000);
    if (streamTokenRecord.expiresAt < now) {
      return unauthorizedResponse('Stream token has expired');
    }

    return successResponse({
      valid: true,
      userId: tokenData.userId,
      concertId: tokenData.concertId,
      expiresAt: new Date(streamTokenRecord.expiresAt * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Validate stream token error:', error);
    return errorResponse('Internal server error', 500, error);
  }
};


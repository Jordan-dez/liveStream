import { APIGatewayEvent, LambdaContext } from '../../types';
import { verifyStreamToken } from '../../utils/jwt';
import { getStreamToken, getConcertById } from '../../utils/dynamodb';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } from '../../utils/response';

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

    // Vérifier que le token existe dans DynamoDB (double vérification)
    const streamTokenRecord = await getStreamToken(token);
    if (!streamTokenRecord) {
      return unauthorizedResponse('Stream token not found');
    }

    // Vérifier l'expiration
    const now = Math.floor(Date.now() / 1000);
    if (streamTokenRecord.expiresAt < now) {
      return unauthorizedResponse('Stream token has expired');
    }

    // Récupérer le concert
    const concert = await getConcertById(tokenData.concertId);
    if (!concert) {
      return notFoundResponse('Concert not found');
    }

    // Construire l'URL d'embed YouTube sécurisée
    const embedUrl = `https://www.youtube.com/embed/${concert.youtubeVideoId}?autoplay=1&modestbranding=1&rel=0&controls=1&playsinline=1`;

    return successResponse({
      embedUrl,
      expiresAt: new Date(streamTokenRecord.expiresAt * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Get embed URL error:', error);
    return errorResponse('Internal server error', 500, error);
  }
};


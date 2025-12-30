import { APIGatewayEvent, LambdaContext } from '../../types';
import { getConcertById } from '../../utils/dynamodb';
import { successResponse, errorResponse, notFoundResponse } from '../../utils/response';

export const handler = async (
  event: APIGatewayEvent,
  context: LambdaContext
) => {
  try {
    if (event.httpMethod !== 'GET') {
      return errorResponse('Method not allowed', 405);
    }

    const concertId = event.pathParameters?.concertId;
    if (!concertId) {
      return errorResponse('Concert ID is required', 400);
    }

    const concert = await getConcertById(concertId);
    if (!concert) {
      return notFoundResponse('Concert not found');
    }

    // Ne pas exposer youtubeVideoId dans la réponse publique
    const { youtubeVideoId, ...publicConcert } = concert;

    return successResponse(publicConcert);
  } catch (error) {
    console.error('Get concert error:', error);
    return errorResponse('Internal server error', 500, error);
  }
};


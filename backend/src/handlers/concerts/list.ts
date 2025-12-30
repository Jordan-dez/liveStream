import { APIGatewayEvent, LambdaContext } from '../../types';
import { listConcerts } from '../../utils/dynamodb';
import { successResponse, errorResponse } from '../../utils/response';

export const handler = async (
  event: APIGatewayEvent,
  context: LambdaContext
) => {
  try {
    if (event.httpMethod !== 'GET') {
      return errorResponse('Method not allowed', 405);
    }

    const status = event.queryStringParameters?.status;
    const concerts = await listConcerts(status);

    // Filtrer les informations sensibles (youtubeVideoId)
    const publicConcerts = concerts.map(({ youtubeVideoId, ...rest }) => rest);

    return successResponse(publicConcerts);
  } catch (error) {
    console.error('List concerts error:', error);
    return errorResponse('Internal server error', 500, error);
  }
};


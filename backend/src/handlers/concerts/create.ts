import { v4 as uuidv4 } from 'uuid';
import { APIGatewayEvent, LambdaContext, Concert } from '../../types';
import { requireAdmin } from '../../utils/auth';
import { createConcert } from '../../utils/dynamodb';
import { successResponse, errorResponse } from '../../utils/response';
import { validateRequired, validateNumber } from '../../utils/validation';

interface CreateConcertRequest {
  title: string;
  description: string;
  artist: string;
  scheduledDate: string;
  youtubeVideoId: string;
  price: number;
  status?: 'upcoming' | 'live' | 'ended' | 'cancelled';
}

export const handler = async (
  event: APIGatewayEvent,
  context: LambdaContext
) => {
  try {
    if (event.httpMethod !== 'POST') {
      return errorResponse('Method not allowed', 405);
    }

    await requireAdmin(event);

    const body: CreateConcertRequest = JSON.parse(event.body || '{}');
    
    // Validation
    validateRequired(body.title, 'title');
    validateRequired(body.description, 'description');
    validateRequired(body.artist, 'artist');
    validateRequired(body.scheduledDate, 'scheduledDate');
    validateRequired(body.youtubeVideoId, 'youtubeVideoId');
    validateRequired(body.price, 'price');
    validateNumber(body.price, 'price', 0);

    // Valider le format de date ISO 8601
    const scheduledDate = new Date(body.scheduledDate);
    if (isNaN(scheduledDate.getTime())) {
      return errorResponse('Invalid scheduledDate format. Use ISO 8601');
    }

    const concertId = uuidv4();
    const now = new Date().toISOString();

    const concert: Concert = {
      concertId,
      title: body.title,
      description: body.description,
      artist: body.artist,
      scheduledDate: body.scheduledDate,
      youtubeVideoId: body.youtubeVideoId,
      price: Math.round(body.price * 100), // Convertir en centimes
      status: body.status || 'upcoming',
      createdAt: now,
    };

    await createConcert(concert);

    // Ne pas exposer youtubeVideoId dans la réponse
    const { youtubeVideoId, ...publicConcert } = concert;

    return successResponse(publicConcert, 201);
  } catch (error: any) {
    if (error.statusCode) {
      return error;
    }
    console.error('Create concert error:', error);
    return errorResponse('Internal server error', 500, error);
  }
};


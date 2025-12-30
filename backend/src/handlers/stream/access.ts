import { v4 as uuidv4 } from 'uuid';
import { APIGatewayEvent, LambdaContext } from '../../types';
import { requireAuth } from '../../utils/auth';
import { getConcertById, getPurchaseByUserAndConcert, createStreamToken } from '../../utils/dynamodb';
import { generateStreamToken } from '../../utils/jwt';
import { successResponse, errorResponse, notFoundResponse, forbiddenResponse } from '../../utils/response';

export const handler = async (
  event: APIGatewayEvent,
  context: LambdaContext
) => {
  try {
    if (event.httpMethod !== 'POST') {
      return errorResponse('Method not allowed', 405);
    }

    const payload = await requireAuth(event);
    const body = JSON.parse(event.body || '{}');
    const { concertId } = body;

    if (!concertId) {
      return errorResponse('Concert ID is required', 400);
    }

    // Vérifier que le concert existe
    const concert = await getConcertById(concertId);
    if (!concert) {
      return notFoundResponse('Concert not found');
    }

    // Vérifier que l'utilisateur a acheté ce concert
    const purchase = await getPurchaseByUserAndConcert(payload.userId, concertId);
    if (!purchase || purchase.status !== 'completed') {
      return forbiddenResponse('You must purchase this concert to access the stream');
    }

    // Vérifier que l'accès n'a pas expiré
    const now = new Date();
    const expiresAt = new Date(purchase.expiresAt);
    if (now > expiresAt) {
      return forbiddenResponse('Your access to this concert has expired');
    }

    // Vérifier que le concert est disponible (upcoming ou live)
    if (concert.status !== 'upcoming' && concert.status !== 'live') {
      return errorResponse('This concert is not currently available', 400);
    }

    // Générer un token d'accès temporaire (JWT)
    const streamToken = generateStreamToken(payload.userId, concertId);
    const tokenId = streamToken; // Utiliser le token JWT comme tokenId pour la recherche
    
    // Calculer l'expiration (concert date + 2h ou expiration du purchase, le plus court)
    const concertDate = new Date(concert.scheduledDate);
    const streamExpiresAt = Math.min(
      Math.floor((expiresAt.getTime() / 1000)), // Expiration du purchase
      Math.floor((concertDate.getTime() / 1000) + 2 * 60 * 60) // Concert date + 2h
    );

    // Stocker le token dans DynamoDB avec TTL
    await createStreamToken({
      tokenId,
      userId: payload.userId,
      concertId,
      expiresAt: streamExpiresAt,
      createdAt: new Date().toISOString(),
    });

    return successResponse({
      streamToken,
      expiresAt: new Date(streamExpiresAt * 1000).toISOString(),
    });
  } catch (error: any) {
    if (error.statusCode) {
      return error;
    }
    console.error('Stream access error:', error);
    return errorResponse('Internal server error', 500, error);
  }
};


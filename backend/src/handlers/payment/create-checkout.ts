import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import { APIGatewayEvent, LambdaContext } from '../../types';
import { requireAuth } from '../../utils/auth';
import { getConcertById, getPurchaseByUserAndConcert } from '../../utils/dynamodb';
import { successResponse, errorResponse, notFoundResponse } from '../../utils/response';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

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

    if (concert.status !== 'upcoming' && concert.status !== 'live') {
      return errorResponse('Concert is not available for purchase', 400);
    }

    // Vérifier si l'utilisateur a déjà acheté ce concert
    const existingPurchase = await getPurchaseByUserAndConcert(payload.userId, concertId);
    if (existingPurchase && existingPurchase.status === 'completed') {
      return errorResponse('You have already purchased this concert', 409);
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: concert.title,
              description: `Concert by ${concert.artist}`,
            },
            unit_amount: concert.price, // Déjà en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/concerts/${concertId}`,
      client_reference_id: `${payload.userId}#${concertId}`,
      metadata: {
        userId: payload.userId,
        concertId: concertId,
      },
    });

    return successResponse({
      checkoutSessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    if (error.statusCode) {
      return error;
    }
    console.error('Create checkout error:', error);
    return errorResponse('Internal server error', 500, error);
  }
};


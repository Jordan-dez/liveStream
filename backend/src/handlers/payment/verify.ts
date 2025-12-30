import Stripe from 'stripe';
import { APIGatewayEvent, LambdaContext } from '../../types';
import { requireAuth } from '../../utils/auth';
import { getPurchaseByUserAndConcert } from '../../utils/dynamodb';
import { successResponse, errorResponse } from '../../utils/response';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

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
    const { sessionId, concertId } = body;

    if (!sessionId) {
      return errorResponse('Session ID is required', 400);
    }

    if (!concertId) {
      return errorResponse('Concert ID is required', 400);
    }

    // Vérifier la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return successResponse({
        success: false,
        status: session.payment_status,
      });
    }

    // Vérifier dans la base de données
    const purchase = await getPurchaseByUserAndConcert(payload.userId, concertId);

    if (purchase && purchase.status === 'completed') {
      return successResponse({
        success: true,
        concertId: purchase.concertId,
        purchaseDate: purchase.purchaseDate,
      });
    }

    // Si le webhook n'a pas encore traité, retourner pending
    return successResponse({
      success: false,
      status: 'pending',
      message: 'Payment is being processed',
    });
  } catch (error: any) {
    if (error.statusCode) {
      return error;
    }
    console.error('Verify payment error:', error);
    return errorResponse('Internal server error', 500, error);
  }
};


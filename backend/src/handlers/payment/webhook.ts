import Stripe from 'stripe';
import { APIGatewayEvent, LambdaContext } from '../../types';
import { getPurchase, updatePurchaseStatus, createPurchase } from '../../utils/dynamodb';
import { successResponse, errorResponse } from '../../utils/response';
import { v4 as uuidv4 } from 'uuid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
if (!WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set');
}

export const handler = async (
  event: APIGatewayEvent,
  context: LambdaContext
) => {
  try {
    const signature = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
    if (!signature) {
      return errorResponse('Missing stripe-signature header', 400);
    }

    // Vérifier la signature du webhook
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body || '',
      signature,
      WEBHOOK_SECRET
    );

    // Traiter l'événement checkout.session.completed
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      
      const userId = session.metadata?.userId;
      const concertId = session.metadata?.concertId;

      if (!userId || !concertId) {
        console.error('Missing metadata in Stripe session:', session.id);
        return errorResponse('Invalid session metadata', 400);
      }

      // Vérifier si le purchase existe déjà (idempotence)
      const existingPurchase = await getPurchase(session.id);
      
      if (!existingPurchase) {
        // Créer un nouvel enregistrement de purchase
        const purchaseId = uuidv4();
        const now = new Date();
        
        // Calculer la date d'expiration (concert date + 2h)
        // Pour MVP, on utilise une expiration par défaut de 24h
        const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

        await createPurchase({
          purchaseId,
          userId,
          concertId,
          stripeSessionId: session.id,
          status: 'completed',
          purchaseDate: now.toISOString(),
          expiresAt,
        });

        console.log(`Purchase created: ${purchaseId} for user ${userId} and concert ${concertId}`);
      } else {
        // Mettre à jour le statut si nécessaire
        if (existingPurchase.status !== 'completed') {
          await updatePurchaseStatus(existingPurchase.purchaseId, 'completed');
        }
      }
    }

    return successResponse({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    
    if (error.type === 'StripeSignatureVerificationError') {
      return errorResponse('Invalid signature', 400);
    }
    
    return errorResponse('Internal server error', 500, error);
  }
};


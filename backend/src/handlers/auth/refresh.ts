import { APIGatewayEvent, LambdaContext } from '../../types';
import { requireAuth } from '../../utils/auth';
import { getUserById } from '../../utils/dynamodb';
import { generateToken } from '../../utils/jwt';
import { successResponse, errorResponse } from '../../utils/response';

export const handler = async (
  event: APIGatewayEvent,
  context: LambdaContext
) => {
  try {
    if (event.httpMethod !== 'POST') {
      return errorResponse('Method not allowed', 405);
    }

    const payload = await requireAuth(event);
    const user = await getUserById(payload.userId);
    
    if (!user) {
      return errorResponse('User not found', 404);
    }

    // Générer un nouveau token
    const token = generateToken({
      userId: user.userId,
      email: user.email,
      role: user.role,
    });

    return successResponse({
      token,
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error.statusCode) {
      return error;
    }
    console.error('Refresh token error:', error);
    return errorResponse('Internal server error', 500, error);
  }
};


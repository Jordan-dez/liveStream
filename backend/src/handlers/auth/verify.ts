import { APIGatewayEvent, LambdaContext } from '../../types';
import { requireAuth } from '../../utils/auth';
import { getUserById } from '../../utils/dynamodb';
import { successResponse, errorResponse } from '../../utils/response';

export const handler = async (
  event: APIGatewayEvent,
  context: LambdaContext
) => {
  try {
    if (event.httpMethod !== 'GET') {
      return errorResponse('Method not allowed', 405);
    }

    const payload = await requireAuth(event);
    const user = await getUserById(payload.userId);
    
    if (!user) {
      return errorResponse('User not found', 404);
    }

    return successResponse({
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
    console.error('Verify token error:', error);
    return errorResponse('Internal server error', 500, error);
  }
};


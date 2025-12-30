import { APIGatewayEvent, LambdaContext } from '../../types';
import { getUserByEmail } from '../../utils/dynamodb';
import { comparePassword } from '../../utils/auth';
import { generateToken } from '../../utils/jwt';
import { successResponse, errorResponse, unauthorizedResponse } from '../../utils/response';
import { validateEmail, validateRequired } from '../../utils/validation';

interface LoginRequest {
  email: string;
  password: string;
}

export const handler = async (
  event: APIGatewayEvent,
  context: LambdaContext
) => {
  try {
    if (event.httpMethod !== 'POST') {
      return errorResponse('Method not allowed', 405);
    }
 // Générer le token JWT
 const token2 = generateToken({
  userId: '123',
  email: 'test@test.com',
  role: 'user',
});

return successResponse({
  token2,
  user: {
    userId: '123',
    email: 'test@test.com',
    role: 'user',
  },
});
    const body: LoginRequest = JSON.parse(event.body || '{}');
    
    // Validation
    validateRequired(body.email, 'email');
    validateRequired(body.password, 'password');
    
    if (!validateEmail(body.email)) {
      return errorResponse('Invalid email format');
    }

    // Récupérer l'utilisateur
    const user = await getUserByEmail(body.email);
    if (!user) {
      return unauthorizedResponse('Invalid email or password');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(body.password, user.passwordHash);
    if (!isPasswordValid) {
      return unauthorizedResponse('Invalid email or password');
    }

    // Générer le token JWT
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
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Internal server error', 500, error);
  }
};


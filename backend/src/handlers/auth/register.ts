import { v4 as uuidv4 } from 'uuid';
import { APIGatewayEvent, LambdaContext, User } from '../../types';
import { getUserByEmail, createUser } from '../../utils';
import { hashPassword } from '../../utils/auth';
import { generateToken } from '../../utils/jwt';
import { successResponse, errorResponse } from '../../utils/response';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';

interface RegisterRequest {
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

    const body: RegisterRequest = JSON.parse(event.body || '{}');
    
    // Validation
    validateRequired(body.email, 'email');
    validateRequired(body.password, 'password');
    
    if (!validateEmail(body.email)) {
      return errorResponse('Invalid email format');
    }

    const passwordValidation = validatePassword(body.password);
    if (!passwordValidation.valid) {
      return errorResponse(passwordValidation.message || 'Invalid password');
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await getUserByEmail(body.email);
    if (existingUser) {
      return errorResponse('Email already registered', 409);
    }

    // Créer le nouvel utilisateur
    const userId = uuidv4();
    const passwordHash = await hashPassword(body.password);
    const now = new Date().toISOString();

    const user: User = {
      userId,
      email: body.email,
      passwordHash,
      createdAt: now,
      role: 'user',
    };

    await createUser(user);

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
    }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse('Internal server error', 500, error);
  }
};


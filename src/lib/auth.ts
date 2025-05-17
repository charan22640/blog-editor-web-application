import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not configured');
  }
  return new TextEncoder().encode(secret);
};

export async function createToken(payload: any) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload for token creation');
  }
  const JWT_SECRET = getJwtSecret();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .setNotBefore(0) // Token is valid immediately
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token format');
  }
  const JWT_SECRET = getJwtSecret();
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    if (!verified.payload || typeof verified.payload !== 'object') {
      throw new Error('Invalid token payload');
    }
    return verified.payload;
  } catch (err) {
    console.error('Token verification failed:', err);
    if (err instanceof Error) {
      throw new Error(`Token verification failed: ${err.message}`);
    }
    throw new Error('Token verification failed');
  }
}

export async function getUser(req?: NextRequest) {
  try {
    let token;
    if (req) {
      // For API routes and middleware
      token = req.cookies.get('token')?.value;
    } else {
      // For server components
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
    }
    
    if (!token) {
      return null;
    }
    
    const payload = await verifyToken(token);
    return payload;
  } catch (error) {
    console.error('Error in getUser:', error);
    return null;
  }
}

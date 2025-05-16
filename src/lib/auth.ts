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
  const JWT_SECRET = getJwtSecret();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  const JWT_SECRET = getJwtSecret();
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (err) {
    console.error('Token verification failed:', err);
    return null;
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

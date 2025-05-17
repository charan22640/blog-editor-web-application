import { connectToDb } from '@/lib/db';
import { User } from '@/lib/models/User';
import { createToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Check for required environment variables
    if (!process.env.MONGODB_URI) {
      console.error('Missing MONGODB_URI environment variable');
      return NextResponse.json({ error: 'Server misconfiguration: missing database URI' }, { status: 500 });
    }
    if (!process.env.JWT_SECRET) {
      console.error('Missing JWT_SECRET environment variable');
      return NextResponse.json({ error: 'Server misconfiguration: missing JWT secret' }, { status: 500 });
    }

    await connectToDb();
    
    // Parse request body
    let email, password;
    try {
      const body = await req.json();
      email = body.email;
      password = body.password;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user and verify credentials
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT token
    const token = await createToken({ id: user._id, email: user.email });

    // Create response with cookie
    const response = NextResponse.json({ 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      }
    });

    // Set cookie using response object with enhanced security and persistence
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed to 'lax' to allow cross-site navigation
      path: '/', // Ensure cookie is available across all paths
      maxAge: 60 * 60 * 24 * 7 // Extended to 7 days for better persistence
    });

    return response;
  } catch (error) {
    console.error('Login route error:', error);
    return NextResponse.json({ 
      error: 'Login failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

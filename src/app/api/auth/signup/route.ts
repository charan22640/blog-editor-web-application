import { connectToDb } from '@/lib/db';
import { User } from '@/lib/models/User';
import { createToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectToDb();
    
    // Parse request body
    let email, password, name;
    try {
      const body = await req.json();
      email = body.email;
      password = body.password;
      name = body.name;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json({ 
        error: 'Email, password, and name are required' 
      }, { status: 400 });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Create new user
    const user = await User.create({ email, password, name });
    const token = await createToken({ id: user._id, email: user.email });
    
    // Create response with cookie
    const response = NextResponse.json({ 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      }
    });

    // Set cookie using response object
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ 
      error: 'Registration failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
